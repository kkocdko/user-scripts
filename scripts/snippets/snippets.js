// ==UserScript==
// @name        Snippets
// @name:zh-CN  代码片段
// @description My Snippets
// @description:zh-CN 我的代码片段
// @namespace   https://greasyfork.org/users/197529
// @version     0.0.1
// @author      kkocdko
// @license     Unlicense
// @match       *://*.bing.com/search
// @run-at      document-start
// ==/UserScript==

const {} = {
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
  sleep(ms) /* 20210416-2319 */ {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  waitUntil(condition, interval = 200, timeout = 5000) /* 20210416-2319 */ {
    return new Promise((resolve) => {
      const finish = () => [clearInterval(timer), resolve()];
      const timer = setInterval(() => condition() && finish(), interval);
      setTimeout(finish, timeout);
    });
  },
  waitValue(fn, interval = 200, timeout = 3000) /* 20220104-1405 */ {
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
        reject("waitValue: timeout");
      }, timeout);
    });
  },
  timeStr() /* 20211114-1554 */ {
    const zp = (n) => ("0" + n).substr(-2, 2);
    const d = new Date();
    return `${zp(d.getHours())}:${zp(d.getMinutes())}:${zp(d.getSeconds())}`;
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
  saveStr(name, str) /* 20211203-1130 */ {
    const el = document.createElement("a");
    el.download = name;
    el.href = URL.createObjectURL(new Blob([str]));
    el.click();
  },
  delAllCookie() /* 20220221-2238 */ {
    for (const c of document.cookie.split("; "))
      document.cookie = c.split("=")[0] + "=;max-age=0";
  },
};

// User CSS Template
document.lastChild.appendChild(document.createElement("style")).textContent = `

body {
  min-width: 0;
}

`.replace(/;/g, "!important;");
