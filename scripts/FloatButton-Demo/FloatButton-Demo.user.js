// ==UserScript==
// @name         FloatButtonDemo
// @name:zh-CN   浮动按钮Demo
// @description  A reliable function to insert float buttons in web page
// @description:zh-CN  一个可靠的在网页中插入浮动按钮的方法
// @namespace    https://greasyfork.org/users/197529
// @version      0.7
// @author       kkocdko
// @license      Unlicense
// @match        *://*/*
// ==/UserScript==
"use strict";

const button1 = addFloatButton("This is a button", () =>
  console.log("The first button was pressed")
);
const button2 = addFloatButton("Button with emoji 🙂", () =>
  console.log("The second button was pressed")
);
console.log(button1);
console.log(button2);

function addFloatButton(text, onclick) {
  if (!document.addFloatButton) {
    const buttonContainer = document.body
      .appendChild(document.createElement("div"))
      .attachShadow({ mode: "open" });
    buttonContainer.innerHTML =
      "<style>:host{position:fixed;top:3px;left:3px;z-index:2147483647;height:0}#i{display:none}*{float:left;margin:4px;padding:1em;outline:0;border:0;border-radius:5px;background:#1e88e5;box-shadow:0 1px 4px rgba(0,0,0,.1);color:#fff;font-size:14px;line-height:0;transition:.3s}:active{background:#42a5f5;box-shadow:0 2px 5px rgba(0,0,0,.2)}button:active{transition:0s}:checked~button{visibility:hidden;opacity:0;transform:translateY(-3em)}label{border-radius:50%}:checked~label{opacity:.3;transform:translateY(3em)}</style><input id=i type=checkbox><label for=i></label>";
    document.addFloatButton = (text, onclick) => {
      const button = document.createElement("button");
      button.textContent = text;
      button.addEventListener("click", onclick);
      return buttonContainer.appendChild(button);
    };
  }
  return document.addFloatButton(text, onclick);
}
