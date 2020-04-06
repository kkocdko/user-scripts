// ==UserScript==
// @name         BingSearchMaterialTheme
// @name:zh-CN   必应搜索Material主题
// @description  Show search results as cards, follow Material Design
// @description:zh-CN  以卡片形式展示搜索结果，遵循Material Design
// @namespace    https://greasyfork.org/users/197529
// @version      0.6.0
// @author       kkocdko
// @license      Unlicense
// @match        *://*.bing.com/search
// @run-at       document-start
// ==/UserScript==
"use strict";

document.documentElement.insertAdjacentHTML(
  "beforeend",
  `<style>

#sb_clt,
.b_logoArea,
#id_h,
#b_pole,
#b_content > aside,
#b_footer {
  display: none;
}

body {
  --card-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
    0 1px 3px 1px rgba(60, 64, 67, 0.15);
  min-width: unset;
  background: rgb(248, 249, 250);
}

#b_header,
#b_content {
  width: 90vw;
  min-width: unset;
  max-width: 680px;
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
}

#b_header .est_selected::after {
  border: none;
  box-shadow: none;
}

#b_header #sb_form {
  width: 100%;
}

#b_header #sb_form_q {
  flex-grow: 1;
  width: unset;
}

#b_header .b_searchboxForm {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border: none;
  box-shadow: var(--card-shadow);
}

#b_header #sb_form_q ~ :not(#sw_as) {
  top: 0;
  width: 22px;
  height: 22px;
  margin: 0 10px;
  padding: 0;
  text-align: center;
}

#b_header #sb_form_q ~ #sb_go_par {
  width: unset;
  height: unset;
  margin: 0;
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
  padding-top: 35px;
  padding-left: 0;
}

#b_results {
  display: grid;
  gap: 15px;
  width: unset;
  margin-top: 5px;
}

#b_results > li {
  margin: 0;
  padding: 14px 19px;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: var(--card-shadow);
}

#b_results > li > h2 {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#b_results .b_caption {
  padding-bottom: 0;
}

#b_results #lMapContainer {
  border: none;
  box-shadow: none;
}

#b_results #lMapContainer .dynMap {
  width: unset;
}

#b_results #dict_ans {
  padding-top: 0;
  border: none;
}

  </style>`.replace(/;/g, "!important;")
);
