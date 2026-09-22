// run on node or http://ender3v3ke.internal/favicon.ico
// proxychains node ~/misc/code/user-scripts/scripts/snippets/ender3v3ke.user.js
// const ws = new WebSocket(`ws://${location.host}:9999`);
const ws = new WebSocket(`ws://ender3v3ke.internal:9999`);
ws.onclose = ws.onerror = () => process.exit(1);
setTimeout(() => ws.readyState !== WebSocket.OPEN && process.exit(1), 1000);
setInterval(() => {
  ws.send(JSON.stringify({ ModeCode: "heart_beat", msg: new Date() }));
  ws.send(JSON.stringify({ method: "get", params: { reqProbedMatrix: 1 } }));
}, 5000);
let fan = 0; // 0 - 100
let timer = null;
ws.onmessage = (msg) => {
  if (!msg.data.includes('"modelFanPct"')) return;
  fan = JSON.parse(msg.data).modelFanPct;
  if (fan === 0) return;
  clearTimeout(timer);
  console.info(`fan = ${fan}, will be closed after 2000 ms`);
  timer = setTimeout(() => {
    console.log("fan closed");
    ws.send(JSON.stringify({ method: "set", params: { fan: 0 } }));
  }, 2000);
};
// Source Han Sans CN
