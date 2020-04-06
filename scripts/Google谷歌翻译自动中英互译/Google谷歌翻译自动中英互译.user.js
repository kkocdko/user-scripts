// ==UserScript==
// @name         Google谷歌翻译自动中英互译
// @description  自动切换输出语言
// @namespace    https://greasyfork.org/users/197529
// @version      1.1
// @author       kkocdko
// @license      Unlicense
// @match        *://translate.google.com/*
// @match        *://translate.google.cn/*
// ==/UserScript==
"use strict";

const sourceTextInputBox = document.querySelector("#source");
const sourceLangSelector = document.querySelector(".sl-selector a");
window.location.hash =
  "#view=home&op=translate&sl=auto&tl=en&text=" + sourceTextInputBox.value;
autoSwitchLanguage();
new window.MutationObserver(autoSwitchLanguage).observe(sourceLangSelector, {
  childList: true,
});

function autoSwitchLanguage() {
  if (sourceTextInputBox.value === "") return;
  const sourceLangIsEnglish = /英语|English/.test(
    sourceLangSelector.textContent
  );
  const targetLang = sourceLangIsEnglish ? "zh-CN" : "en";
  window.location.hash = window.location.hash.replace(
    /&tl=[^&]+/,
    "&tl=" + targetLang
  );
  window.dispatchEvent(new window.HashChangeEvent("hashchange"));
}
