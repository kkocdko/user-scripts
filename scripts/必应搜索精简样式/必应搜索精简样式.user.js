// ==UserScript==
// @name         必应搜索精简样式
// @description  向页面注入样式表
// @namespace    https://greasyfork.org/users/197529
// @version      0.4
// @author       kkocdko
// @license      Unlicense
// @match        *://*.bing.com/search
// @run-at       document-start
// ==/UserScript==
'use strict'

document.documentElement.insertAdjacentHTML('beforeend', `<style>

#id_h,
#b_opalpers,
#b_context {
  display: none;
}

#b_content {
  padding: 41px 0 0 0;
}

.b_scopebar {
  margin: 15px 0 0 0;
}

#est_switch {
  margin-left: 1px;
}

#sb_form {
  margin: 0 0 0 -99px;
}

body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

html,
#b_header,
#b_content {
  min-width: unset;
  width: unset;
  background: #f8f9fa;
}

.est_selected::after,
.b_searchboxForm:hover,
.b_searchboxForm {
  box-shadow: 0 2px 5px #ccc;
  border-left: none;
  border-right: none;
  border-top: none;
  border-bottom: none;
}

.est_selected::before {
  left: 0;
  bottom: -9px;
}

#sa_ul {
  box-shadow: 0 2px 5px #ccc;
}

#b_results>li {
  box-shadow: 0 2px 5px #ccc;
  border-radius: 5px;
  margin-bottom: 1em;
  padding: 0.9em 1.3em 0.5em;
}

#b_header,
#b_results {
  width: 649px;
}

#b_results>li>h2 {
  margin-bottom: 0.2em;
}

#b_results>li>div>p {
  margin-bottom: 0.2em;
}

</style>`.replace(/;/g, '!important;'))
