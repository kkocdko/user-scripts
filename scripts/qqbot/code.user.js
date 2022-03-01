// ==UserScript==
// @name        QQ BOT
// @match       *://127.0.0.1:6700/*
// @version     0.1
// @grant       GM_xmlhttpRequest
// @require     http://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/dayjs.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/plugin/duration.min.js
// ==/UserScript==

dayjs.extend(dayjs_plugin_duration);
document.title = "QQ BOT";
const ws = new WebSocket("ws://127.0.0.1:6700/");
const replies = new Map();
replies.set("呜", "呜");
replies.set("你说对吧", "啊对对对");
replies.set("运行平台", '{"go-cqhttp": "v1.0.0-rc1"}');
ws.onmessage = async (e) => {
  e = JSON.parse(e.data);
  const enabled =
    e.post_type === "message" &&
    e.message_type === "group" &&
    e.message.trim().startsWith("[CQ:at,qq=3423596160]") &&
    [
      201408600 /* 计协 */, 757224637 /* 两开花 */, 619263282 /* Note */,
    ].includes(e.group_id);
  if (!enabled) return;
  const say = (str) => {
    const req = {
      action: "send_group_msg",
      params: { group_id: e.group_id, message: `[BOT] ` + str },
    };
    ws.send(JSON.stringify(req));
  };
  const msg = e.message.replace(/^\[.+?\]\s*/, "");

  if (msg.startsWith("暑假倒计时")) {
    const v = dayjs.duration(dayjs("20220711").diff(dayjs()));
    say(`距离 2022 年暑假还有 ${v.asSeconds()} 秒`);
  } else if (msg.startsWith("高考倒计时")) {
    const v = dayjs.duration(dayjs("20220607 09:00").diff(dayjs()));
    say(`距离 2022 年高考还有 ${v.asDays().toFixed(3)} 天`);
  } else if (msg.startsWith("吟诗")) {
    const r = await fetch("https://api.muxiaoguo.cn/api/Gushici");
    say((await r.json()).data.min_content);
  } else if (msg.startsWith("kk单身多久了")) {
    const v = dayjs.duration(dayjs().diff(dayjs("20030325 06:54")));
    say(`kk已经连续单身 ${v.asDays().toFixed(3)} 天了`);
  } else if (msg.startsWith("比特币") || msg.startsWith("BTC")) {
    const r = await fetch(`https://chain.so/api/v2/get_info/BTC`);
    const d = (await r.json()).data;
    say(`比特币当前价格 ${Number(d.price).toFixed(3)} 美元`);
  } else if (msg.startsWith("垃圾分类")) {
    const query = msg.split(" ").pop();
    const r = await fetch(`https://api.muxiaoguo.cn/api/lajifl?m=${query}`);
    say(query + " " + ((await r.json()).data.type ?? "不是垃圾"));
  } else if (msg.startsWith("聊天")) {
    // send("不想说话……");
    const input = msg.split(" ").pop();
    // to avoid cros issue
    GM_xmlhttpRequest({
      url: `http://api.api.kingapi.cloud/api/xiaoai.php?msg=${input}`,
      responseType: "text",
      onload: ({ response: output }) => say(output.split("\n")[2]),
    });
  } else if (msg.startsWith("设置回复")) {
    replies.set(...msg.split(" ").slice(-2));
  } else if (replies.has(msg.split(" ").pop())) {
    say(replies.get(msg.split(" ").pop()));
  } else {
    say(`未知指令: ${msg}`);
  }
};

console.log("LOADED");

// {
//   "id": 231,
//   "pid": 15,
//   "city_code": "101190301",
//   "city_name": "镇江",
//   "post_code": "212000",
//   "area_code": "0511",
//   "ctime": "2019-07-11 17:31:32"
// }
//   http://t.weather.sojson.com/api/weather/city/101030100
