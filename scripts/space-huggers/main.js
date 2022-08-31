// webrtc
import { createServer } from "http";
import { WebSocketServer } from "ws";
import * as ws from "ws";
import * as fs from "fs";

const inPage = async () => {
  const ws = new WebSocket(`ws://${location.hostname}:9799`);
  ws.onmessage = (e) => {
    console.log(e.data);
  };
};
const pageSuffix = `\n<script>(${inPage.toString()})()</script>`;

createServer((_, res) => {
  res.setHeader("content-type", "text/html;charset=utf8");
  res.writeHead(200).end(fs.readFileSync("index.html").toString() + pageSuffix);
}).listen(9798);

new WebSocketServer({ port: 9799 }).on("connection", (ws) => {
  // onkeydown = (e) => console.log(e.keyCode);
  const map = new Map([
    ["z", 122],
    ["x", 120],
    ["c", 99],
    ["\x1B[A", 38], // up
    ["\x1B[B", 40], // down
    ["\x1B[C", 39], // right
    ["\x1B[D", 37], // left
  ]);
  console.log("started, press '\\' to exit");
  process.stdin.setRawMode(true);
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (key) => {
    if (key === "\\") [console.log(">>> exit"), process.exit()];
    ws.send(map.get(key));
  });
});
