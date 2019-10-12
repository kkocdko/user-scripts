// ==UserScript==
// @name         隐藏开通QQ空间提示横幅
// @description  隐藏关闭QQ空间后出现的“开通空间”提示横幅
// @namespace    https://greasyfork.org/users/197529
// @version      0.3.6
// @author       kkocdko
// @license      Unlicense
// @match        *://user.qzone.qq.com/*
// @run-at       document-start
// @noframes
// ==/UserScript==
'use strict'

document.documentElement.insertAdjacentHTML('beforeend', `<style>

#top_tips_container, #top_tips_seat {
  display: none;
}

.top-fix-inner {
  margin: 0;
}

</style>`.replace(/;/g, '!important;'))
