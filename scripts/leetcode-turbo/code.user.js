// ==UserScript==
// @name        LeetCode Turbo
// @description Replace monaco with vanilla textarea.
// @namespace   https://greasyfork.org/users/197529
// @version     0.2.2
// @author      kkocdko
// @license     Unlicense
// @match       *://leetcode.com/problems/*
// @match       *://leetcode.cn/problems/*
// @run-at      document-start
// ==/UserScript==

const globalThis = this.unsafeWindow || this;
globalThis.requestAnimationFrame = () => {}; // just ignore the requestAnimationFrame is ok?
const fetch = globalThis.fetch;
// Object.defineProperties(globalThis, { gio: { get: () => ({}), set() {} } }); // block the https://github.com/syt123450/giojs
// https://static.leetcode.cn/lc-monaco/monaco-97aac266332974a36c55_0.34.7.js
globalThis.fetch = (input, init) => {
  // https://static.leetcode.cn/lc-monaco/monaco-stats_0.34.7.json
  if (input?.includes("/lc-monaco/monaco-stats_")) {
    return new Response(
      JSON.stringify({
        js: [
          "monaco-fake.js",
          // "monaco-97aac266332974a36c55_0.34.7.js",
          // "monaco-with-langs-8b23646125da1a61dff8_0.34.7.js",
          // "editor.worker-5b8fcf9e2261c26fa5dd_0.34.7.js",
          // "ts.worker-1ef9d1d859df7cb2c889_0.34.7.js",
        ],
        css: [],
      })
    );
  }
  //   throw Error("Monaco editor blocked.");
  // if (input?.endsWith("/submit") || input?.endsWith("/submit/"))
  //   init.body = JSON.stringify({
  //     ...JSON.parse(init.body),
  //     lang: lang.value,
  //     typed_code: editor.value,
  //   });
  return fetch(input, init);
};
/*
const question = fetch("/graphql/", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    operationName: "questionEditorData",
    variables: { titleSlug: location.pathname.split("/")[2] },
    query: `query questionEditorData($titleSlug: String!) { question(titleSlug: $titleSlug) { codeSnippets { langSlug code } } }`,
  }),
}).then((v) => v.json());
const reloadSnippets = async () => {
  const snippets = (await question).data.question.codeSnippets;
  for (const v of snippets)
    lang.appendChild(document.createElement("option")).textContent = v.langSlug;
  lang.value = localStorage.codeLang || "cpp";
  editor.value = snippets.find((v) => v.langSlug === lang.value).code;
};
const lang = document.createElement("select");
lang.style = `font: 13px / 1.3 monospace; min-width: 5em; top: -29px; left: 6em; position: absolute; border: 1px solid #7778`;
lang.onchange = (e) => {
  if (!confirm("will OVERWRITE the content in editor, continue?"))
    return e.preventDefault();
  localStorage.codeLang = lang.value;
  reloadSnippets();
};
const editor = document.createElement("textarea");
editor.spellcheck = false;
editor.style = `font: 13px / 1.3 monospace; height: 100%; width: 100%; padding: 6px; white-space: pre; outline: none`;
const replaceEditorTimer = setInterval(() => {
  const el = document.querySelector("#editor");
  if (!el) return;
  clearInterval(replaceEditorTimer);
  el.replaceWith(editor);
  editor.parentNode.insertBefore(lang, editor);
  editor.parentNode.style.overflow = "initial";
}, 200);
reloadSnippets();
*/

// make a LRU cache for getComputedStyle
/*
const cache4gcs = new Map();
const originGetComputedStyle = globalThis.getComputedStyle;
globalThis.getComputedStyle = (elt, pseudoElt) => {
  if (pseudoElt !== undefined) return originGetComputedStyle(elt, pseudoElt);
  let pair = cache4gcs.get(elt);
  const now = Date.now();
  if (pair === undefined || pair[0] + 900 < now) {
    pair = [now, originGetComputedStyle(elt, pseudoElt)];
    console.log("miss " + now);
  }
  cache4gcs.delete(elt);
  cache4gcs.set(elt, pair);
  if (cache4gcs.size > 32) {
    const keys = cache4gcs.keys();
    for (let i = 0; i < 8; i++) cache4gcs.delete(keys.next().value);
  }
  return pair[1];
};
*/
// more conservative requestAnimationFrame
/*
const cache4raf = new Map();
const originRequestAnimationFrame = globalThis.requestAnimationFrame;
globalThis.requestAnimationFrame = (callback) => {
  const k = callback.toString();
  const now = Date.now();
  const interval = 200;
  if (cache4raf.get(k) > now - interval) {
    originRequestAnimationFrame(callback);
  } else {
    setTimeout(() => {
      originRequestAnimationFrame(callback);
    }, interval);
  }
  if (cache4raf.size > 32) {
    const keys = cache4raf.keys();
    for (let i = 0; i < 8; i++) cache4raf.delete(keys.next().value);
  }
};
*/

// https://leetcode.cn/problems/intersection-of-two-arrays-ii/description/

// ublock append ||static.leetcode.cn/lc-monaco/

/* 
fetch("https://leetcode.cn/graphql/", {
  headers: { "content-type": "application/json" },
  method: "POST",
  body: JSON.stringify({
    query:
      "\n    query questionTitle($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    title\n    titleSlug\n    isPaidOnly\n    difficulty\n    likes\n    dislikes\n    categoryTitle\n  }\n}\n    ",
    variables: { titleSlug: "intersection-of-two-arrays-ii" },
    operationName: "questionTitle",
  }),
})
  .then((v) => v.text())
  .then((v) => console.log(v));

// 获取预设代码片段
fetch("https://leetcode.cn/graphql/", {
  headers: { "content-type": "application/json" },
  method: "POST",
  body: JSON.stringify({
    query:
      "\n    query questionEditorData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    codeSnippets {\n      lang\n      langSlug\n      code\n    }\n    envInfo\n    enableRunCode\n    hasFrontendPreview\n    frontendPreviews\n  }\n}\n    ",
    variables: { titleSlug: "intersection-of-two-arrays-ii" },
    operationName: "questionEditorData",
  }),
})
  .then((v) => v.json())
  .then((v) => console.log(v));

fetch("https://leetcode.cn/graphql/", {
  headers: { "content-type": "application/json" },
  method: "POST",
  body: JSON.stringify({
    query:
      "\n    query questionContent($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    content\n    editorType\n    mysqlSchemas\n    dataSchemas\n  }\n}\n    ",
    variables: { titleSlug: "intersection-of-two-arrays-ii" },
    operationName: "questionContent",
  }),
});

fetch("https://leetcode.cn/graphql/", {
  headers: { "content-type": "application/json" },
  method: "POST",
  body: JSON.stringify({
    query:
      "\n    query questionTranslations($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    translatedTitle\n    translatedContent\n  }\n}\n    ",
    variables: { titleSlug: "intersection-of-two-arrays-ii" },
    operationName: "questionTranslations",
  }),
});
*/
