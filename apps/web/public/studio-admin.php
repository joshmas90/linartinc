<?php
header('Cache-Control: no-store, private');
header('X-Robots-Tag: noindex, nofollow');
header("Content-Security-Policy: default-src 'self'; img-src 'self' blob:; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
header('Referrer-Policy: no-referrer');
?><!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>LINART · Project desk</title><link rel="stylesheet" href="/studio-admin.css"></head>
<body><header><div><span class="eyebrow">LINART CONSTRUCTION</span><h1>Project desk.</h1></div><button id="logout" hidden>Sign out</button></header><main>
<p id="notice" role="status" aria-live="polite"></p>
<section id="login"><span class="eyebrow">PRIVATE · AUTHORIZED TEAM MEMBERS</span><h2>A considered beginning.</h2><p>Verify your email to review client inquiries and their project ideas.</p><form id="auth"><label>Email<input type="email" id="email" required autocomplete="email"></label><label id="code-label" hidden>Verification code<input id="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6,10}"></label><button id="send-code" type="button">Send verification code</button><button id="verify" hidden>Open project desk</button></form></section>
<section id="desk" hidden><div class="toolbar"><label>Find a project<input id="search" placeholder="Name, location or service"></label><label>Status<select id="filter"><option value="">All statuses</option><option>New Inquiry</option><option>Awaiting Details</option><option>Ready for Review</option><option>Contacted</option><option>Archived</option></select></label><button id="refresh">Refresh</button></div><div class="workspace"><nav id="projects" aria-label="Project inquiries"></nav><article id="brief"><h2>Select an inquiry.</h2><p>The initial inquiry is complete on its own. Studio details are optional.</p></article></div><button id="more" hidden>Load more inquiries</button></section>
</main><script type="module" src="/studio-admin.js"></script></body></html>
