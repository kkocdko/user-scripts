// ==UserScript==
// @name        UserCSS Editor
// @name:zh-CN  用户样式编辑器
// @description A convenient UserCSS editor.
// @description:zh-CN 便利的用户样式编辑器。
// @namespace   https://greasyfork.org/users/197529
// @version     0.1
// @author      kkocdko
// @license     Unlicense
// @match       *://*/*
// ==/UserScript==
"use strict";

const container = document.body
  .appendChild(document.createElement("div"))
  .attachShadow({ mode: "open" });
container.appendChild(document.createElement("style")).textContent = `
textarea {
  position: fixed;
  left: 30px;
  top: 30px;
  width: 320px;
  height: 180px;
  z-index: 2147483647;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
  outline: none;
  border: 3px solid transparent;
  padding: 7px;
  font-size: 14px;
  font-family: monospace;
}
`;
const inputBox = container.appendChild(document.createElement("textarea"));
const styleTag = document.head.appendChild(document.createElement("style"));
setInterval(() => {
  styleTag.textContent = inputBox.value.replace(/;/g, "!important;");
}, 500);
