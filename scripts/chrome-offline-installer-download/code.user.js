// ==UserScript==
// @name        Chrome Offline Installer Download
// @namespace   https://greasyfork.org/users/197529
// @version     0.0.1
// @author      kkocdko
// @license     Unlicense
// @match       *://api.pzhacm.org/iivb/cu.json
// @run-at      document-start
// ==/UserScript==
"use strict";

document.documentElement.style.display = "none";
(async () => {
  const response = await (await fetch(location)).json();
  let htmlStr = "";
  for (const [channel, value] of Object.entries(response)) {
    if (channel === "proxy") continue;
    htmlStr += `<b>${channel}</b><br>`;
    for (const [platform, { cdn, name, time }] of Object.entries(value)) {
      htmlStr += `
        ${platform}&emsp;${new Date(time * 1000).toLocaleString("en-GB")}&emsp;
        <a href="${cdn}">${name}</a>
        <br>
      `;
    }
    htmlStr += "<hr>";
  }
  document.body.innerHTML = htmlStr;
  document.title = "Chrome Offline Installer Download";
  document.documentElement.style.display = "";
})();
