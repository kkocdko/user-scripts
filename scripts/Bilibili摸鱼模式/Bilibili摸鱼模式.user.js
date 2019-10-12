// ==UserScript==
// @name         Bilibili摸鱼模式
// @description  仅显示播放器，关闭弹幕，添加浮动时钟
// @namespace    https://greasyfork.org/users/197529
// @version      0.2
// @author       kkocdko
// @license      Unlicense
// @match        *://*.bilibili.com/video/*
// @run-at       document-start
// ==/UserScript==
'use strict'

// Disable danmaku
disableDanmaku()
runAfterPageReady(() => {
  document.querySelector('#multi_page').addEventListener('DOMSubtreeModified', () => {
    disableDanmaku()
    setTimeout(() => {
      // Fix the player's bug
      window.dispatchEvent(new window.UIEvent('resize'))
    }, 1000)
  })
})

function disableDanmaku () {
  const disableDanmakuTimer = setInterval(() => {
    const danmakuSwitch = document.querySelector('.bilibili-player-video-danmaku-switch>input')
    if (danmakuSwitch) {
      clearInterval(disableDanmakuTimer)
      if (danmakuSwitch.checked) {
        danmakuSwitch.click()
      }
    }
  }, 500)
}

// Float clock
const clockStyle = document.head.appendChild(document.createElement('style'))
setInterval(() => {
  clockStyle.textContent = `#bilibiliPlayer::before{content:"${new Date().toTimeString().substr(0, 8)}"}`
}, 1000)

// Modify style
document.head.insertAdjacentHTML('beforeend', `<style>

body,
html {
  height: unset;
}

body>:not(#app),
#app>div>:not(.l-con),
.l-con>:not(#playerWrap),
.bilibili-player-video-top,
.bilibili-player-video-danmaku-root {
  display: none;
}

#bofqi {
  height: unset;
}

.bilibili-player-video-sendbar {
  margin-top: -10px;
  height: 10px;
  visibility: hidden;
}

.bilibili-player-video-btn-pagelist {
  display: unset;
}

#bilibiliPlayer::before {
  position: absolute;
  margin: 1em;
  font-size: 24px;
  z-index: 99;
  color: #fff;
  text-shadow: #000 0 0 3px, #000 0 0 4px;
}

</style>`.replace(/;/g, '!important;'))

function runAfterPageReady (callback) {
  window.addEventListener('DOMContentLoaded', callback) // Run script after dom loaded
  window.addEventListener('load', callback) // For overslow script inserting
  if (document.readyState === 'complete') callback() // For lessfunctional script-manager
}
