// ==UserScript==
// @name        天翼云盘免登录下载
// @description 无需登录下载天翼云盘分享链接
// @namespace   https://greasyfork.org/users/197529
// @version     0.0.1
// @author      kkocdko
// @license     Unlicense
// @match       *://cloud.189.cn/*
// ==/UserScript==
"use strict";

const timer = setInterval(() => {
  try {
    Object.defineProperty(
      (this.unsafeWindow || window).application.headerView,
      "isLogin",
      { get: () => true }
    );
    clearInterval(timer);
  } catch (_) {}
}, 500);
