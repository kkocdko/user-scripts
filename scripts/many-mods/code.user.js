// ==UserScript==
// @name        Many Mods
// @description Many many small modify for many sites.
// @namespace   https://greasyfork.org/users/197529
// @version     2.0.65
// @author      kkocdko
// @license     Unlicense
// @match       *://*/*
// @exclude-match  *://127.0.0.1:8109/*
// @exclude-match  *://127.0.0.1:9393/*
// @exclude-match  *://127.0.0.1:9090/*
// @exclude-match  *://*@47.100.126.230:*/*
// @exclude-match  *://47.100.126.230:*/*
// @exclude-match  *://forum.suse.org.cn/*
// @exclude-match  *://gemini.google.com/*
// @exclude-match  *://generated.vusercontent.net/*
// @exclude-match  *://caddyserver.com/*
// @exclude-match  *://godbolt.org/*
// @exclude-match  *://vercel.com/*
// @exclude-match  *://v0.dev/*
// @exclude-match  *://*.github.dev/*
// @exclude-match  *://discord.com/*
// @exclude-match  *://replit.com/*
// @exclude-match  *://html5.gamedistribution.com/*
// @exclude-match  *://skydom.pecpoc.com/*
// @exclude-match  *://material.angular.io/*
// @exclude-match  *://caniuse.com/*
// @exclude-match  *://developer.mozilla.org/*
// @exclude-match  *://*.mdn.mozilla.net/*
// @exclude-match  *://esbuild.github.io/*
// @exclude-match  *://flutter.github.io/*
// @exclude-match  *://gallery.flutter.dev/*
// @exclude-match  *://codesandbox.io/*
// @exclude-match  *://codepen.io/*
// @exclude-match  *://doc.rust-lang.org/*
// @exclude-match  *://rust-lang.github.io/*
// @exclude-match  *://*.xda-developers.com/*
// @exclude-match  *://online-go.com/*
// @exclude-match  *://x.com/*
// @exclude-match  *://twitter.com/*
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
// @exclude-match  *://*.y8.com/*
// @exclude-match  *://nnethercote.github.io/perf-book/*
// @exclude-match  *://colab.research.google.com/*
// @exclude-match  *://danielyxie.github.io/bitburner/*
// @exclude-match  *://*.skk.moe/*
// @exclude-match  *://regex101.com/*
// @exclude-match  *://*.js13kgames.com/*
// @exclude-match  *://esp-rs.github.io/*
// @exclude-match  *://*.curl.se/*
// @exclude-match  *://*.toolpad.io/*
// @exclude-match  *://happy0316.top/*
// @exclude-match  *://parceljs.org/*
// @exclude-match  *://*.draw.io/*
// @exclude-match  *://*.diagrams.net/*
// @exclude-match  *://live.mdnplay.dev/*
// @exclude-match  *://*.opensuse.org/*
// @exclude-match  *://hedzr.com/*
// @require     https://registry.npmmirror.com/darkreader/4.9.105/files/darkreader.js
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @inject-into content
// ==/UserScript==

// @inject-into page
// @inject-into content // 既要又要问题

// Only contains custom style and other tiny functions that wouldn't shock users

const afterEnter = (f, condition = () => document.documentElement) => {
  if (condition()) {
    f();
    return;
  }
  const observer = new MutationObserver(() => {
    if (condition()) {
      observer.disconnect();
      f();
    }
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
  if (
    document.readyState === "interactive" ||
    document.readyState === "complete"
  ) {
    listener();
    return;
  }
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
  fetchMethod: (input, init) => {
    if (!self.GM_xmlhttpRequest) return window.fetch(input, init);
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: input,
        onerror: reject,
        onload: (response) => {
          resolve({
            text: async () => response.responseText,
            blob: async () => response.response,
          });
        },
      });
    });
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
    "#000000",
    "important"
  );
});
css`
  :root {
    background: #000000;
    color-scheme: dark;
    --darkreader-bg--background-color-neutral-subtle: #000000;
    --darkreader-bg--background-color-neutral: #000000;
  }
`;

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
  // darkOptions.fetchMethod = async () => ({ text: async () => "" });
  // darkOptions = undefined;
  // css`
  //   *,
  //   #git-header-nav {
  //     background: none;
  //     color: #fff;
  //   }
  //   html,
  //   body {
  //     background: #000;
  //   }
  // `;
}

// linakesi ci
if (host === "ci.linakesi.com") {
  darkOptions.sepia = 10;
  css`
    .breadcrumbs__wrapper,
    .breadcrumbs__wrapper *,
    .stage-start-time,
    .stage-start-time *,
    .cbwf-dialog,
    .cbwf-dialog *,
    .jenkins-config-widgets,
    .jenkins-config {
      background: #000;
      color: #fff;
    }
    .stage-wrapper * {
      text-shadow: none;
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

// ithome
if (host.endsWith(".ithome.com")) {
  darkOptions.sepia = 90;
  css`
    * {
      background: #000;
    }
  `;
}

// cnbeta
if (host === "www.cnbeta.com.tw") {
  css`
    * {
      animation: none;
      transition: none;
    }
    .cnbeta-side-yellow-title,
    .cnbeta-side-blue-title,
    .page-footer {
      background: none;
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

// ChatGPT
if (host === "chatgpt.com") {
  darkOptions = undefined;
  afterReady(() => {
    setTimeout(() => {
      css`
        html {
          --main-surface-primary: #000;
        }
      `;
    }, 1000);
  });
}

// Google AI Studio
if (host === "aistudio.google.com") {
  darkOptions = undefined;
  css`
    html,
    * {
      --color-canvas-background_revamp: #000;
    }
    body,
    .banner-and-app-container {
      background: #000;
    }
  `;
}

// Doubao (bytedance)
if (host.endsWith(".doubao.com")) {
  Object.defineProperty(globalThis.navigator, "serviceWorker", {}); // Disable the ServiceWorker to save cache storate
}

// Katex
if (host === "katex.org") {
  css`
    .demo {
      /* filter: invert(1); */
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

// Luogu
if (host === "www.luogu.com.cn") {
  let timer = null;
  new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      for (const el of document.querySelectorAll("a[target=_blank]"))
        el.removeAttribute("target");
    }, 500);
  }).observe(document.body, {
    characterData: true,
    subtree: true,
  });
  css`
    @media (prefers-color-scheme: dark) {
      html {
        filter: brightness(1.2);
      }
      .problem-card img {
        filter: invert(1);
      }
    }
    html {
      overflow: overlay;
    }
    section.side > :not(.card) {
      display: none;
    }
    .main-container {
      margin-left: 0;
    }
    #app > nav:not(:hover) {
      opacity: 0.3;
      transform: translate(calc(-100% + 20px), calc(100% - 20px));
    }
  `;
}

if (host === "chess.com" || host.endsWith(".chess.com")) {
  darkOptions = undefined;
  css`
    body {
      background: #000;
      --color-neutrals-white: #bbb;
    }
    #board-single {
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%23474747"/><path fill="black" d="M1,1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1z M0,2v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1z M1,3v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1z M0,4v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1z M1,5v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1z M0,6v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1z M1,7v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1z M0,8v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1z"/></svg>');
    }
    #board-single.analysis-overlay {
      box-shadow: 0 0 0 2px #2196f3;
    }
    #board-single.analysis-overlay:before {
      display: none;
    }
    .piece:is(.wp, .wr, .wn, .wb, .wq, .wk) {
      filter: brightness(0.9);
    }
    .piece:is(.bp, .br, .bn, .bb, .bq, .bk) {
      filter: sepia(1);
    }
    .clock-icon-icon > svg {
      transform: none;
    }
    .clock-time-monospace {
      position: absolute;
      display: block;
    }
  `;
}

// V2EX
if (host === "v2ex.com" || host.endsWith(".v2ex.com")) {
  if (host !== "v2ex.com") {
    css`
      * {
        background: #000;
        visibility: hidden;
      }
    `;
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
    .disable_now {
      background: none;
      border: 1px solid #666;
    }
    a:visited {
      color: #999;
    }
  `;
}

// rCore Tutoral
if (host === "rcore-os.github.io" || host === "rcore-os.cn") {
  css`
    html {
      font-size: 1.1em;
    }
    * {
      background: #000;
      color: #fff;
    }
    .content {
      padding: 0 0.3em 0 0;
    }
    img:not(.avatar > *) {
      filter: invert(1) hue-rotate(180deg);
    }
    .mobile-header:not(:hover),
    .back-to-top:not(:hover) {
      opacity: 0;
    }
    .highlight .w {
      text-decoration: none;
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
      background: #fff;
      background-color: #fff;
      color: #000;
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

// CodeMao
if (host === "turtle.codemao.cn") {
  css`
    header,
    .cm-editor {
      background: #fff;
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

// WeChat Web
if (host === "wx.qq.com" || host === "wx2.qq.com") {
  css`
    .download_entry,
    .copyright {
      display: none;
    }
    body {
      background: none;
      overflow: hidden;
    }
    .main {
      height: 100vh;
      min-height: unset;
      padding: 0;
    }
    .main_inner {
      max-width: unset;
      border-radius: 0;
    }
    .nav_view {
      top: 154px;
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
    /*
    a strong {
      box-shadow: inset 0 -2px 0 0 #ff06;
    }
    */
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
    #sb_form_q {
      border: none;
    }
    #b_results .b_algoheader,
    #b_results .b_algoheader * {
      background-color: #0000;
    }
  `;
}

// OpenWRT LuCI Docs
if (host === "openwrt.github.io") {
  css`
    .navigation {
      background-color: #000;
      filter: invert(1);
    }
    ::-webkit-scrollbar {
      width: 8px;
      background-color: #000;
    }
    ::-webkit-scrollbar-corner {
      background-color: #000;
    }
  `;
}

// OpenWRT Local
if (host === "192.168.1.1") {
  css`
    @media (prefers-color-scheme: dark) {
      header > .fill {
        filter: invert(1);
        background: #000;
        box-shadow: 0 1px #777;
      }
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

// MUI Docs
if (host === "mui.com") {
  css`
    #__next > div,
    nav[aria-label="documentation"] > .MuiDrawer-root > div {
      background: #000;
    }
    #__next > div > header {
      position: absolute;
    }
    .MuiCode-root pre,
    [id^="demo-:"] {
      background: #000;
      border: 2px solid #355678dd;
    }
  `;
}

// Youtube
if (host.endsWith(".youtube.com")) {
  darkOptions = undefined;
  Object.defineProperty(globalThis.navigator, "serviceWorker", {}); // Disable the ServiceWorker to save memory
  css`
    ytm-pivot-bar-renderer,
    ytm-mobile-topbar-renderer:not(.topbar-transparent-background),
    ytm-feed-filter-chip-bar-renderer {
      backdrop-filter: none;
      background-color: #000;
    }
    ytm-pivot-bar-renderer {
      height: 42px;
    }
    /* place the nerd info box to the bottom */
    .ytp-sfn {
      position: fixed;
      top: unset;
      bottom: 0px;
      left: 0;
    }
    /*
    .ytp-mweb-player {
      transform: none;
      transition: none;
    }
    */
  `;
  // https://greasyfork.org/scripts/457579  使用移动版(平板布局)页面  https://m.youtube.com/?persist_app=1&app=m
  // https://greasyfork.org/scripts/525586  允许后台播放
}

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
  Object.defineProperty(globalThis.indexedDB, "open", {}); // 因为逼站的前端是傻逼
  Object.defineProperty(globalThis.navigator, "serviceWorker", {}); // Disable the ServiceWorker to save memory
  css`
    #biliMainHeader,
    #biliMainHeader * {
      transition: none;
      background: #000;
    }
    .mini-header__logo,
    .animated-banner {
      display: none;
    }
    .bili-mini-mask {
      /*display: none;*/
    }
    .openapp-dialog,
    .mplayer-widescreen-callapp {
      display: none;
    }
    .m-video-player {
      position: relative;
    }
    #submit-video .cover {
      pointer-events: none;
    }
  `;
  // TODO: 在搜索页面等页面添加 在嵌入播放器打开 的选项？
  if (pathname === "/blackboard/webplayer/mbplayer.html") {
    if (new URLSearchParams(location.hash.slice(1)).has("no-dm")) {
      css`
        .gsl-dm {
          display: none;
        }
      `;
    }
  }
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
  // 因为知乎的前端是傻逼
  Object.defineProperty(globalThis.navigator, "serviceWorker", {});
  Object.defineProperty(globalThis, "Worker", {});
  Object.defineProperty(globalThis, "SharedWorker", {});
  Object.defineProperty(globalThis, "WebSocket", {});
  Object.defineProperty(globalThis.indexedDB, "open", {});
  css`
    .ContentItem-title,
    .QuestionHeader-title {
      font-weight: normal;
    }
  `;
}

// For math pages, load KaTeX
if (
  (host.endsWith(".wikipedia.org") && document.querySelector("math")) ||
  (host.endsWith(".cnblogs.com") && document.querySelector(".math")) ||
  (host === "zhuanlan.zhihu.com" && document.querySelector(".ztext-math"))
) {
  const t = ([s]) => fetch(s).then((v) => v.text());
  const p4js = t`https://registry.npmmirror.com/katex/0.16.9/files/dist/katex.min.js`;
  const p4css = t`https://registry.npmmirror.com/katex/0.16.9/files/dist/katex.min.css`;
  (async () => {
    const q = ".mwe-math-element>img,.math,.ztext-math";
    const es = document.querySelectorAll(q);
    eval(await p4js);
    for (const e of es) {
      const code = (e.textContent || e.alt).trim().replace(/^\\\(|\\\)$/g, "");
      e.katexResult = katex.renderToString(code, { throwOnError: false });
    }
    const el = document.createElement("style");
    el.textContent = await p4css;
    document.documentElement.appendChild(el);
    for (const e of es)
      if (e.tagName === "IMG") e.outerHTML = e.katexResult;
      else e.innerHTML = e.katexResult;
  })();
  // https://zhuanlan.zhihu.com/p/429815465
  // https://zhuanlan.zhihu.com/p/557873619
  // https://www.cnblogs.com/Paranoid5/p/15112393.html
}

if (host === "leetcode.com" || host === "leetcode.cn") {
  Object.defineProperty(globalThis.navigator, "serviceWorker", {});
  Object.defineProperty(globalThis, "Worker", {});
  darkOptions = undefined;
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

if (host === "web.telegram.org" && (pathname === "/k/" || pathname === "/k")) {
  darkOptions = undefined;
  css`
    * {
      backdrop-filter: none;
      animation: none;
    }
    html {
      --body-background-color: #000000;
      --body-background-color-rgb: 0, 0, 0;
      --background-color-true: #181818;
      --background-color: var(--background-color-true);
      --message-background-color: #000000;
      --message-out-background-color: #000000;
      --message-out-background-color-rgb: 0, 0, 0;
      --surface-color: #000000;
      --surface-color-rgb: 0, 0, 0;
      --menu-background-color: #222222;
      --primary-color: #b6abed;
    }
    .bubble-content,
    .sidebar-header {
      box-shadow: inset 0 -1px 0 0 #555;
    }
    .chatlist-chat.active {
      --background: #000000;
      box-shadow: inset 0 0 0 2px;
    }
    .chat-input .btn-send,
    .btn-corner,
    .reaction-block:before {
      background-color: #000000;
      box-shadow: inset 0 0 0 1px #888;
    }
    .avatar-like custom-emoji-renderer-element,
    .chatlist-chat custom-emoji-renderer-element {
      display: none;
    }
    .chat-background {
      background-color: #000000;
    }
  `;
}

if (darkOptions) {
  const run = () => {
    if (darkOptions.fetchMethod)
      DarkReader.setFetchMethod(darkOptions.fetchMethod);
    // https://github.com/darkreader/darkreader/issues/9567
    const raf = window.requestAnimationFrame;
    window.requestAnimationFrame = (f) => setTimeout(f, 700);
    DarkReader.auto(darkOptions, darkOptions.fixes);
    window.requestAnimationFrame = raf;
  };
  if (window.DarkReader) {
    afterEnter(() => run());
  } else {
    console.log("[many-mods] start load darkreader by dynamic import");
    const url = `https://registry.npmmirror.com/darkreader/4.9.105/files/darkreader.js`;
    import(url).then(() => afterEnter(() => run()));
  }
}

// https://github.com/darkreader/darkreader/issues/9567
// https://github.com/darkreader/darkreader/pull/4005
