// ==UserScript==
// @name        Rust Books Mod
// @match       *://doc.rust-lang.org/*
// @match       *://docs.rs/*
// @version     0.2.2
// ==/UserScript==
"use strict";

const { sleep, waitUntil } = {
  sleep(ms) /* 20210416-2319 */ {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  waitUntil(condition, interval = 200, timeout = 5000) /* 20210416-2319 */ {
    return new Promise((resolve) => {
      const finish = () => [clearInterval(timer), resolve()];
      const timer = setInterval(() => condition() && finish(), interval);
      setTimeout(finish, timeout);
    });
  },
};

waitUntil(() => document.readyState === "complete").then(async () => {
  // books
  document.querySelector("#ayu.theme")?.click();

  // docs
  if (document.documentElement.dataset.theme === "ayu") return;
  document.querySelector("#settings-menu").click();
  await sleep(300);
  document.querySelector("#preferred-dark-theme-ayu").click();
  await sleep(300);
  document.querySelector("#settings-menu").click();
});

document.lastChild.appendChild(document.createElement("style")).textContent = `
/* docs */
*{background:#0000;}
html{background:#000;}
.result-name,.module-item>a,.sidebar .mod,.sidebar .enum,.sidebar .trait,.sidebar .type{font-family:monospace;}
::-webkit-scrollbar { display:none; }
.nav-container { position: relative; }

/* books */
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
