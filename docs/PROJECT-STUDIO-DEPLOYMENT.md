# Deployment and operations — approval required

Do not apply the migration to JCA. Do not merge these changes into production or trigger a mobile build until the appropriate checks below are approved/completed.

## Required connections

1. A dedicated LINART Supabase project in the organization selected by the owner (and a staging project/environment for integration tests). The currently connected JCA project is unrelated. Project creation and billing decisions remain with the owner.
2. Hostinger access to LINART PHP hosting, private files outside `public_html`, environment settings, CLI PHP and a cron job. The current session exposes no callable Hostinger tools.
3. An approved SMTP sender configured in Supabase Auth for verification codes. No test emails were sent. New free-tier projects using Supabase's default SMTP cannot customize the necessary OTP templates; custom SMTP resolves this.
4. A Mac/Xcode or explicitly approved Codemagic test/build run. Signing and App Store distribution require separate approval.

## Preflight before the production migration

Run `supabase/preflight.sql` read-only against the identified LINART project. Inspect existing schemas, grants, RLS policies, functions, dependencies, bucket settings and migration history; verify that the LINART namespace is unused. Confirm there are no broad storage policies or existing triggers that could grant access to the new bucket. Take a recoverable database backup and record its reference. If any existing LINART objects exist, stop and reconcile a new migration; do not drop or overwrite them.

The committed migration is `supabase/migrations/20260923185850_linart_studio_v1.sql`, created using Supabase CLI 2.117.0. Apply in staging first, run the checks, then obtain explicit production approval. This session applied it only to isolated PGlite PostgreSQL with stub Auth/Storage schemas, not any hosted Supabase database.

## Hosting

Requires PHP 8.1+ with curl, mbstring, fileinfo, GD, sessions, JSON, OpenSSL and mail. Verify PHP on the actual host. Serve `npm run build` output as usual; it includes `contact.php`, `studio.php`, `studio-runtime.php` and the admin shell/assets. The website's existing public content/branding is retained.

Install `server/sync-inquiries.php` outside the web root, preserving its relative `../apps/web/public/studio-runtime.php` reference, or adjust that one include path for the actual hosting layout. It is CLI-only. Set a once-per-minute cron job to run it with the same environment as PHP. Watch its exit status and `pending failures` counter; alert LINART operational staff through an owner-approved channel if the queue is not draining. It never sends notification emails. Pending uncertain records older than five minutes also appear in admin, clearly marked as unconfirmed notification delivery.

Environment variables (values never committed):

| Name | Purpose |
|---|---|
| `LINART_PRIVATE_DIR` | Absolute, writable 0700 directory outside `public_html`; identical for web and cron |
| `LINART_SUPABASE_URL` | The dedicated project HTTPS API URL |
| `LINART_SUPABASE_PUBLIC_KEY` | Publishable/legacy anon key used only by gateway Auth calls |
| `LINART_SUPABASE_SERVICE_KEY` | Server secret/service-role key; never browser/mobile accessible |
| `LINART_SITE_ORIGIN` | Exact canonical origin, normally `https://linartinc.com` |
| `LINART_CLAMSCAN` | Optional absolute executable path to ClamAV; PDF uploads disabled without it |

Set PHP `upload_max_filesize=10M`, `post_max_size=12M`, memory sufficient for a 20-megapixel decode, HTTPS-only cookies, `session.use_strict_mode=1`, and a private `session.save_path`. Ensure `Authorization` reaches PHP (verify with an isolated bearer request). Do not cache any `contact.php`/`studio*.php` response; `.htaccess` sets no-store. Proxy/CDN rules must honor it. Keep database keys out of logs, phpinfo pages, shell history and error responses. The gateway sends generic upstream failures, never provider response bodies.

If private disk writes fail, the inquiry endpoint fails before sending email; otherwise it records first, hands mail to the existing transport, then reports success only on confirmed handoff and durable state. This cannot prove inbox delivery. There is intentionally no silent email retry. Inspect Hostinger mail transport logs with authorization and verify recipient delivery using an approved test address in staging.

## Auth and administration

- Configure Auth email OTP templates to include `{{ .Token }}` for both initial confirmation and magic-link email paths. Set a 10-minute OTP expiry, a 15-minute access-token lifetime, and provider rate limits. Test first-time and returning users. Codes are one-time; request another on expiration. The app holds no refresh token.
- Initial inquiry receipts expire after 30 days. Claim requires both receipt hash and verified email. A bound user returns with a new email code; receipt expiry does not remove established access.
- Add each approved LINART staff member's verified Auth user UUID to `public.linart_admins` using an authorized server/SQL session. Clients cannot modify this table. Remove the row to immediately revoke gateway administrator access. Use individual staff identities and protect staff email accounts with MFA. Native admin MFA enrollment is not included in v1.
- Admin URL: `https://linartinc.com/studio-admin.php`. The public shell contains no client data. API data requires an allowlisted identity; HttpOnly Secure SameSite=Strict cookies keep tokens out of JavaScript. Every request checks current allowlist membership. Client data clears on sign-out and after 15 minutes of browser inactivity.
- Signed-out tokens are denied by a local hashed-token revocation record until they expire. Maintain one shared `LINART_PRIVATE_DIR` if multiple PHP nodes are introduced. Recheck the design before horizontally scaling.
- If a client loses the original invitation before claiming it, verify identity through the contact details already recorded. An authorized operator may bind the confirmed Auth UUID to that specific inquiry after comparing the Auth-confirmed email and recording the action in `linart_audit`. Never bind on an unverified emailed project ID alone. This recovery is human-operated, not an anonymous API.

## File handling and deletion

Images: JPEG/PNG, at most eight photos, 10 MB each, 20 megapixels before decoding. Server decodes/re-encodes JPEG to strip source metadata. Native imports resize to 1600 pixels at 1x and remove metadata. All objects are private and stream through the authorized gateway; no public or emailed signed URLs are produced.

Documents: up to four PDFs, 10 MB each, require ClamAV. Keep signatures current. Active-content indicators are rejected as defense in depth; pattern checks alone are not a malware scanner. Files download as attachments with nosniff. Validate a safe PDF and EICAR/malformed fixtures in staging; leave PDF uploads disabled if the host cannot run a scanner. CAD, Office and arbitrary file types are out of scope.

Uploads reserve a counted database slot before transfer. Retrying a photo uses the same asset UUID; a pending stored object is reconciled by digest before it is marked ready. Pending transfers block final submission. A client can remove a pending document then choose it again. Failure after deletion but before metadata cleanup is recoverable by retrying remove. The native review distinguishes online attachments from local photos.

Clients can request deletion in-app; it closes their online access immediately and flags the admin record. The team must fulfill requests rather than leaving them queued. Proposed operational schedule, **owner approval required before publishing policy**: unconverted inquiries/drafts reviewed after 24 months; device-export PDFs removed on share completion; queue files kept only for an approved short recovery period after confirmed sync; security counters/revoked-token hashes removed after expiry. Set the contractual/legal schedule for actual construction clients with counsel.

Deletion procedure: verify scope/identity and record approval; stop queued re-import for the inquiry; remove private objects through the Storage API (not direct SQL); remove inquiry/studio/asset data under an approved server session; remove local queue and lead-log entries; address copies in operational email and exported briefs; delete/revoke the Auth identity if it has no other retained projects or administrator role; record minimal non-content audit evidence. Backups age out according to the provider's backup schedule. Never promise removal from backups instantly. No bulk purge cron is installed by this change.

## Release checks / rollback

Test two client identities and one administrator in staging: initial inquiry with Supabase down, accepted retry, uncertain timeout, queue recovery, wrong/expired receipt, code expiry, cross-client access, RLS direct access denial, cross-project upload/download, pending upload recovery, scanner rejection, draft conflicts, submitted snapshots, deletion request, role revocation, logout, cookie/CSRF behavior, mobile offline return, large text and PDF export. No staging mail should target production recipients.

Production rollback: disable Studio environment configuration and cron, preserve private files and database records, and restore the previous release as needed. The existing contact endpoint still records and sends inquiries without Supabase; Studio shows unavailable. Do not run the destructive SQL rollback on production records. `supabase/rollback/linart_studio_v1.sql` is for an empty staging installation only and was verified locally.

References: [Supabase passwordless auth](https://supabase.com/docs/guides/auth/auth-email-passwordless), [storage access](https://supabase.com/docs/guides/storage/security/access-control), [SMTP template change](https://supabase.com/changelog/46599-changes-to-email-template-customisation-on-free-tier), [Codemagic skip-ci](https://docs.codemagic.io/yaml-running-builds/starting-builds-automatically/).
