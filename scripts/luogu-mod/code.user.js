// ==UserScript==
// @name        Luogu Mod
// @namespace   https://greasyfork.org/users/197529
// @version     1.3
// @author      kkocdko
// @license     Unlicense
// @match       *://www.luogu.com.cn/*
// ==/UserScript==
"use strict";

let timer = null;
new MutationObserver(() => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    for (const el of document.querySelectorAll("a[target=_blank]"))
      el.removeAttribute("target");
  }, 500);
}).observe(document.body, {
  characterData: true,
  subtree: true,
});

document.lastChild.appendChild(document.createElement("style")).textContent = `

@media (prefers-color-scheme: dark) {
  html {
    filter: brightness(1.2);
  }

  .problem-card img {
    filter: invert(1);
  }
}

html {
  overflow: overlay;
}

section.side > :not(.card) {
  display: none;
}

.main-container {
  margin-left: 0;
}

#app > nav:not(:hover) {
  opacity: 0.3;
  transform: translate(calc(-100% + 20px), calc(100% - 20px));
}

`.replace(/;/g, "!important;");
