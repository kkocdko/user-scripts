// ==UserScript==
// @name        V2EX Mod
// @match       *://*.v2ex.com/*
// @version     0.1
// ==/UserScript==
document.lastChild.appendChild(document.createElement("style")).textContent = `
#Wrapper { --component-margin: 0; background: #fff; }
.content { padding: 0; }
.item_title > a:not(:visited) { color: #000; }
`.replace(/;/g, "!important;");
