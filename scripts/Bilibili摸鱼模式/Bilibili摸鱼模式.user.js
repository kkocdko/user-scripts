// ==UserScript==
// @name         Bilibili摸鱼模式
// @description  保持网页全屏，去除弹幕，添加浮动时钟
// @namespace    https://greasyfork.org/users/197529
// @version      0.3
// @author       kkocdko
// @license      Unlicense
// @match        *://*.bilibili.com/video/*
// @run-at       document-start
// ==/UserScript==
'use strict'

document.documentElement.style = `
  background: #000;
  transition: opacity 0.3s;
  opacity: 0
`

runAfterPageReady(() => {
  // Disable danmaku
  const disableDanmakuTimer = setInterval(() => {
    const danmakuSwitch = document.querySelector('.bilibili-player-video-danmaku-switch>input')
    if (danmakuSwitch) {
      clearInterval(disableDanmakuTimer)
      if (danmakuSwitch.checked) {
        danmakuSwitch.click()
      }
    }
  }, 500)

  document.querySelector('#bilibiliPlayer').addEventListener('DOMSubtreeModified', function () {
    if (window.player && window.player.isFullScreen && !window.player.isFullScreen()) {
      document.querySelector('.bilibili-player-video-web-fullscreen').click()
      document.documentElement.style.opacity = ''
    }
  })

  // Float clock
  const closkStyle = document.head.appendChild(document.createElement('style'))
  setInterval(() => {
    closkStyle.textContent = `#bilibiliPlayer::before{content:"${new Date().toTimeString().substr(0, 8)}"}`
  }, 1000)

  // Modify style
  document.head.appendChild(document.createElement('style')).innerHTML = `
    .bilibili-player-video-top,
    .bilibili-player-video-danmaku-root {
      display: none;
    }

    #bilibiliPlayer::before {
      position: absolute;
      margin: 1em;
      font-size: 24px;
      z-index: 99;
      color: #fff;
      text-shadow: #000 0 0 3px, #000 0 0 4px;
    }
  `.replace(/;/g, '!important;')
})

function runAfterPageReady (onready) {
  const callback = () => {
    window.removeEventListener('DOMContentLoaded', callback)
    window.removeEventListener('load', callback)
    onready()
  }
  if (document.readyState === 'complete') {
    onready() // For lessfunctional script-manager
  } else {
    window.addEventListener('DOMContentLoaded', callback) // Run script after dom loaded
    window.addEventListener('load', callback) // For overslow script inserting
  }
}
