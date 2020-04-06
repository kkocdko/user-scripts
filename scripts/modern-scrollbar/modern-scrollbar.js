// ==UserScript==
// @name         Modern scrollbar
// @name:zh-CN   现代化的滚动条
// @description  Make scrollbar's style more modern
// @description:zh-CN  使滚动条的外观更现代化
// @namespace    https://greasyfork.org/users/197529
// @version      0.7
// @author       kkocdko
// @license      Unlicense
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==
"use strict";

document.documentElement.insertAdjacentHTML(
  "beforeend",
  `<style>

* {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}


@media screen and (prefers-color-scheme: dark) {
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.05);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }
}

</style>`.replace(/;/g, "!important;")
);
