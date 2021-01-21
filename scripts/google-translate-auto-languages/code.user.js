// ==UserScript==
// @name        Google Translate Auto Languages
// @name:zh-CN  Google谷歌翻译自动中英互译
// @description Auto switch Chinese/English
// @description:zh-CN 自动切换目标语言为中/英文
// @namespace   https://greasyfork.org/users/197529
// @version     1.4
// @author      kkocdko
// @license     Unlicense
// @match       *://translate.google.com/*
// @match       *://translate.google.cn/*
// ==/UserScript==
"use strict";

const firstLangExp = /英语|English/;
const firstLangCode = "en";
const secondLangCode = "zh-CN";

const inputBox = document.querySelector("textarea");
const langSelector = document.querySelector('[role="tablist"]').parentNode
  .parentNode.previousElementSibling;
let prevIsFirstLang = null;
const switchLang = () => {
  if (inputBox.value == "") return;
  const isFirstLang = firstLangExp.test(langSelector.textContent);
  if (isFirstLang === prevIsFirstLang) return;
  prevIsFirstLang = isFirstLang;
  let targetLang = isFirstLang ? secondLangCode : firstLangCode;
  const targetButton = document.querySelector(
    `[data-popup-corner]~* [role="tab"][data-language-code="${targetLang}"]`
  );
  if (targetButton.getAttribute("aria-selected") === "true") return;
  targetButton.click();
};
// switchLang();
new MutationObserver(switchLang).observe(langSelector, {
  characterData: true,
  subtree: true,
});
const autoLangButton = document.querySelector("[data-language-code=auto]");
if (autoLangButton.getAttribute("aria-selected") !== "true") {
  autoLangButton.click();
}
