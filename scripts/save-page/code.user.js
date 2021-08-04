// ==UserScript==
// @name        Save Page
// @name:zh-CN  保存页面
// @description Save page as single HTML file.
// @description:zh-CN 将页面保存为单个 HTML 文件。
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.0
// @author      kkocdko
// @license     Unlicense
// @match       *://*/*
// ==/UserScript==
"use strict";

const { addFloatButton } = {
  addFloatButton(text, onClick) /* 20200707-123713 */ {
    if (!document.addFloatButton) {
      const container = document.body
        .appendChild(document.createElement("div"))
        .attachShadow({ mode: "open" });
      container.innerHTML =
        "<style>:host{position:fixed;top:3px;left:3px;z-index:2147483647;height:0}#i{display:none}*{float:left;margin:4px;padding:1em;outline:0;border:0;border-radius:5px;background:#1e88e5;box-shadow:0 1px 4px rgba(0,0,0,.1);color:#fff;font-size:14px;line-height:0;transition:.3s}:active{background:#42a5f5;box-shadow:0 2px 5px rgba(0,0,0,.2)}button:active{transition:0s}:checked~button{visibility:hidden;opacity:0;transform:translateY(-3em)}label{border-radius:50%}:checked~label{opacity:.3;transform:translateY(3em)}</style><input id=i type=checkbox><label for=i></label>";
      document.addFloatButton = (text, onClick) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.addEventListener("click", onClick);
        return container.appendChild(button);
      };
    }
    return document.addFloatButton(text, onClick);
  },
};

addFloatButton("Save page", async function () {
  console.time("save page");
  this.style.background = "#ff9800";
  const interval = setInterval((o) => {
    const suffix = ".".padStart((++o.i % 3) + 1, " ").padEnd(3, " ");
    this.innerHTML = "Saving " + suffix.replace(/\s/g, "&nbsp;");
  }, ...[333, { i: 0 }]); // 茴回囘囬

  const document = Object.freeze(window.document);
  const /** @type {Document} */ dom = document.cloneNode(true);

  const removeList = `script, style, source, title, link[rel=stylesheet], link[rel=alternate], link[rel=search], link[rel*=pre], link[rel*=icon]`;
  dom.querySelectorAll(removeList).forEach((el) => el.remove());

  const qsam = (s, f) => [...document.querySelectorAll(s)].map(f);

  const imgs = dom.querySelectorAll("img");
  const imgTasks = qsam("img", async (el, i) => {
    const reader = new FileReader();
    reader.readAsDataURL(await (await fetch(el.currentSrc)).blob());
    await new Promise((r) => (reader.onload = reader.onerror = r));
    imgs[i].src = reader.result;
    imgs[i].srcset = "";
  });

  const css = [];
  const cssTasks = qsam("style, link[rel=stylesheet]", async (el, i) => {
    if (el.tagName === "STYLE") css[i] = el.textContent;
    else css[i] = await (await fetch(el.href)).text();
  });

  await Promise.allSettled([...imgTasks, ...cssTasks]);

  // [TODO:Limitation] `url()` and `image-set()` in css will not be save
  // Avoid the long-loading issue
  const cssStr = css.join("\n").replace(/(url|image-set)\(.*?\)/g, "url()");
  dom.head.appendChild(dom.createElement("style")).textContent = cssStr;

  // [TODO:Limitation] breaked some no-doctype / xhtml / html4 pages
  const result = "<!DOCTYPE html>" + dom.documentElement.outerHTML;

  const link = document.createElement("a"); // Using `dom` will cause failure
  link.download = `${document.title}_${Date.now()}.html`;
  link.href = "data:text/html," + encodeURIComponent(result);
  link.click();

  console.timeEnd("save page");

  clearInterval(interval);
  this.textContent = "Page saved";
  this.style.background = "#4caf50";
});
