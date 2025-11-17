// ==UserScript==
// @name        Better Local Player
// @description On file URLs.
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.0
// @author      kkocdko
// @license     Unlicense
// @match       file://*/*
// ==/UserScript==

const video = document.querySelector("video");
onkeydown = (e) => {
  e.preventDefault();
  if (e.key === "[") video.currentTime -= 5.0;
  if (e.key === "]") video.currentTime += 5.0;
  if (e.key === "p") video.paused ? video.play() : video.pause();
  if (e.key === "c") video.controls ^= true;
  if (e.key === "s") {
    const input = document.createElement("input");
    input.type = "file";
    input.click();
    input.onchange = () => {
      const url = URL.createObjectURL(input.files[0]);
      const track = document.createElement("track");
      track.default = true;
      track.kind = "captions";
      track.src = url;
      document.querySelector("video").appendChild(track);
    };
  }
};
void 0;
