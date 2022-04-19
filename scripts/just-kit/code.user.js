// ==UserScript==
// @name        JUST Kit
// @description Patches & tools for JUST Website.
// @description:zh-CN 用于江苏科技大学网站的补丁与工具。
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.59
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

const { addFloatButton, saveStr } = {
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
input.button { background-color: #07e; }
.iradio_square-green.checked { box-shadow: inset 0 0 4px; border-radius: 50%; }
`.replace(/;/g, "!important;");

// Force page to scroll on x axis
if (
  top === self &&
  (urlMatch`/_s2/students_` || urlMatch`/TeachingCenterStudentWeb`)
) {
  document.documentElement.style.cssText +=
    ";min-width: 1280px !important; overflow-x: auto !important;";
}

// Auto login
if (urlMatch`/cas/login`) {
  setInterval(() => {
    if (!rememberPassword.checked) return;
    const el = document.querySelector(".login_btn");
    el.click();
    el.click = () => {};
  }, 100);
}

// Fix P.E. page left panel
if (urlMatch`/menu.asp?menu`) {
  setTimeout(() => {
    for (const el of document.querySelectorAll("[onclick]")) {
      const v = el.getAttribute("onclick").replace("href(", "href=(");
      el.setAttribute("onclick", v);
    }
  }, 900);
}

// Health clock in (old)
if (urlMatch`/default/work/jkd/jkxxtb/jkxxcj.jsp`) {
  addFloatButton("Clock in", () => {
    input_tw.value = input_zwtw.value = 36;
    post.click();
  });
}

// Health clock in
if (urlMatch`/static/?health-clock-in`) {
  document.head.innerHTML += `<meta name=viewport content="width=device-width"><style>body{margin:0}iframe{border:0;width:100%;height:100%}</style>`;
  document.body.innerHTML = `<iframe src=../jkdk.html></iframe>`;
  document.title = "just-kit-health-clock-in";
  const key = document.title + "-location";
  addFloatButton("Clock in", () => {
    const iframe = document.querySelector("iframe").contentWindow.document;
    const el = iframe.querySelector("input[placeholder$=定位]");
    el.value = localStorage[key];
    el._valueTracker.setValue(""); // github.com/facebook/react/issues/11488#issuecomment-347775628
    el.dispatchEvent(new Event("input", { bubbles: true }));
    setTimeout(() => iframe.querySelector("form+*>*").click(), 99);
  });
  addFloatButton(`Location = ${localStorage[key]}`, function () {
    localStorage[key] = prompt(key, localStorage[key]);
    this.textContent = `Location = ${localStorage[key]}`;
  });
  // encrypt = (v, k) =>CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(v), CryptoJS.MD5(k), {mode: CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7}).toString();
}

// Schedule dump
if (urlMatch`/jsxsd/xskb/xskb_list.do`) {
  addFloatButton("Dump schedule", () => {
    const date = Date.now().toString(36).slice(0, -2);
    const name = `schedule_${zc.value || 0}_${date}.html`;
    const prefix = `<!DOCTYPE html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>body{margin:2px -1px;font-family:sans-serif}table{border:0}</style>`;
    const content = prefix + kbtable.outerHTML;
    document.documentElement.innerHTML = content;
    document.title = name;
    saveStr(name, content);
  });
}

// Teaching evaluation
if (urlMatch`/jsxsd/xspj/xspj_edit.do`) {
  addFloatButton("Fill form", () => {
    for (const el of document.querySelectorAll("[type=radio]:first-child"))
      el.click();
    document.querySelector("[type=radio]:not(:first-child)").click();
  });
}

// Fix `window.showModalDialog`
(this.unsafeWindow || this).showModalDialog = (url) => open(url);

// GPA Estimation
// github.com/mikai233/fstar-client/blob/e387e2948f158968e01d0497375ef60faccc589e/lib/utils/utils.dart
// if (location.pathname.endsWith("/cjcx_list")) {
// addFloatButton("Estimate GPA", () => {});
// }

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

// http://www.gaoxiaokaoshi.com/Study/LibraryStudyList.aspx
// const grid=document.body.appendChild(document.createElement('parallel-grid'))
// grid.style="display:grid;grid:1fr 1fr 1fr 1fr/ 1fr 1fr 1fr;width:100vw;height:100vh"
// showframe=(p_Name, p_Id)=>{grid.appendChild(document.createElement('iframe')).src="../Study/LibraryStudy.aspx?tmp=1&Id=" + p_Id + "&PlanId=" + ddlClass.value}

/* ===== Notes ===== *

个人主页: my.just.edu.cn
VPN2反代: vpn2.just.edu.cn
360SO VPN2: client.v.just.edu.cn/https/webvpnb153e15136e234229309c84507966ea4
教务管理: jwgl.just.edu.cn:8080/jsxsd/
教务管理(单点登录): jwgl.just.edu.cn:8080/sso.jsp
教务管理(内网1): 202.195.206.36:8080/jsxsd
教务管理(内网2): 202.195.206.37:8080/jsxsd
后勤管理: hqgy.just.edu.cn/sg/wechat/index.jsp
查寝得分: hqgy.just.edu.cn/sg/wechat/healthCheck.jsp
健康打卡: dc.just.edu.cn/static/?health-clock-in
健康打卡(RAW): dc.just.edu.cn/jkdk.html
健康打卡(旧): ehall.just.edu.cn/default/work/jkd/jkxxtb/jkxxcj.jsp
体育: tyxy.just.edu.cn
网课: teach.just.edu.cn
实验课成绩: 202.195.195.198/sy/
退出登录: ids2.just.edu.cn/cas/logout
奇怪的管理界面: client.v.just.edu.cn/enlink/#/client/app
智慧树: portals.zhihuishu.com/just
超星: just.fanya.chaoxing.com
安全微伴: weiban.mycourse.cn/pharos/login/jskjdx/21200002/loginByJskjdx.do
国防教育: www.gaoxiaokaoshi.com

关于 [ VPN2 ] : 
使用 `360SO via VPN2` 搜索要访问的网址。记得加上 `http / https` 前缀。
搜索结果页出现“找不到该 URL，可以直接访问 `http://x.x`”后点击直接访问链接即可。
遇“无效网关”等奇怪错误时，请检查协议前缀是否正确，如 http 可能误写为 https。
当前（20220110）VPN2 似乎不支持流式传输，因而下载大文件可能出错，记得校验 Hash。

关于 [ 健康打卡 ] :
新版（20220420）健康打卡报表使用 Hash Router，各跳转关系十分混乱且不稳定。
为简化实现，当且仅当访问上文指定的地址时才可使用一键打卡功能。

/* ================= */
