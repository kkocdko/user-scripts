// ==UserScript==
// @name        Force Fullscreen
// @description Let page to be fullscreen.
// @namespace   https://greasyfork.org/users/197529
// @version     0.0.1
// @author      kkocdko
// @license     Unlicense
// @match       *://*/*
// ==/UserScript==
"use strict";

const fullscreen = () => {
  document.documentElement.requestFullscreen();
  removeEventListener("pointerup", fullscreen);
};
addEventListener("pointerup", fullscreen);
