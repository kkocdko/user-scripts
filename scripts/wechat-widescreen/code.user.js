// ==UserScript==
// @name        微信网页版宽屏显示
// @description 去除微信网页版页面两侧的边距
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.0
// @author      kkocdko
// @license     Unlicense
// @match       *://wx.qq.com/*
// @match       *://wx2.qq.com/*
// @run-at      document-start
// ==/UserScript==
document.lastChild.appendChild(document.createElement("style")).textContent = `

.download_entry {
  display: none;
}

.main_inner {
  max-width: unset;
}

.nav_view {
  top: 154px;
}

body {
  background: none;
}

`.replace(/;/g, "!important;");
