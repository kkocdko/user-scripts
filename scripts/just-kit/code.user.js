// ==UserScript==
// @name        JUST Kit
// @description Patches & tools for JUST Website.
// @description:zh-CN 用于江苏科技大学网站的补丁与工具。
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.18
// @author      kkocdko
// @license     Unlicense
// @match       *://*.just.edu.cn/*
// @match       *://*.just.edu.cn:8080/*
// @match       *://*.just.edu.cn:80/*
// @match       *://10.250.255.34/*
// @match       *://10.250.255.34/authentication/*
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

// Styles
// document.lastChild.appendChild(document.createElement("style")).textContent = `
// .personalinfo>.list_nav_box>iframe:first-child,browserPrompt{display:none;}
// `.replace(/;/g, "!important;");

// Force page to scroll on x axis
waitValue(() => document.readyState !== "loading").then(() => {
  if (document.documentElement.offsetWidth >= 1280) return;
  addFloatButton("Scroll X Axis", () => {
    let v = document.documentElement.getAttribute("style") ?? "";
    v += `width:1280px!important;min-width:1280px!important;overflow-x:scroll!important`;
    document.documentElement.setAttribute("style", v);
  });
});

// Auto login
waitValue(() => document.querySelector(".login_btn")).then((el) => el.click());

// Fix P.E. page left frame
waitValue(() => leftFrame.document.readyState === "complete").then(() => {
  leftFrame.document.querySelectorAll("[onclick]").forEach((el) => {
    const v = el.getAttribute("onclick").replace("href(", "href=(");
    el.setAttribute("onclick", v);
  });
});

// Health clock in
waitValue(() => input_zwtw).then(() => {
  addFloatButton("Clock in", () => {
    input_tw.value = input_zwtw.value = 36;
    post.click();
  });
});

// Schedule dump
waitValue(() => kbtable).then((el) => {
  addFloatButton("Dump schedule", () => {
    saveStr(
      `schedule_${zc.value}_${Date.now().toString(36).slice(0, -2)}.html`,
      `<!DOCTYPE html><meta name="viewport" content="width=device-width">` +
        el.outerHTML
    );
  });
});

// Evaluation of teaching
waitValue(() => location.pathname.endsWith("/xspj_edit.do")).then(() => {
  addFloatButton("Fill form", () => {
    for (const el of document.querySelectorAll("[type=radio]:first-child"))
      el.click();
    document.querySelector("[type=radio]:not(:first-child)").click();
  });
});

// Fix `window.showModalDialog`
(this.unsafeWindow || self).showModalDialog = async (url, args, opt = "") => {
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
Bing via VPN2：client.v.just.edu.cn/https/webvpn75e21a7d71bfef5014373fde6b3dc8d6/
教务系统自动登录：jwgl.just.edu.cn:8080/sso.jsp
后勤：hqgy.just.edu.cn/sg/wechat/index.jsp
查寝分数：hqgy.just.edu.cn/sg/wechat/healthCheck.jsp
体育：tyxy.just.edu.cn
网课：teach.just.edu.cn
实验课成绩：202.195.195.198/sy/
退出登录：ids2.just.edu.cn/cas/logout
智慧树：http://portals.zhihuishu.com/just
超星：http://just.fanya.chaoxing.com/

教务系统内网：
http://202.195.206.36:8080/jsxsd
http://202.195.206.37:8080/jsxsd

https://client.v.just.edu.cn/enlink/#/client/app

/* ================= */
