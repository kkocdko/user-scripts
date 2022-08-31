/*
https://api.bilibili.com/x/player/pagelist?bvid=BV1z3411M7Uc
https://api.bilibili.com/x/player/playurl?qn=16&fnver=0&fnval=4048&bvid=${bvid}&cid=${cid}
*/

get = (bvid) =>
  fetch(`https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`)
    .then((r) => r.json())
    .then((d) =>
      d.data.map((v) =>
        fetch(
          `https://api.bilibili.com/x/player/playurl?qn=16&fnver=0&fnval=4048&bvid=${bvid}&cid=${v.cid}`
        )
          .then((r) => r.json())
          .then((a) => [
            v.part,
            a.data.dash.video.find((b) => b.height == 480).baseUrl,
          ])
      )
    )
    .then((v) => Promise.all(v));
