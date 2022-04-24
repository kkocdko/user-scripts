// ==UserScript==
// @name        Tencent Course
// @namespace   https://greasyfork.org/users/197529
// @match       *://ke.qq.com/webcourse/*
// @version     0.0.2
// @noframes
// ==/UserScript==
"use strict";

const { addFloatButton } = {
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
};

addFloatButton().remove();
const signIn = () => {
  try {
    document.querySelector(".sign-dialog .s-btn").click();
    addFloatButton(new Date().toTimeString().split(" ")[0]);
  } catch {}
};
setInterval(signIn, 1000 * 2);
const iframe = document.body.appendChild(document.createElement("iframe"));
iframe.src = location.href;
iframe.style = "position:fixed;bottom:9px;left:9px;border:solid";
setInterval(() => iframe.contentWindow.location.reload(), 1000 * 60 * 1);

document.lastChild.appendChild(document.createElement("style")).textContent = `
#react-body { background: #000; }
`.replace(/;/g, "!important;");
