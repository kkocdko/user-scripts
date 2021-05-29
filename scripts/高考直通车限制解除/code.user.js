// ==UserScript==
// @name         高考直通车限制解除
// @description  无需下载APP，直接查看试卷/答案
// @namespace    https://greasyfork.org/users/197529
// @version      0.0.2
// @author       kkocdko
// @license      Unlicense
// @match        *://app.gaokaozhitongche.com/newsexam/h/*
// @inject-into  content
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

addFloatButton("直接查看内容", () => {
  document
    .querySelectorAll("img[data-imgsrc]")
    .forEach((e) => (e.src = e.dataset.imgsrc));
  document.body.innerHTML =
    "<style>img{max-width:100%}</style>" +
    document.querySelector("#content-box>.wrap-box").innerHTML;
});
