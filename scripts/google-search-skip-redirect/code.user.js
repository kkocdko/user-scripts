// ==UserScript==
// @name        Google Search Skip Redirect
// @description Replace redirect link to direct link.
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.0
// @author      kkocdko
// @license     Unlicense
// @match       *://www.google.com/search
// ==/UserScript==
document.querySelectorAll('a[href*="/url?q="]').forEach((e) => {
  const begin = e.href.indexOf("/url?q=") + "/url?q=".length;
  const end = e.href.indexOf("&", begin);
  e.href = decodeURIComponent(
    e.href.slice(begin, end === -1 ? undefined : end)
  );
});
// Why not other existing user scripts? Because others always bundled with features that I don't need.
