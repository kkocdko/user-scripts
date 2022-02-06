// ==UserScript==
// @name        JUST Kit
// @description Patches & tools for JUST Website.
// @description:zh-CN 用于江苏科技大学网站的补丁与工具。
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.29
// @author      kkocdko
// @license     Unlicense
// @match       *://*.just.edu.cn/*
// @match       *://*.just.edu.cn:8080/*
// @match       *://10.250.255.34/*
// @match       *://202.195.195.198/*
// @match       *://202.195.206.36:8080/*
// @match       *://202.195.206.37:8080/*
// ==/UserScript==
"use strict";

const { addFloatButton, waitValue, saveStr } = {
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
  saveStr(name, str) /* 20211203-1130 */ {
    const el = document.createElement("a");
    el.download = name;
    el.href = URL.createObjectURL(new Blob([str]));
    el.click();
  },
};

const urlMatch = /* match url prefix, supports webvpn */ ([s]) =>
  location.href.match(/(?<=:..+)\/(?!http|webvpn).+/)[0].startsWith(s);

// Styles
document.lastChild.appendChild(document.createElement("style")).textContent = `
body { overflow-x: auto; }
#browserPrompt { display: none; }
input.button { background-color: #07e; }
.checked .iCheck-helper { background: none; border: solid #22645e; border-radius: 50%; opacity: 1; }
`.replace(/;/g, "!important;");

// Force page to scroll on x axis
waitValue(() => document.readyState !== "loading").then(() => {
  if (top !== self || document.documentElement.offsetWidth >= 1280) return;
  addFloatButton("Scroll X Axis", () => {
    document.documentElement.style.cssText +=
      "min-width: 1280px !important; overflow-x: scroll !important";
  });
});

// Auto login
if (urlMatch`/cas/login`)
  setTimeout(() => document.querySelector(".login_btn").click(), 100);

// Fix P.E. page left panel
if (urlMatch`/menu.asp?menu`) {
  setTimeout(() => {
    for (const el of document.querySelectorAll("[onclick]")) {
      const v = el.getAttribute("onclick").replace("href(", "href=(");
      el.setAttribute("onclick", v);
    }
  }, 900);
}

// Health clock in
if (urlMatch`/default/work/jkd/jkxxtb/jkxxcj.jsp`) {
  addFloatButton("Clock in", () => {
    input_tw.value = input_zwtw.value = 36;
    post.click();
  });
}

// Schedule dump
if (urlMatch`/jsxsd/xskb/xskb_list.do`) {
  addFloatButton("Dump schedule", () => {
    saveStr(
      `schedule_${zc.value}_${Date.now().toString(36).slice(0, -2)}.html`,
      `<!DOCTYPE html><meta name="viewport" content="width=device-width">` +
        kbtable.outerHTML
    );
  });
}

// Teaching Evaluation
if (urlMatch`/jsxsd/xspj/xspj_edit.do`) {
  addFloatButton("Fill form", () => {
    for (const el of document.querySelectorAll("[type=radio]:first-child"))
      el.click();
    document.querySelector("[type=radio]:not(:first-child)").click();
  });
}

// GPA Estimation
// https://github.com/mikai233/fstar-client/blob/e387e2948f158968e01d0497375ef60faccc589e/lib/utils/utils.dart
// if (location.pathname.endsWith("/cjcx_list")) {
// addFloatButton("Estimate GPA", () => {});
// }

// Fix `window.showModalDialog`
(this.unsafeWindow || this).showModalDialog = async (url, args, opt = "") => {
  // Thanks for github.com/niutech/showModalDialog
  const dialog = document.body.appendChild(document.createElement("dialog"));
  dialog.style = `padding:0;${opt.replace(/dialog/gi, "")}`;
  const iframe = dialog.appendChild(document.createElement("iframe"));
  iframe.style = "width:100%;height:100%;border:0";
  iframe.src = url;
  dialog.showModal();
  await new Promise((r) => (iframe.onload = r));
  iframe.contentWindow.close = () => dialog.remove();
  iframe.contentWindow.dialogArguments = args;
};

// Free WLAN?
// (this.unsafeWindow || self).XMLHttpRequest = new Proxy(XMLHttpRequest, {
//   construct: (T, args) => {
//     const ret = new T(...args);
//     let inner = null;
//     Object.defineProperty(ret, "onreadystatechange", {
//       value(...args) {
//         if (ret.readyState == 4 &&ret.responseURL === "http://10.250.255.34/api/v1/login") {}
//         if (inner) inner(...args);
//       },
//       set: (n) => (inner = n),
//     });
//     return ret;
//   },
// });
// if (property == "responseText" && target.responseURL === "http://10.250.255.34/api/v1/login") {
//   const json = JSON.parse(target.responseText);
//   if (json?.data?.policy?.pagenumb === "mondaypage") {
//     json.data.policy.channels.push({ name: "XSWK", id: "1" });
//     target.responseText = JSON.stringify(json);
//   }
//   let b = target.responseText;
//   let a = `{"code":200,"message":"ok","data":{"reauth":true,"policy":{"pagenumb":"mondaypage","channels":[{"name":"中国移动","id":"2"},{"name":"中国电信","id":"3"},{"name":"中国联通","id":"4"}]}}}`;
// }

/* ===== Notes ===== *

个人主页：my.just.edu.cn
VPN2反代：vpn2.just.edu.cn
360SO via VPN2：client.v.just.edu.cn/https/webvpnb153e15136e234229309c84507966ea4
教务系统(自动登录)：jwgl.just.edu.cn:8080/sso.jsp
后勤：hqgy.just.edu.cn/sg/wechat/index.jsp
查寝分数：hqgy.just.edu.cn/sg/wechat/healthCheck.jsp
健康打卡：ehall.just.edu.cn/default/work/jkd/jkxxtb/jkxxcj.jsp
体育：tyxy.just.edu.cn
网课：teach.just.edu.cn
实验课成绩：202.195.195.198/sy/
退出登录：ids2.just.edu.cn/cas/logout
智慧树：http://portals.zhihuishu.com/just
超星：http://just.fanya.chaoxing.com
安全微伴：https://weiban.mycourse.cn/pharos/login/jskjdx/21200002/loginByJskjdx.do

教务系统内网：
http://202.195.206.36:8080/jsxsd
http://202.195.206.37:8080/jsxsd

奇怪的管理界面：
https://client.v.just.edu.cn/enlink/#/client/app

VPN2 使用笔记：
使用 `360SO via VPN2` 搜索要访问的网址，记得加上 `http / https` 前缀。
搜索结果页出现“找不到该 URL，可以直接访问 `http://x.x`”后点击直接访问链接即可。
若遇到“无效网关”等奇怪错误，请检查协议前缀是否正确，如 http 可能误写为 https。
当前（20220110）VPN2 似乎不支持流式传输，因而下载大文件可能出错，记得校验 Hash。

/* ================= */
