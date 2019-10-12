// ==UserScript==
// @name         Google谷歌翻译自动中英互译
// @description  自动切换输出语言
// @namespace    https://greasyfork.org/users/197529
// @version      0.9
// @author       kkocdko
// @license      Unlicense
// @match        *://translate.google.com/*
// @match        *://translate.google.cn/*
// ==/UserScript==
'use strict'

const sourceTextEl = document.querySelector('#source')
const sourceLangEl = document.querySelector('.sl-selector a')
window.location.hash = '#view=home&op=translate&sl=auto&tl=en&text=' + sourceTextEl.value
autoSwitchLanguage()
sourceLangEl.addEventListener('DOMSubtreeModified', autoSwitchLanguage)

function autoSwitchLanguage () {
  if (sourceTextEl.value === '') {
    return
  }
  const isEnglish = sourceLangEl.textContent === '检测到英语' || sourceLangEl.textContent === 'English - detected'
  const targetValue = isEnglish ? 'tl=zh-CN' : 'tl=en'
  const sourceValue = isEnglish ? 'tl=en' : 'tl=zh-CN'
  if (window.location.hash.indexOf(targetValue) !== -1) {
    window.location.hash = window.location.hash.replace(targetValue, sourceValue)
  }
  window.location.hash = window.location.hash.replace(sourceValue, targetValue)
}
