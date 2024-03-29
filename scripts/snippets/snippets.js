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
  addFloatButton(text, onclick) /* 20220509-1936 */ {
    if (!document.addFloatButton) {
      const host = document.body.appendChild(document.createElement("div"));
      const root = host.attachShadow({ mode: "open" });
      root.innerHTML = `<style>:host{position:fixed;top:4px;left:4px;z-index:2147483647;height:0}#i{display:none}*{float:left;padding:0 1em;margin:4px;font-size:14px;line-height:2em;color:#fff;user-select:none;background:#28e;border:1px solid #fffa;border-radius:8px;transition:.3s}[for]~:active{filter:brightness(1.1);transition:0s}:checked~*{opacity:.3;transform:translateY(-3em)}:checked+*{transform:translateY(3em)}</style><input id=i type=checkbox><label for=i>&zwj;</label>`;
      document.addFloatButton = (text, onclick) => {
        const el = document.createElement("label");
        el.textContent = text;
        el.addEventListener("click", onclick);
        return root.appendChild(el);
      };
    }
    return document.addFloatButton(text, onclick);
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
  timeStr() /* 20220227-1212 */ {
    const zp = (n) => ("0" + n).substring(-2, 2);
    const d = new Date();
    return `${zp(d.getHours())}:${zp(d.getMinutes())}:${zp(d.getSeconds())}`;
  },
  fetchex(url, type) /* 20220509-1838 */ {
    // @grant       GM_xmlhttpRequest
    if (self.GM_xmlhttpRequest)
      return new Promise((resolve, onerror) => {
        const onload = (e) => resolve(e.response);
        GM_xmlhttpRequest({ url, responseType: type, onload, onerror });
      });
    else return fetch(url).then((v) => v[type]());
  },
  saveStr(name, str) /* 20211203-1130 */ {
    const el = document.createElement("a");
    el.download = name;
    el.href = URL.createObjectURL(new Blob([str]));
    el.click();
  },
  delAllCookies() /* 20220221-2238 */ {
    for (const c of document.cookie.split("; "))
      document.cookie = c.split("=")[0] + "=;max-age=0";
  },
  load([u]) /* 20221015-1031 */ {
    const el = document.head.appendChild(document.createElement("script"));
    el.src = u;
    return new Promise((r) => (el.onload = r));
  },
  css([s]) /* 20230314-2128 */ {
    document.lastChild.appendChild(
      document.createElement("style")
    ).textContent = s.replace(/;/g, "!important;");
  },
};

/**
 * Race URLs and fetch the earlist responsed (may not be fastest) URL to `Blob`.
 * @param {...string} urls
 * @returns {Promise<Blob>}
 */
const race = (...urls) => {
  const ctrls = urls.map(() => new AbortController());
  return Promise.any(
    urls.map(async (url, i) => {
      const r = await fetch(url, { signal: ctrls[i].signal });
      if (!r.ok) throw Error("response not ok");
      ctrls.forEach((c, j) => j !== i && c.abort());
      console.log(url);
      return r.blob();
    })
  );
};

race(
  "https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-sc@5.0.3/files/noto-serif-sc-chinese-simplified-300-normal.woff2",
  "https://unpkg.com/@fontsource/noto-serif-sc@5.0.3/files/noto-serif-sc-chinese-simplified-400-normal.woff2",
  "https://npm.elemecdn.com/@fontsource/noto-serif-sc@5.0.3/files/noto-serif-sc-chinese-simplified-400-normal.woff2",
  "https://registry.npmmirror.com/@fontsource/noto-serif-sc/5.0.3/files/files/noto-serif-sc-chinese-simplified-400-normal.woff2"
).then((v) => URL.createObjectURL(v));

// modify px size
let a = "";
let b = a.replace(/[\d\.]+?(?=px)(?!=\w)/g, (v) => {
  return Math.round(+v * 1.05 * 100) / 100;
});
console.log(b);

// User CSS Template
document.lastChild.appendChild(document.createElement("style")).textContent = `

body {
  min-width: 0;
}

`.replace(/;/g, "!important;");
