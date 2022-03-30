// ==UserScript==
// @name        Dash on ZhiHuiShu
// @namespace   Violentmonkey Scripts
// @match       *://*.zhihuishu.com/videoStudy.html
// @match       *://*.zhihuishu.com/live/vod_room.html
// @version     0.0.1
// @run-at      document-start
// ==/UserScript==

// for exam: https://greasyfork.org/scripts/426104
const rate=16; // videoStudy:50~200 | vod_room:2~16
const setInterval=unsafeWindow.setInterval;
const setTimeout=unsafeWindow.setTimeout;
unsafeWindow.setInterval=(f,t)=>setInterval(f,t/rate);
unsafeWindow.setTimeout=(f,t)=>setTimeout(f,t/rate);
setInterval(()=>{
  try{document.querySelector('video').playbackRate=rate;}catch{}
  if(document.querySelector('.dialog-back')?.clientWidth)location.reload();
  setTimeout(()=>document.querySelector('video')?.play(),1700);
  const entry=[...document.querySelectorAll('.time_ico_half')].filter(e=>!e.nextElementSibling.classList.contains('time_icofinish'))[0];
  if(!entry)return;
  entry.scrollIntoView({behavior:"smooth",block:"center"});
  entry.click();
},1000*5);
