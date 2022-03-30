// ==UserScript==
// @name        Tencent Course
// @namespace   https://greasyfork.org/users/197529
// @match       *://ke.qq.com/webcourse/*
// @version     0.0.1
// @noframes
// ==/UserScript==

const signIn = () => document.querySelector(".sign-dialog .s-btn")?.click();
setInterval(signIn, 1000 * 2);
const iframe = document.body.appendChild(document.createElement("iframe"));
iframe.src = location.href;
iframe.style = "position:fixed;bottom:9px;left:9px;border:solid";
setInterval(() => iframe.contentWindow.location.reload(), 1000 * 60 * 1);
