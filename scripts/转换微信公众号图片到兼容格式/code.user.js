// ==UserScript==
// @name         转换微信公众号图片到兼容格式
// @description  将WEBP格式图片转换到JPEG、PNG等兼容性较好的格式
// @namespace    https://greasyfork.org/users/197529
// @version      0.6.3
// @author       kkocdko
// @license      Unlicense
// @match        *://mp.weixin.qq.com/*
// ==/UserScript==
"use strict";

const { addFloatButton } = {
  addFloatButton(text, onclick) /* 20220322-1526 */ {
    if (!document.addFloatButton) {
      const host = document.body.appendChild(document.createElement("div"));
      const root = host.attachShadow({ mode: "open" });
      root.innerHTML = `<style>:host{position:fixed;top:4px;left:4px;z-index:2147483647;height:0}#i{display:none}*{float:left;padding:1em;margin:4px;line-height:0;color:#fff;user-select:none;background:#28e;border-radius:8px;box-shadow:0 0 4px #aaa;transition:.3s}[for]~:active{background:#4af;transition:0s}:checked~*{opacity:.3;transform:translateY(-3em)}:checked+*{transform:translateY(3em)}</style><input id=i type=checkbox><label for=i>`;
      document.addFloatButton = (text, onclick) => {
        const el = document.createElement("label");
        el.textContent = text;
        el.addEventListener("click", onclick);
        return root.appendChild(el);
      };
    }
    return document.addFloatButton(text, onclick);
  },
};

addFloatButton("转换全部图片到兼容格式", function () {
  document.querySelectorAll("img").forEach((el) => {
    const imgUrlStr = el.dataset.src || el.src;
    if (!imgUrlStr) return;
    const imgUrl = new URL(imgUrlStr);
    imgUrl.searchParams.set("tp", "png");
    const newImg = el.cloneNode();
    newImg.src = imgUrl.href;
    el.replaceWith(newImg);
  });
  this.style.background = "#4caf50";
  this.textContent = "全部图片都已转换完成！";
});
