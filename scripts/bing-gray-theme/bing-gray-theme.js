// ==UserScript==
// @name         BingGrayTheme
// @name:zh-CN   必应搜索灰色主题
// @description  Show search results as cards, color similar to the settings page of MS Edge
// @description:zh-CN  以卡片形式展示搜索结果，配色类似于MSEdge的设置页面
// @namespace    https://greasyfork.org/users/197529
// @version      0.5.2
// @author       kkocdko
// @license      Unlicense
// @match        *://*.bing.com/search
// @run-at       document-start
// ==/UserScript==
"use strict";

document.documentElement.insertAdjacentHTML(
  "beforeend",
  `<style>

.b_logoArea,
#id_h,
#b_content > aside,
#b_footer {
  display: none;
}

body {
  --card-shadow: 0px 1.6px 3.6px rgba(0, 0, 0, 0.13),
    0px 0.3px 0.9px rgba(0, 0, 0, 0.11);
  min-width: unset;
  background: rgb(247, 247, 247);
}

#b_header,
#b_content {
  width: 90vw;
  min-width: unset;
  max-width: 650px;
  margin: 0 auto;
}

#b_header {
  background: none;
}

#b_header #est_switch {
  margin-left: 0;
}

#b_header .est_selected {
  box-shadow: var(--card-shadow);
}

#b_header .est_selected::before {
  bottom: -10px;
  left: 0;
  border: none;
}

#b_header .est_selected::after {
  border: none;
  box-shadow: none;
}

#b_header #sb_form,
#b_header .b_searchboxForm {
  width: 100%;
}

#b_header .b_searchboxForm {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border: none;
  box-shadow: var(--card-shadow);
}

#b_header #sb_form_q {
  flex-grow: 1;
  width: unset;
}

#b_header #sb_go_par {
  float: right;
}

#b_header #sb_form_q ~ :not(#sw_as) {
  top: 0;
}

#b_header #sw_as {
  width: 100%;
}

#b_header .sa_drw {
  box-shadow: var(--card-shadow);
}

#b_header .b_scopebar {
  margin-left: 0;
}

#b_content {
  padding-left: 0;
}

#b_content > main > * {
  box-sizing: border-box;
  width: 100%;
}

#b_results {
  display: grid;
  gap: 15px;
  margin-top: 3px;
}

#b_results > li {
  margin: 0;
  padding: 15px 20px 10px;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: var(--card-shadow);
}

#b_results > li > h2 {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#dict_ans {
  border: none;
}

</style>`.replace(/;/g, "!important;")
);
