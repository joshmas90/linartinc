# LINART Project Studio v1 — implementation and release gates

Status: source implementation, locally verified backend contracts; **not deployed or iOS release-ready**.
Audit date: September 23, 2026.

## Audited baseline

- Website: `45ee6b05b0148a226f7a97717df6aa25a35d5c29`.
- App: `5dd6599` on `joshmas90/linartinc-app`.
- The existing PHP inquiry handler validates name, email, phone, project location and service, appends a private log, then calls the host mail transport. A true `mail()` result means transport acceptance, not guaranteed inbox delivery. Actual mailbox delivery has not been tested.
- Existing native Studio had local photos/notes and manual PDF sharing, with no server association or authentication. It had not been compiled.
- Connected Supabase discovery returned **JCA only** (`rnuagisyemujstgokkjd`). No LINART database was available. JCA data, schemas and settings were not changed. This implementation is intended for a separate LINART project unless a shared target is explicitly reviewed and approved.
- No Codemagic configuration or GitHub build workflow was present in the app repository. Account-level triggers and hosting secrets were not accessible through the checked repositories.
- Existing LINART assets and design system were retained. Approved Studio mockup image files were not located in these repositories, so exact mockup parity is not claimed.

## Client experience

1. Explore the existing native homepage, services and actual LINART project portfolio.
2. Send the short inquiry: name, email, phone, project location and project type. Contact preference, description and timing may be blank. No Studio, account, photos or budget is required.
3. The website sends the existing notification and returns success only after its mail transport accepts it. A private journal supplies a stable inquiry reference. The app offers Begin Studio, Return Later or Skip after acceptance.
4. The background worker independently syncs accepted inquiries into Supabase. During an outage the lead still reaches the existing mail workflow, while Studio association waits for recovery.
5. Verify the inquiry email using a short-lived one-time code. Select an accepted project. A new inquiry may take a few minutes to appear after the scheduled worker runs.
6. Develop optional, service-specific goals, existing conditions, materials/style, priorities, investment, timing and constraints. Add up to eight JPEG photo copies, ten inspiration links and four PDF plans. PDFs require an enabled scanner; photographs of plans work without it.
7. Edits and file selections stay on the device. “Save progress to LINART” uploads privately after explicit consent and makes the draft available to authorized staff. “Submit brief” follows review and marks it ready for review even when only partially complete.
8. Return later, verify again when the session expires, load the saved cloud version on another device, or submit an update. Version checks reject stale answer overwrites. Cached project records and local drafts remain available when a cached session/device is offline.
9. Export a personal PDF if useful. The app does not claim delivery through another app. Imported PDF plans are listed, not embedded in the exported PDF.
10. Delete the Studio account and cloud projects from the access screen. Separate prior emails/business records require LINART’s retention process.

## Architecture and boundaries

The existing Hostinger/PHP server is the only application gateway. Supabase provides Auth, PostgreSQL and private Storage. No extra hosted application or Edge Function is needed.

- `contact.php`: existing validation/mail path plus a stable client request UUID, private locked journal and replay protection. It performs **zero Supabase requests**.
- `server/sync-inquiries.php`: CLI cron worker; insert-only, idempotent sync of accepted inquiries. It never sends mail. Failed/uncertain mail attempts are not silently resent or presented as successful.
- `studio/api.php`: passwordless authentication, verified-email project authorization, draft saving, submission, private assets and staff-only review/status operations.
- `studio/admin.php`: responsive desktop/iPad project desk. No client records are embedded in its public login shell. Every API call authenticates and authorizes independently.
- `linart_inquiries`: immutable original contact/verified-email association, current draft, optimistic version, last-submitted snapshot and timestamps.
- `linart_assets`: project-scoped metadata, content/size constraints, idempotent upload reservations and a database-serialized maximum of 12 files.
- `linart_staff`: server-managed, immediately checked active staff allowlist. User-editable metadata cannot grant privileges.

All three tables enable RLS and revoke `anon`/`authenticated` privileges. No browser or app receives a Supabase service/secret key. Database RPCs are security invoker and executable only by the server role. No client Storage policy is added. A shared project’s pre-existing Storage policies must be audited before any deployment.

The gateway validates Supabase access tokens through Auth `/user`; it never trusts an email or project UUID sent by a client as proof. It compares the verified Auth email to the accepted inquiry record. All projects for the same verified mailbox are accessible to that mailbox holder. Shared household mailboxes consequently share access; use separate inquiry emails when separate access is needed.

Native tokens use non-synchronizing, device-only Keychain storage. Refresh tokens are discarded. Staff tokens stay in server-side PHP sessions with Secure, HttpOnly, SameSite=Strict cookies and CSRF protection. Staff status is checked on each call. Email OTP trades some convenience at session expiry for simple revocation and return access; mailbox security is part of the security boundary.

## Upload and sharing safeguards

- JPEG content is decoded and re-encoded server-side, removing embedded source metadata. Maximum 20 megapixels and 10 MB per upload; the app normally creates 1600-pixel copies.
- PDF content must match its type and pass the configured ClamAV daemon. Scanner errors fail closed; no silent bypass.
- Per-file notes are limited to 500 characters, answers to 4,000, links to ten. Links are never fetched by the server, avoiding server-side URL fetch exposure.
- Private download URLs expire after 60 seconds. Downloaded copies cannot be recalled; expired/revoked accounts do not recall already-issued links before those 60 seconds elapse.
- Explicit account deletion removes cloud files before database rows and Auth identity, removes pending/synced local inquiry journals and writes non-PII tombstones so the worker cannot recreate erased records.
- Original email notifications and transport logs are separate business records. Retention review/deletion of those records and provider backups must be assigned to an owner before launch.
- Cloud media uploads happen before the final draft transaction. A network interruption can leave already-uploaded private files visible in a draft, while the final submission remains unconfirmed. Refresh is required before retrying. This is intentional, not an all-or-nothing claim.

## Deployment sequence — approvals required

1. Choose/provision a LINART Supabase project and connect it here. Creating a paid project or branch requires its normal cost confirmation. Do not repurpose JCA without explicit approval.
2. Run `server/preflight.sql` read-only against that exact project. Inspect schemas, dependencies, grants, policies, existing buckets and migration history. Take and verify the applicable backup/export. Resolve broad Storage policies before continuing.
3. Review and explicitly approve `supabase/migrations/20260923190048_linart_project_studio.sql`. Apply first to a staging target; run advisors and the two-client access tests. No production migration has been applied by this work.
4. Configure Supabase email OTP templates to show `{{ .Token }}`, a short OTP expiry (recommended ten minutes), and access-token expiry (recommended one hour). Configure authenticated custom SMTP, provider quotas and rate limits. Test only authorized test inboxes. App sessions do not persist refresh tokens.
5. Create the intended staff Auth users and allowlist their verified UUIDs in `linart_staff` through an authorized administrative operation. Do not put administrator email-only checks or user metadata roles in the app. Require secure staff mailbox access; Supabase MFA for the admin UI is not implemented in this version.
6. Deploy the website package to staging. `studio/common.php` must ship with `contact.php`. Supply PHP 8.2+ with cURL, mbstring, fileinfo and GD. Enable header forwarding for `Authorization`; the Apache config includes it. Set `upload_max_filesize=10M`, `post_max_size=12M`, memory/time limits suitable for image decoding, HTTPS and `display_errors=Off`.
7. Copy `server/config.example.php` to a **private path outside public_html**, configure `LINART_CONFIG_FILE` or the documented sibling `linart-config.php`, and set its permissions to 0600. Use an absolute private data directory with 0700 permissions. Set the Supabase URL/server key privately; never commit it. Start with `studio_enabled=false`.
8. Install the worker outside public_html and schedule, for example, `php /private/server/sync-inquiries.php /absolute/public_html` every minute. Use the same private configuration in CLI and web PHP. Monitor nonzero exit codes, failed/pending mail journals and the age of unsynced accepted inquiries. Never delete pending outbox records as routine cleanup.
9. Install/configure an updated ClamAV daemon if PDF upload is wanted at launch. Otherwise the app explains the restriction and accepts photographs of plans. Validate real scanner clean/infected-file behavior in staging.
10. Validate original inquiry delivery to an **explicitly authorized** test recipient; no real inbox test was performed here. Test Supabase outage, dropped response, repeated request ID, worker retry, two clients, non-staff login, revocation, account deletion and PDF scanning end-to-end.
11. Review/publish `studio/privacy.php`, choose the business retention schedule and assign the owner for email/log/backup deletion requests. Configure periodic inactive-record review. App Store declarations should include contact information, photos/video, other user content and identifiers linked to the user for app functionality; no tracking. The native privacy manifest has been updated, but App Store Connect was not edited.
12. Turn on `studio_enabled` only after staging checks pass and deployment approval is given. Deploy the native app only after Xcode build, XCTest, simulator and real iPhone/iPad acceptance tests are approved and pass. Do not start Codemagic or App Store submission implicitly.

## Rollback and operational recovery

First disable `studio_enabled` and stop the sync cron. Initial inquiry mail remains independent. Revert app/website changes if needed; preserve private journals for reconciliation. Never resend an uncertain mail journal automatically. An operator must check mailbox/transport evidence and reconcile delivery state.

`server/rollback.sql` is a destructive, owner-approved **last resort** after exporting records and downloading Storage assets. Remove objects via Storage API before deleting the bucket. It drops only LINART objects. A failed database rollout does not justify modifying JCA or other existing tables.

Use a single authoritative PHP host/private directory for this version. Multi-node deployment needs a shared transactional journal/rate-limit/locking store before rollout. Account deletion and the worker share locks to avoid re-inserting deleted leads. Tombstones are ID/timestamp-only records. Security rate-limit lock files and completed outbox records need an approved retention policy; do not expose the private directory to web serving or backups with wider access.

## Verification performed

- Website production build: PASS.
- PHP syntax and JavaScript syntax: PASS.
- Isolated PostgreSQL (PGlite, with minimal Supabase-owned schema stand-ins): migration and rollback, deny-by-default role access, version conflicts, optional/partial submission, workflow preservation, file quota/idempotency, path/size constraints: PASS.
- Local PHP HTTP integration against a fake HTTPS Supabase server and file-only mail sink: inquiry validation, replay without duplicate mail, no Supabase dependency in lead submission, worker retry, verified ownership, cross-client denial, staff allowlist, CSRF, unsafe origins, stale draft rejection, JPEG validation, PDF scanner gate, signed downloads and account deletion: PASS.
- Headless Chromium dashboard with isolated preview data: desktop and iPad screenshots reviewed, no JavaScript page errors or iPad horizontal overflow. This is not a physical iPad/Safari check.
- Swift syntax parser and Xcode project/resource structure: performed separately; **not equivalent to compilation or XCTest**.
- Read-only live `GET /contact.php`: returned expected 405. No live POST or email was sent.

Commands: `npm run build`, `npm run test:studio:db`, `npm run test:studio:php`, `npm run test:studio:http`. HTTP tests require PHP 8.2+, required PHP extensions, Python 3 and OpenSSL; set `PHP_BIN` when PHP is not on PATH.

## Remaining release gates and limitations

- No LINART Supabase target, hosted SMTP, live host private configuration or cron has been provisioned/verified. This is not a functioning deployed service yet.
- No Xcode compile, XCTest execution, simulator/device run, signing, Codemagic build or App Store submission. Native API contracts pass independent server tests; SwiftUI/SDK type checking and usability remain release gates.
- VoiceOver, large Dynamic Type, rotation, safe areas, keyboard behavior, PDF pagination, photo import and document provider behavior need real iPhone/iPad checks.
- Staff dashboard browser/visual verification is recorded in the release report. Account-level hosting/build triggers have not been independently inspected.
- Stale checks protect answer snapshots. Media operations are individually authorized, serialized per project and retryable, but are not one atomic transaction with the final brief. Avoid simultaneous multi-device editing of attachment notes until a richer conflict UI is added.
- Inquiry mail outage recovery is deliberately manual to avoid duplicate leads. Host mail transport acceptance is not delivery proof.
- The native project list currently loads the most recent 50 inquiries per verified mailbox. Staff inbox pagination supports older records.
