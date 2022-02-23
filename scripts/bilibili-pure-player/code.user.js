// ==UserScript==
// @name        Bilibili Pure Player Page
// @name:zh-CN  Bilibili 纯净播放页
// @description Native & Pure
// @description:zh-CN 原生 & 纯净
// @namespace   https://greasyfork.org/users/197529
// @version     0.2.1
// @author      kkocdko
// @license     Unlicense
// @match       *://*.bilibili.com/video/*
// @run-at      document-start
// ==/UserScript==
"use strict";
document.lastChild.appendChild(document.createElement("style")).textContent = `
[id$="Header"],
#arc_toolbar_report,
#v_desc ~ *,
.right-container > :first-child ~ :not(#multi_page),
.right-container ~ *,
.bilibili-player-video-wrap > :not(.bilibili-player-video),
.bilibili-player-video-wrap ~ * {
  display: none;
}
.player-wrap,
.player-wrap > *,
.desc-info {
  height: auto;
}
.left-container {
  min-height: 101vh;
}
`.replace(/;/g, "!important;");
let once = () => {
  once = () => {};
  const el = document.querySelector("video");
  el.controls = true;
  el.onclick = (e) => e.preventDefault();
};
addEventListener("load", once);
if (document.readyState === "complete") once();
