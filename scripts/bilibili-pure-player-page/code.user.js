// ==UserScript==
// @name        Bilibili Pure Player Page
// @name:zh-CN  Bilibili 纯净播放页
// @description Native & Pure
// @description:zh-CN 原生 & 纯净
// @namespace   https://greasyfork.org/users/197529
// @version     0.3.2
// @author      kkocdko
// @license     Unlicense
// @match       *://*.bilibili.com/video/*
// @run-at      document-start
// ==/UserScript==
"use strict";
document.lastChild.appendChild(document.createElement("style")).textContent = `
.bili-mini-mask,
[id$="Header"],
#arc_toolbar_report,
#v_desc ~ *,
#v_desc > [report-id=abstract_spread],
.right-container-inner > :first-child ~ :not(.base-video-sections-v1),
.right-container ~ *,
.bpx-player-video-area > :not(.bpx-player-video-perch),
.bpx-player-sending-area {
  display: none;
}
html {overflow:hidden;}
#bilibili-player,#playerWrap,.bpx-player-container,.desc-info{height:unset;}
.bpx-player-video-wrap{border:none;outline:none;}
.left-container {min-height: 101vh;}
`.replace(/;/g, "!important;");
let once = () => {
  once = () => {};
  const el = document.querySelector("video");
  el.controls = true;
  el.onclick = (e) => e.preventDefault();
};
addEventListener("load", once);
if (document.readyState === "complete") once();

// ==UserScript==
// @name        Bilibili Edgeless
// @namespace   Violentmonkey Scripts
// @match       *://*.bilibili.com/video/*
// @version     1.0
// @run-at      document-start
// ==/UserScript==
// document.lastChild.appendChild(document.createElement("style")).textContent = `
// #bilibili-player,#playerWrap,.bpx-player-container{height:unset;}
// `.replace(/;/g, "!important;");
