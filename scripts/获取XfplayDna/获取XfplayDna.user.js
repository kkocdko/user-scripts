// ==UserScript==
// @name         获取XfplayDna
// @description  在影音先锋视频页面获取XfplayDna
// @namespace    https://greasyfork.org/users/197529
// @version      1.6
// @author       kkocdko
// @license      Unlicense
// @match        *://www.4xfzy.vip/*
// @match        *://www.yexf8.com/*
// @match        *://www.gegezy10.com/*
// @match        *://www.avzz5.com/*
// @match        *://xf.1ady.info/*
// @match        *://xf.9ady.info/*
// @run-at       document-start
// @noframes
// ==/UserScript==
'use strict'

function queryXfDna (queryEl = document) {
  const urlEl = queryEl.querySelector('param[name=URL]')
  if (urlEl) {
    return urlEl.value
  } else {
    const iframeArr = queryEl.querySelectorAll('iframe')
    for (const iframe of iframeArr) {
      const dna = queryXfDna(iframe.contentWindow.document)
      if (dna) {
        return dna
      }
    }
  }
  return null
}

const timer = setInterval(() => {
  const xfDNA = queryXfDna()
  if (xfDNA) {
    window.stop()
    clearInterval(timer)
    document.write(`
      <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
      <span>Xfplay DNA:</span>
      <input value="${xfDNA}" readonly>
      <span></span>
    `)
    window.addEventListener('click', copyDna)
    window.addEventListener('keypress', copyDna)
  }
  function copyDna () {
    document.querySelector('input').select()
    document.execCommand('copy')
    document.querySelector('span:last-child').textContent = ' (Have been copied)'
  }
}, 300)
