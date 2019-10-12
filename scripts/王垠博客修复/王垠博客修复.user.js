// ==UserScript==
// @name         王垠博客修复
// @description  使得王垠博客页面调用的资源能正常加载
// @namespace    https://greasyfork.org/users/197529
// @version      0.2
// @author       kkocdko
// @license      Unlicense
// @match        *://www.yinwang.org/*
// @run-at       document-body
// ==/UserScript==
'use strict'

document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/http:/g, '')
