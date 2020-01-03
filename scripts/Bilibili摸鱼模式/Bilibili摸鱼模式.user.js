// ==UserScript==
// @name         Bilibili摸鱼模式
// @description  保持网页全屏，去除弹幕，嵌入时钟
// @namespace    https://greasyfork.org/users/197529
// @version      0.7
// @author       kkocdko
// @license      Unlicense
// @match        *://*.bilibili.com/video/*
// @run-at       document-start
// ==/UserScript==
'use strict'

;(async () => {
  document.documentElement.style = (`
    background: #000;
    opacity: 0;
    overflow: hidden;
    transition: opacity 0.3s;
  `)

  await waitUntilPageReadyAsync()

  // Modify style
  document.head.insertAdjacentHTML('beforeend', `<style>
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
  </style>`.replace(/;/g, '!important;'))

  // Float clock
  const closkStyle = document.head.appendChild(document.createElement('style'))
  setInterval(() => {
    closkStyle.textContent = `#bilibiliPlayer::before{content:"${new Date().toTimeString().substr(0, 8)}"}`
  }, 1000)

  // Wait until player loaded
  await waitUntilAsync(() => document.querySelector('.bilibili-player-video-btn-danmaku'), 10000, 200)

  // Close danmaku
  document.querySelector('.bilibili-player-video-danmaku-switch>input').click()

  // Set web full-screen and show page
  const playerContrainer = document.querySelector('#bofqi')
  const setWebFullScreen = () => {
    if (!playerContrainer.classList.contains('webfullscreen')) {
      document.querySelector('.bilibili-player-video-web-fullscreen').click()
      document.documentElement.style.opacity = ''
    }
  }
  setWebFullScreen()
  new window.MutationObserver(setWebFullScreen).observe(playerContrainer, { attributes: true })
})()

async function waitUntilAsync (conditionCalculator, timeout = 5000, interval = 50) {
  return new Promise((resolve, reject) => {
    const intervalTimer = setInterval(() => {
      if (conditionCalculator()) {
        clearInterval(intervalTimer)
        clearTimeout(timeoutTimer)
        resolve()
      }
    }, interval)
    const timeoutTimer = setTimeout(() => {
      clearInterval(intervalTimer)
      reject(new Error())
    }, timeout)
  })
}

async function waitUntilPageReadyAsync () {
  return new Promise(resolve => {
    if (document.readyState === 'complete') {
      resolve() // For lessfunctional script-manager
    } else {
      const onReady = () => {
        window.removeEventListener('DOMContentLoaded', onReady)
        window.removeEventListener('load', onReady)
        resolve()
      }
      window.addEventListener('DOMContentLoaded', onReady) // Run script after dom loaded
      window.addEventListener('load', onReady) // For overslow script inserting
    }
  })
}
