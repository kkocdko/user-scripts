// ==UserScript==
// @name        Bilibili Utils
// @description Small utils
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.1
// @author      kkocdko
// @license     Unlicense
// @match       *://www.bilibili.com/robots.txt
// @match       *://www.bilibili.com/video/*
// @run-at      document-start
// ==/UserScript==

addEventListener("keydown", (e) => {
  const video = document.querySelector("video");

  // origin ratio
  if (e.key === "o") {
    if (devicePixelRatio !== 1) return alert("please set scale = 1");
    video.style.setProperty("width", video.videoWidth + "px", "important");
    video.style.setProperty("height", video.videoHeight + "px", "important");
    video.style.marginTop =
      Math.round((innerHeight - video.videoHeight) / 3) + "px";
  }

  // reshape to 16:9
  if (e.key === "r") {
    if (!document.fullscreenElement) return;
    let el = document.querySelector("video");
    if (el.dataset.reshaped) return;
    el.dataset.reshaped = "true";
    let height = Math.trunc(el.clientHeight / 4) * 4;
    el.style.height = height + "px";
    el.style.width = Math.trunc(((height / 10) * 16) / 4) * 4 + "px";
    el.style.objectFit = "fill";
  }
});

throw new Error("stop");

document.documentElement.style.colorScheme = "dark light";
document.body.replaceChildren();
const $bvavid = document.body.appendChild(document.createElement("input"));
const $vpid = document.body.appendChild(document.createElement("input"));
const $get = document.body.appendChild(document.createElement("button"));
$get.textContent = "Get";
$get.onclick = async () => {
  const url = `https://www.bilibili.com/video/${$bvavid.value}?p=$${$vpid.value}`;
  const s = await (await fetch(url, { redirect: "follow" })).text();
  const markBegin = "<script>window.__playinfo__=";
  const markEnd = "</script>";
  let indexBegin = s.indexOf(markBegin);
  if (indexBegin === -1) throw new Error("not found markBegin");
  indexBegin += markBegin.length;
  let indexEnd = s.indexOf(markEnd, indexBegin);
  if (indexEnd === -1) throw new Error("not found markEnd");
  const playInfo = JSON.parse(s.slice(indexBegin, indexEnd));
  const audioInfo = playInfo.data.dash.audio.sort((a, b) => {
    const conditions = [
      (v) => v.id === 30232,
      (v) => v.mimeType === "audio/mp4",
    ];
    for (const c of conditions) {
      const d = c(b) - c(a);
      if (d !== 0) return d;
    }
  })[0];
  const videoInfo = playInfo.data.dash.video.sort((a, b) => {
    const conditions = [
      (v) => v.id === 64,
      (v) => v.codecs.startsWith("av01."),
      (v) => v.codecs.startsWith("hev1."),
      (v) => v.codecs.startsWith("avc1."),
    ];
    for (const c of conditions) {
      const d = c(b) - c(a);
      if (d !== 0) return d;
    }
  })[0];
  const fileNamePrefix = "bilibili_" + $bvavid.value + "_" + $vpid.value;
  document.body.appendChild(document.createElement("br"));
  const $audioName = document.body.appendChild(document.createElement("input"));
  $audioName.value = fileNamePrefix + "_audio.m4a";
  const $audioDl = document.body.appendChild(document.createElement("a"));
  $audioDl.download = $audioName.value;
  $audioDl.href = audioInfo.baseUrl;
  $audioDl.textContent = `audio (codecs="${audioInfo.codecs}",bandwidth="${audioInfo.bandwidth}")`;
  $audioDl.style.display = "block";
  document.body.appendChild(document.createElement("br"));
  const $videoName = document.body.appendChild(document.createElement("input"));
  $videoName.value = fileNamePrefix + "_video.mp4";
  const $videoDl = document.body.appendChild(document.createElement("a"));
  $videoDl.download = $videoName.value;
  $videoDl.href = videoInfo.baseUrl;
  $videoDl.textContent = `video (codecs="${videoInfo.codecs}",height="${videoInfo.height}")`;
  $videoDl.style.display = "block";
};
document.body.appendChild(document.createElement("br"));

/*
https://www.bilibili.com/video/BV1A7JnzcE3V
https://www.bilibili.com/video/BV1vnJxzYEsn
*/
