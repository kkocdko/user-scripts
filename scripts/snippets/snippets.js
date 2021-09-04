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

const { addFloatButton, sleep, getTimeStr } = {
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
  getTimeStr() /* 20210416-2319 */ {
    const zeroPad = (num, len = 2) => ("00000" + num).substr(-len, len);
    const d = new Date();
    const str =
      zeroPad(d.getHours()) +
      ":" +
      zeroPad(d.getMinutes()) +
      ":" +
      zeroPad(d.getSeconds()) +
      "." +
      zeroPad(d.getMilliseconds(), 3);
    return str;
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

// User CSS Template
document.lastChild.appendChild(document.createElement("style")).textContent = `

body {
  min-width: 0;
}

`.replace(/;/g, "!important;");
