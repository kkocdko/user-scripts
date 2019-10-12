// ==UserScript==
// @name         Bilibili主站自动关闭弹幕
// @description  个人认为近年弹幕质量明显有所下滑，都怪史莱姆
// @namespace    https://greasyfork.org/users/197529
// @version      0.3
// @author       kkocdko
// @license      Unlicense
// @match        *://*.bilibili.com/video/*
// ==/UserScript==
'use strict'

const timer = setInterval(() => {
  const button = document.querySelector('.bilibili-player-video-danmaku-switch>input')
  if (button) {
    clearInterval(timer)
    button.click()
  }
}, 500)
