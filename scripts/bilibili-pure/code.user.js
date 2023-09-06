// ==UserScript==
// @name        Bilibili Pure
// @name:zh-CN  Bilibili 纯净
// @description Pure & Native
// @description:zh-CN 纯净 & 原生
// @namespace   https://greasyfork.org/users/197529
// @version     0.5.1
// @author      kkocdko
// @license     Unlicense
// @grant       GM_xmlhttpRequest
// @match       *://*.bilibili.com/robots.txt
// @match       *://*.bilibili.com/video/*
// ==/UserScript==
"use strict";

(async () => {
  if (location.hostname === "m.bilibili.com") {
    stop();
    const bvid = location.pathname.slice("/video/".length);
    /** @type string */
    const html = await new Promise((resolve) =>
      GM_xmlhttpRequest({
        headers: {
          Referer: "www.bilibili.com",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.48",
        },
        url: `https://www.bilibili.com/video/${bvid}`,
        onload: (response) => resolve(response.response),
      })
    );
    let i0, i1;
    i0 = html.indexOf("window.__INITIAL_STATE__=");
    i1 = html.indexOf("</script>", i0);
    eval(html.slice(i0, i1));
    i0 = html.indexOf("window.__playinfo__=");
    i1 = html.indexOf("</script>", i0);
    eval(html.slice(i0, i1));
  }

  if (location.pathname !== "/robots.txt") {
    localStorage.bpTitle = __INITIAL_STATE__.videoData.title;
    localStorage.bpBvid = __INITIAL_STATE__.bvid;
    localStorage.bpDash = JSON.stringify(__playinfo__.data.dash);
    // console.log(localStorage.bpTitle, localStorage.bpBvid, localStorage.bpDash);
    location = "https://www.bilibili.com/robots.txt#" + __INITIAL_STATE__.bvid;
    throw "jump to clean page";
  }

  document.head.insertAdjacentHTML(
    "beforeend",
    `
    <meta name="viewport" content="width=device-width">
    <!-- <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"> -->
    <style>
      body { display: flex; justify-content: center; align-items: center; margin: 0; height: 100vh; overflow: hidden; }
      body > :not(video) { display: none; }
      video { max-width: 100%; max-height: 100%; outline: none; }
    </style>
    `
  );

  // TODO: show parts and serials list

  if (!localStorage.bpTitle) return;
  document.title = localStorage.bpTitle;
  localStorage.bpTitle = undefined;
  const bvid = localStorage.bpBvid;
  localStorage.bpBvid = undefined;
  history.pushState(null, null, `https://www.bilibili.com/video/${bvid}`);
  const dash = JSON.parse(localStorage.bpDash);
  localStorage.bpDash = undefined;

  const min = (arr, f = (e) => e) => {
    let ret = null;
    for (const e of arr) if (ret === null || f(e) < f(ret)) ret = e;
    return ret;
  }; // TODO: HD
  const aInfo = min(dash.audio, (e) => e.bandwidth);
  const vInfo = min(dash.video, (e) => (e.codecid === 7 ? -e.width : 9e9));

  const audio = document.createElement("audio");
  audio.src = aInfo.baseUrl;
  const video = document.createElement("video");
  video.src = vInfo.baseUrl;
  video.controls = true;
  video.onplay = () => {
    audio.play();
  };
  video.onpause = () => {
    audio.pause();
  };
  video.onratechange = () => {
    audio.playbackRate = video.playbackRate;
  };
  video.onseeking = () => {
    audio.pause();
  };
  let lastLostSync = 0;
  const sync = () => {
    const diff = Math.abs(audio.currentTime - video.currentTime); // unit: seconds
    if (diff <= 0.2) return;
    const now = Date.now();
    let reason = "";
    if (diff > 0.5) reason = "big_drop";
    if (now - lastLostSync < 750) reason = "double_miss";
    if (reason) {
      console.log(`[bp] sync, reason = ${reason}, diff = ${diff}`);
      audio.currentTime = video.currentTime;
    }
    lastLostSync = now;
  };
  video.onseeked = () => {
    sync();
    audio.play();
  };
  setInterval(sync, 500);
  // TODO: fix, chrome will auto pause slient video if you switch the tab
  document.body.innerHTML = "";
  document.body.appendChild(video);
})();
