<?php
// Copy outside public_html as linart-config.php; permissions 0600. Never commit real values.
return [
    'private_dir' => '/absolute/private/linart-data',
    'supabase_url' => 'https://YOUR-LINART-PROJECT.supabase.co',
    'service_key' => 'SET_ON_SERVER_ONLY',
    'studio_enabled' => false,
    // Enable PDF uploads only with a working, updated ClamAV scanner.
    'clamdscan' => '/usr/bin/clamdscan',
];
