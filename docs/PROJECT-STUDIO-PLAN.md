# LINART Project Studio v1 — implementation plan and audited baseline

23 September 2026. Source implementation; deployment is explicitly gated.

## Inspected baseline

- App `5dd65990f34565dbf51b4a1154e25f3196e1de12`: native SwiftUI; existing Studio stores one local draft, photos, links and exports PDFs. No secure project association or server save.
- Website `45ee6b05b0148a226f7a97717df6aa25a35d5c29`: existing PHP contact endpoint validates input, logs details, calls PHP mail, and returns `{ok:true}` only after mail accepts. No idempotency key or inquiry receipt. Public-directory fallback for logs was unsafe.
- Connected Supabase: only the unrelated JCA project is visible. No JCA schema or data was modified or queried for this work. No LINART project can be inspected/applied yet.
- No Xcode/Apple SDK, signing tools, Codemagic connection, or callable Hostinger deployment tools are available. No workflows or Codemagic configuration exist in the app repository.
- Previous design context confirms four approved Studio concepts: landing, photos/inspiration, guided questions, review. Original mockup images are unavailable; existing LINART imagery and design tokens are preserved.

## Implemented sequence

1. Preserve PHP notification recipients and initial validation; add a durable private inquiry record, request identity, receipt and replay protection. Initial inquiry never calls Supabase.
2. A separate CLI worker imports recorded leads into LINART-only Supabase tables. Outages leave the queue intact; no emails are retried by the worker.
3. Use Supabase email OTP through the existing PHP host. A verified email AND a 256-bit inquiry receipt claim the inquiry. Subsequently the bound Supabase user ID authorizes access. No email/project-ID-only access.
4. Restrict all LINART tables/functions and the private bucket to the server role. The gateway verifies Auth and owner/admin permission for each action. Server role stays only in hosting environment configuration.
5. Connect native per-inquiry local drafts to explicit online saves, uploads and review/submission. Preserve PDF export. Stored revision numbers prevent stale local drafts from overwriting online edits.
6. Provide an isolated, no-analytics admin interface with HttpOnly cookies, live administrator allowlist checks, private file transfers, workflow status and print/PDF support.
7. Validate source and isolated behavior; document hosted integration and Xcode/device gates separately.

## Deliberate v1 tradeoffs

The PHP gateway fits the existing host and mail workflow; no separate Edge Function system is introduced. Every database read/write is server-authorized; RLS denies direct client access. Losing the initial device before claiming the invitation requires human identity-verified reconnection. No passwords, refresh tokens or deep-link secrets are exposed to clients. Email verification is only needed for online Studio access, never for the initial inquiry or local planning after it is accepted.

Online saves are explicit, local saves automatic. LINART can see saved drafts. A submitted snapshot of answers/links/media metadata remains separately recorded; the current attachment collection can change when a client removes files. No immutable construction-contract archive is implied. Initial inquiry notifications remain unchanged; Studio updates appear in the admin dashboard, without additional production emails.
