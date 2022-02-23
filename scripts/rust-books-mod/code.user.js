// ==UserScript==
// @name        Rust Books Mod
// @match       *://doc.rust-lang.org/*
// @version     0.1
// ==/UserScript==
document.querySelector("#ayu.theme").click();
document.lastChild.appendChild(document.createElement("style")).textContent = `
.ayu {
  --fg: #eee;
  --bg: #000;
  --quote-bg: #000;
  --page-padding: 0;
}
.ayu .hljs, .ayu blockquote { background: var(--bg); }
.ayu .hljs-comment { color: #8e99a4; }
.ayu .menu-bar:not(:hover) { opacity: 0; }
.ayu ::-webkit-scrollbar { display:none; }
`.replace(/;/g, "!important;");
