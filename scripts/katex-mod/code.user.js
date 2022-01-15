// ==UserScript==
// @name        KaTeX Mod
// @description Seems better.
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.0
// @author      kkocdko
// @license     Unlicense
// @match       *://katex.org/*
// ==/UserScript==
document.lastChild.appendChild(document.createElement("style")).textContent = `

.demo {
  /* filter: invert(1); */
  flex-direction: column-reverse;
}

.demo-right,
.demo-left,
.demo-left textarea {
    background: #000;
    color: #fff;
}

`.replace(/;/g, "!important;");

document.querySelector(".demo-right").onclick = function () {
  this.parentNode.requestFullscreen();
};
