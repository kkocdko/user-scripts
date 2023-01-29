// ==UserScript==
// @name        Bilibili Pure
// @name:zh-CN  Bilibili 纯净
// @description Pure & Native
// @description:zh-CN 纯净 & 原生
// @namespace   https://greasyfork.org/users/197529
// @version     0.4.2
// @author      kkocdko
// @license     Unlicense
// @match       *://*.bilibili.com/robots.txt
// @match       *://*.bilibili.com/video/*
// @run-at      document-start
// ==/UserScript==
"use strict";

if (location.pathname !== "/robots.txt") {
  // TODO: use origin part info and cid
  const bvid = location.href.match(/BV.+?(?=(\?|\/|$))/)[0];
  // localStorage.blPureData = JSON.stringify(__playinfo__.data.dash);
  // __INITIAL_STATE__.p;
  location = "https://www.bilibili.com/robots.txt#" + bvid;
  throw "jump to clean page";
}

document.head.insertAdjacentHTML(
  "beforeend",
  `
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <style>
    body { display: flex; justify-content: center; align-items: center; margin: 0; height: 100vh; overflow: hidden; }
    body > :not(video) { display: none; }
    video { max-width: 100%; max-height: 100%; outline: none; }
  </style>
  `
);

// TODO: show parts and serials list
(async () => {
  const [bvid, partid] = location.hash.slice(1).split(",");
  const opusInfoUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
  const opusInfo = (await fetch(opusInfoUrl).then((r) => r.json())).data;
  document.title = opusInfo.title + " - Bilibili Pure";
  // const cid = opusInfo.pages[(partid ?? 1) - 1].cid;
  // const playInfoUrl = `https://api.bilibili.com/x/player/wbi/playurl?avid=${opusInfo.aid}&bvid=${bvid}&cid=${cid}&qn=16&fnver=0&fnval=4048&fourk=1&session=4be331b4864f323a30ed1b4d4b354c38&w_rid=a936d63d4113211db5e98cfe643de29a&wts=1674949149`;
  // const playInfo = (await fetch(playInfoUrl).then((r) => r.json())).data.dash;
  // if (!localStorage.blPureData)
  //   location = `https://www.bilibili.com/video/${bvid}`;
  // const playInfo = JSON.parse(localStorage.blPureData);
  // localStorage.blPureData = "";
  const pageUrl = `https://www.bilibili.com/video/${bvid}`;
  const page = await fetch(pageUrl).then((v) => v.text());
  const pageI1 = page.indexOf("__playinfo__=");
  const pageI2 = page.indexOf("</script>", pageI1);
  const playInfoText = page.slice(pageI1 + "__playinfo__=".length, pageI2);
  const playInfo = eval("(" + playInfoText + ")").data.dash;
  // console.log(eval("(" + playInfoText + ")"));
  const minOf = (arr, f = (e) => e) => {
    let ret = null;
    for (const e of arr) if (ret === null || f(e) < f(ret)) ret = e;
    return ret;
  };

  // TODO: HD
  const aInfo = minOf(playInfo.audio, (e) => e.bandwidth);
  const vInfo = minOf(playInfo.video, (e) =>
    e.codecid === 7 ? -e.width : 9e9
  );

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
    if (diff > 0.2) {
      let now = Date.now();
      // too big
      if (diff > 0.5) {
        console.log(diff, "big drop");
        audio.currentTime = video.currentTime;
      }
      // is last detect also lostsync?
      else if (now - lastLostSync < 750) {
        console.log(diff, "double miss");
        audio.currentTime = video.currentTime;
      }
      lastLostSync = now;
    }
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
