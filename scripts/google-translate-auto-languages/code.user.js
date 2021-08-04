// ==UserScript==
// @name        Google Translate Auto Languages
// @name:zh-CN  Google谷歌翻译自动中英互译
// @description Auto switch Chinese/English
// @description:zh-CN 自动切换目标语言为中/英文
// @namespace   https://greasyfork.org/users/197529
// @version     1.5
// @author      kkocdko
// @license     Unlicense
// @match       *://translate.google.com/*
// @match       *://translate.google.cn/*
// @noframes
// ==/UserScript==
"use strict";

const firstLangRule = /English|英语/;
const firstLang = "en";
const secondLang = "zh-CN";

const inputBox = document.querySelector("textarea");
const detectTab = document.querySelector("[role=tab]");
let prevIsFirstLang = null;
const switchLang = () => {
  if (inputBox.value === "") return;
  const isFirstLang = firstLangRule.test(detectTab.textContent);
  if (isFirstLang === prevIsFirstLang) return;
  prevIsFirstLang = isFirstLang;
  const lang = isFirstLang ? secondLang : firstLang;
  const selector = `[data-popup-corner]~* [data-language-code=${lang}]`;
  const tab = document.querySelector(selector);
  if (tab.getAttribute("aria-selected") !== "true") tab.click();
};
const options = { characterData: true, subtree: true };
new MutationObserver(switchLang).observe(detectTab, options);
if (detectTab.getAttribute("aria-selected") !== "true") detectTab.click();
