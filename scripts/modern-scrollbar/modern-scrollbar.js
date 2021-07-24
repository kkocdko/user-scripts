// ==UserScript==
// @name        Modern Scrollbar
// @name:zh-CN  现代化的滚动条
// @description Make scrollbar's style more modern
// @description:zh-CN 使滚动条的外观更现代化
// @namespace   https://greasyfork.org/users/197529
// @version     0.8.1
// @author      kkocdko
// @license     Unlicense
// @match       *://*/*
// @run-at      document-start
// ==/UserScript==
document.lastChild.appendChild(document.createElement("style")).textContent = `

html{overflow:overlay;}

::-webkit-scrollbar,
::-webkit-scrollbar-corner {
    width:7px;
    height:7px;
    background:#0000;
}

::-webkit-scrollbar-thumb{
    background:#aaaa;
}

`.replace(/;/g, "!important;");
// Use the new standard? https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter
