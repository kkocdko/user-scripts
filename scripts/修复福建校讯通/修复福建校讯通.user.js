// ==UserScript==
// @name         修复福建校讯通
// @description  使福建校讯通网站在现代浏览器上正常显示
// @namespace    https://greasyfork.org/users/197529
// @version      0.9
// @author       kkocdko
// @license      Unlicense
// @match        *://www.xxtyd.fj.cn/mhnew/htm/all.htm
// @match        *://www.xxt.fj.chinamobile.com/mhnew/htm/all.htm
// @run-at       document-start
// ==/UserScript==
'use strict'

runAfterPageReady(() => {
  document.querySelector('#rightiframe').setAttribute('onload', 'height = contentWindow.document.documentElement.scrollHeight || contentWindow.document.body.scrollHeight')
})

function runAfterPageReady (callback) {
  window.addEventListener('DOMContentLoaded', callback) // Run script after dom loaded
  window.addEventListener('load', callback) // For overslow script inserting
  if (document.readyState === 'complete') callback() // For lessfunctional script-manager
}
