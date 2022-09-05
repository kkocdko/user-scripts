// ==UserScript==
// @name        bilibili_video_download
// @namespace   http://evgo2017.com/
// @homepageURL https://github.com/evgo2017/bilibili_video_download
// @supportURL  https://github.com/evgo2017/bilibili_video_download/issues
// @description 单/多P，单/多集，多视频/番剧正片，弹幕，封面图，大会员，Aria2 导出方式，Aria2RPC，弹幕 RPC（可更新弹幕），Local Storage  方式保存配置
// @match       *://www.bilibili.com/video/*
// @match       *://www.bilibili.com/bangumi/play/ep*
// @match       *://www.bilibili.com/bangumi/play/ss*
// @match       *://space.bilibili.com/*/favlist/*
// @match       *://space.bilibili.com/*/bangumi*
// @match       *://space.bilibili.com/*/cinema*
// @version     1.2.3.191001
// @license     MIT License
// @author      evgo2017
// @copyright   evgo2017
// @grant       none
// @run-at      document-body
// ==/UserScript==

(async function () {
    'use strict';
    /**
     * 用户配置
     */
    const LocalStorageName = 'evgoBvd'
        , defaultOptions = new Map([
            ['BASEDIR', './']
            , ['ARIA2TOKEN', '']
            , ['ARIA2RPC', 'http://localhost:6800/jsonrpc']
            , ['DANMURPC', 'http://localhost:6801']
            , ['QN', '120']
            , ['QNByBofqi', '0']
            , ['DownCoverPic', '0']
            , ['DownCoverPicOnly', '0']
            , ['DownDanmu', '0']
            , ['DownDanmuOnly', '0']
            , ['SHOWPLUG', '1']
        ])
    if (!localStorage.getItem(LocalStorageName)) {
        let evgoBvd = {}
        for (let [key, value] of defaultOptions) {
            evgoBvd[key] = value
        }
        localStorage.setItem(LocalStorageName, JSON.stringify(evgoBvd))
    } else {
        let evgoBvd = JSON.parse(localStorage.getItem(LocalStorageName))
        for (let [key, value] of defaultOptions) {
            if (!evgoBvd.hasOwnProperty(key)) {
                evgoBvd[key] = value
            }
        }
        localStorage.setItem(LocalStorageName, JSON.stringify(evgoBvd))
    }
    /* 刷新配置项 */
    let BASEDIR
        , ARIA2TOKEN
        , ARIA2RPC
        , DANMURPC
        , QN
        , QNByBofqi
        , DownCoverPic
        , DownCoverPicOnly
        , DownDanmu
        , DownDanmuOnly
        , SHOWPLUG
    function refreshOptions() {
        let evgoBvd = JSON.parse(localStorage.getItem(LocalStorageName))
        BASEDIR = evgoBvd.BASEDIR
        ARIA2TOKEN = evgoBvd.ARIA2TOKEN
        ARIA2RPC = evgoBvd.ARIA2RPC
        DANMURPC = evgoBvd.DANMURPC
        QN = evgoBvd.QN
        QNByBofqi = parseInt(evgoBvd.QNByBofqi)
        DownCoverPic = parseInt(evgoBvd.DownCoverPic)
        DownCoverPicOnly = parseInt(evgoBvd.DownCoverPicOnly)
        DownDanmu = parseInt(evgoBvd.DownDanmu)
        DownDanmuOnly = parseInt(evgoBvd.DownDanmuOnly)
        SHOWPLUG = parseInt(evgoBvd.SHOWPLUG)
    }
    refreshOptions()

    /**
     * 全局数据
     */
    let G_info = {
        get: function () { },
        one: {
            info: []
            , Aria2: function () {
                this.href = BlobURL(Exporter.Aria2(G_info.one.info))
            }
            , RPC: function () {
                Exporter.RPC(G_info.one.info)
            }
            , JSON: function () {
                this.href = BlobURL(Exporter.JSON(G_info.one.info))
            }
        },
        all: {
            info: []
            , Aria2: function () {
                this.href = BlobURL(Exporter.Aria2(G_info.all.info))
            }
            , RPC: function () {
                Exporter.RPC(G_info.all.info)
            }
            , JSON: function () {
                this.href = BlobURL(Exporter.JSON(G_info.all.info))
            }
        }
    }, G_getDataAuto = true

    const REFERER = 'https://www.bilibili.com'
    /**
     * 获取 api 数据
     * @param {string} url
     */
    function rp(url) {
        let xhr = new XMLHttpRequest()
        xhr.withCredentials = true
        xhr.open('GET', url, false)
        xhr.send()
        return xhr.responseText
    }
    /**
     * 获取 url 中的参数
     * @param {string} param
     */
    function getParameter(param) {
        let reg = new RegExp(param + "=([^\&]*)", "i")
            , res = reg.exec(window.location.search)
        if (res == null) return null
        return parseInt(res[1])
    }
    /**
     * 监听 history，无需刷新页面即可更新功能列表
     * @param {string} type
     */
    /*https://stackoverflow.com/questions/4570093/how-to-get-notified-about-changes-of-the-history-via-history-pushstate*/
    const _wr = function (type) {
        var orig = history[type]
        return function () {
            var rv = orig.apply(this, arguments)
            var e = new Event(type)
            e.arguments = arguments
            window.dispatchEvent(e)
            return rv
        }
    }
    history.pushState = _wr('pushState')
    history.replaceState = _wr('replaceState')
    window.addEventListener('replaceState', () => { Info.get() })
    window.addEventListener('pushState', () => { Info.get() })
    /**
     * 单集 Part QN 以播放器的 QN 为准，其余以设置的 QN 为准
     */
    const changePartQN = setInterval(() => {
        let lis = document.querySelectorAll('.bilibili-player-video-quality-menu .bui-select-item')
        if (lis.length) {
            clearInterval(changePartQN)
            lis.forEach(li => {
                li.addEventListener('click', () => {
                    Info.get()
                })
            })
        }
    }, 500)
    /**
     * 直到 condition 条件成立返回
     * @param {function} condition
     */
    const waitFor = async function (condition) {
        let res = await new Promise(resolve => {
            const wait = setInterval(() => {
                if (condition()) {
                    clearInterval(wait)
                    resolve('ok')
                }
            }, 100)
        })
        return res
    }
    /**
     * 设置 Cookies
     * @param {string} name
     * @param {string} value
     */
    function setCookie(name, value) {
        let date = new Date()
        date.setTime(date.getTime() + 2 * 365 * 24 * 60 * 60 * 1000)
        document.cookie = name + "=" + escape(value) + ";path=/;" + 'expires=' + date.toGMTString() + ';'
    }
    /**
     * 得到 Cookies
     * @param {string} name
     */
    function getCookie(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
        return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null
    }
    /**
     * 设置 Local Storage
     * @param {string} name
     * @param {string} value
     */
    function setLocalStorage(name, value) {
        let evgoBvd = JSON.parse(localStorage.getItem(LocalStorageName))
        evgoBvd[name] = value
        localStorage.setItem(LocalStorageName, JSON.stringify(evgoBvd))
    }
    /**
     * 得到 Local Storage
     * @param {string} name
     */
    function getLocalStorage(name) {
        let evgoBvd = JSON.parse(localStorage.getItem(LocalStorageName))
        return evgoBvd.hasOwnProperty(name) ? evgoBvd[name] : null
    }
    /**
     * 得到 Blob URL
     * @param {Array} infos
     */
    function BlobURL(infos) {
        return URL.createObjectURL(new Blob([infos.join('')]))
    }
    /**
     * 选择 QN
     * @match https://www.bilibili.com/*
     * 在播放具体视频的页面时，下载的清晰度是否以正在播放的清晰度为准
     */
    function changeQN() {
        if (QNByBofqi) {
            return getCookie('CURRENT_QUALITY')
        }
        return QN
    }
    /**
     * 显示隐藏插件
     */
    function changeSHOWPLUG() {
        let value = parseInt(getLocalStorage('SHOWPLUG')) === 1 ? 0 : 1
        setLocalStorage('SHOWPLUG', value)
        refreshOptions()
        if(SHOWPLUG) {
            document.body.removeChild(document.getElementById('bvdlist-show'))
            Info.get()
        } else {
            document.body.removeChild(document.getElementById('bvdlist'))
            UI.showPlug()
        }
    }

    class Video {
        /**
         * 获取 video 视频的某 Part
         * @param { dir, id, cid, part, pic } video
         */
        static async part(video) {
            const QN = changeQN()
                , { dir, id, cid, part, pic } = video
                , res = await rp(`https://api.bilibili.com/x/player/playurl?avid=${id}&cid=${cid}&qn=${QN}&otype=json`)
                , durl = JSON.parse(res).data.durl

            let urls = []
            if (DownDanmuOnly) {
                urls.push({ xml: true, dir, id, cid, out: `${part}.xml`, url: `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}` })
                return [[urls]]
            }
            if (DownCoverPicOnly) {
                urls.push({ dir, id, cid, out: `${part}.${pic.split('.').pop()}`, url: pic })
                return [[urls]]
            }
            if (DownCoverPic) urls.push({ dir, id, cid, out: `${part}.${pic.split('.').pop()}`, url: pic })
            if (DownDanmu) urls.push({ xml: true, dir, id, cid, out: `${part}.xml`, url: `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}` })
            if (durl.length < 2) {
                // 无分段
                urls.push({ dir, id, cid, out: `${part}.FLV`, url: durl[0].url })
            } else {
                // 有分段
                durl.forEach((value, index) => {
                    urls.push({ dir, id, cid, out: `${part}-${index}.FLV`, url: value.url })
                })
            }
            return [[urls]]
        }
        /**
         * 获取 videos 的所有 video 的全部 Part
         * @param [{ dir, id },{ dir, id }] / { dir, id } videos
         */
        static async all(videos) {
            if (!Array.isArray(videos)) {
                videos = [videos]
            }
            return Promise.all(videos.map(async video => {
                const { dir, id } = video
                    , res = await rp(`https://api.bilibili.com/x/web-interface/view?aid=${id}`)
                    , { pages, pic } = JSON.parse(res).data

                return Promise.all(pages.map(async page => {
                    const { cid, part } = page
                        , res = await rp(`https://api.bilibili.com/x/player/playurl?avid=${id}&cid=${cid}&qn=${QN}&otype=json`)
                        , durl = JSON.parse(res).data.durl

                    let urls = []
                    if (DownDanmuOnly) {
                        urls.push({ xml: true, dir, id, cid, out: `${part}.xml`, url: `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}` })
                        return urls
                    }
                    if (DownCoverPicOnly) {
                        urls.push({ dir, id, cid, out: `${part}.${pic.split('.').pop()}`, url: pic })
                        return urls
                    }
                    if (DownCoverPic) urls.push({ dir, id, cid, out: `${part}.${pic.split('.').pop()}`, url: pic })
                    if (DownDanmu) urls.push({ xml: true, dir, id, cid, out: `${part}.xml`, url: `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}` })
                    if (durl.length < 2) {
                        // 无分段
                        urls.push({ dir, id, cid, out: `${part}.FLV`, url: durl[0].url })
                    } else {
                        // 有分段
                        durl.forEach((value, index) => {
                            urls.push({ dir, id, cid, out: `${part}-${index}.FLV`, url: value.url })
                        })
                    }
                    return urls
                }))
            }))
        }
    }
    class Bangumi {
        /**
         * 获取 bangumi 的某集
         * @param { dir, id, part, episode, cover, cid } bangumi
         */
        static async part(bangumi) {
            const QN = changeQN()
                , { dir, id, part, episode, cover, cid } = bangumi
                , res = await rp(`https://api.bilibili.com/pgc/player/web/playurl?ep_id=${id}&qn=${QN}&otype=json`)
                , durl = JSON.parse(res).result.durl
                , sonTitle = `第${episode}集-${part}`

            let urls = []
            if (DownDanmuOnly) {
                urls.push({ xml: true, dir, id, cid, out: `${sonTitle}.xml`, url: `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}` })
                return [[urls]]
            }
            if (DownCoverPicOnly) {
                urls.push({ dir, id, cid, out: `${sonTitle}.${cover.split('.').pop()}`, url: cover })
                return [[urls]]
            }
            if (DownCoverPic) urls.push({ dir, id, cid, out: `${sonTitle}.${cover.split('.').pop()}`, url: cover })
            if (DownDanmu) urls.push({ xml: true, dir, id, cid, out: `${sonTitle}.xml`, url: `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}` })
            if (durl.length < 2) {
                // 无分段
                urls.push({ dir, id, cid, out: `${sonTitle}.FLV`, url: durl[0].url })
            } else {
                // 有分段
                durl.forEach((value, index) => {
                    urls.push({ dir, id, cid, out: `${sonTitle}-${index}.FLV`, url: value.url })
                })
            }
            return [[urls]]
        }
        /**
         * 获取 bangumis 的所有 bangumi 的全集正片
         * @param [{ dir, epList },{ dir, epList }] / { dir, epList } bangumis
         */
        static async all(bangumis) {
            if (!Array.isArray(bangumis)) {
                bangumis = [bangumis]
            }
            return Promise.all(bangumis.map(async bangumi => {
                const { dir, id } = bangumi
                let { epList } = bangumi
                if (!epList) {
                    let res = await rp(`https://api.bilibili.com/pgc/web/season/section?season_id=${id}`)
                    if (JSON.parse(res).result.main_section) {
                        epList = JSON.parse(res).result.main_section.episodes
                    } else {
                        epList = []
                    }
                }

                return Promise.all(epList.map(async page => {
                    const { id, title: episode, cover, cid } = page
                        , part = page.longTitle ? page.longTitle : page.long_title
                        , res = await rp(`https://api.bilibili.com/pgc/player/web/playurl?ep_id=${id}&qn=${QN}&otype=json`)
                        , durl = JSON.parse(res).result.durl
                        , sonTitle = `第${episode}集-${part}`

                    let urls = []
                    if (DownDanmuOnly) {
                        urls.push({ xml: true, dir, id, cid, out: `${sonTitle}.xml`, url: `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}` })
                        return urls
                    }
                    if (DownCoverPicOnly) {
                        urls.push({ dir, id, cid, out: `${sonTitle}.${cover.split('.').pop()}`, url: cover })
                        return urls
                    }
                    if (DownCoverPic) urls.push({ dir, id, cid, out: `${sonTitle}.${cover.split('.').pop()}`, url: cover })
                    if (DownDanmu) urls.push({ xml: true, dir, id, cid, out: `${sonTitle}.xml`, url: `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}` })
                    if (durl.length < 2) {
                        // 无分段
                        urls.push({ dir, id, cid, out: `${sonTitle}.FLV`, url: durl[0].url })
                    } else {
                        // 有分段
                        durl.forEach((value, index) => {
                            urls.push({ dir, id, cid, out: `${sonTitle}-${index}.FLV`, url: value.url })
                        })
                    }
                    return urls
                }))
            }))
        }
    }
    class Info {
        /**
         * 获取当前页面的对应功能列表
         */
        static async get() {
            const currentURL = window.location.href
            if (currentURL.search('space') > -1) {
                // 批量
                if (currentURL.search('favlist') > -1) {
                    // 收藏页 @match *://space.bilibili.com/*/favlist*
                    G_info.get = Info.favlist
                } else if (currentURL.search('bangumi') > -1 || currentURL.search('cinema') > -1) {
                    // 追番 @match *://space.bilibili.com/*/bangumi*
                    // 追剧 @match *://space.bilibili.com/*/cinema*
                    G_info.get = Info.bangumisOrCinema
                }
                G_getDataAuto = false
                UI.list([
                    {
                        textContent: '获取数据'
                        , onclick: async function () {
                            await G_info.get()
                            let uiList = [
                                , { textContent: '导出文件', download: 'download.session', onclick: G_info.all.Aria2, href: '#' }
                                , { textContent: '远程 RPC', onclick: G_info.all.RPC }
                                , { textContent: '原始数据', download: 'download.json', onclick: G_info.all.JSON }
                            ]
                            UI.list(uiList)
                        }
                    }
                    , '量大卡顿等待即可'
                ])
            } else {
                // 单个
                if (currentURL.search('video') > -1) {
                    // 视频 @match *://www.bilibili.com/video/av*
                    G_info.get = Info.oneVideo
                } else if (currentURL.search('bangumi') > -1) {
                    // 番剧 @match *://www.bilibili.com/bangumi/play/ep*
                    G_info.get = Info.oneBangumi
                }
                G_getDataAuto = true
                await G_info.get()
                let uiList = [
                    '当前'
                    , { textContent: '导出文件', download: 'download.session', onclick: G_info.one.Aria2, href: '#' }
                    , { textContent: '远程 RPC', href: '', onclick: G_info.one.RPC }
                    , { textContent: '原始数据', download: 'download.json', onclick: G_info.all.JSON }
                    , {}
                    , '全部'
                    , { textContent: '导出文件', download: 'download.session', onclick: G_info.all.Aria2, href: '#' }
                    , { textContent: '远程 RPC', href: '', onclick: G_info.all.RPC }
                    , { textContent: '原始数据', download: 'download.json', onclick: G_info.all.JSON }
                ]
                UI.list(uiList)
            }
        }
        static async oneVideo() {
            await waitFor(() => window.__INITIAL_STATE__)
            await waitFor(() => window.__INITIAL_STATE__.videoData)
            await waitFor(() => window.__INITIAL_STATE__.videoData.pages)
            await waitFor(() => document.querySelector('#viewbox_report h1'))

            const { aid, videoData } = window.__INITIAL_STATE__
                , pic = videoData.pic
                , p = getParameter('p') ? getParameter('p') - 1 : 0
                , { cid, part } = videoData.pages[p]
                , dir = document.querySelector('#viewbox_report h1').title

            // 当前 Part
            G_info.one.info = await Video.part({ dir, id: aid, cid, part: part ? part : dir, pic })
            // 全 Part
            G_info.all.info = await Video.all({ dir, id: aid })
        }
        static async oneBangumi() {
            await waitFor(() => window.__INITIAL_STATE__)
            await waitFor(() => parseInt(window.__INITIAL_STATE__.epInfo.epStatus) > 0)
            await waitFor(() => document.querySelector('.media-title'))
            await waitFor(() => window.__INITIAL_STATE__.epList)

            const { id, title: episode, longTitle: part } = window.__INITIAL_STATE__.epInfo
                , cover = window.__INITIAL_STATE__.epInfo.cover
                , dir = document.querySelector('.media-title').title
                , epList = window.__INITIAL_STATE__.epList

            // 单集
            G_info.one.info = await Bangumi.part({ dir, id, part: part ? part : dir, episode, cover, cid })
            // 全集
            G_info.all.info = await Bangumi.all({ dir, epList })
        }
        /**
         * 获取收藏页数据
         */
        static async favlist() {
            // 收藏页 @match *://space.bilibili.com/*/favlist*
            const up_mid = /\d+/.exec(window.location.href)[0]
                , res = await rp(`https://api.bilibili.com/medialist/gateway/base/created?pn=1&ps=100&up_mid=${up_mid}&is_space=0&jsonp=jsonp`)
                , favlists = JSON.parse(res).data.list
            let media_id
                , media_count
                , maxPn
                , infos = []

            if (window.location.search) {
                media_id = getParameter('fid')
                for (let fav of favlists) {
                    if (media_id == fav.id) {
                        media_count = fav.media_count
                    }
                }
            } else {
                media_id = favlists[0].id
                media_count = favlists[0].media_count
            }

            maxPn = media_count / 20 + 1
            for (let pn = 1; pn < maxPn; pn++) {
                const res = await rp(`https://api.bilibili.com/medialist/gateway/base/spaceDetail?media_id=${media_id}&ps=20&pn=${pn}&keyword=&order=mtime&type=0&tid=0&jsonp=jsonp`)
                    , medias = JSON.parse(res).data.medias
                for (let media of medias) {
                    let { title: dir, id } = media
                    infos.push({ dir, id })
                }
            }

            G_info.all.info = await Video.all(infos)
        }
        /**
         * 获取追番/剧数据
         */
        static async bangumisOrCinema() {
            // 追番 @match *://space.bilibili.com/*/banguimi*
            // 追剧 @match *://space.bilibili.com/*/cinema*
            const up_mid = /\d+/.exec(window.location.href)[0]
                , type = window.location.href.search('bangumi') > -1 ? 1 : 2
                , ts = Date.parse(new Date())
                , res = await rp(`https://api.bilibili.com/x/space/bangumi/follow/list?type=${type}&follow_status=0&pn=1&ps=15&vmid=${up_mid}&ts=${ts}`)
                , { list: bangumis, ps, total } = JSON.parse(res).data
            let maxPn
                , infos = []

            bangumis.forEach(bangumi => {
                let { title: dir, season_id: id } = bangumi
                infos.push({ dir, id })
            })

            maxPn = total / ps + 1
            for (let pn = 2; pn <= maxPn; pn++) {
                // 说明有多页，需要多次获取
                const res = await rp(`https://api.bilibili.com/x/space/bangumi/follow/list?type=${type}&follow_status=0&pn=${pn}&ps=15&vmid=${up_mid}&ts=${ts}`)
                    , { list: bangumis } = JSON.parse(res).data
                bangumis.forEach(bangumi => {
                    let { title: dir, season_id: id } = bangumi
                    infos.push({ dir, id })
                })
            }

            G_info.all.info = await Bangumi.all(infos)
        }
    }

    class Exporter {
        /**
         * 以 Aria2 方式导出
         * @param {Array} infos
         */
        static Aria2(infos) {
            let data = []
            infos.map(info => info.map(pages => pages.map(page => {
                let { dir, url, out } = page
                dir = dir.replace(/[\\\/:?*"<>|]/ig, '-')
                out = out.replace(/[\\\/:?*"<>|]/ig, '-')
                data.push(`${url}\r\n referer=${REFERER}\r\n dir=${BASEDIR}${dir}\r\n out=${out}\r\n`)
            })))
            return data
        }
        /**
         * 将数据发送到 RPC
         * @param {Array} infos
         */
        static RPC(infos) {
            console.log(infos)
            infos.map(info => info.map(pages => pages.map(page => {
                let { dir, out, url, xml } = page
                    , rpcStatus = document.getElementById('rpcStatus')
                    , xhr = new XMLHttpRequest()

                dir = dir.replace(/[\\\/:?*"<>|]/ig, '-')
                out = out.replace(/[\\\/:?*"<>|]/ig, '-')

                xhr.onloadstart = () => {
                    rpcStatus.innerHTML = '<p>发送请求</p>'
                }
                xhr.onload = () => {
                    rpcStatus.innerHTML = '<p>请求完成</p>'
                }
                xhr.onerror = (e) => {
                    rpcStatus.innerHTML = `<p>请求出错:${e}</p>`
                }
                xhr.ontimeout = () => {
                    rpcStatus.innerHTML += '<p>请求超时</p>'
                }
                if (xml) {
                    xhr.open('POST', `${DANMURPC}`, true)
                    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
                    xhr.send(JSON.stringify({
                        jsonrpc: "2.0",
                        id: "",
                        method: "add",
                        params: {
                            'dir': `${BASEDIR}${dir}`,
                            'out': `${out}`,
                            'url': `${url}`
                        }
                    }))
                } else {
                    xhr.open('POST', `${ARIA2RPC}`, true)
                    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
                    xhr.send(JSON.stringify([{
                        jsonrpc: "2.0",
                        id: "",
                        method: "aria2.addUri",
                        params: [
                            `token:${ARIA2TOKEN}`,
                            [url],
                            { 'referer': `${REFERER}`, 'dir': `${BASEDIR}${dir}`, 'out': `${out}`, 'http-accept-gzip': 'true' }
                        ]
                    }]))
                }
            })))
        }
        /**
         * 以 JSON 方式导出
         * @param {Array} infos
         */
        static JSON(infos) {
            let data = {}
            infos.map(info => info.map(pages => pages.map(page => {
                let { dir, id, cid, url, out } = page
                dir = dir.replace(/[\\\/:?*"<>|]/ig, '-')
                out = out.replace(/[\\\/:?*"<>|]/ig, '-')
                data[id] = { dir, cid, url, out, BASEDIR, REFERER }
            })))
            return [JSON.stringify(data)]
        }
    }

    class UI {
        /**
         * 显示插件
         */
        static showPlug() {
            let dd = document.createElement('div')
            dd.id = 'bvdlist-show'
            dd.style.color = '#fff'
            dd.style.backgroundColor = '#00A1D6'
            dd.style.zIndex = 999
            dd.style.position = 'fixed'
            dd.style.fontSize = '1.2em'
            dd.style.paddingLeft = '5px'
            dd.style.paddingRight = '5px'
            dd.textContent = '>'
            dd.style.top = '50px'
            dd.onclick = changeSHOWPLUG

            document.body.appendChild(dd)
        }
        /**
         * 功能列表
         * @param {Array} types
         */
        static list(types) {
            const baseTypes = [
                {}
                , {
                    textContent: '设置',
                    onclick: function () {
                        let st = document.getElementById('bvdsetting')
                        if (st) st.style.display = st.style.display == 'none' ? 'block' : 'none'
                        else UI.setting()
                    }
                }
                , { textContent: '隐藏插件', onclick: changeSHOWPLUG }
                , { textContent: '帮助', href: 'https://github.com/evgo2017/bilibili_video_download' }
            ]

            if (document.getElementById('bvdlist')) document.body.removeChild(document.getElementById('bvdlist'))
            let dd = document.createElement('div')
            dd.id = 'bvdlist'
            dd.style.backgroundColor = '#00A1D6'
            dd.style.zIndex = 999
            dd.style.position = 'fixed'
            dd.style.width = '78px'
            dd.style.fontSize = '1.2em'
            dd.textContent = '下载方式'
            dd.style.top = '167px'

            let rpcStatus = document.createElement('p')
            rpcStatus.id = 'rpcStatus'
            rpcStatus.style.color = 'red'
            dd.appendChild(rpcStatus)

            for (let i of baseTypes) types.push(i)
            for (let i of types) dd.appendChild(UI.createA(i))
            document.body.appendChild(dd)
        }
        /* 设置页面 */
        static setting() {
            let st = document.createElement('div')
                , inputTextsDiv = document.createElement('div')
                , selectsDiv = document.createElement('div')
                , checkboxsDiv = document.createElement('div')
                , buttonsDiv = document.createElement('div')

            const inputTexts = [ /* 输入框 */
                { textContent: `基础路径（以 “/\” 结尾）`, name: 'BASEDIR' }
                , { textContent: 'Aria2 Token', name: 'ARIA2TOKEN' }
                , { textContent: 'Aria2 RPC', name: 'ARIA2RPC' }
                , { textContent: '弹幕 RPC', name: 'DANMURPC' }
            ], selects = [ /* 下拉菜单 */
                {
                    textContent: '最高清晰度（QN）'
                    , name: 'QN'
                    , title: '小技巧：会返回此 QN，或视频最大支持 QN 的视频'
                    , options: [
                        { value: '120', innerText: '超清 4K' }
                        , { value: '116', innerText: '高清 1080P60' }
                        , { value: '112', innerText: '高清 1080P+' }
                        , { value: '80', innerText: '高清 1080P' }
                        , { value: '74', innerText: '高清 720P60' }
                        , { value: '64', innerText: '高清 720P' }
                        , { value: '32', innerText: '清晰 480P' }
                        , { value: '16', innerText: '流畅 360P' }
                        , { value: '0', innerText: '自动' }
                    ]
                }
            ], checkboxs = [  /* 单选 */
                { textContent: '下载封面图', name: 'DownCoverPic', title: "封面图" }
                , { textContent: '下载弹幕 XML', name: 'DownDanmu', title: '更改后需刷新。因下载工具功能及方便更新弹幕，提供 JSON 文件。建议使用支持 XML 的播放器，还原度极高，比如“弹弹Play”' }
                , { textContent: '仅更新弹幕 XML', name: 'DownDanmuOnly', title: '仅更新弹幕，不下载其他资料，权重最高' }
                , { textContent: '仅下载封面图', name: 'DownCoverPicOnly', title: '仅下载封面图，不下载其他资料，当同时选择【仅更新弹幕 XML】时，此项无效' }
                , { textContent: '播放页 QN 以播放器为准', name: 'QNByBofqi', title: '在播放具体视频的页面时，下载的清晰度是否以正在播放的清晰度为准' }
            ], buttons = [ /* 按钮 */
                {
                    value: '保存'
                    , type: 'submit'
                    , onclick: async function () {
                        const bvdsetting = document.getElementById('bvdsetting')
                        let data = null

                        data = bvdsetting.querySelectorAll('input')
                        for (let i of data) {
                            switch (i.type) {
                                case 'checkbox':
                                    if (i.checked) setLocalStorage(i.name, '1')
                                    else setLocalStorage(i.name, '0')
                                    break
                                case 'text':
                                    setLocalStorage(i.name, i.value)
                                    break
                                default:
                                    break
                            }
                        }

                        data = bvdsetting.querySelectorAll('select')
                        for (let i of data) setLocalStorage(i.name, i[i.selectedIndex].value)

                        st.style.display = 'none'
                        refreshOptions()
                        if (G_getDataAuto) await G_info.get()
                        else Info.get()
                        return false
                    }
                },
                {
                    value: '关闭'
                    , type: 'button'
                    , onclick: function () {
                        st.style.display = 'none'
                    }
                }
            ]

            for (let i of inputTexts) inputTextsDiv.appendChild(UI.createInputText(i))
            for (let i of selects) selectsDiv.appendChild(UI.createSelect(i))
            for (let i of checkboxs) checkboxsDiv.appendChild(UI.createCheckbox(i))
            for (let i of buttons) buttonsDiv.appendChild(UI.createButton(i))

            st.id = 'bvdsetting'
            st.textContent = '设置'
            st.style.backgroundColor = '#00A1D6'
            st.style.zIndex = 999
            st.style.position = 'fixed'
            st.style.padding = '10px'
            st.style.fontSize = '1.2em'
            st.style.top = '70px'
            st.style.left = '80px'

            st.appendChild(inputTextsDiv)
            st.appendChild(selectsDiv)
            st.appendChild(checkboxsDiv)
            st.appendChild(buttonsDiv)

            let lis = st.getElementsByTagName('div')
            for (let i of lis) i.style.marginTop = '10px'

            document.body.appendChild(st)
        }
        /* 创建按钮 dom: String || {} || { textContent, download, href, onclick } */
        static createA(goal) {
            let a = document.createElement('a')
            a.style.display = 'block'
            a.style.fontSize = '1em'
            a.style.padding = '5px'
            if (typeof goal == 'string') {
                a.textContent = goal
                return a
            }

            let { textContent, download, href, onclick } = goal
            a.textContent = textContent ? textContent : '-----'
            if (textContent) a.style.color = '#fff'
            if (href) a.href = href
            if (download) a.download = download
            if (onclick) a.onclick = onclick
            return a
        }
        /* 创建修改标签 { textContent, name, title }  */
        static createInputText(goal) {
            const { textContent, name, title } = goal
            let value = getLocalStorage(name)
                , div = document.createElement('div')
                , label = document.createElement('label')
                , input = document.createElement('input')

            label.setAttribute("for", name)
            label.innerHTML = `${textContent}:`
            label.style.display = 'inline-block'
            label.style.marginBottom = '5px'
            label.title = `${title}`

            input.style.display = 'block'
            input.style.fontSize = '1em'
            input.style.border = 0
            input.style.padding = '5px'
            input.placeholder = value
            input.value = value
            input.name = name

            div.appendChild(label)
            div.appendChild(input)
            return div
        }
        /* 创建下拉菜单 [{textContent, name, title, options}] */
        static createSelect(goal) {
            const { textContent, name, title, options } = goal
            let value = parseInt(getLocalStorage(name))
                , div = document.createElement('div')
                , label = document.createElement('label')
                , select = document.createElement('select')

            label.setAttribute("for", name)
            label.innerHTML = `${textContent}:`
            label.style.display = 'block'
            label.style.marginBottom = '5px'
            label.title = `${title}`

            options.forEach(i => {
                let option = document.createElement('option')
                option.value = i.value
                option.innerText = i.innerText
                if (i.value == value) option.seletced = "selected"
                select.appendChild(option)
            })

            select.name = name
            select.style.padding = '3px 5px 7px'
            select.style['-webkit-appearance'] = "menulist"

            div.appendChild(label)
            div.appendChild(select)
            return div
        }
        /* 创建选择 { textContent, name, title } */
        static createCheckbox(goal) {
            const { textContent, name, title } = goal
            let value = parseInt(getLocalStorage(name))
                , div = document.createElement('div')
                , label = document.createElement('label')
                , input = document.createElement('input')

            label.setAttribute("for", name)
            label.innerHTML = `${textContent}`
            label.style.marginLeft = '5px'
            label.title = `${title}`

            input.type = 'checkbox'
            input.style['-webkit-appearance'] = "checkbox"
            input.name = name
            if (value) input.checked = "checked"

            div.appendChild(input)
            div.appendChild(label)
            return div
        }
        /* 创建按钮 { value, type, onclick } */
        static createButton(goal) {
            let { value, type, onclick } = goal
                , button = document.createElement('input')

            button.type = type
            button.value = value
            button.onclick = onclick
            button.style.border = 0
            button.style.padding = '3px 5px'
            button.style.marginRight = '10px'

            return button
        }
    }
    if(SHOWPLUG) {
        Info.get()
    } else {
        UI.showPlug()
    }
})()
