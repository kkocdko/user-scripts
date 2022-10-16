// ==UserScript==
// @name        Rust Books Mod
// @match       *://doc.rust-lang.org/*
// @match       *://docs.rs/*
// @version     0.2
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

// docs.rs
document.lastChild.appendChild(document.createElement("style")).textContent = `
html {
  --color-background: #000;
  --main-background-color: #000;
  --sidebar-background-color: #000;
  --code-block-background-color: #000;
  --scrollbar-track-background-color: transparent;
  --scrollbar-thumb-background-color: #7777;
  --scrollbar-color: #7777 #7777;
}
`.replace(/;/g, "!important;");
waitUntil(() => document.readyState === "complete").then(async () => {
  if (document.documentElement.dataset.theme === "ayu") return;
  document.querySelector("#settings-menu").click();
  await sleep(300);
  document.querySelector("#preferred-dark-theme-ayu").click();
  await sleep(300);
  document.querySelector("#settings-menu").click();
});

// doc.rust-lang.org and other books
document.querySelector("#ayu.theme")?.click();
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
