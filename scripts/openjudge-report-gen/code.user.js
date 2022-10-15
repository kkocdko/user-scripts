// ==UserScript==
// @name        OpenJudge Report Gen
// @description Generate homework report PDF automatically.
// @description:en Generate homework report PDF automatically.
// @description:zh-CN 自动生成作业报告 PDF。
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.1
// @author      kkocdko
// @license     Unlicense
// @match       *://noi.openjudge.cn/*
// ==/UserScript==
"use strict";

// https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.es.min.js

const { addFloatButton, load } = {
  addFloatButton(text, onclick) /* 20220509-1936 */ {
    if (!document.addFloatButton) {
      const host = document.body.appendChild(document.createElement("div"));
      const root = host.attachShadow({ mode: "open" });
      root.innerHTML = `<style>:host{position:fixed;top:4px;left:4px;z-index:2147483647;height:0}#i{display:none}*{float:left;padding:0 1em;margin:4px;font-size:14px;line-height:2em;color:#fff;user-select:none;background:#28e;border:1px solid #fffa;border-radius:8px;transition:.3s}[for]~:active{filter:brightness(1.1);transition:0s}:checked~*{opacity:.3;transform:translateY(-3em)}:checked+*{transform:translateY(3em)}</style><input id=i type=checkbox><label for=i>&zwj;</label>`;
      document.addFloatButton = (text, onclick) => {
        const el = document.createElement("label");
        el.textContent = text;
        el.addEventListener("click", onclick);
        return root.appendChild(el);
      };
    }
    return document.addFloatButton(text, onclick);
  },
  load([u]) /* 20221015-1031 */ {
    const el = document.head.appendChild(document.createElement("script"));
    el.src = u;
    return new Promise((r) => (el.onload = r));
  },
};

(async () => {
  await load`https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.3.0-beta.2/pdfmake.min.js`;
  pdfMake.addFonts({
    Roboto: {
      normal: `https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.3.0-beta.2/fonts/Roboto/Roboto-Regular.ttf`,
      bold: `https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.3.0-beta.2/fonts/Roboto/Roboto-Medium.ttf`,
    },
  });
  const pid = "01";
  const pdf = pdfMake.createPdf({
    defaultStyle: { font: "Roboto" },
    content: [
      {
        text: `Homework ${pid}`,
        fontSize: 20,
        alignment: "center",
        margin: [0, 20, 0, 10],
      },

      {
        layout: "noBorders", // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: ["auto", "*"],
          body: [
            [
              {
                text: `Problem ${pid}`,
                fontSize: 16,
                bold: true,
                margin: [0, 0, 0, 18],
              },
              "",
            ],
          ],
        },
      },
      {
        text: `Problem ${pid}`,
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 18],
      },
    ],
    footer: (cur, len) => ({ text: `${cur} / ${len}`, alignment: "center" }),
  });
  pdf.download();
})();
