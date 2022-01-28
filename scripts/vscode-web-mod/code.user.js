// ==UserScript==
// @name        VSCode Web Mod
// @description Seems better.
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.0
// @author      kkocdko
// @license     Unlicense
// @match       *://localhost:8109/*
// @run-at      document-start
// ==/UserScript==
"use strict";
(this.unsafeWindow || this).innerHeight = outerHeight + 35;
document.lastChild.appendChild(document.createElement("style")).textContent = `
body > .monaco-workbench > .monaco-grid-view {
  top: -35px;
  height: calc(100% + 35px);
}
`.replace(/;/g, "!important;");
