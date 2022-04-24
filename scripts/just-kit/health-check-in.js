// cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js
eval(await (await fetch(location)).text());
const encrypt = (str, key) => {
  const words = CryptoJS.enc.Utf8.parse(str);
  const cfg = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
  return btoa(CryptoJS.AES.encrypt(words, CryptoJS.MD5(key), cfg).toString());
};
const checkIn = (id, authentication) => {
  const bodyRaw = `{"formWid":"a5e94ae0b0e04193bae67c86cfd6e223","dataMap":{"INPUT_L11NMC9H":"${id}","LOCATION_L1OELUCJ":"江苏省镇江市京口区","RADIO_L11NMCA8":"梦溪","RADIO_L11NMCAA":"正常","RADIO_L1RTT90Y":"正常","RADIO_L11NMCAC":"绿码","RADIO_L11NMCAF":"绿码","RADIO_L11NMCAJ":"否","INPUT_L11NMCAO":"36","INPUT_L11NMCAM":"36","RADIO_L11NMCAK":"否","RADIO_L15XZ9SA":"否","RADIO_L1MVAKG2":"是","RADIO_L1WY3PV5":"承诺"}}`;
  const body = encrypt(bodyRaw, "zntb666666666666");
  const url = `http://dc.just.edu.cn/dfi/formData/saveFormSubmitDataEncryption`;
  const init = { method: "post", headers: { authentication }, body };
  // return [Number(id), await (await fetch(url, init)).text()];
  return `${id} ${authentication} ${body}`;
};
const list = [
  "21221000000 eyJ0eX...",
];
// for (const entry of list) await checkIn(...entry.split(" "));
console.log(list.map((v) => checkIn(...v.split(" "))).join("\n"));
