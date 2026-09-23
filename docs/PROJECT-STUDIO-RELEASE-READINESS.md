# LINART v1 — release-readiness report

**23 September 2026 · source implementation complete for staging review; not production- or App-Store-ready.**

## Delivered source

| Area | Implemented |
|---|---|
| Initial inquiry | Existing validation and recipients retained; optional contact preference; stable request UUID, private durable record, replay protection, accurate uncertain-delivery handling |
| Inquiry / Studio association | Independent CLI queue; 256-bit receipt, hashed in Supabase, 30-day claim expiry; verified email plus receipt; bound Auth user for return access |
| Database | Separate inquiry, draft, attachment, admin membership and audit tables; service-only grants and RPCs; RLS denies direct client access; preflight and staging rollback scripts |
| Drafts / submission | Optional structured answers, links, revision conflicts, saved timestamps, submitted answer/link/media-metadata snapshot, partial submissions and later updates |
| Private media | Up to eight images and four conditional PDFs; byte/type/quantity checks; image re-encoding; immutable object IDs; private gateway downloads; pending transfer recovery |
| Native iPhone / iPad source | Post-inquiry choices, code verification/return screen, protected per-inquiry local drafts, explicit cloud saves, photo/remote-photo review, document uploads, submissions, deletion requests and PDF fallback |
| Private admin | Email-code login, live allowlist authorization, HttpOnly cookie, status/filter/search, inquiry and Studio review, missing-context prompts, private attachment access, print/PDF and inactivity sign-out |
| Privacy / operations | Updated app privacy text and manifest, draft policy, provider/retention/deletion runbook, environment/configuration instructions and rollback strategy |

The client flow remains **inquiry → confirmed thank-you → optional local/online Studio → review → submit/update**. Skipping or closing Studio does not alter the original inquiry. LINART sees initial inquiries independently; cloud drafts are visibly distinct from submissions. Studio submissions do not send additional notification emails in this version; they appear in the dashboard.

## Verification evidence

| Check | Result |
|---|---|
| Isolated PostgreSQL tests | **20 passed**: migration/rollback, wrong and expired receipt, ownership, administrator revocation, direct-role denial, optional submission, revision conflict, snapshot retention, upload count and pending-upload gate |
| Actual PHP inquiry with disabled/intercepted mail | **9 passed**: Supabase absent, duplicate replay, changed-payload conflict, input rejection, failed/uncertain mail, oversized/wrong-method/honeypot rejection and private disk records |
| Actual PHP gateway with mocked/disabled network | **8 passed**: missing auth, unverified email, hostile origin, own vs other project, actor spoofing, client admin attempt and unavailable attachment |
| Server validators | **10 passed**: optional answers, limits, unexpected structures, URL schemes/credentials and reference path traversal and batch-upload throttling |
| Admin browser fixture | **Passed**: login shell, inquiry review, text escaping, missing-context prompts, status updates, sign-out data clearing; no horizontal overflow at desktop 1440, iPad 834 and phone 390 widths; no JS exceptions |
| Website production bundle | **Passed** |
| Changed JavaScript lint and PHP syntax | **Passed** |
| Swift grammar | **Passed**, grammar only |
| Xcode project/resource structure | **Passed**: source membership, targets/scheme, assets/catalog, plist/XML and refreshed SHA-256 manifest |
| Privacy manifest keys | Parsed and checked against Apple's documented enum values; no tracking or added broad device permissions |

47 isolated backend/validation checks passed, plus the browser and source/build checks above. Browser tests used synthetic data, not production identities. PHP tests disabled real mail and outbound curl. No real client inquiry or test email was sent.

## Unresolved release gates

1. **Dedicated LINART Supabase connection.** Only JCA is visible in this session; it was untouched. No hosted backend has been deployed. Inspect the actual LINART schema/dependencies/policies with the provided preflight before applying anything.
2. **Explicit production migration approval.** The migration and rollback are prepared and locally tested; neither was run against a hosted database.
3. **Hostinger configuration and deployment access.** No callable hosting tools are exposed here. Install PHP files and the private queue worker, set environment variables, configure cron/monitoring and verify HTTPS/header/session behavior.
4. **Email sender and Auth configuration.** Configure SMTP and one-time-code templates; verify first-time and returning login, expiry and rate limits in staging. Confirm existing inquiry inbox delivery using an owner-approved test destination. No email test is authorized yet.
5. **Hosted integration/security test.** Local tests stub hosted Auth and Storage. Real storage policies, gateway limits, role enforcement, scanner execution, revoked sessions, queue recovery and cross-client transfers must be tested in staging. Run Supabase security advisors there.
6. **Xcode and physical devices.** No Apple SDK is available here. Source parsing does not establish type correctness or runtime behavior. Run the updated XCTest suite, unsigned simulator builds, and iPhone/iPad checks before any signing/distribution. Exact mockup fidelity remains unverified; original mockup image files were unavailable.
7. **Privacy/retention approval.** Approve and publish the policy, nominate the deletion-request owner, settle retention periods, and complete App Store privacy answers. PDF uploads remain disabled unless the host has a maintained scanner.
8. **Existing website lint debt.** Full repository lint reports 27 unresolved imports in pre-existing unused UI scaffolding. Production build and changed-file lint pass. No lint rules were weakened or unrelated dependency tree expanded to conceal this.

No Codemagic build, signing, TestFlight upload, App Store submission, production migration, live deployment or main-branch merge was initiated. Source commits use `[skip ci]` and review branches to preserve the build restriction.

## Operational limitations to retain

- PHP mail returning true confirms transport handoff, not recipient inbox delivery. Uncertain outcomes are not resent automatically.
- Studio saves are explicit; local device edits are not silently uploaded. PDF selection is an explicit immediate upload and is labeled that way.
- Initial invitation recovery after device loss/expiry is handled by an authorized operator after identity verification. Already-bound projects return through fresh email codes.
- Administrator email accounts should have MFA; native admin MFA enrollment is not included in v1.
- Submitted snapshots preserve answers/links/media metadata. They are not immutable archival copies of files a client later removes.
- Deletion requests close client access, then require LINART to remove all approved copies using the runbook. No unapproved bulk deletion or indefinite-retention promise is introduced.

## Source locations

- App repository: `joshmas90/linartinc-app`, review branch `work/project-studio-v1`, commit `9284a6381f8ace42b7f55363d378d9fcf0275785` (full reference available in Git).
- Website/backend/admin repository: `joshmas90/linartinc`, review branch `work/project-studio-v1`.
- Configuration: `docs/PROJECT-STUDIO-DEPLOYMENT.md`.
- Privacy draft: `docs/PRIVACY-POLICY-DRAFT.md`.
- Test commands and limitations: `tests/README.md`.
- Native details: app `Documentation/PROJECT-STUDIO-IMPLEMENTATION.md`.
