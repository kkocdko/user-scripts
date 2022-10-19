// ==UserScript==
// @name        OJCN Report Gen
// @description Generate homework report PDF automatically.
// @description:en Generate homework report PDF automatically.
// @description:zh-CN 自动生成作业报告 PDF。
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.3
// @author      kkocdko
// @license     Unlicense
// @match       *://noi.openjudge.cn/*
// ==/UserScript==
"use strict";

const cfg = {
  homeworkId: 1,
  studentName: "无名氏",
  problems: [
    "/ch0101/02",
    "/ch0101/04",
    "/ch0101/08",
    "/ch0101/09",
    "/ch0103/03",
    "/ch0103/05",
    "/ch0103/06",
    "/ch0103/08",
    "/ch0103/09",
    "/ch0103/13",
  ].map((v) => (v.endsWith("/") ? v : v + "/")),
  userId: document.querySelector("#userToolbar>li")?.textContent,
  isDev: window.ojcnrgDev || true,
};
if (!document.querySelector(".account-link") && !cfg.isDev)
  throw alert("login required");
document.lastChild.appendChild(document.createElement("style")).textContent = `
body::before{ content: ""; position: fixed; left: 40px; top: 40px; width: 6vmin; height: 6vmin; border: 8px solid #37b; border-radius: 25%; z-index: 2000; animation: spin 12s linear infinite; }
@keyframes spin { 100% { transform: rotate(3600deg); } }
`;
const { load } = {
  load([u]) /* 20221015-1031 */ {
    const el = document.head.appendChild(document.createElement("script"));
    el.src = u;
    return new Promise((r) => (el.onload = r));
  },
};
(async () => {
  await load`https://cdn.jsdelivr.net/npm/pdfmake@0.3.0-beta.3/build/pdfmake.min.js`;
  pdfMake.addFonts({
    "Noto Sans": {
      // normal: `https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@4.5.11/files/noto-sans-latin-400-normal.woff`,
      normal: `https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-sc@4.5.12/files/noto-sans-sc-chinese-simplified-400-normal.woff`,
      italics: `https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@4.5.11/files/noto-sans-latin-400-italic.woff`,
      bold: `https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@4.5.11/files/noto-sans-latin-700-normal.woff`,
    },
    "Noto Sans Mono": {
      normal: `https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-mono@4.5.11/files/noto-sans-mono-latin-400-normal.woff`,
    },
  });
  const pdfDefinition = {
    defaultStyle: { font: "Noto Sans" },
    compress: !cfg.isDev,
    info: { title: new Date().toLocaleString("zh-CN") },
    pageMargins: [50, 50, 50, 50],
    content: [
      {
        text: `Homework ${cfg.homeworkId.toString().padStart(2, "0")}`,
        fontSize: 17,
        bold: true,
        alignment: "center",
        margin: [0, 16, 0, 0],
      },
      {
        layout: "noBorders",
        fontSize: 12,
        lineHeight: 1.1,
        table: {
          headerRows: 1,
          widths: ["auto", 140, "auto", 140],
          body: [
            [
              { text: "Student ID:", bold: true, margin: [32, 1, 10, 0] },
              {
                text: `  ${cfg.userId}`.padEnd(20, " "),
                decoration: "underline",
              },
              { text: "Name:", bold: true, margin: [32, 1, 10, 0] },
              {
                text: `  ${cfg.studentName}`.padEnd(20, " "),
                decoration: "underline",
              },
            ],
          ],
        },
        margin: [0, 18, 0, 4],
      },
    ],
    footer: (cur, len) => ({
      text: `${cur} / ${len}`,
      alignment: "center",
      fontSize: 10,
      margin: [0, 8, 0, 0],
    }),
  };
  const genProblemSection = (i, path, code, record) => [
    {
      text: `Problem ${i.toString().padStart(2, "0")}`,
      fontSize: 12,
      bold: true,
      margin: [0, 24, 0, 12],
    },
    {
      text: [
        { text: "Description: ", bold: true },
        { text: "Read the problem at " },
        { text: `http://noi.openjudge.cn${path}`, italics: true },
        { text: ", try to make your program " },
        { text: "accept", italics: true },
        { text: " by the OJ system." },
      ],
      fontSize: 11,
    },
    {
      text: `My Program:`,
      fontSize: 11,
      decoration: "underline",
      decorationStyle: "double",
      margin: [0, 12, 0, 8],
    },
    {
      text: code
        .split("\n")
        .map((s) => `\u200B  ${s}`)
        .join("\n"),
      font: "Noto Sans Mono",
      fontSize: 10,
    },
    {
      text: `My Result:`,
      fontSize: 11,
      decoration: "underline",
      decorationStyle: "double",
      margin: [0, 12, 0, 8],
    },
    {
      table: {
        widths: [55, "*", "auto", 20, 36, 34, "auto", "auto", 36],
        body: [
          "提交人,题目,结果,分数,内存,时间,代码长度,语言,提交时间".split(","),
          record,
        ],
      },
      fontSize: 8,
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => "#aaa",
        vLineColor: () => "#aaa",
      },
    },
  ];
  const tasks = cfg.problems.map(async (path, idx) => {
    const [, ch, problemId] = path.split("/");
    const queryUrl = `/${ch}/status/?problemNumber=${problemId}&userName=${cfg.userId}`;
    const queryPage = await fetch(queryUrl).then((r) => r.text());
    const table = queryPage.split(/<\/?table>/g)[1];
    const entry = table.split(/<\/?tr>/).find((v) => v.includes("Accepted"));
    const record = [];
    for (let s = entry; s !== ""; ) {
      if (s.startsWith("<")) s = s.slice(s.indexOf(">"));
      let idx = s.indexOf("<");
      if (idx === -1) break;
      let v = s.slice(1, idx).trim();
      if (v) record.push(v);
      s = s.slice(idx).trim();
    }
    record[1] = { text: record[1], link: location.origin + queryUrl };
    const solutionUrl = entry.match(/(?<=language"><a href=")[^"]+/)[0];
    const solutionPage = await fetch(solutionUrl).then((r) => r.text());
    const codeExactor = document.createElement("p");
    codeExactor.innerHTML = solutionPage.match(/<pre(.|\n)+?<\/pre>/)[0];
    const code = codeExactor.textContent;
    return genProblemSection(idx + 1, path, code, record);
  });
  for (const sections of await Promise.all(tasks))
    pdfDefinition.content = pdfDefinition.content.concat(sections);
  const pdf = pdfMake.createPdf(pdfDefinition);
  if (!cfg.isDev) return pdf.download(cfg.userId);
  const iframe = document.body.appendChild(document.createElement("iframe"));
  iframe.style = `border:none;position:fixed;left:0;top:0;height:100vh;width:100vw;z-index:3000`;
  iframe.src = URL.createObjectURL(await pdf.getBlob());
})();

// document.lastChild.appendChild(document.createElement("style")).textContent = `
// table{
//   width: 100vw;
//   background: #fff;
//   position: fixed;
//   top: 0;
//   left: 0;
//   z-index: 99999;
//   box-shadow:0 0 0 20px #fff;
// }
// tr:not(:first-child){
//   opacity:0;
// }
// #footer{display:none;}
// `.replace(/;/g, "!important;");

// ~/misc/apps/miniserve -p 9973 --header cache-control:max-age=3 /home/kkocdko/misc/code/user-scripts/scripts/ojcn-report-gen
// http://127.0.0.1:9973/index.html
