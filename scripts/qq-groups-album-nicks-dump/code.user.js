// ==UserScript==
// @name        QQ Group Album Nicks Dump
// @namespace   https://greasyfork.org/users/197529
// @match       *://h5.qzone.qq.com/groupphoto/album
// @version     0.1.0
// @author      kkocdko
// ==/UserScript==
"use strict";

const { addFloatButton } = {
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
};

addFloatButton("Dump Mode", () => {
  const url = "https://h5.qzone.qq.com/groupphoto/inqq";
  const token = window.PSY.user.token(url);
  const groupId = new URLSearchParams(location.href).get("groupId");
  for (const el of [...groupzone_album_list.children]) {
    const albumId = el.dataset.aid;
    const btn = document.createElement("button");
    btn.style = "display:block;margin-top:1em;padding:.3em .5em";
    btn.textContent = el.innerText;
    btn.addEventListener("click", async () => {
      const response = await fetch(`${url}?g_tk=${token}`, {
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
        },
        body: `cmd=qunGetPhotoList&qunid=${groupId}&albumid=${albumId}`,
        method: "POST",
      }).then((v) => v.json());
      const nicks = response.data.photolist.map((v) => v.pic_host_nick.nick);
      // console.log(nicks)
      const target = `张三,李四`;
      let remain = target.split(",");
      for (const nick of nicks)
        remain = remain.filter((v) => !nick.includes(v));
      console.log(remain);
    });
    el.replaceWith(btn);
  }
});
