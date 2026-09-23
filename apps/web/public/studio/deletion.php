<?php
declare(strict_types=1);
// Loaded only after verified client authentication. No standalone HTTP actions.
function studio_delete_client(array $user): void {
    if (studio_is_admin($user)) throw new InvalidArgumentException('Staff access must be removed by the LINART administrator before deleting this account.');
    // Serialize with the outbox worker so erased inquiries cannot be recreated by a sync.
    $worker = studio_lock('outbox-worker');
    try {
        $email = strtolower($user['email']);
        $projects=studio_remote('/rest/v1/linart_inquiries?email=eq.'.rawurlencode($email).'&select=id&limit=1000');
        foreach ($projects as $project) {
            $id=studio_uuid($project['id']); $lock=studio_lock('inquiry:'.$id);
            try {
                // Tombstone first; preserves deletion intent across interrupted operations.
                studio_write(studio_private_dir().'/deleted-'.$id.'.json',['id'=>$id,'deleted_at'=>gmdate('c')]);
                $assets=studio_remote('/rest/v1/linart_assets?inquiry_id=eq.'.$id.'&select=object_path');
                if ($assets) studio_remote('/storage/v1/object/linart-studio','DELETE',['prefixes'=>array_column($assets,'object_path')]);
                studio_remote('/rest/v1/linart_inquiries?id=eq.'.$id,'DELETE');
                $path=studio_private_dir().'/inquiry-'.$id.'.json';
                if (is_file($path) && !unlink($path)) throw new RuntimeException('Could not remove the inquiry journal.');
            } finally { fclose($lock); }
        }
        // Also erase accepted or pending journals not yet synchronized to Supabase.
        foreach (glob(studio_private_dir().'/inquiry-*.json') as $path) {
            $record=json_decode(file_get_contents($path),true);
            if (strcasecmp($record['lead']['email']??'', $email)!==0) continue;
            $id=studio_uuid($record['id']);$lock=studio_lock('inquiry:'.$id);
            try {
                studio_write(studio_private_dir().'/deleted-'.$id.'.json',['id'=>$id,'deleted_at'=>gmdate('c')]);
                if (!unlink($path)) throw new RuntimeException('Could not remove the inquiry journal.');
            } finally { fclose($lock); }
        }
        // Existing mailboxes and legacy logs require the documented business retention process.
        studio_remote('/auth/v1/admin/users/'.rawurlencode($user['id']),'DELETE');
    } finally { fclose($worker); }
}
