// ==UserScript==
// @name        Save Page
// @name:zh-CN  保存页面
// @description Save page as single HTML file.
// @description:zh-CN 将页面保存为单个 HTML 文件。
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.4
// @author      kkocdko
// @license     Unlicense
// @match       *://*/*
// @grant       GM_xmlhttpRequest
// @noframes
// ==/UserScript==
"use strict";

const { addFloatButton, fetchex } = {
  addFloatButton(text, onclick) /* 20220419-1455 */ {
    if (!document.addFloatButton) {
      const host = document.body.appendChild(document.createElement("div"));
      const root = host.attachShadow({ mode: "open" });
      root.innerHTML = `<style>:host{position:fixed;top:4px;left:4px;z-index:2147483647;height:0}#i{display:none}*{float:left;padding:1em;margin:4px;font-size:14px;line-height:0;color:#fff;user-select:none;background:#28e;border:1px solid #fffa;border-radius:8px;transition:.3s}[for]~:active{background:#4af;transition:0s}:checked~*{opacity:.3;transform:translateY(-3em)}:checked+*{transform:translateY(3em)}</style><input id=i type=checkbox><label for=i>`;
      document.addFloatButton = (text, onclick) => {
        const el = document.createElement("label");
        el.textContent = text;
        el.addEventListener("click", onclick);
        return root.appendChild(el);
      };
    }
    return document.addFloatButton(text, onclick);
  },
  async fetchex(url, type) /* 20210904-1148 */ {
    // @grant       GM_xmlhttpRequest
    if (self.GM_xmlhttpRequest)
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url,
          responseType: type,
          onload: (e) => resolve(e.response),
          onerror: reject,
        });
      });
    else return (await fetch(url))[type]();
  },
};

// TODO: Content Security Policy. Example: https://github.com/kkocdko/kblog

addFloatButton("Save page", async function () {
  console.time("save page");
  this.style.background = "#ff9800";
  const interval = setInterval((o) => {
    const suffix = ".".padStart((++o.i % 3) + 1, " ").padEnd(3, " ");
    this.innerHTML = "Saving " + suffix.replace(/\s/g, "&nbsp;");
  }, ...[333, { i: 0 }]); // 茴回囘囬

  const /** @type {Document} */ dom = document.cloneNode(true);

  const removeList = `script, style, source, title, link[rel=stylesheet], link[rel=alternate], link[rel=search], link[rel*=pre], link[rel*=icon]`;
  dom.querySelectorAll(removeList).forEach((el) => el.remove());

  const qsam = (s, f) => [...document.querySelectorAll(s)].map(f);

  const imgs = dom.querySelectorAll("img");
  const imgTasks = qsam("img", async (el, i) => {
    const reader = new FileReader();
    reader.readAsDataURL(await fetchex(el.currentSrc, "blob"));
    await new Promise((r) => (reader.onload = reader.onerror = r));
    imgs[i].src = reader.result;
    imgs[i].srcset = "";
  });

  const css = []; // Keep order
  const cssTasks = qsam("style, link[rel=stylesheet]", async (el, i) => {
    if (el.tagName === "STYLE") css[i] = el.textContent;
    else css[i] = await fetchex(el.href, "text");
  });

  await Promise.allSettled([...imgTasks, ...cssTasks]);

  // [TODO:Limitation] `url()` and `image-set()` in css will not be save
  // Avoid the long-loading issue
  const cssStr = css.join("\n").replace(/(url|image-set)(.+?)/g, "url()");
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
