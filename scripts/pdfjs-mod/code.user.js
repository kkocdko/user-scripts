// ==UserScript==
// @name        PDFJS Mod
// @description Hide top bar etc.
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.0
// @author      kkocdko
// @license     Unlicense
// @match       *://127.0.0.1:9005/*
// ==/UserScript==
"use strict";

addEventListener("keypress", ({ key }) => {
  if (key == "]") viewerContainer.scrollBy(0, innerHeight / 3);
  if (key == "[") viewerContainer.scrollBy(0, innerHeight / -3);
  if (key == "=") PDFViewerApplication.pdfViewer.currentScale += 0.01;
  if (key == "-") PDFViewerApplication.pdfViewer.currentScale -= 0.01;
});

setTimeout(() => {
  PDFViewerApplication.pdfViewer.textLayerMode = 0;
  // PDFViewerApplication.pdfViewer.renderer = "svg";
}, 100);

document.lastChild.appendChild(document.createElement("style")).textContent = `

.toolbar:not(:hover) {
  opacity: 0;
}

#viewerContainer {
  top: 0;
  filter: brightness(0.7) contrast(3) hue-rotate(180deg) invert(1);
}

.pdfViewer .page {
  margin: 0;
  overflow: hidden;
  border: 0;
  border-top: 1px solid #777;
}

`.replace(/;/g, "!important;");
