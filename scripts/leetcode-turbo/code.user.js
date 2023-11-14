// ==UserScript==
// @name        LeetCode Turbo
// @description Replace monaco with vanilla textarea.
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.2
// @author      kkocdko
// @license     Unlicense
// @match       *://leetcode.com/problems/*
// @match       *://leetcode.cn/problems/*
// @run-at      document-start
// ==/UserScript==
"use strict";

const globalThis = this.unsafeWindow || this;
const originFetch = globalThis.fetch;
const textarea = document.createElement("textarea");
textarea.style =
  "font-family: monospace; height: 100%; width: 100%; padding: 6px 10px; white-space: pre; outline: none;";
const replaceEditorTimer = setInterval(() => {
  try {
    document.querySelector("#editor").replaceWith(textarea);
    clearInterval(replaceEditorTimer);
  } catch (_) {}
}, 500);
globalThis.fetch = (input, init) => {
  if (input?.includes("/lc-monaco/") || input?.includes("/monaco-tm/")) {
    throw Error("Monaco editor blocked.");
  }
  if (input?.endsWith("/submit") || input?.endsWith("/submit/")) {
    init.body = JSON.stringify({
      ...JSON.parse(init.body),
      typed_code: textarea.value,
    });
  }
  return originFetch(input, init);
};
const titleSlug = location.href.split("/problems/")[1].split("/")[0];
fetch("https://leetcode.cn/graphql/", {
  headers: { "content-type": "application/json" },
  method: "POST",
  body: JSON.stringify({
    operationName: "questionEditorData",
    variables: { titleSlug },
    query: `
      query questionEditorData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          codeSnippets {
            langSlug
            code
          }
        }
      }
    `,
  }),
})
  .then((v) => v.json())
  .then((v) => {
    textarea.value = v.data.question.codeSnippets.find(
      (v) => v.langSlug == "cpp"
    ).code;
  });

// more conservative requestAnimationFrame
// const originRequestAnimationFrame = globalThis.requestAnimationFrame;
// let rafCounter = 0;
// let rafBoost = false;
// globalThis.addEventListener("pointermove", () => {
//   rafBoost = true;
// });
// globalThis.requestAnimationFrame = (callback) => {
//   // if (rafBoost || rafCounter === 0) {
//   originRequestAnimationFrame(callback);
//   // } else {
//   setTimeout(() => {
//     originRequestAnimationFrame(callback);
//   }, 900);
//   // }
//   rafCounter = (rafCounter + 1) % 4;
// };

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
