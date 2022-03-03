// ==UserScript==
// @name        QQ BOT
// @match       *://127.0.0.1:6700/*
// @version     0.1
// @grant       GM_xmlhttpRequest
// @require     http://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/dayjs.min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/plugin/duration.min.js
// ==/UserScript==

dayjs.extend(dayjs_plugin_duration);

const replies = new Map();
replies.set("呜", "呜");
replies.set("你说对吧", "啊对对对");
replies.set("运行平台", '{"go-cqhttp": "v1.0.0-rc1"}');

new WebSocket("ws://127.0.0.1:6700").onmessage = async (event) => {
  const e = JSON.parse(event.data);
  if (e.post_type !== "message") return;
  if (e.message_type !== "group") return;
  if (!e.message.trim().startsWith(`[CQ:at,qq=${e.self_id}]`)) return;

  const say = (str) => {
    const o = {
      action: "send_group_msg",
      params: { group_id: e.group_id, message: `[BOT] ` + str },
    };
    event.target.send(JSON.stringify(o));
  };
  const request = (url, responseType) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url,
        responseType,
        onload: (e) => resolve(e.response),
        onerror: reject,
      });
    });
  };

  const msg = e.message.replace(/.*]\s*/, "");

  if (["乌克兰", "俄罗斯", "俄乌"].some((s) => msg.includes(s))) {
    say("嘘！");
    return;
  } else if (msg.startsWith("暑假倒计时")) {
    const v = dayjs.duration(dayjs("20220711").diff(dayjs()));
    say(`距离 2022 年暑假还有 ${v.asDays().toFixed(3)} 天`);
  } else if (msg.startsWith("高考倒计时")) {
    const v = dayjs.duration(dayjs("20220607 09:00").diff(dayjs()));
    say(`距离 2022 年高考还有 ${v.asDays().toFixed(3)} 天`);
  } else if (msg.startsWith("吟诗")) {
    const r = await request("http://api.muxiaoguo.cn/api/Gushici", "json");
    say(r.data.min_content);
  } else if (msg.startsWith("kk单身多久了")) {
    const v = dayjs.duration(dayjs().diff(dayjs("20030325 06:54")));
    say(`kk已经连续单身 ${v.asDays().toFixed(3)} 天了`);
  } else if (msg.startsWith("比特币") || msg.startsWith("BTC")) {
    const r = await request(`http://chain.so/api/v2/get_info/BTC`, "json");
    say(`比特币当前价格 ${r.data.price.slice(0, -5)} 美元`);
  } else if (msg.startsWith("垃圾分类")) {
    const i = msg.split(" ").pop();
    const u = `http://api.muxiaoguo.cn/api/lajifl?m=${i}`;
    say(i + " " + (await request(u, "json")).data.type ?? "不是垃圾");
  } else if (msg.startsWith("聊天")) {
    const i = msg.split(" ").pop();
    const u = `http://api.api.kingapi.cloud/api/xiaoai.php?msg=${i}`;
    say((await request(u, "text")).split("\n")[2]);
  } else if (msg.startsWith("设置回复")) {
    replies.set(...msg.split(" ").slice(-2));
  } else if (replies.has(msg.split(" ").pop())) {
    say(replies.get(msg.split(" ").pop()));
  } else {
    say(`未知指令: [${msg}]`);
  }
};

// ({ city_code: "101190301", city_name: "镇江" });
// http://t.weather.sojson.com/api/weather/city/101030100
