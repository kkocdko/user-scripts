// ==UserScript==
// @name         百度网盘自动跳转PanDownload
// @description  跳转到PanDownload直链下载
// @namespace    https://greasyfork.org/users/197529
// @version      0.1
// @author       kkocdko
// @license      Unlicense
// @match        *://pan.baidu.com/s/*
// ==/UserScript==
'use strict'

addFloatButton('跳转到PanDownload', () => {
  const shareId = window.location.pathname.split('s/')[1]
  const password = window.prompt('Password:')
  const jumpUrl = `//pan.baiduwp.com/s/${shareId}` + (password ? `?pwd=${password}` : '')
  window.location.href = jumpUrl
})

function addFloatButton (text, onclick) {
  if (!document.addFloatButton) {
    const buttonContainer = document.body.appendChild(document.createElement('div')).attachShadow({ mode: 'open' })
    buttonContainer.innerHTML = '<style>:host{position:fixed;top:3px;left:3px;z-index:2147483647;height:0}#i{display:none}*{float:left;margin:4px;padding:1em;outline:0;border:0;border-radius:5px;background:#1e88e5;box-shadow:0 1px 4px rgba(0,0,0,.1);color:#fff;font-size:14px;line-height:0;transition:.3s}:active{background:#42a5f5;box-shadow:0 2px 5px rgba(0,0,0,.2)}button:active{transition:0s}:checked~button{visibility:hidden;opacity:0;transform:translateY(-3em)}label{border-radius:50%}:checked~label{opacity:.3;transform:translateY(3em)}</style><input id=i type=checkbox><label for=i></label>'
    document.addFloatButton = (text, onclick) => {
      const button = document.createElement('button')
      button.textContent = text
      button.addEventListener('click', onclick)
      return buttonContainer.appendChild(button)
    }
  }
  return document.addFloatButton(text, onclick)
}
