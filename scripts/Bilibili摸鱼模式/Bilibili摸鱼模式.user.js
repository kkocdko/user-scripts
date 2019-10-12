// ==UserScript==
// @name         Bilibili摸鱼模式
// @description  隐藏无用元素，添加浮动时钟，自动关闭弹幕
// @namespace    https://greasyfork.org/users/
// @version      0.1
// @author       kkocdko
// @license      Unlicense
// @match        *://*.bilibili.com/video/*
// ==/UserScript==
'use strict'

// Close danmaku
document.querySelector('#bofqi').addEventListener('DOMSubtreeModified', () => {
  const danmakuSwitchEl = document.querySelector('.bilibili-player-video-danmaku-switch>input')
  if (danmakuSwitchEl && danmakuSwitchEl.dataset.disabled !== 'true') {
    setTimeout(() => {
      danmakuSwitchEl.dataset.disabled = 'true'
      danmakuSwitchEl.checked = true
      danmakuSwitchEl.click()
    }, 700)
  }
})

// Float clock
const clockStyleEl = document.createElement('style')
setInterval(() => {
  clockStyleEl.textContent = `#bilibiliPlayer::before{content:"${new Date().toTimeString().substr(0, 8)}"}`
}, 1000)
document.body.append(clockStyleEl)

// Modify style
document.body.insertAdjacentHTML('beforeend', `<style>

body,
html {
  height: unset;
}

#entryOld,
.bili-header-m,
.l-con>:not(#playerWrap),
.r-con>:not(#multi_page),
.bilibili-player-video-top,
.bilibili-player-video-danmaku-root {
  display: none !important;
}

#bilibiliPlayer::before {
  position: absolute;
  margin: 1em;
  font-size: 24px;
  z-index: 99;
  color: #fff;
  text-shadow: #000 0 0 3px, #000 0 0 4px;
}

</style>`)
