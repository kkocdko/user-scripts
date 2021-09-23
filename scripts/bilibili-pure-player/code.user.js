// ==UserScript==
// @name        Bilibili Pure Player Page
// @name:zh-CN  Bilibili 纯净播放页
// @description MUST be used with AD rules
// @description:zh-CN 必须与广告屏蔽规则配套使用
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.0
// @author      kkocdko
// @license     Unlicense
// @match       *://*.bilibili.com/*
// ==/UserScript==
"use strict";

if (v_tag.offsetHeight !== 0) {
  alert("[Bilibili Pure Player Page] user script MUST be used with AD rules!");
  throw 1;
}

document.lastChild.appendChild(document.createElement("style")).textContent = `
  #bilibili-player { height: auto; }
  .bilibili-player-video { margin: 0; }
`.replace(/;/g, "!important;");

let last;
const once = () => {
  const el = document.querySelector("video");
  if (!el || last === el) return;
  last = el;
  el.addEventListener("click", () => el.click());
  el.controls = true;
};
const container = document.querySelector("#bilibili-player");
const options = { childList: true, subtree: true };
new MutationObserver(once).observe(container, options);
once();
