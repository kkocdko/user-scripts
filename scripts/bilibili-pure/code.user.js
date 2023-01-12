// ==UserScript==
// @name        Bilibili Pure
// @name:zh-CN  Bilibili 纯净
// @description Pure & Native
// @description:zh-CN 纯净 & 原生
// @namespace   https://greasyfork.org/users/197529
// @version     0.4.1
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
  // __INITIAL_STATE__.p;
  location = "https://www.bilibili.com/robots.txt#" + bvid;
  throw "jump to clean page";
}

document.head.appendChild(document.createElement("style")).textContent = `
body { display: flex; justify-content: center; align-items: center; margin: 0; height: 100vh; overflow: hidden; }
body > :not(video) { display: none; }
video { max-width: 100%; max-height: 100%; outline: none; }
`;

/*
https://api.bilibili.com/x/player/pagelist?bvid=BV1z3411M7Uc
https://api.bilibili.com/x/player/playurl?qn=16&fnver=0&fnval=4048&bvid=${bvid}&cid=${cid}
https://api.bilibili.com/x/player/playurl?avid=733986366&cid=927131247&qn=16&type=mp4&platform=html5
*/

// TODO: optimize, don't get all video info
const getInfo = (bvid) =>
  fetch(`https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`)
    .then((response) => response.json())
    .then((json) =>
      json.data.map((videoPart) =>
        fetch(
          `https://api.bilibili.com/x/player/wbi/playurl?qn=16&fnver=0&fnval=4048&bvid=${bvid}&cid=${videoPart.cid}`
        )
          .then((response) => response.json())
          .then((json) => ({ title: videoPart.part, ...json.data.dash }))
      )
    )
    .then((tasks) => Promise.all(tasks));

const getTitle = (bvid) =>
  fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`)
    .then((r) => r.json())
    .then((d) => d.data.title);

// TODO: multi part and serials
(async () => {
  let [bvid, p] = location.hash.slice(1).split(",");
  p = (p ?? 1) - 1;

  getTitle(bvid).then((title) => {
    document.title = title + " - Bilibili Pure";
  });

  const ret = await getInfo(bvid);
  // const ret = await get("BV1aD4y1h7Yk");

  const minOf = (arr, f = (e) => e) => {
    let ret = null;
    for (const e of arr) if (ret === null || f(e) < f(ret)) ret = e;
    return ret;
  };

  // TODO: HD
  const aInfo = minOf(ret[p].audio, (e) => e.bandwidth);
  const vInfo = minOf(ret[p].video, (e) => (e.codecid === 7 ? -e.width : 9e9));

  const audio = document.createElement("audio");
  audio.src = aInfo.baseUrl;
  const video = document.createElement("video");
  video.src = vInfo.baseUrl;
  video.controls = true;
  video.onplay = () => audio.play();
  video.onpause = () => audio.pause();
  video.onratechange = () => {
    audio.playbackRate = video.playbackRate;
  };
  video.onseeking = () => audio.pause();
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

// (
//   await fetch(
//     "https://api.bilibili.com/x/player/wbi/playurl?avid=649205861&bvid=BV1ue4y1j7CK&cid=936203037&qn=16&fnver=0&fnval=4048&fourk=1&session=xxx&w_rid=xxx&wts=1671964872",
//     {
//       credentials: "include",
//     }
//   ).then((v) => v.json())
// ).data.dash;
