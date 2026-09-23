<?php
header('Cache-Control: no-store, private');
header('X-Robots-Tag: noindex, nofollow');
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
header('Referrer-Policy: no-referrer');
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>LINART · Project desk</title><link rel="stylesheet" href="admin.css"><script src="admin.js" defer></script></head>
<body><header><a href="/" aria-label="LINART home">LINART<span>CONSTRUCTION INC.</span></a><div>PRIVATE PROJECT DESK</div><button id="logout" hidden>Sign out</button></header><main>
<section id="login"><p class="eyebrow">A considered beginning</p><h1>Every project.<br>A clearer picture.</h1><p>Authorized LINART personnel only. Verify your email to open the project desk.</p><form id="login-form"><label>Email address<input id="email" type="email" autocomplete="email" required maxlength="180"></label><button id="send-code" type="button">Send access code</button><label>One-time code<input id="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6,8}" required></label><button type="submit">Open project desk</button></form></section>
<p id="notice" role="status" aria-live="polite"></p>
<section id="desk" hidden><div class="desk-heading"><div><p class="eyebrow">From first conversation to shared vision</p><h1>Project inquiries</h1></div><button id="refresh">Refresh</button></div><div class="workspace"><aside><label>Find in this page<input id="search" type="search" placeholder="Name, location or service"></label><div id="projects"></div><nav aria-label="Inquiry pages"><button id="previous">Previous</button><button id="next">Next</button></nav></aside><article id="detail"><h2>Select a project</h2><p>Contact details, ideas and documents will appear here.</p></article></div></section>
</main><footer>LINART · Private client information. Share only with authorized project personnel.</footer></body></html>
