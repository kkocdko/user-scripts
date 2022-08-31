const load = async ([u]) => eval(await (await fetch(u)).text());
await load`https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js`;
const encrypt = (str, key) => {
  const words = CryptoJS.enc.Utf8.parse(str);
  const cfg = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
  return btoa(CryptoJS.AES.encrypt(words, CryptoJS.MD5(key), cfg).toString());
};
const checkIn = async (id, authentication) => {
  const formWid = "a5e94ae0b0e04193bae67c86cfd6e223";
  const userId = `AM@1273972164`;
  const submitToken = await fetch(
    `http://dc.just.edu.cn/dfi/formOpen/saveFormView?formWid=${formWid}&userId=${userId}`,
    { method: "POST", headers: { authentication } }
  )
    .then((v) => v.json())
    .then((v) => v.data.submitToken);
  const data = {
    dataMap: {
      INPUT_L11NMC9H: id.toString(), // 学工号
      LOCATION_L1OELUCJ: "江苏省", // 位置(定位)
      RADIO_L11NMCA8: "", // 学习工作地域:长山|梦溪|张家港|校外
      RADIO_L11NMCAA: "正常",
      RADIO_L1RTT90Y: "正常",
      RADIO_L11NMCAC: "绿码", // 健康码状态:绿码|黄码|红码
      RADIO_L11NMCAF: "绿码", // 行程码状态:绿码|黄码|橙码|红码
      RADIO_L3O2U7WJ: "否",
      RADIO_L11NMCAJ: "否",
      INPUT_L11NMCAO: "36",
      INPUT_L11NMCAM: "36",
      RADIO_L11NMCAK: "是", // 是否居住校内:是|否
      RADIO_L15XZ9SA: "否", // 是否从外地返回:是|否
      INPUT_L1BG7AIY: "", // 从外地返回路径
      RADIO_L1MVAKG2: "是", // 48小时核酸检测:是|否
      RADIO_L3JT1W1T: "加强针", // 疫苗接种情况:未接种|未完成|完成|加强针
      RADIO_L1WY3PV5: "承诺",
    },
    formWid,
    userId,
    submitToken,
  };
  const body = encrypt(JSON.stringify(data), "zntb666666666666");
  const url = `http://dc.just.edu.cn/dfi/formData/saveFormSubmitDataEncryption`;
  const init = { method: "POST", headers: { authentication }, body };
  console.log(Number(id), await (await fetch(url, init)).text());
};
const list = [
  `220123492084 eyJ0eX...`,
];
for (const entry of list) await checkIn(...entry.split(" "));
// token = `sessionStorage.jwToken` on http://dc.just.edu.cn
// search `formData/saveFormSubmitDataEncryption` in `umi.js`, dump data
