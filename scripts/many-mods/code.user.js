// ==UserScript==
// @name        Many Mods
// @description Many many small modify for many sites.
// @namespace   https://greasyfork.org/users/197529
// @version     1.0.20
// @author      kkocdko
// @license     Unlicense
// @match       *://*/*
// @run-at      document-start
// ==/UserScript==
"use strict";

const { css } = {
  css([s]) /* 20230314-2128 */ {
    document.lastChild.appendChild(
      document.createElement("style")
    ).textContent = s.replace(/;/g, "!important;");
  },
};

const { host, pathname } = location;

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
if (host === "v2ex.com" || host === "www.v2ex.com") {
  if (host === "www.v2ex.com") location.host = "v2ex.com";
  css`
    #Wrapper {
      --component-margin: 0;
    }
    .content {
      padding: 0;
    }
    * {
      background: #fff;
      color: #000;
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
if ((host + pathname).startsWith("pandas.pydata.org/docs")) {
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

// Onedrive
if (host === "onedrive.live.com") {
  css`
    #O365_NavHeader * {
      background: #fff;
      color: #000;
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
  (matchMedia("(prefers-color-scheme:dark)").matches ? css : () => {})`
    body {
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
    }
    .search-results-page {
      background: #000;
    }
    .search-title,
    .search-title * {
      color: #fff;
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

// Deepl
if (host === "www.deepl.com") {
  throw 1;
  css`
    body > :not(.dl_translator_page_container),
    [data-testid="translator-character-limit-proad"] {
      display: none;
    }
    #dl_translator {
      padding: 0;
      margin: -4px -12px 0;
      width: calc(100vw + 24px);
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

// Bing Login
if (host === "login.live.com") {
  css`
    .template-section.main-section {
      background: #fff;
    }
  `;
}
