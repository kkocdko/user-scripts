// ==UserScript==
// @name         美化惠安一中官网
// @description  使福建惠安一中官网更加现代化
// @namespace    https://greasyfork.org/users/197529
// @version      3.0.2
// @author       kkocdko
// @license      Unlicense
// @match        *://*.fjhayz.cn/*
// @run-at       document-start
// ==/UserScript==
'use strict'

document.documentElement.style.display = 'none'
const { iconData, cssStr, garbageListStr } = getResources()
let isModified = false
let isHomePage = false
cleanEnvironment()
runAfterPageReady(() => {
  if (!isModified) {
    // console.clear()
    isModified = true
    isHomePage = !!document.querySelector('.main1')
    modifyPage()
    loadPagePlugin()
    document.documentElement.style.display = ''
  }
})

function runAfterPageReady (callback) {
  window.addEventListener('DOMContentLoaded', callback) // Run script after dom loaded
  window.addEventListener('load', callback) // For overslow script inserting
  if (document.readyState === 'complete') callback() // For lessfunctional script-manager
}

function cleanEnvironment () {
  garbageListStr.split(',').forEach(key => Object.defineProperty(window, key, { writable: false }))
}

function modifyPage () {
  // Block script, style and big images
  document.querySelectorAll('script, link[type], .main5down img').forEach(el => {
    el.removeAttribute('src')
    el.removeAttribute('href')
  })
  // Set hyperlink target to current tab
  document.querySelectorAll('a').forEach(el => { el.target = '' })
  // Modify dom om
  const mainBoxEl = document.createElement('div')
  mainBoxEl.classList.add('main-box')
  if (isHomePage) {
    mainBoxEl.classList.add('home-box')
    forEachEl([
      '.tabbed_content',
      '.main1center>div',
      '.main1right',
      '.main2right',
      '.main2left',
      '.main3left',
      '.main3right',
      '.main4left',
      '.main4center'
    ], el => {
      el.removeAttribute('id')
      el.removeAttribute('class')
      mainBoxEl.append(el)
    })
    mainBoxEl.children[0].insertAdjacentHTML('afterBegin', '<input id=tab-switch type=checkbox><label for=tab-switch>')
  } else {
    forEachEl(['.right', '.left', '.right-big'], el => mainBoxEl.append(el))
  }
  forEachEl(['.menu', '.noticesbox', mainBoxEl], el => document.body.append(el))
  forEachEl(['.container', '.main7'], el => el.remove())
  // Insert resources
  document.querySelector('.menu>ul>li:first-child>a').insertAdjacentHTML('beforeEnd', `<img src="${iconData}">`)
  document.head.insertAdjacentHTML('afterBegin', `
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
    <link rel="icon" href="${iconData}">
    <style>${cssStr}</style>
    <title>${'惠安一中 - ' + (isHomePage ? '首页' : window.location.pathname)}</title>
  `)
}

function loadPagePlugin () {
  if (isHomePage) {
    // Focu cards
    const focuContainer = document.querySelector('.fPic')
    const focuNumber = focuContainer.childElementCount
    focuContainer.style.setProperty('--pic-number', focuNumber)
    let focuIndex = 0
    setInterval(() => {
      focuContainer.style.setProperty('--pic-index',
        focuIndex < focuNumber - 1
          ? ++focuIndex
          : focuIndex = 0
      )
    }, 5000)
  } else {
    // Page number nav
    const pageNumberContainer = document.querySelector('#dcms_pager')
    if (pageNumberContainer) {
      const urlArgs = new URLSearchParams(window.location.search)
      const getCookie = name => {
        const result = document.cookie.match(`(^|\\s)${name}=([^;]*)(;|$)`)
        return result ? window.unescape(result[2]) : null
      }
      const totalPage = parseInt(getCookie('TotalPage'))
      const totalRecord = parseInt(getCookie('TotalRecord'))
      const currentPage = Number(urlArgs.get('page') ? urlArgs.get('page') : 1)
      const pageName = window.location.pathname + '?page='
      let innerHTML = `<span>共${totalRecord}项</span>`
      innerHTML += currentPage === 1
        ? ''
        : `<a class=pgNext href="${pageName}1">首页</a><a class=pgNext href="${pageName}${currentPage - 1}">上一页</a>`
      const beginI = currentPage > 5 && totalPage > 9 ? currentPage - 4 : 1
      for (let i = beginI, loopi = 0; i <= totalPage; i++) {
        innerHTML += i === currentPage
          ? `<a class=pgcurrent>${i}</a>`
          : `<a href="${pageName}${i}">${i}</a>`
        loopi++
        if (loopi === 5) break
      }
      const endpager = currentPage === totalPage
        ? ''
        : `<a class=pgNext href="${pageName}${currentPage + 1}">下一页</a><a class=pgNext href="${pageName}${totalPage}">尾页</a>`
      innerHTML += `${endpager}<span>${currentPage}/${totalPage}页</span><select onchange="location.href='${pageName}'+this.value">`
      for (let i = beginI; i <= totalPage; i++) {
        innerHTML += i === currentPage
          ? `<option value="${i}" selected="selected">${i}</option>`
          : `<option value="${i}">${i}</option>`
      }
      innerHTML += '</select>'
      pageNumberContainer.innerHTML = innerHTML
    }
  }
}

function forEachEl (elArr, callback) {
  elArr.forEach(el => {
    el = typeof el === 'string' ? document.querySelector(el) : el
    if (el) callback(el)
  })
}

function getResources () {
  return {
    iconData: 'data:image/webp;base64,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',
    cssStr: '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}a{color:#3367d6;text-decoration:none;text-overflow:ellipsis;}body{display:flex;flex-direction:column;align-items:center;padding-bottom:30px;min-height:101vh;background:#f8f9fa;--theme-color-1:#f44336;--theme-color-2:#ef5350;--theme-color-3:#d32f2f;}.menu{overflow:hidden auto;width:100%;height:50px;background:var(--theme-color-1);box-shadow:0 0 5px 0 rgba(0,0,0,0.2);}.menu ul{margin:0 auto;max-width:1190px;}.menu li{float:left;overflow:hidden;width:6em;height:50px;}.menu li:hover{background:rgba(255,255,255,0.2);}.menu li ul{position:absolute;top:50px;z-index:3;display:none;width:inherit;background:var(--theme-color-1);box-shadow:0 1px 3px 0 rgba(0,0,0,0.3);}.menu li:hover ul{display:block;}.menu a{display:block;padding:0 0.5em;width:100%;height:100%;color:#fff;text-align:center;font-size:16px;line-height:50px;}.menu>ul>li:first-child{width:175px;}.menu>ul>li:first-child a{position:relative;padding:0;color:transparent;white-space:nowrap;}.menu>ul>li:first-child a::after{content:"惠安一中";position:absolute;top:0;right:0;width:125px;color:#fff;font-weight:bold;font-size:25px;font-family:STKaiti,KaiTi,KaiTi_GB2312,cursive;}.menu>ul>li:first-child img{float:left;margin:5px;height:40px;}.noticesbox{overflow:hidden;margin-top:1px;height:32px;max-width:1190px;width:100%;}.noticesbox .notice{float:left;}.noticesbox img{display:none;}.scrollnews ul{list-style:none;}.scrollnews a{padding-left:5px;color:#555;font-size:12px;line-height:32px;}.scrollnews a:hover{color:var(--theme-color-3);}.scrollnews span{padding:0 0 0 60px;color:#999;}.search{float:right;width:19em;height:100%;}.search .ss{position:relative;width:100% !important;height:100%;}.search form{width:100% !important;height:100% !important;}.search input{margin:3px 0;padding-left:3px;width:80%;height:26px;border:1px solid #dbdbdb;border-right:0;color:#666 !important;}.search input[type=image]{position:absolute;top:0;right:0;width:20% !important;opacity:0;}.search .ss::after{content:"搜索";float:right;margin:3px 0;width:20%;height:26px;border:1px solid #dbdbdb;background:#fff;text-align:center;font-size:14px;line-height:26px;pointer-events:none;}.main-box{display:flex;flex-wrap:wrap;justify-content:center;margin:0 auto;width:100%;max-width:1190px;}.home-box{box-shadow:0 2px 5px 0 rgba(0,0,0,0.2);}.home-box>*{position:relative;overflow:hidden;width:50%;height:230px;min-width:calc(576px / 2);border:1px solid #ddd;background:#fff;flex-grow:1;}@media screen and (max-width:576px){.home-box>*{border-width:0 0 1px 0;}}.home-box>:nth-child(-n+3){width:33.33% !important;flex-grow:999 !important;}.home-box>*>:nth-last-child(2){height:30px;background:var(--theme-color-2);font-size:16px;line-height:30px;}.home-box>*>:nth-last-child(2) a{display:inline-block;width:6em;height:30px;color:#fff;text-align:center;font-size:16px;}.home-box>*>:nth-last-child(2) a.A5{float:right;}.home-box>*>:nth-last-child(2)>a:first-child{background:var(--theme-color-3);}.home-box>* li a{display:block;overflow:hidden;padding:0 5px;color:#000;white-space:nowrap;font-size:14px;line-height:25px;}.home-box>* li b{margin:0 -1px;color:#000 !important;}.home-box>* li span{float:right;}.home-box>:first-child>label{position:absolute;z-index:2;display:inline-block;width:12em;height:30px;font-size:16px;}.home-box>:first-child>input{display:none;}.home-box .tabs .moving_bg{position:absolute;width:6em;height:30px;background:var(--theme-color-3);transition:0.5s;user-select:none;}.home-box>:first-child>input:checked~div .moving_bg{transform:translateX(100%);}.home-box .tabs .tab_item{position:relative;float:left;color:#fff;}.home-box .tabslider{width:200%;white-space:nowrap;transition:0.5s;}.home-box>:first-child>input:checked~div .tabslider{transform:translateX(-50%);}.home-box .tabslider ul{display:inline-block;overflow:hidden;margin-right:-4px;width:50%;}.home-box .fPic{width:calc(100% * var(--pic-number));height:100%;white-space:nowrap;transition:1s;transform:translateX(calc(-100% / var(--pic-number) * var(--pic-index)));--pic-number:1;--pic-index:0;}.home-box .fPic .fcon{position:relative;float:left;display:inline-block !important;width:calc(100% / var(--pic-number));height:100%;}.home-box .fPic .fcon img{width:100%;height:100%;object-fit:cover;}.home-box .fPic .shadow a{position:absolute;right:0;bottom:0;left:0;overflow:hidden;padding:0 0.5em;background:rgba(0,0,0,0.4);color:#fff;text-overflow:ellipsis;white-space:nowrap;font-size:14px;line-height:1.9em;}.left,.right,.right-big{margin:20px 3px 0 3px;height:min-content;background:#fff;box-shadow:0 2px 5px 0 rgba(0,0,0,0.2);}.left{min-width:9em;width:20%;}.right,.right-big{padding-bottom:0.5em;min-width:320px;width:calc(100% - 20% - 4 * 3px);}@media screen and (max-width:770px){.left,.right,.right-big{margin:0;margin-top:10px;width:100%;}}.lefttop,.righttop{padding:0 20px;height:40px;background:var(--theme-color-2);color:#fff;text-align:center;font-size:16px;line-height:40px;}.righttop a{float:right;color:#fff;}.righttop .A1{float:left;}.left ul,.righttext,.righttext-big{padding:0 1em;}.left li,.righttext li,.righttext-big li{position:relative;overflow:hidden;line-height:3em;}.left a,.righttext li a,.righttext-big li a{display:block;overflow:hidden;color:#000;white-space:nowrap;font-size:14px;}.righttext li a,.righttext-big li a{width:calc(100% - 7em);}.righttext li span,.righttext-big li span{position:absolute;right:0;}.left span{float:right;}.left i{font-style:normal;}.newstitle,.newstime{margin:20px 0;text-align:center;}.newstitle{font-size:26px;}.newstime{color:#666;font-size:14px;}.newscontent *,.newscontent-big *{padding:0 !important;max-width:100%;text-indent:2em !important;font-size:16px !important;font-family:unset !important;line-height:1.7em !important;}.newscontent img,.newscontent-big img{display:inherit;}.newscontent td,.newscontent-big td{border:1px solid #000;}#dcms_pager{overflow:auto;padding:1em;text-align:center;white-space:nowrap;font-size:12px;}#dcms_pager a,#dcms_pager select{margin:3px;padding:0 0.5em;border:1px solid #ccc;color:#000;line-height:2em;}',
    garbageListStr: '$,jQuery,_win,_doc,slice,_head,Koala,_K,K,KK,KA,Sizzle,KClass,KEvent,Kwdom,ClassK,Knative,Qfast,TabbedContent,changeTwoDecimal,FloatAdd,FloatSub,FloatMul,FloatDiv,setCookie,deleteCookie,getCookie,get,GetQueryString,ChkObjectIsExists,renderDcmsPager,renderDcmsPager2,renderDcmsPager3,htmlArr,len,renderContentPage,jump,HtmlQueryString,renderHtmlDcmsPager,search_Onsubmit,speed,Marquee,MyMar,span_msg,scrollUp,timerID'
  }
}
