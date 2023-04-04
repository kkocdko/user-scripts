// ==UserScript==
// @name        Show Key
// @description Display the key you pressed.
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.1
// @author      kkocdko
// @license     Unlicense
// @match       *://*/*
// ==/UserScript==
"use strict";
const host = document.body.appendChild(document.createElement("div"));
const root = host.attachShadow({ mode: "open" });
root.innerHTML = `<style>
  :host {
    position: fixed;
  }
  div {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 2147483647;
    font-size: 20px;
    text-shadow: 1px 1px #fff, 1px -1px #fff, -1px 1px #fff, -1px -1px #fff;
    user-select: none;
    pointer-events: none;
    font-family: monospace;
  }
  span {
    line-height: 2;
    padding: 0 0.5em;
    margin: 4px;
    display: inline-block;
    box-shadow: 0 1px 5px 1px #888;
    border-radius: 8px;
    background: #fff;
  }
</style>`;

// <div><span>Ctrl</span> + <span>M</span></div>
// <div><span>Shift</span> + <span>U</span></div>
// keyboard layout
const serial = new Map(); // (code, stamp)
const div = root.appendChild(document.createElement("div"));
const names = {};
for (const c of [...Array(10).keys()]) names[`Digit${c}`] = c;
for (const c of [...Array(26).keys()].map((v) => String.fromCharCode(v + 65)))
  names[`Key${c}`] = c;
names.ControlLeft = names.ControlRight = "Ctrl";
names.ShiftLeft = names.ShiftRight = "Shift";
names.AltLeft = names.AltRight = "Alt";
names.BracketRight = "]";
names.BracketLeft = "[";
names.Slash = "/";
names.Backquote = "`";
const refresh = () => {
  const pressed = [
    ...new Set(
      [...serial.keys()].map((v) => {
        if (!names[v]) {
          names[v] = v;
          console.log(`showkeydown: unknown key [ ${v} ]`);
        }
        return names[v];
      })
    ).values(),
  ];
  div.innerHTML = pressed.map((name) => `<span>${name}</span>`).join(" + ");
};
addEventListener("keydown", ({ code }) => {
  serial.set(code, Date.now());
  refresh();
});
addEventListener("keyup", ({ code }) => {
  serial.delete(code);
  refresh();
});
