// ==UserScript==
// @name         智学网改卷页面精简样式
// @description  向页面注入样式表
// @namespace    https://greasyfork.org/users/197529
// @version      0.2
// @author       kkocdko
// @license      Unlicense
// @match        *://*.zhixue.com/marking/marking/personal/*
// @run-at       document-start
// ==/UserScript==
'use strict'

document.head.insertAdjacentHTML('beforeend', `<style>

#div_Annotation {
  /* display: none !important; */
}

.khj_autowarp {
  width: unset;
  height: 100vh;
  padding: 0 5px;
  border: 0;
}

.map {
  height: calc(100% - 65px);
}

.mapwarp,
.mapwarp>.hd:first-child {
  height: 100%;
}

#marking_left_content {
  height: calc(100% - 40px);
  padding: 0;
}

#img_containter {
  height: 100% !important;
}

</style>`.replace(/;/g, '!important;'))
