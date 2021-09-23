Provide a **PURE** player page for Bilibili.

**MUST be used with AD blocker rules**. Please paste these rules into your AD Blocker (like [uBlock Origin](https://github.com/gorhill/uBlock)):

```
bilibili.com##[id$=Header]
bilibili.com###playerWrap~:not(#v_desc)
bilibili.com##.r-con>:first-child~:not(#multi_page)
bilibili.com##.bilibili-player-video-wrap>:not(.bilibili-player-video)
bilibili.com##.bilibili-player-video-wrap~*
||s1.hdslb.com/bfs/static/player/main/widgets
||s1.hdslb.com/bfs/seed
||s1.hdslb.com/bfs/cm
```

If you encounter problems such as video controls disappear, please temporarily off the ad blocker, select "Disable HEVC" in the player settings.

![Screenshot](https://z3.ax1x.com/2021/09/23/4dwGod.png)
