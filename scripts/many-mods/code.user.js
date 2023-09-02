// ==UserScript==
// @name        Many Mods
// @description Many many small modify for many sites.
// @namespace   https://greasyfork.org/users/197529
// @version     1.0.19
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

const { hostname, pathname } = location;

// React Docs
if (hostname === "beta.reactjs.org") {
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
if (hostname === "katex.org") {
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
if (hostname === "www.luogu.com.cn") {
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
if (hostname === "v2ex.com" || hostname === "www.v2ex.com") {
  if (hostname === "www.v2ex.com") hostname = "v2ex.com";
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
if (hostname === "rcore-os.github.io" || hostname === "rcore-os.cn") {
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
if (hostname === "texpage.com" || hostname.endsWith(".texpage.com")) {
  css`
    .pdfViewer {
      background: #0000;
      filter: brightness(0.7) contrast(3) hue-rotate(180deg) invert(1);
    }
  `;
}

// Matlab Online
if (hostname === "matlab.mathworks.com") {
  css`
    div.dijitTabContainerTop#dijit_layout_TabContainer_0 * {
      background: #0000;
      color: #000;
    }
  `;
}

// Python Docs
if (hostname === "docs.python.org") {
  css`
    html {
      background: #fff;
      text-shadow: 0 0 0;
      filter: invert(100%) hue-rotate(180deg);
      font-size: 20px;
    }
    body {
      margin: 0 10px;
    }
    body > :not(.document) {
      display: none;
    }
  `;
}

// Pandas Docs
if ((hostname + pathname).startsWith("pandas.pydata.org/docs")) {
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
if (hostname === "react-redux.js.org") {
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
if (hostname === "onedrive.live.com") {
  css`
    #O365_NavHeader * {
      background: #fff;
      color: #000;
    }
  `;
}

// CSDN
if (hostname === "blog.csdn.net") {
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
if (hostname === "turtle.codemao.cn") {
  css`
    header,
    .cm-editor {
      background: #fff;
    }
  `;
}

// GitHub
if (hostname === "github.com" || hostname === "gist.github.com") {
  const a = () => css`
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
  setTimeout(() => a(), 700);
  a();
}

// WeChat Web
if (hostname === "wx.qq.com" || hostname === "wx2.qq.com") {
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
if (hostname === "www.deepl.com") {
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
if (hostname === "www.bing.com") {
}

// OpenWRT LuCI Docs
if (hostname === "openwrt.github.io") {
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
if (hostname === "192.168.1.1") {
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
if (hostname === "gorm.io") {
  css`
    figure.highlight {
      overflow: auto;
    }
  `;
}

// MUI Docs
if (hostname === "mui.com") {
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
if (hostname === "login.live.com") {
  css`
    .template-section.main-section {
      background: #fff;
    }
  `;
}
