// ==UserScript==
// @name         知乎日报精简样式
// @description  向页面注入样式表
// @namespace    https://greasyfork.org/users/197529
// @version      0.2
// @author       kkocdko
// @license      Unlicense
// @match        *://daily.zhihu.com/*
// @run-at       document-start
// ==/UserScript==
'use strict'

document.head.insertAdjacentHTML('beforeend', `<style>

body {
  padding-top: 0;
}

.navbar-fixed-top {
  position: absolute;
}

.download,
.global-header {
  display: none;
}

.content-wrap {
  max-width: unset;
}

</style>`.replace(/;/g, '!important;'))
