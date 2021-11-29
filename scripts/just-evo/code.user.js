// ==UserScript==
// @name        JUST EVO
// @description Patches & tools for JUST Website
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.8
// @author      kkocdko
// @license     Unlicense
// @match       *://*.just.edu.cn/*
// @match       *://*.just.edu.cn:8080/*
// @match       *://*.just.edu.cn:80/*
// @match       *://10.250.255.34/authentication/*
// ==/UserScript==
"use strict";

const { addFloatButton, waitValue, downloadText } = {
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
  waitValue(fn, interval = 200, timeout = 3000) /* 20210928-1143 */ {
    return new Promise((resolve, reject) => {
      const intervalHandle = setInterval(() => {
        try {
          const value = fn();
          if (!value) return;
          clearInterval(intervalHandle);
          clearTimeout(timeoutHandle);
          resolve(value);
        } catch {}
      }, interval);
      const timeoutHandle = setTimeout(() => {
        clearInterval(intervalHandle);
        reject();
      }, timeout);
    });
  },
  downloadText(name, contentStr) /* 20211027-0709 */ {
    const blob = new window.Blob([contentStr]);
    const href = URL.createObjectURL(blob);
    URL.revokeObjectURL(blob);
    const aTag = document.createElement("a");
    aTag.download = name;
    aTag.href = href;
    aTag.click();
  },
};

// Auto login
waitValue(() => document.querySelector(".login_btn")).then((e) => e.click());

// Fix JUST P.E.
waitValue(() => leftFrame.document.readyState === "complete").then(() => {
  leftFrame.document.querySelectorAll("[onclick]").forEach((el) => {
    const v = el.getAttribute("onclick").replace("href(", "href=(");
    el.setAttribute("onclick", v);
  });
});

// Health clock in
if (
  location.pathname.split("/")?.[2] ==
  "webvpn929a314d8b5a743de924a3a45cc360c56b072364889c09028d67155f67909744"
) {
  addFloatButton("Clock in", () => {
    input_tw.value = input_zwtw.value = 36;
    post.click();
  });
}

// Shedule dump
waitValue(() => document.querySelector("#kbtable")).then((el) => {
  addFloatButton("Dump schedule", () => {
    downloadText(
      `schedule_${zc.value}_${Date.now()}.html`,
      `<!DOCTYPE html><meta name="viewport" content="width=device-width">` +
        el.outerHTML
    );
  });
});

// Fix `window.showModalDialog` for book purchase page
(this.unsafeWindow || window).showModalDialog = (url, args, opt = "") => {
  // Thanks for github.com/niutech/showModalDialog
  const dialog = document.body.appendChild(document.createElement("dialog"));
  dialog.style = `padding:0;${opt.replace(/dialog/gi, "")}`;
  const iframe = dialog.appendChild(document.createElement("iframe"));
  iframe.style = "width:100%;height:100%;border:0";
  iframe.src = url;
  iframe.contentWindow.dialogArguments = args;
  iframe.onload = () => (iframe.contentWindow.close = () => dialog.remove());
  dialog.showModal();
};

/*
http://ids2.just.edu.cn/cas/logout
http://jwgl.just.edu.cn:8080/jsxsd/framework/xsMain.jsp
https://client.v.just.edu.cn/http/webvpn764a2e4853ae5e537560ba711c0f46bd/_s2/students_sy/main.psp
*/
