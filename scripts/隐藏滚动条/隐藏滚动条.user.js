// ==UserScript==
// @name         隐藏滚动条
// @description  隐藏页面上的所有滚动条
// @namespace    https://greasyfork.org/users/197529
// @version      0.4
// @author       kkocdko
// @license      Unlicense
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==
'use strict'

document.head.insertAdjacentHTML('beforeend', `<style>

* {
  scrollbar-width: none;
}

::-webkit-scrollbar {
  width: 0px;
}

</style>`.replace(/;/g, '!important;'))
