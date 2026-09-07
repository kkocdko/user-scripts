// ==UserScript==
// @name        Better Native Player
// @description On file URLs.
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.2
// @author      kkocdko
// @license     Unlicense
// @match       file://*/*
// @match       *://ffzy.tv/*
// ==/UserScript==

const initParamPlayer = async () => {
  // http://ffzy.tv/robots.txt#url=https://vip.ffzy-online2.com/20230103/5935_7cdcba65/index.m3u8
  if (!location.hash.startsWith("#url="))
    return console.info("param url not found");
  const url = location.hash.slice("#url=".length);
  const get = (u) => fetch(u, { redirect: "follow" }).then((r) => r.text());
  const playlist = await get(url);
  const relative = playlist.split("\n").find((v) => v.endsWith(".m3u8")); // first one in playlist
  const u = url.replace(/[^/]+$/, relative);
  let o = "";
  let skip = 3;
  for (let line of (await get(u)).split("\n")) {
    if (line === "#EXT-X-DISCONTINUITY") skip -= 1;
    if (skip == 1) continue; // remove ad
    if (line.endsWith(".ts")) line = u.replace(/[^/]+$/, line);
    o += line + "\n";
  }
  const blob = new Blob([o], { type: "application/vnd.apple.mpegurl" });
  const video = document.createElement("video");
  video.src = URL.createObjectURL(blob);
  video.crossOrigin = "anonymous";
  document.body.replaceChildren(video);
  // import fs from "node:fs";
  // import assert from "node:assert";
  // const firstArgIndex = process.argv.findIndex((v) => /^https?:/.test(v));
  // const url = process.argv[firstArgIndex];
  // const file = process.argv[firstArgIndex + 1];
  // fs.writeFileSync(file + ".m3u8", o);
  // console.log(`ffmpeg -protocol_whitelist file,https,tls,tcp -i ${file + ".m3u8"}  -c copy -movflags faststart ${file}`);
  // node ~/misc/code/user-scripts/scripts/m3u8-save/code.user.js https://vip.ffzy-online2.com/20230103/5902_56190c07/index.m3u8 s02e04.mp4
  // tmux new -s s02e04 -d 'ffmpeg -protocol_whitelist file,https,tls,tcp,httpproxy -i s02e04.mp4.m3u8  -c copy -movflags faststart s02e04.mp4'
};

const initPlayerControls = async () => {
  const video = document.querySelector("video");
  video.controls = true;
  document.onkeydown = (e) => {
    e.preventDefault();
    if (e.key === "[") video.currentTime -= 5.0;
    if (e.key === "]") video.currentTime += 5.0;
    if (e.key === "p") video.paused ? video.play() : video.pause();
    if (e.key === "c") video.controls ^= true;
    if (e.key === "s") {
      const input = document.createElement("input");
      input.type = "file";
      input.click();
      input.onchange = () => {
        const url = URL.createObjectURL(input.files[0]);
        const track = document.createElement("track");
        track.default = true;
        track.kind = "captions";
        track.src = url;
        document.querySelector("video").appendChild(track);
      };
    }
  };
  const css = ([s]) => {
    const el = document.createElement("style");
    el.textContent = s.replace(/;/g, "!important;");
    document.documentElement.appendChild(el);
  };
  css`
    body {
      margin: 0;
      color-scheme: dark;
      background-color: black;
    }
    video {
      max-width: 100%;
      max-height: 100%;
      outline: none;
    }
  `;
};

initParamPlayer().finally(() => initPlayerControls());
