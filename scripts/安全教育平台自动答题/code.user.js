// ==UserScript==
// @name         安全教育平台自动答题
// @description  支持安全课程、专题活动、互动视频
// @namespace    https://greasyfork.org/users/197529
// @version      0.9.3
// @author       kkocdko
// @license      Unlicense
// @match        *://*.xueanquan.com/*
// @noframes
// ==/UserScript==
"use strict";

const { addFloatButton } = {
  addFloatButton(text, onClick) /* 20200707-1237 */ {
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

addFloatButton("自动完成", async function () {
  this.textContent = "正在运行";
  this.style.background = "#ff9800";
  if (document.querySelector(".choseArea")) {
    // interactive video
    while (!document.querySelector(".seminar_nav .finish:not(.normal)")) {
      for (const el of document.querySelectorAll(".choseArea :first-child"))
        el.click();
      for (const el of document.querySelectorAll("video")) {
        el.volume = 0;
        el.currentTime = 2147483647;
        el.play();
      }
      await new Promise((r) => setTimeout(r, 900));
    }
  } else {
    // paper or exam
    const specTopic = location.host.indexOf("huodong.") === 0;
    for (const el of document.querySelectorAll("input:not(:checked)")) {
      if (!specTopic) el.value = 1;
      el.click();
    }
    scroll(0, 9e9);
    scrollBy(0, -0.3 * innerHeight);
  }
  this.textContent = "运行结束";
  this.style.background = "#4caf50";
});
