// ==UserScript==
// @name        Many Mods
// @description Many many small modify for many sites.
// @namespace   https://greasyfork.org/users/197529
// @version     2.0.35
// @author      kkocdko
// @license     Unlicense
// @match       *://*/*
// @exclude-match  *://127.0.0.1:8109/*
// @exclude-match  *://127.0.0.1:9304/*
// @exclude-match  *://127.0.0.1:9393/*
// @exclude-match  *://127.0.0.1:9090/*
// @exclude-match  *://*@127.0.0.1:9304/*
// @exclude-match  *://*@47.100.126.230:*/*
// @exclude-match  *://47.100.126.230:*/*
// @exclude-match  *://47.114.114.68:13002/*
// @exclude-match  *://kkocdko.site/toy/*
// @exclude-match  *://forum.suse.org.cn/*
// @exclude-match  *://generated.vusercontent.net/*
// @exclude-match  *://caddyserver.com/*
// @exclude-match  *://godbolt.org/*
// @exclude-match  *://v0.dev/*
// @exclude-match  *://*.github.dev/*
// @exclude-match  *://discord.com/*
// @exclude-match  *://replit.com/*
// @exclude-match  *://html5.gamedistribution.com/*
// @exclude-match  *://skydom.pecpoc.com/*
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
// @exclude-match  *://*.nextweb.fun/*
// @exclude-match  *://*.nextchat.dev/*
// @exclude-match  *://chat-gpt-next-web.vercel.app/*
// @exclude-match  *://ianlecorbeau.github.io/blog/*
// @exclude-match  *://*.codeium.com/*
// @exclude-match  *://*.babylonjs.com/*
// @exclude-match  *://*.web.dev/*
// @exclude-match  *://oledera.samsungdisplay.com/*
// @exclude-match  *://*.lhr.life/*
// @exclude-match  *://*.cdnjs.com/*
// @exclude-match  *://*.feishu.cn/*
// @exclude-match  *://nas.iot4im.com:13001/*
// @exclude-match  *://nas.iot4im.com:14001/*
// @exclude-match  *://*.y8.com/*
// @exclude-match  *://nnethercote.github.io/perf-book/*
// @exclude-match  *://colab.research.google.com/*
// @exclude-match  *://danielyxie.github.io/bitburner/*
// @exclude-match  *://*.skk.moe/*
// @exclude-match  *://regex101.com/*
// @exclude-match  *://*.js13kgames.com/*
// @exclude-match  *://esp-rs.github.io/*
// @exclude-match  *://*.openai.com/*
// @exclude-match  *://*.curl.se/*
// @exclude-match  *://*.toolpad.io/*
// @exclude-match  *://happy0316.top/*
// @exclude-match  *://parceljs.org/*
// @exclude-match  *://www.webrtc-experiment.com/*
// @exclude-match  *://*.draw.io/*
// @exclude-match  *://*.diagrams.net/*
// @exclude-match  *://live.mdnplay.dev/*
// @exclude-match  *://*.opensuse.org/*
// @exclude-match  *://hedzr.com/*
// @exclude-match  *://www.bilibili.com/robots.txt
// @require     https://registry.npmmirror.com/darkreader/4.9.86/files/darkreader.js
// @grant       GM_xmlhttpRequest
// @run-at      document-start
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
  fetchMethod: window.fetch,
};

css`
  :root {
    background: #000000;
    --darkreader-bg--background-color-neutral-subtle: #000000;
    --darkreader-bg--background-color-neutral: #000000;
  }
`;

// Google Search
if (host === "www.google.com") {
  darkOptions = undefined;
  css`
    html,
    body,
    #tsf *,
    #searchform,
    #searchform > * {
      background: #000;
    }
    header,
    header > *,
    #gsr,
    #main div,
    #tsf textarea + * {
      background: none;
    }
    #tsf > div:first-child {
      box-shadow: 0 0 0 1px #777;
    }
  `;
  const toDarkMode = () => {
    if (document.querySelector('meta[name="color-scheme"]')) {
      return true;
    }
    const el = document.querySelector(
      'footer a[href^="/setprefs?"][href*="cs=2"], #appbar a[href^="/setprefs?"][href*="cs=2"], #navd a[href^="/setprefs?"][href*="cs=2"]'
    );
    if (el) {
      el?.click();
      return true;
    }
  };
  afterEnter(() => {}, toDarkMode);
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
  darkOptions.fetchMethod = (url) =>
    new Promise((resolve) => {
      GM_xmlhttpRequest({
        url,
        onload: (response) => {
          resolve({ text: async () => response.response });
        },
      });
    });
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
  darkOptions.sepia = 90;
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
  // darkOptions = undefined;
  /*
  darkOptions.fetchMethod = (input, init) => {
    const extName = new URL(input).pathname.split(".").pop();
    if (
      extName === "jpg" ||
      extName === "jpeg" ||
      extName === "png" ||
      extName === "webp" ||
      extName === "avif"
    ) {
      return;
    }
    if (self.GM_xmlhttpRequest) {
      return new Promise((resolve, reject) => {
        const onload = (e) => {
          resolve({ text: () => e.responseText });
        };
        GM_xmlhttpRequest({ url: input, onload, onerror: reject });
      });
    } else {
      return window.fetch(input, init);
    }
  };
  */
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
  /*
    *, *>*, ::before, ::after,.md-header,.md-main,.md-nav,.md-nav>*,.md-nav__item { background: #000;color:#fff; }
    .utterances-frame {     filter: invert(1);
        background: #fff;}
        .highlight .hll,.highlight .hll *{background:#474722;}
        .wy-nav-content-wrap{margin-left:0;}
        .wy-nav-side:not(:hover){transform:translate(calc(-100% + 15px),calc(-100% + 15px));}
        .wy-nav-content{max-width:unset;padding:5px;}
    */
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

// Redux (for React) Docs
if (host === "react-redux.js.org") {
  css`
    [class^="codeBlockTitle_"],
    [class^="codeBlockContent_"] > * {
      filter: invert(1) hue-rotate(180deg);
      background: #000;
    }
    .docusaurus-highlight-code-line {
      background: #000;
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

// New Bing
if (host === "www.bing.com") {
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
  // Disable the ServiceWorker to save memory
  Object.defineProperty(globalThis.navigator, "serviceWorker", {});
  // https://greasyfork.org/scripts/457579  使用移动版(平板布局)页面  https://m.youtube.com/?persist_app=1&app=m
  // https://greasyfork.org/scripts/437123  允许后台播放
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
  `;
  Object.defineProperty(globalThis.indexedDB, "open", {});
}

// Stack Overflow
if (
  host === "stackoverflow.com" ||
  host === "askubuntu.com" ||
  host === "superuser.com" ||
  host === "serverfault.com" ||
  host.endsWith(".stackexchange.com")
) {
  // darkOptions = undefined;
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
    body {
      background: #000;
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
  `;
}

if (host.endsWith(".zhihu.com")) {
  // console.log(window.wrappedJSObject)
  Object.defineProperty(globalThis, "Worker", {});
  Object.defineProperty(globalThis, "SharedWorker", {});
  Object.defineProperty(globalThis, "WebSocket", {});
  Object.defineProperty(globalThis.indexedDB, "open", {});
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

if (host === "registry.npmmirror.com") {
  // https://registry.npmmirror.com/katex/0.16.9/files/
  // document.body.
  // addFloatButton("Files List", async () => {
  //   let [, pkg, ver, ver2] = location.pathname.split("/");
  //   if (pkg?.startsWith("@")) {
  //     pkg = pkg + "/" + ver;
  //     ver = ver2;
  //   }
  //   if (!/^[\.\d]+$/.test(ver)) {
  //     location = `${location.origin}/${pkg}/latest/files/`;
  //     return;
  //   }
  //   const url = `${location.origin}/${pkg}/${ver}/files/`;
  //   const r = await (await fetch(url)).json();
  //   console.log(r);
  //   // const ver = p1?.startsWith("@")
  //   //   ? await fetch(`${location.origin}/${p1}/${p2}`)
  //   //       .then((v) => v.json())
  //   //       .then((v) => v["dist-tags"].latest)
  //   //   : pkgp2;
  // });
}

if (host === "web.telegram.org") {
  darkOptions = undefined;
  css`
    html {
      --color-background: #000;
      --color-background-own: rgb(51, 41, 112);
      --color-background-own-apple: rgb(51, 41, 112);
      --color-background-own-selected: rgb(51, 41, 112);
      --color-chat-active: rgb(51, 41, 112);
      --color-chat-active-greyed: rgb(51, 41, 112);
      --color-green: rgb(51, 41, 112);
      --color-green-darker: rgb(51, 41, 112);
      --color-reply-own-hover: #0000;
      --color-reply-own-hover-apple: #0000;
      --color-reply-own-active: #0000;
      --color-reply-own-active-apple: #0000;
      --color-links: rgb(175, 163, 235);
      --color-code: rgb(175, 163, 235);
      --color-message-reaction-own: #0000;
      --color-message-reaction-hover-own: #0000;
      --color-message-reaction-chosen-hover: #0000;
      --color-voice-transcribe-button-own: #0000;
      --button-primary-bgColor-rest: #09b43add;
    }
    .message-content {
      border: 1px solid #555;
      background: none;
    }
    .chat-list {
      background: #000;
    }
    .Chat {
      --background-color: #0000;
    }
    .Chat.selected .ListItem-button {
      background-color: rgba(51, 41, 112, 0.8);
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
    const url = `https://registry.npmmirror.com/darkreader/4.9.86/files/darkreader.js`; // same as the `@require` above
    import(url).then(() => afterEnter(() => run()));
  }
}

// https://github.com/darkreader/darkreader/issues/9567
// https://github.com/darkreader/darkreader/pull/4005
