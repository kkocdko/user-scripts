// ==UserScript==
// @name        智学网增强
// @description 修复成绩标签跳移，微调批注字体
// @namespace   https://greasyfork.org/users/197529
// @version     0.0.4
// @author      kkocdko
// @license     Unlicense
// @match       *://*.zhixue.com/*
// @run-at      document-start
// ==/UserScript==
document.lastChild.appendChild(document.createElement("style")).textContent = `

.zx-tab-list {
  margin: 0;
  overflow: hidden;
  transform: none;
}

.zx-tab-list > * {
  width: 3.5em;
  min-width: 0;
  padding: 0;
  border-right: 1px solid #ddd;
}

#rollTmp {
  text-shadow: 0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff,
    0 0 3px #fff, 0 0 3px #fff;
}

`.replace(/;/g, "!important;");
