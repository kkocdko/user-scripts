// ==UserScript==
// @name        Bilibili Video Reshape
// @description Some video is 16:10 but encoded as 16:9 , this script reshape the viewport to 16:10
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.1
// @author      kkocdko
// @license     Unlicense
// @match       *://www.bilibili.com/video/*
// ==/UserScript==

document.addEventListener("fullscreenchange", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1700));
  if (!document.fullscreenElement) return;
  let el = document.querySelector("video");
  if (el.dataset.reshaped) return;
  el.dataset.reshaped = "true";
  let height = Math.trunc(el.clientHeight / 4) * 4;
  el.style.height = height + "px";
  el.style.width = Math.trunc(((height / 10) * 16) / 4) * 4 + "px";
  el.style.objectFit = "fill";
});
