提供**纯净的**哔哩哔哩视频播放页面。

**必须与广告过滤规则同时使用**。请将以下规则添加到你的广告过滤器（例如 [uBlock Origin](https://github.com/gorhill/uBlock)）：

```
bilibili.com##[id$=Header]
bilibili.com###playerWrap~:not(#v_desc)
bilibili.com##.r-con>:first-child~:not(#multi_page)
bilibili.com##.bilibili-player-video-wrap>:not(.bilibili-player-video)
bilibili.com##.bilibili-player-video-wrap~*
||s1.hdslb.com/bfs/static/player/main/widgets
||s1.hdslb.com/bfs/static/jinkela/video/stardust-video
||s1.hdslb.com/bfs/seed
||s1.hdslb.com/bfs/cm
```

如果你遇到视频控件无法显示等问题，请暂时关闭广告过滤器，在播放器设置中选择“禁用 HEVC”。

![截屏](https://z3.ax1x.com/2021/09/23/4dwGod.png)
