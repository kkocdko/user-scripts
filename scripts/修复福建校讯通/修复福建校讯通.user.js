// ==UserScript==
// @name         修复福建校讯通
// @description  使福建校讯通网站在现代浏览器上正常显示
// @namespace    https://greasyfork.org/users/197529
// @version      1.0
// @author       kkocdko
// @license      Unlicense
// @match        *://www.xxtyd.fj.cn/mhnew/htm/all.htm
// @match        *://www.xxt.fj.chinamobile.com/mhnew/htm/all.htm
// @run-at       document-start
// ==/UserScript==
'use strict'

Object.defineProperty(window, 'dyniframesize', {
  writable: false,
  value () {
    const iframe = document.querySelector('#rightiframe')
    iframe.height = iframe.contentDocument.scrollingElement.scrollHeight
  }
})
