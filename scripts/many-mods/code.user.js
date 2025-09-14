// ==UserScript==
// @name        Many Mods
// @description Many many small modify for many sites.
// @namespace   https://greasyfork.org/users/197529
// @version     2.0.90
// @author      kkocdko
// @license     Unlicense
// @match       *://*/*
// @exclude-match  *://127.0.0.1:8109/*
// @exclude-match  *://127.0.0.1:9393/*
// @exclude-match  *://127.0.0.1:9090/*
// @exclude-match  *://generated.vusercontent.net/*
// @exclude-match  *://godbolt.org/*
// @exclude-match  *://vercel.com/*
// @exclude-match  *://v0.dev/*
// @exclude-match  *://*.github.dev/*
// @exclude-match  *://discord.com/*
// @exclude-match  *://replit.com/*
// @exclude-match  *://*.y8.com/*
// @exclude-match  *://html5.gamedistribution.com/*
// @exclude-match  *://skydom.pecpoc.com/*
// @exclude-match  *://online-go.com/*
// @exclude-match  *://krunker.io/*
// @exclude-match  *://*.js13kgames.com/*
// @exclude-match  *://material.angular.io/*
// @exclude-match  *://caniuse.com/*
// @exclude-match  *://esbuild.github.io/*
// @exclude-match  *://codesandbox.io/*
// @exclude-match  *://codepen.io/*
// @exclude-match  *://*.xda-developers.com/*
// @exclude-match  *://meet.google.com/*
// @exclude-match  *://tailwindcss.com/*
// @exclude-match  *://mui.com/*
// @exclude-match  *://react.fluentui.dev/*
// @exclude-match  *://chakra-ui.com/*
// @exclude-match  *://ui.shadcn.com/*
// @exclude-match  *://*.radix-ui.com/*
// @exclude-match  *://ianlecorbeau.github.io/blog/*
// @exclude-match  *://*.codeium.com/*
// @exclude-match  *://*.babylonjs.com/*
// @exclude-match  *://*.web.dev/*
// @exclude-match  *://oledera.samsungdisplay.com/*
// @exclude-match  *://*.lhr.life/*
// @exclude-match  *://*.cdnjs.com/*
// @exclude-match  *://*.feishu.cn/*
// @exclude-match  *://nnethercote.github.io/perf-book/*
// @exclude-match  *://colab.research.google.com/*
// @exclude-match  *://danielyxie.github.io/bitburner/*
// @exclude-match  *://*.skk.moe/*
// @exclude-match  *://regex101.com/*
// @exclude-match  *://*.toolpad.io/*
// @exclude-match  *://parceljs.org/*
// @exclude-match  *://*.draw.io/*
// @exclude-match  *://*.diagrams.net/*
// @exclude-match  *://live.mdnplay.dev/*
// @exclude-match  *://hedzr.com/*
// @require     https://registry.npmmirror.com/darkreader/4.9.109/files/darkreader.js
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// ==/UserScript==

// @inject-into page
// @inject-into content // 既要又要问题

// Only contains custom style and other tiny functions that wouldn't shock users

const afterEnter = (f, condition = () => document.documentElement) => {
  if (condition()) return f();
  const observer = new MutationObserver(() => {
    if (!condition()) return;
    observer.disconnect();
    f();
  });
  observer.observe(document, { childList: true, subtree: true });
};

const afterReady = (f) => {
  let triggered = false;
  const listener = () => {
    if (triggered) return;
    triggered = true;
    window.removeEventListener("DOMContentLoaded", listener);
    window.removeEventListener("load", listener);
    f();
  };
  const state = document.readyState;
  if (state === "interactive" || state === "complete") return listener();
  window.addEventListener("DOMContentLoaded", listener);
  window.addEventListener("load", listener);
};

const css = ([s]) => {
  const el = document.createElement("style");
  el.textContent = s.replace(/;/g, "!important;");
  afterEnter(() => {
    document.documentElement.appendChild(el);
  });
};

// const globalThis = this.unsafeWindow || this;
const { host, pathname } = location;

// set this to undefined to disable DarkReader
let darkOptions = {
  darkSchemeBackgroundColor: "#000000",
  darkSchemeTextColor: "#ffffff",
  scrollbarColor: "#666666",
  selectionColor: "#445566",
  contrast: 115,
  brightness: 130, // { contrast: 115, brightness: 130 } just got the background color down to #000
  fixes: undefined,
  fetchMethod: (url, init) => {
    if (!self.GM_xmlhttpRequest) return window.fetch(url, init);
    const { promise, resolve, reject } = Promise.withResolvers();
    GM_xmlhttpRequest({
      url,
      onerror: reject,
      onload: (r) => {
        resolve({
          text: async () => r.responseText,
          blob: async () => r.response,
        });
      },
    });
    return promise;
  },
};

afterEnter(() => {
  document.documentElement.style.setProperty(
    "color-scheme",
    "dark",
    "important"
  );
  document.documentElement.style.setProperty(
    "background-color",
    "#000",
    "important"
  );
});
css`
  :root,
  html,
  body {
    background: #000;
    color-scheme: dark;
    --darkreader-bg--background-color-neutral-subtle: #000000;
    --darkreader-bg--background-color-neutral: #000000;
  }
`;

const disableHeavyFeatures = () => {
  // some sites like bilibili.com use service worker and indexeddb, disable them to save memory
  // Object.defineProperty(globalThis, "WebSocket", {});
  Object.defineProperty(globalThis, "Worker", {});
  Object.defineProperty(globalThis, "SharedWorker", {});
  Object.defineProperty(globalThis.navigator, "serviceWorker", {
    value: { getRegistrations: async () => {} },
  });
  Object.defineProperty(globalThis.indexedDB, "open", {});
  indexedDB
    .databases()
    .then((dbs) => dbs.map((db) => indexedDB.deleteDatabase(db.name)));
};

const slowdownTimers = () => {
  const realSetInterval = globalThis.setInterval;
  const realSetTimeout = globalThis.setTimeout;
  globalThis.setInterval = (handler, timeout, ...args) =>
    realSetInterval(handler, timeout * 2, ...args);
  globalThis.setTimeout = (handler, timeout, ...args) =>
    realSetTimeout(handler, timeout * 2, ...args);
};

// MDN
if (host === "developer.mozilla.org") {
  darkOptions = undefined;
  css`
    .code-example {
      --code-background-block: #000;
      border: 1px solid #777;
    }
  `;
}

// React Docs
if (host === "beta.reactjs.org") {
  css`
    .sp-editor {
      height: auto;
      max-height: unset;
    }
    .sp-editor ~ * {
      display: none;
    }
  `;
}

// Kubernetes Docs
if (host === "kubernetes.io") {
  css`
    .td-navbar {
      min-height: 0;
      height: 2.8em;
      zoom: 0.8;
    }
  `;
}

// reddit
if (host === "www.reddit.com") {
  darkOptions = undefined;
  css`
    * {
      --color-neutral-background: #000;
    }
  `;
}

// gitee
if (host === "gitee.com") {
  darkOptions.fixes = {
    ignoreImageAnalysis: ["*"],
    disableStyleSheetsProxy: true,
  };
  css`
    #git-header-nav {
      background: #000;
    }
  `;
}

if (host === "m.nmc.cn") {
  css`
    .weather-real,
    .am-header,
    header {
      background: #000;
      background-image: none;
    }
    .wrapper {
      overflow-x: scroll;
      overflow-x: overlay;
    }
    .am-tabs-bd .am-tab-panel * {
      -webkit-user-drag: unset;
      touch-action: unset;
      transform: none;
    }
  `;
}

// wechat articles
if (host.endsWith("mp.weixin.qq.com")) {
  css`
    #page-content {
      background: #000;
    }
  `;
}

// Debian man pages
if (host === "manpages.debian.org") {
  darkOptions = undefined;
  css`
    * {
      background-image: unset;
      background: #000;
      color: #fff;
    }
    a,
    a * {
      color: #acf;
    }
    .maincontent {
      max-width: unset;
    }
    .Bl-tag > dd {
      overflow: hidden;
    }
  `;
}

// Google AI Studio / Gemini
if (host === "aistudio.google.com" || host === "gemini.google.com") {
  darkOptions = undefined;
  slowdownTimers();
  css`
    html,
    body {
      --color-v3-surface: #000;
      --color-v3-surface-container: #000;
      --color-v3-surface-left-nav: #000;
      background: #000;
    }
  `;
}

// Qwen (Alibaba)
if (host === "chat.qwen.ai") {
  darkOptions = undefined;
  css`
    html {
      --container-primary-bgweb: #000;
      --container-secondary-bgweb: #000;
      --container-primary-bgapp: #000;
      --container-secondary-bgapp: #000;
      --container-primary-fill: #000;
      --container-secondary-fill: #000;
    }
    .codespan:is(.dark *) {
      background-color: #000;
      color: #9fa8da;
      box-shadow: 0 0 0 1px #777;
    }
  `;
}

// Doubao (bytedance)
if (host.endsWith(".doubao.com")) {
  disableHeavyFeatures();
}

// Katex
if (host === "katex.org") {
  css`
    .demo {
      flex-direction: column-reverse;
    }
    .demo-right,
    .demo-left,
    .demo-left textarea {
      background: #000;
      color: #fff;
    }
  `;
  document.querySelector(".demo-right").onclick = function () {
    this.parentNode.requestFullscreen();
  };
}

if (host === "chess.com" || host.endsWith(".chess.com")) {
  darkOptions = undefined;
  // disableHeavyFeatures();
  css`
    body {
      background: #000;
      --color-neutrals-white: #bbb;
      --gutter: 0rem;
      --gutterSmall: 1px;
      --subtractFrom: 0rem;
      --evalWidth: calc(2rem - 2px);
    }
    wc-chess-board {
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="%23474747" d="M0,0H1V2H2V1H0Z"/></svg>')
        0 0 / 25% repeat;
    }
    wc-chess-board.analysis-overlay:before {
      box-shadow: 0 0 0 1px #1976d2;
      background: none;
    }
    .piece:is(.wp, .wr, .wn, .wb, .wq, .wk) {
      filter: brightness(0.9);
    }
    .piece:is(.bp, .br, .bn, .bb, .bq, .bk) {
      filter: sepia(1) brightness(1.1);
    }
    wc-chess-board .hint {
      background-color: #567;
    }
    .clock-icon-icon > svg,
    .clock-time-monospace {
      transform: none;
      position: absolute;
    }
    .evaluation-bar-score {
      padding: 1px;
    }
  `;
  if (pathname === "/home") {
    const getEl = () => document.querySelector(".tv-player-component");
    console.time("find_tv_remove");
    afterEnter(() => {
      getEl().remove(), console.timeEnd("find_tv_remove");
    }, getEl);
  }
}

// V2EX
if (host === "v2ex.com" || host.endsWith(".v2ex.com")) {
  if (host !== "v2ex.com") {
    window.stop();
    location.host = "v2ex.com";
    throw new Error("jumped");
  }
  darkOptions = undefined;
  css`
    :root {
      --box-border-color: #666;
      --box-background-hover-color: #666;
    }
    #Wrapper {
      --component-margin: 0;
    }
    .content {
      padding: 0;
    }
    * {
      background: #000;
      color: #fff;
      text-shadow: none;
    }
    h1 {
      font-weight: normal;
    }
    a:visited {
      color: #999;
    }
  `;
}

// TexPage
if (host === "texpage.com" || host.endsWith(".texpage.com")) {
  css`
    .pdfViewer {
      background: #0000;
      filter: brightness(0.7) contrast(3) hue-rotate(180deg) invert(1);
    }
  `;
}

// Matlab Online
if (host === "matlab.mathworks.com") {
  css`
    div.dijitTabContainerTop#dijit_layout_TabContainer_0 * {
      background: #0000;
      color: #000;
    }
  `;
}

// Python Docs
if (host === "docs.python.org") {
  css`
    html,
    body,
    .sphinxsidebar {
      background: #000;
    }
    body > :not(.document) {
      display: none;
    }
    div.body .highlight {
      background: none;
    }
    div.body {
      font-size: 16px;
    }
  `;
}

// Pandas Docs
if (host === "pandas.pydata.org" && pathname.startsWith("/docs")) {
  css`
    * {
      background: #000;
    }
    .bd-header:not(:hover) {
      opacity: 0;
    }
  `;
}

// OneDrive
if (host === "onedrive.live.com") {
  css`
    #O365_NavHeader,
    #O365_NavHeader * {
      background: none;
      background-color: none;
    }
    #spartan-left-nav > div:first-child button {
      background: none;
    }
  `;
}

// CSDN
if (host === "blog.csdn.net") {
  css`
    code {
      background: #fff;
      color: #000;
      box-shadow: 0 0 0 1px #999;
    }
    * {
      user-select: unset;
    }
    body {
      background-image: none;
    }
  `;
}

// GitHub
if (host === "github.com" || host === "gist.github.com") {
  darkOptions = undefined;
  css`
    html {
      --color-fg-default: #fff;
      --color-canvas-default: #000;
      --color-page-header-bg: #000;
      --color-canvas-subtle: #000;
      --color-btn-bg: #000;
      --color-border-default: #777;
      --color-btn-border: #777;
      --color-border-muted: #777;
      --color-canvas-overlay: #000;
      --color-header-bg: #000;
      --color-fg-muted: hsl(212deg 9% 74%);
      --color-accent-fg: hsl(215deg 56% 66%);
      --button-primary-bgColor-rest: #09b43aee;
      --button-default-bgColor-rest: #000;
      --bgColor-muted: #000;
      --bgColor-default: #000;
      --bgColor-inset: #000;
    }
  `;
}

// Bing search
if (host === "www.bing.com" && pathname === "/search") {
  darkOptions = undefined;
  css`
    *,
    #b_results *,
    .b_scopebar ul:after,
    .b_pinhead:not(.b_dark) #b_header {
      background-image: unset;
      background-color: #000;
      color: #fff;
      border-color: #777;
    }
    #b_results a,
    #b_results a *:not(.rdtopattr *, .b_tpcn *),
    #b_algospacing .b_algospacing_link {
      color: #acf;
    }
    #b_header,
    .b_scopebar {
      padding-top: 0;
      padding-bottom: 0;
      margin-top: 0;
      margin-bottom: 0;
    }
    #bpage #b_results > * {
      margin: 0;
    }
    #sb_form_q,
    .b_bop_cs_sb {
      border: none;
    }
    #b_results .b_algoheader,
    #b_results .b_algoheader * {
      background-color: #0000;
    }
  `;
}

// GORM Docs
if (host === "gorm.io") {
  css`
    figure.highlight {
      overflow: auto;
    }
  `;
}

// Redis Docs
if (host === "redis.io") {
  css`
    .codetabs,
    .bg-gradient-to-bl,
    #search-button ~ * {
      background: #0000;
      box-shadow: 0 0 0 1px #777;
    }
    .codetabs *,
    .highlight pre {
      background: #0000;
    }
    .codetabs {
      filter: invert(1) hue-rotate(180deg);
    }
    header {
      position: relative;
    }
  `;
}

// Youtube
if (host.endsWith(".youtube.com")) {
  darkOptions = undefined;
  disableHeavyFeatures();
  css`
    * {
      backdrop-filter: none;
    }
    ytm-pivot-bar-renderer,
    ytm-mobile-topbar-renderer:not(.topbar-transparent-background),
    ytm-feed-filter-chip-bar-renderer {
      background-color: #000;
    }
    ytm-pivot-bar-renderer {
      height: 42px;
    }
    .ytp-mweb-player {
      transform: none;
      transition: none;
    }
    .ad-showing video {
      visibility: hidden;
    }
  `;
  // localStorage["yt-player-quality"]=JSON.stringify({data:"{\"quality\":144,\"previousQuality\":144}",expiration:5747494973140,creation:1747494973140})
  // 使用移动版(平板布局)页面  https://m.youtube.com/?persist_app=1&app=m  |  app=desktop
}
// 允许后台播放 https://greasyfork.org/scripts/521370
/*
// [patch:20250915]
window.addEventListener('visibilitychange', e => {
  e.stopImmediatePropagation();
  setTimeout(() => document.querySelector('video').play(), 2000);
}, true);
*/
/*
// [backup:20250915]
// ==UserScript==
// @name         YouTube Background Playback - Kiwi Browser
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      1
// @description  Enable YouTube background playback in Kiwi.
// @author       hacker09
// @match        *://*.youtube.com/*
// @match        *://*.youtube-nocookie.com/*
// @run-at       document-end
// @grant        none
// ==/UserScript==
 
'use strict';
const lactRefreshInterval = 5 * 60 * 1000; // 5 mins
const initialLactDelay = 1000;
 
// Page Visibility API
Object.defineProperties(document, { 'hidden': { value: false }, 'visibilityState': { value: 'visible' } });
window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);
 
// _lact stuff
function waitForYoutubeLactInit(delay = initialLactDelay) {
  if (window.hasOwnProperty('_lact')) {
    window.setInterval(() => { window._lact = Date.now(); }, lactRefreshInterval);
  }
  else{
    window.setTimeout(() => waitForYoutubeLactInit(delay * 2), delay);
  }
 
}
 
waitForYoutubeLactInit();
*/

// Bing Login
if (host === "login.live.com") {
  css`
    .template-section.main-section {
      background: #fff;
    }
  `;
}

// Tower
if (host === "tower.im") {
  // darkOptions = {};
  css`
    tr-todo-page-todo-title .title-style,
    .team-name,
    .link-team-name {
      font-weight: normal;
      transition: none;
    }
    .promotion-banner-link,
    #nav-upgrade {
      display: none;
    }
    .notifications-group-item-body img,
    img.avatar,
    a.avatar img,
    .assignee img,
    .pjax-loading {
      opacity: 0.7;
      transition: none;
    }
    * {
      transition: none;
    }
    .workspace .pjax-loading:before {
      content: "···";
      animation: none;
      top: 200px;
      text-align: center;
      width: unset;
    }
  `;
}

// Bilibili
if (host.endsWith(".bilibili.com")) {
  disableHeavyFeatures();
  darkOptions = undefined;
  css`
    :root {
      --brand_pink: #d67;
      --bg1: #000;
      --bg2: #000;
      --bg3: #000;
      --bg1_float: #000;
      --bg2_float: #000;
      --text1: #fff;
      --text2: #fff;
      --line_regular: #888;
      --graph_bg_bright: #000;
      --graph_bg_thin: #000;
      --graph_bg_regular: #000;
      --graph_bg_thick: #000;
      --graph_weak: #000;
    }
    .b-img,
    .history-list .r-info,
    .history-list .r-info .title,
    .opus-module-content {
      background: #000;
      color: #fff;
    }
    #app .bg,
    #app .bgc {
      display: none;
    }
  `;
}

// Stack Overflow
if (
  host === "stackoverflow.com" ||
  host === "askubuntu.com" ||
  host === "superuser.com" ||
  host === "serverfault.com" ||
  host.endsWith(".stackexchange.com")
) {
  darkOptions = undefined;
  afterEnter(
    () => {
      // force enable highcontrast dark theme when not login
      document.body.classList.add("theme-dark");
      document.body.classList.add("theme-highcontrast");
    },
    () => document?.body?.classList?.add
  );
  css`
    * {
      --theme-post-title-color: #7cbfed;
      --theme-link-color: #7cbfed;
    }
    #question-header a[href="/questions/ask"],
    body {
      background: #000;
      color: #fff;
    }
    .js-consent-banner,
    .js-dismissable-hero {
      display: none;
    }
    header.js-top-bar {
      position: absolute;
      margin: 0;
      border-top: none;
      background: none;
    }
    header.js-top-bar * {
      background: none;
    }
    .site-header--container {
      display: none;
    }
    .s-sidebarwidget,
    .s-sidebarwidget * {
      background: none;
    }
  `;
}

if (host.endsWith(".zhihu.com")) {
  // console.log(window.wrappedJSObject)
  // 因为知乎的前端是傻逼，写进去一堆数据体积几十兆不知道在干什么
  disableHeavyFeatures();
  if (!document.cookie.split("; ").includes("theme=dark")) {
    document.cookie = "theme=dark; path=/; max-age=31536000";
    if (document.cookie.split("; ").includes("theme=dark")) {
      location.reload(); // it is not set manually before (first if) and not httponly (second if), so needs reload
    }
  }
  css`
    :root {
      --GBL01A: #1363be;
    }
    .ContentItem-actions.is-fixed {
      width: 100vw;
      padding: 0;
      background: #111a;
    }
  `;
  // 另一部分已拆分至 zhihu-desktop-on-mobile
}

if (host === "leetcode.com" || host === "leetcode.cn") {
  Object.defineProperty(globalThis.navigator, "serviceWorker", {});
  Object.defineProperty(globalThis, "Worker", {});
  if (pathname === "/contest" || pathname.startsWith("/contest/"));
  else darkOptions = undefined;
  css`
    .flexlayout__layout,
    .flexlayout__layout *:not(.monaco-editor-background *) {
      background-color: #000;
    }
    .flexlayout__layout code,
    .flexlayout__layout pre {
      color: unset;
      font-family: monospace;
    }
  `;
}

if (host === "oi-wiki.org") {
  css`
    .md-content img {
      filter: invert(1);
    }
  `;
}

// Telegram Web K > settings > language > show translate button = off
if (host === "web.telegram.org" && (pathname === "/k/" || pathname === "/k")) {
  darkOptions = undefined;
  css`
    * {
      backdrop-filter: none;
      animation: none;
      transition: none;
      --body-background-color: #000;
      --body-background-color-rgb: 0, 0, 0;
      --background-color-true: #181818;
      --background-color: var(--background-color-true);
      --message-background-color: #000;
      --message-out-background-color: #000;
      --message-out-background-color-rgb: 0, 0, 0;
      --surface-color: #000;
      --surface-color-rgb: 0, 0, 0;
      --menu-background-color: #222222;
      --primary-color: #b6abed;
    }
    .bubble-content,
    .sidebar-header {
      box-shadow: inset 0 -1px 0 0 #555;
    }
    .chatlist-chat.active {
      --background: #000;
      box-shadow: inset 0 0 0 2px;
    }
    .chat-input .btn-send,
    .btn-corner,
    .reaction-block:before {
      background-color: #000;
      box-shadow: inset 0 0 0 1px #888;
    }
    .avatar-like custom-emoji-renderer-element,
    .chatlist-chat custom-emoji-renderer-element {
      display: none;
    }
    .chat-background {
      background-color: #000;
    }
  `;
}

if (darkOptions) {
  const run = () => {
    if (darkOptions.fetchMethod)
      DarkReader.setFetchMethod(darkOptions.fetchMethod);
    // https://github.com/darkreader/darkreader/issues/9567
    const raf = window.requestAnimationFrame; // slow down requestAnimationFrame temporarily
    window.requestAnimationFrame = (f) => setTimeout(f, 700);
    DarkReader.auto(darkOptions, darkOptions.fixes);
    window.requestAnimationFrame = raf;
  };
  if (window.DarkReader) {
    afterEnter(() => run());
  } else {
    console.log("[many-mods] start load darkreader by dynamic import");
    const url = `https://registry.npmmirror.com/darkreader/4.9.109/files/darkreader.js`;
    import(url).then(() => afterEnter(() => run()));
  }
}

// https://github.com/darkreader/darkreader/issues/9567
// https://github.com/darkreader/darkreader/pull/4005
