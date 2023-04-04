// ==UserScript==
// @name        Many Mods
// @description Many many small modify for many sites.
// @namespace   https://greasyfork.org/users/197529
// @version     1.0.11
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

// React Docs
if (location.host === "beta.reactjs.org") {
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
if (location.host === "katex.org") {
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
if (location.host === "www.luogu.com.cn") {
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
if (location.host === "v2ex.com" || location.host === "www.v2ex.com") {
  if (location.host === "www.v2ex.com") location.host = "v2ex.com";
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
if (location.host === "rcore-os.github.io" || location.host === "rcore-os.cn") {
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
if (location.host === "texpage.com" || location.host.endsWith(".texpage.com")) {
  css`
    .pdfViewer {
      background: #0000;
      filter: brightness(0.7) contrast(3) hue-rotate(180deg) invert(1);
    }
  `;
}

// Matlab Online
if (location.host === "matlab.mathworks.com") {
  css`
    div.dijitTabContainerTop#dijit_layout_TabContainer_0 * {
      background: #0000;
      color: #000;
    }
  `;
}

// Python Docs
if (location.host === "docs.python.org") {
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
if ((location.host + location.pathname).startsWith("pandas.pydata.org/docs")) {
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
if (location.host === "react-redux.js.org") {
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
if (location.host === "onedrive.live.com") {
  css`
    #O365_NavHeader * {
      background: #fff;
      color: #000;
    }
  `;
}

// GitHub
if (location.host === "github.com") {
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
  `;
  setTimeout(() => a(), 700);
  a();
}

// WeChat Web
if (location.host === "wx.qq.com" || location.host === "wx2.qq.com") {
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
