// ==UserScript==
// @name        Save Page
// @name:zh-CN  保存页面
// @description Save page as single HTML file.
// @description:zh-CN 将页面保存为单个 HTML 文件。
// @namespace   https://greasyfork.org/users/197529
// @version     0.0.1
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
  let dotI = 1;
  const interval = setInterval(() => {
    const dot = ".".padStart((++dotI % 3) + 1, " ").padEnd(3, " ");
    this.innerHTML = "Saving " + dot.replace(/\s/g, "&nbsp;");
  }, 333);

  // [TODO:Function] lazyload images

  // [TODO:Limitation] shadow dom???
  const /** @type {Document} */ dom = document.cloneNode(true);
  dom.querySelectorAll("script, link[rel*=pre]").forEach((el) => el.remove());
  let css = [];
  const procCss = async (/** @type {HTMLElement} */ el) => {
    const index = css.push(null) - 1; // Keep css order
    css[index] =
      el.tagName === "STYLE"
        ? el.textContent
        : await (await fetch(el.href)).text();
    el.remove();
  };
  const procImg = async (/** @type {HTMLImageElement} */ el) => {
    // [TODO:Function] favicon image
    // [TODO:Limitation] `el.srcset` will break img
    // Image was not rendered, `el.currentSrc` == null
    // console.log(el.currentSrc);
    // const ratio = Math.ceil(devicePixelRatio);
    let src = el.src;
    if (el.srcset) {
      // el.srcset.split(",").flatMap();
      el.srcset = "";
    }
    const res = await fetch(src); // Fit `el.srcset`
    const reader = new FileReader();
    reader.readAsDataURL(await res.blob());
    await new Promise((r) => (reader.onload = reader.onerror = r));
    el.src = reader.result;
  };

  await Promise.allSettled([
    ...[...dom.querySelectorAll("style,link[rel=stylesheet]")].map(procCss),
    ...[...dom.querySelectorAll("img")].map(procImg),
  ]);

  // [TODO:Limitation] `url()` and `image-set()` in css will not be save
  // Avoid the long-loading issue
  css = css.join("\n").replace(/(url|image-set)\(.*?\)/g, "url()");
  dom.head.appendChild(dom.createElement("style")).textContent = css;

  // [TODO:Limitation] breaked some no-doctype / xhtml / html4 pages
  const result = "<!DOCTYPE html>" + dom.documentElement.outerHTML;

  const link = document.createElement("a"); // Using `dom` will cause failure
  link.download = `${dom.title}_${Date.now()}.html`;
  link.href = "data:text/html," + encodeURIComponent(result);
  link.click();

  console.timeEnd("save page");

  clearInterval(interval);
  this.textContent = "Page saved";
  this.style.background = "#4caf50";
});
