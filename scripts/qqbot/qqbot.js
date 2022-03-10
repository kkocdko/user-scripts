import WebSocket from "ws";
import fetch from "node-fetch";

const get = (url, type) => fetch(url).then((e) => e[type]());
const dateDiff = (d) => ((new Date(d) - new Date()) / 864e5).toFixed(3);

const replies = new Map();
replies.set("呜", "呜");
replies.set("你说对吧", "啊对对对");
replies.set("运行平台", '["go-cqhttp", "nodejs"]');

/** @param {WebSocket.MessageEvent} */
const onmessage = async ({ data: event, target: ws }) => {
  event = JSON.parse(event);
  if (!event?.message?.startsWith(`[CQ:at,qq=${event.self_id}]`)) return;
  const say = (str) => {
    const data = {
      action: "send_group_msg",
      params: { group_id: event.group_id, message: `[BOT] ` + str },
    };
    ws.send(JSON.stringify(data));
  };
  const msg = event.message.replace(/.*]\s*/, "");
  if (["乌克兰", "俄罗斯", "俄乌"].some((s) => msg.includes(s))) {
    say("嘘！");
    return;
  } else if (msg.startsWith("暑假倒计时")) {
    say(`距离 2022 年暑假还有 ${dateDiff("2022.07.11")} 天`);
  } else if (msg.startsWith("高考倒计时")) {
    say(`距离 2022 年高考还有 ${dateDiff("2022.06.07 09:00")} 天`);
  } else if (msg.startsWith("kk单身多久了")) {
    say(`kk已经连续单身 ${-dateDiff("2003.03.25 06:54")} 天了`);
  } else if (msg.startsWith("吟诗")) {
    const r = await get("https://v1.jinrishici.com/all.json", "json");
    say(r.content);
  } else if (msg.startsWith("比特币") || msg.startsWith("BTC")) {
    const r = await get(`https://chain.so/api/v2/get_info/BTC`, "json");
    say(`比特币当前价格 ${r.data.price.slice(0, -5)} 美元`);
  } else if (msg.startsWith("垃圾分类")) {
    const i = msg.split(" ").pop();
    const u = `https://api.muxiaoguo.cn/api/lajifl?m=${i}`;
    const t = await get(u, "json").data.type;
    say(t ? `${i} ${t}` : `鬼知道 ${i} 是什么垃圾呢`);
  } else if (msg.startsWith("聊天")) {
    const i = msg.split(" ").pop();
    const u = `http://api.api.kingapi.cloud/api/xiaoai.php?msg=${i}`;
    say((await get(u, "text")).split("\n")[2]);
  } else if (msg.startsWith("设置回复")) {
    replies.set(...msg.split(" ").slice(-2));
  } else {
    say(replies.get(msg.split(" ").pop()) ?? "未知指令");
  }
};
new WebSocket("ws://127.0.0.1:6700").onmessage = (e) =>
  onmessage(e).catch((err) => console.error(err));

// ({ city_code: "101190301", city_name: "镇江" });
// http://t.weather.sojson.com/api/weather/city/101190301
