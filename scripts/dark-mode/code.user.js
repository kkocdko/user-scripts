// ==UserScript==
// @name        Dark Mode
// @match       *://*/*
// @version     0.1.13
// @author      kkocdko
// @license     Unlicense
// @exclude-match  *://localhost:8109/*
// @exclude-match  *://127.0.0.1:9005/*
// @exclude-match  *://127.0.0.1:8080/*
// @exclude-match  *://127.0.0.1:8889/*
// @exclude-match  *://127.0.0.1:9261/*
// @exclude-match  *://127.0.0.1:4000/*
// @exclude-match  *://127.0.0.1:9246/*
// @exclude-match  *://127.0.0.1:9325/*
// @exclude-match  *://127.0.0.1:9304/*
// @exclude-match  *://127.0.0.1:8090/*
// @exclude-match  *://127.0.0.1:9453/*
// @exclude-match  *://124.222.123.153:9304/*
// @exclude-match  *://html5.gamedistribution.com/*
// @exclude-match  *://*.babylonjs.com/*
// @exclude-match  *://*.go.dev/*
// @exclude-match  *://obsproject.com/*
// @exclude-match  *://mirrorz.org/*
// @exclude-match  *://codesandbox.io/*
// @exclude-match  *://slint-ui.com/*
// @exclude-match  *://nas.iot4im.com:13001/*
// @exclude-match  *://nas.iot4im.com:14001/*
// @exclude-match  *://mirror.nju.edu.cn/*
// @exclude-match  *://colab.research.google.com/*
// @exclude-match  *://danielyxie.github.io/bitburner/*
// @exclude-match  *://turtle.codemao.cn/*
// @exclude-match  *://8.219.185.10:9304/*
// @exclude-match  *://bun.sh/*
// @exclude-match  *://regex101.com/*
// @exclude-match  *://react.fluentui.dev/*
// @exclude-match  *://raw.githubusercontent.com/*
// @exclude-match  *://codepen.io/*
// @exclude-match  *://chakra-ui.com/*
// @exclude-match  *://rcore-os.cn/*
// @exclude-match  *://*.cloud.tencent.com/*
// @exclude-match  *://blog.csdn.net/zSY_snake/article/details/*
// @exclude-match  *://ui.shadcn.com/*
// @exclude-match  *://*.radix-ui.com/*
// @exclude-match  *://*.js13kgames.com/*
// @exclude-match  *://esp-rs.github.io/*
// @exclude-match  *://*.openai.com/*
// @exclude-match  *://*.toolpad.io/*
// @exclude-match  *://*.tailwindcss.com/*
// @exclude-match  *://*.tailwindui.com/*
// @exclude-match  *://*.mui.com/*
// @exclude-match  *://*.github.com/*
// @exclude-match  *://*.github.dev/*
// @exclude-match  *://download-directory.github.io/*
// @exclude-match  *://web.telegram.org/*
// @exclude-match  *://www.google.com/*
// @exclude-match  *://*.youtube.com/*
// @exclude-match  *://esbuild.github.io/*
// @exclude-match  *://happy0316.top/*
// @exclude-match  *://parceljs.org/*
// @exclude-match  *://instant.1point3acres.com/*
// @exclude-match  *://www.webrtc-experiment.com/*
// @exclude-match  *://developer.mozilla.org/*
// @exclude-match  *://cdn.jsdelivr.net/*
// @exclude-match  *://stackoverflow.com/*
// @exclude-match  *://doc.rust-lang.org/*
// @exclude-match  *://shapezio.fandom.com/*
// @exclude-match  *://www.bilibili.com/robots.txt
// @run-at      document-start
// ==/UserScript==

// @inject-into content
// document.documentElement.style.background="#000";
// document.documentElement.style.backgroundColor="#000";
// document.body.style.background="#000";
// document.body.style.backgroundColor="#000";
document.lastChild.appendChild(document.createElement("style")).textContent = `
html,body,header,footer{background:#fff!important;}
html{filter:invert(1) hue-rotate(180deg)!important;}
body>pre:first-child:last-child{color:#000!important;}
`;
// *{background-color:#fff!important;}
