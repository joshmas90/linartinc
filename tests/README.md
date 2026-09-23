# Isolated verification

No production credentials, client records or recipient email are used.

QA dependencies were installed outside the repositories: `@electric-sql/pglite@0.3.14`, `@php-wasm/cli@3.1.42` (PHP WASM), runtime Playwright with `@sparticuz/chromium@153.0.0` for the isolated browser run, and Python `tree-sitter`/`tree-sitter-swift`. They are test tooling, not deployed website dependencies. Set `QA_NODE_MODULES` to that installation's `node_modules`.

- `node tests/studio-database.test.mjs`: PostgreSQL migration, authorization, expiry, revision conflicts, private bucket flags and rollback. Hosted Auth/Storage schemas are stubbed; hosted behavior still requires staging.
- `node tests/studio-gateway.test.mjs`: actual gateway with all curl functions mocked; unauthenticated/unverified/cross-client/origin/admin/actor-spoof checks.
- `node tests/inquiry-endpoint.test.mjs`: actual contact.php with `mail` disabled/replaced by a local counter. Tests no-Supabase success, dedupe, validation, uncertain handoff and private records.
- `node $QA_NODE_MODULES/@php-wasm/cli/php-wasm.js tests/studio-validation.php`: server answer/link/reference validation.
- `node tests/studio-admin.test.mjs`: Playwright against an isolated fixture HTTP server; login, review, status, escaping, sign-out and responsive widths. Requires installed Chromium and resolvable `playwright`.
- `node $QA_NODE_MODULES/@php-wasm/cli/php-wasm.js -l path/to/file.php`: syntax check every PHP entrypoint/helper.
- `npm run build`: website release bundle.
- `cd apps/web && npx eslint src/pages/ContactPage.jsx public/studio-admin.js --quiet`: changed JavaScript lint.

Full repository lint currently has 27 unresolved imports in pre-existing, unused UI components. The production build succeeds because these modules are not used by the current pages. This unrelated dependency cleanup is not hidden by weakening lint rules.
