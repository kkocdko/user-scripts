// ==UserScript==
// @name        Pages to Text
// @description Convert webpages to text, designed for plainly equb ebook.
// @namespace   https://greasyfork.org/users/197529
// @version     0.1
// @author      kkocdko
// @license     Unlicense
// @match       *://*/*
// ==/UserScript==
"use strict";

/* WIP */

const shadowHost = document.body.appendChild(document.createElement("div"));
const shadowRoot = shadowHost.attachShadow({ mode: "open" });
// Improve render speed
shadowRoot.appendChild(document.createElement("style")).innerHTML = `
:host {
  position: fixed;
  left: -2500px;
  width: 2000px;
  height: 1px;
  overflow: scroll;
  font-size: 1px;
}
`;
const container = shadowRoot.appendChild(document.createElement("div"));
const html2text = (htmlStr) => {
  container.innerHTML = htmlStr;
  const text = container.innerText;
  container.innerHTML = "";
  return text;
};
const fetchPageText = async (url, transform = (s) => s) => {
  const response = await fetch(url);
  const htmlStr = await response.text();
  const transformed = transform(htmlStr);
  const text = html2text(transformed);
  return text;
};
const downloadStr = (str, filename = "download.txt") => {
  const blobUrl = URL.createObjectURL(new Blob([str]));
  const aTag = document.createElement("a");
  aTag.href = blobUrl;
  aTag.download = filename;
  aTag.click();
};
(async () => {
  const aTagList = [...document.querySelectorAll("a")];
  const urlList = aTagList.map((element, index) => [index, element.href]);
  const partsCount = urlList.length;
  const parts = [];
  const spawn = async () => {
    while (true) {
      const pair = urlList.shift();
      if (!pair) break;
      const [index, url] = pair;
      const text = await fetchPageText(url);
      parts.push([index, text]);
      console.log(`progress: ${index + 1} / ${partsCount}`);
    }
  };
  const threadsCount = 4;
  console.time();
  await Promise.all(Array.from(Array(threadsCount), spawn));
  console.timeEnd();
  parts.sort(([i1], [i2]) => i1 - i2);
  const result = parts.map(([, text]) => text).join("\n");
  downloadStr(result);
})();
