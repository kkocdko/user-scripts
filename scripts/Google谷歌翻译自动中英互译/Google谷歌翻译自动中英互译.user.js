// ==UserScript==
// @name        Google谷歌翻译自动中英互译
// @description 自动切换输出语言
// @namespace   https://greasyfork.org/users/197529
// @version     1.2
// @author      kkocdko
// @license     Unlicense
// @match       *://translate.google.com/*
// @match       *://translate.google.cn/*
// ==/UserScript==
"use strict";

let inputBox = document.querySelector("#source");
let langSelector = document.querySelector(".sl-selector a");
let switchLang = () => {
  if (inputBox.value == "") return;
  let isEnglish = /英语|English/.test(langSelector.textContent);
  let targetLang = isEnglish ? "zh-CN" : "en";
  location.hash = location.hash.replace(/&tl=[^&]+/, "&tl=" + targetLang);
  dispatchEvent(new HashChangeEvent("hashchange"));
};
location.hash = "#view=home&op=translate&sl=auto&tl=en&text=" + inputBox.value;
switchLang();
new MutationObserver(switchLang).observe(langSelector, { childList: true });
