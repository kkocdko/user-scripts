// const load = async ([u]) => eval(await (await fetch(u)).text());
// await load`https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js`;
const CryptoJS = require("./cryptojs.js");
const encrypt = (str) => {
  const words = CryptoJS.enc.Utf8.parse(str);
  const keyWords = [1947217763, 1550666530, -1301273701, -1041739952];
  const key = { words: keyWords, sigBytes: 16 }; // CryptoJS.MD5("zntb666666666666")
  const cfg = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
  return btoa(CryptoJS.AES.encrypt(words, key, cfg).toString());
};
const checkIn = async (id, password) => {
  const ticket = await fetch(
    "http://ids2.just.edu.cn/cas/login?service=http%3A%2F%2Fdc.just.edu.cn%2F%23%2F",
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "user-agent": "Chrome",
      },
      redirect: "manual",
      method: "POST",
      body: `username=${id}&password=${password}&execution=2b7869af-463d-478b-827d-e301aaff31c1_ZXlKaGJHY2lPaUpJVXpVeE1pSjkuWjJOa1NEazBaazV1VDBwaFNVeHRjM05YVEhNdlZtOTVOMk5wUW1aWk1taE1ZMUZqUnpJNVUybE9URFpLY2pSQmMzZEZTMEp3VUd4U2JYUnRXV0p0YVVWRFMyTm5UWE5yZWxWamMwMUpiV1prV0ZkbFVrRm5TRE0yUlZKb2MwcHRVblJzVW5Cc1EwUkRWVGRIV25rM2FFUmhUVTV0ZERaV0szRjRhRU0zTlVJNGVXeDNlbEJrTkVsb0wwUkdUbVpUYldoT1NtdG9kVFU0TW5GTWJ6ZHBja1JqWTJOVFVVc3dlSFZGTkRsYWVXcHhOQ3RYUzBOYWNGRllVSFJOUTFSV1dXeENTSFZ3WlZwTmFqaEhUa0p0T1hKME4zVldTQ3MwYlhWMWRrWktZVTVxZFZoQ0wwWkZSRXBhVG5SNFdsSnZPWFptYW1od1NYQTJlazFVVkZkTk9HVXhWRnByYXpoTlVta3hXa2MzVVVNMVptVlVWbGN3YTFwQ1UwOTFkbkJqY1ZaWUwwUXZNM2g0WldwblpYUTNkMVo0YWpST1MwUjFZa1EwYlN0RWIyUk1lbVJ6UzB0RUszUnFWbUZ5WnpkR2FGbG9NVmRYVURVM1dWUmxTamQ2VTJGQlRHZERVWFZ3TVRCT2VVUk9OMFl3UjI5RFNqUTJNMDFxZVdkSVdXcDRlRzlFVVRoTFZVUkROazV4WTJjelFqTXhWRkEyWWxKeWR6UmtZemhDTHpWUU1ra3ZaREEyWmpsMk1tOXZWbFpDVFZNd2VYQndObEpXUkdveU9TOXpRVzlwVEVKa04yaDZWbkJFV0VaREswdGlka2RhYjJsdVFpdEhiemxoTXpScmFsVkViR1ZIY2xOeFYybFVaQ3MxT1ROUVpHcEpWWFpyTTFwcU1HTjJjbTE2YUcxbVdXWm1RMmxJZVRkVFpGaG5NMEpYV2xNelZHdHVSbVpPVm1GMk1uTXhhMU01WVU4ck5XVnlVVTlwZDJwVmJGTmliWGQwWkZRMVNGVkVLMngyT0c1UlNTdDJWVnBJTjFCMWFHRk9hSEZZUmpoMVlWWTFhMDVoY1daeFVGSnNlbmw1UWxFMVR6ZHZXV2wyTkVac1dtaGFhVkl5T0hOR2NXVmhNME5RT0hvcmRYaHVUbWRYYTIwMlJUZHNabWhwTmpsSk1IUXhXbkZJTWpaNk4xTk9jRmROVm1aeFpGbzNVSEk1UW5acVdrSnpWRGMzWTB4MFdXUkxNVkE0VkhKUlEzQlJVVkV6U0hoQmJHSkdhWFZCY1U5UWRYaFdkR2g2TTNNMmFIWkRhR1J4VGpZclJXMDJiSFZ1VEVoVEwxQlRaRGxXTmk4cmJHeGxaazF3ZWpnM0syeHRhSHBJZEM5QlRtcE9UblZaV2swck1HODBOM0pWVWtwUVRrbHdTVk4yTjNSdlZVTkhXV1JCZW1SV2RraEZUMXAxT0dvemFVRXZZVXhZT0hONk5YWnNWVGg2YTNWNFNuTkNRVTFPYUdreFUxcFNjelZTUnk5YVRXWlVNelZSY0VFMVExQnhWbUl6V2s0MmJXZEJZa2RVVVhkSVVtODVLMHRvT1ROcUszTldSVEpqZUc5clNVeDNZMUYyY2xaTFpWaGlibWxNZEc1RllUZzVWRFUyWTFOdVpqTk9hRlY1VlRScVIwMXFWbGQ1ZFhWWWVGWnZWV052YTNGU1puWndlRWxsSzNSSWFEaHJUbk5sZVhSTE5tVkZjRkk1WXprNFEybG5lazlxWm14eGNHYzVWV0psU1ZCWlNqZHdhSE5oUkZwR1YzRlVlRmhTWTJ4cU56SjJkMlJzYTNaTFFqQXlOVWRDU2poSVkzSnBiMklyYVRGRmNuUk5UVTlTUmtwYVpHaEVaVXhFYUVOMlNrc3ZTREJHZUd0SU1HZHdMM1JTTmtFd1dUWkNOMGsxY0Vjd2RVTjVkVUZxZWtNM1UwVXhibGt2WW1WS2QxazBlREE1WkhsMFJVRkxaMWRGTUM5dk1XczVVR000VFN0WE5ISmxjV1ZvUTBWSVRUWTFUM1E0VkdsTGVpdFVURTR3YVRCRFZIcFRia2RoV0ZGNWJUTXJhRUpMUjNvdmVqbEtNSFpQTlhOQlVIcFphRGMzVW5GVmN6UnBSamQ0TmpKR1ZFdERXVVpvYVdnMlpWVnRVMUU0YVVweFJ6azFabFV5VVVkS2QxTXpPWFZOZG5rM1JrSktZbGx1Y2xKcWNEaEhRMmR3Ylc1UU5qVklVRzVKV0dneFVXaDRTamM1VVVGQ01IUlRWRGxVTUVWTFRsazFjMnMwVGtWRlpEWnlVRmhwVGl0RGFrbFVaV3RJV2paWWRVTXZVVnBsVG1KelVEQmxOMEpzVkdGd1pYSlRPRXhDYVUxaldVZENWWFV6ZW5kdWRuRjNaVEJyWW01M1RFUlRkMGhGTWpCVE1tZERPSEJMZFdwbFVWcExjV05ZUW5CT1R6WjRXSGwwWnpZclFVWkVNV2hDVjA1Q2NXcEZWWGQ1V25ablYzY3laRkp4ZVV0Rk9YbG5LMjVqTjJ4VlVIaEdjV1pIV21aYVoxZGtjM2huV0drelJtOXdiMVpsU0hSSFNXOW1ValowTDFwclduaFdOeTloUkhGamJTOXNjV2RQVmpBNGFrbHdkbk5xWlhOb04xaENkRWR4VXpKNFdFSkpXamR3Ykhjd1MwSXZXWHBSVGtkTUwyZEhjRFZ1Y21KRWJtOTFaalp2ZVd4T09FRnpjbXBDYmxCWVpVeFZLMkZzYXpWdWJHUm9WSFo1YlM4MWNrNVVNMVJIU1c5Qk1XSm9lbVpTZVdwSE1YaHpabG9yT1cxUWFXMTNZVVJOTW5VeGFHOWlUMVZPVFd3ME5sRjZWelV3T1RCYWVqWjBjWFJVWm5Sak9USTBkRTlwYVhOWlkwUTRNMFpGZWxKWFkyOW5hR2RRTUc1cU0yNHJXWFpaYUhWRmNEQTJXR2w1VTBScFVWWkxOVkZZVFU4MGVHRTBUekpGYmxodGJUWjZla013VURCWFNHaEtZblY1UkZkeVptTTBjVVo2YkVGU1dsQkxOWEZEVW5aT1JVNW5aWGx3UTJVellUWXhOMWhaVTNkeWExVlJaMFpGV0dNemFVZFBlbVZWY0U1SFpsUlhOVzFTUW5wNlpYWlNhM1l2WTB0blkyWk5iWGhxT1RJd1dTOVNZMDl0YUdSM05tUXJNbmczVjBNMWRtOTZkVEp5WkhWSk5teFhkVmR1V2k5aVUzWmFPSGR5YzFoa2QwczFObXRPTUVFM09XRXJUV2cwTUhwa1pWbExiSFJOVWxWdGFFSlhURE5CV0hkSFFWTjNZVnBIUVM5b04zWlJjVGgwTlhsUVdIQllXWFJtVW5Oa2VXUXZWV2xVZFd0M1ExQkNiMW94VXpkSlptVkdhVE5zUlZOR1lqVllTbU5sWkhnMVRETjFhbXd5ZWpFdllXMWlPSGxUUVN0NmNHMTFObXRqUVVsd1ozSk1PVE5qTWpoM00wVXJWR3RvTmtOMFFVOXpiRlpIV0VSbGNHcHRNVEZwWkN0T1dGUmlaemN6U1U5dlJXbElPVTVJUWxBeWVIWmFUV0oxTUdjelJuTTVXRk5hUVZkVU9IQjViWFpTTlVwaFRVVTJlRlF2YjNsSk5GZzRkazkxYUVSQ1oyTkdVVUZtWXl0Rk16QlhUSFJPTDJwdWJGaDVkMWhKUldsUFlrNXlZMGd2ZFU5aVZGaHNLMjFqU21Zd2NVaHFiemhpVGl0NmVuWkRjR3dyUmpjM2FIZENRa1U0ZEVGemRVaEtaRmRYUVZsV1lWQk1VbVpFV0M5U1RqVTFNMjV1YVhwVlNYWnRUVGxaTmxoaGFYWjJhR2xwVUNzNFNWUlVNMlU1ZUhsdmFXRkZiVlJOVVhwclZGSjRWR2N4VGxsbldGSlZUbVZ6YUhSeVUydE9WVXh3Tm1aTGFuQnpZM2wyU1ZKakwzQjNaMk5DVHk4NGFuUndZMFEwTm14VVpqTjJjRXhWTjBSSVl6SnZSV0YyVW1samFXVkdOMVI1VjNoM1ZUbFhXazh2ZUhoQlRGVlBkRWhPVW5OeFpWSkZjemRvTDNWV1dIRTRaMnc1ZFZVMmVYVmFNMWRhTUhaVVRYRnNURTVuVldwNE9ITkdjemhZYlhBNVZXTTFXRXRPYXpWb05EaFVPRTV4YkU1TFNFeGljSGsyVWxCUFVWRk1iazkwYTBkRVpsSkZSMmRTWjBaT2FIWkdaSEpSTjBaeU5EQXlLMDlpYjAxdGVqTTBVazlKU1c5WVUwaG5SV0pJTnpoTWVFZzBTbmRaVDFKcGEyTTFjemxRTjFKaFVIZEtZWGxEYzFGSGExTlFkek50TmtWM09VRlpka3AyYURNck1qRkpRazEyV1dodk1rdDFTVEZ6UkZwQlMwSldPRlZDUmsxMGNXTllWa2d4TWtsMmJtcERkMWRXT0VzeE5HeExjbVZFYjNOelltWkJTM2xSUjB3MFlXRkxRVEZ6UlV3eVJtUmFNRmRIYm5WcFlURXlMM1JSYVhoUlNXWlhiVEJ2V0dGMU9HRktXV296ZWtsb1pHdG5XazlQVUhCR2VtRjNaMUZKYUV0amRqWmhaQ3RaWkRrMmJESTNUM2RvWTNkU2JraHBlRVJvTVhoRmJFOXNhMnBhTTFWV2VYZ3hWVU14TVdRNGJFVkRSM0l3VlVGSFdHeERUVFJWZEhscWJIVnZPWFp5ZEVkdU1WTjZOWFExTkN0elUxWmFVbXhYVW1SUGNrRTNVWE5LWmxSbVNXOVdNbUpPVDBSSlEzbG9PVzlYWjIxUFRtWjNkbTVxU2pad1JEZE9lVlZrVkVScFJTOWxjUzgxUWt0cWN6UTJaRzF1WjBOTmFqZG1TRlJSUW1KU2NXWTJNbWsyYm1kTWFGVXZTRk5qU2t4U1lubG5LelkzTUhsVlRTOHhRa2d6V0VnMWJIZzNjbkptZVc1cmQwZzJXVEY1TlhsYVNWSjJlR04xVUdSUmJrbGpTRGhsUWtSUGFuWmtjemhVYW1jNU1qWXdWVTlLYUVod1dsWnhkRFUxSzJoMWQwSnpQUS51YVpMeWhBb0s5MXdXZTNaOHJGUW44UTJaVkJFWHRlVEJRZFBMVnM2X21mb2Z3RzJBUDQ0c1BuSTlDTUdIN3JrcnI4cjZFZkdDcVdBYjdfaXJuMnhRQQ%3D%3D&_eventId=submit&encrypted=true&loginType=1&submit=%E7%99%BB+%E5%BD%95`,
    }
  ).then((v) => v.headers.get("location").split("ticket=")[1].split("#")[0]);
  const authentication = await fetch(
    `http://dc.just.edu.cn/dfi/validateLogin?ticket=${ticket}&service=http%3A%2F%2Fdc.just.edu.cn%2F%23%2F`
  )
    .then((v) => v.json())
    .then((v) => v.data.token);
  const formWid = "a5e94ae0b0e04193bae67c86cfd6e223";
  const submitToken = await fetch(
    `http://dc.just.edu.cn/dfi/formOpen/saveFormView?formWid=${formWid}`,
    { method: "POST", headers: { authentication } }
  )
    .then((v) => v.json())
    .then((v) => v.data.submitToken);
  const data = {
    dataMap: {
      INPUT_L11NMC9H: id.toString(), // 学工号
      LOCATION_L1OELUCJ: "江苏省镇江市丹徒区", // 位置(定位)
      RADIO_L11NMCA8: "长山", // 学习工作地域:长山|梦溪|张家港|校外
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
    submitToken,
  };
  const body = encrypt(JSON.stringify(data));
  const url = `http://dc.just.edu.cn/dfi/formData/saveFormSubmitDataEncryption`;
  const init = { method: "POST", headers: { authentication }, body };
  console.log(Number(id), await (await fetch(url, init)).text());
};
const list = [
  `222210711219 <password>`, // kkocdko self
];
for (const entry of list) checkIn(...entry.split(" "));
// token = `sessionStorage.jwToken` on http://dc.just.edu.cn
// search `formData/saveFormSubmitDataEncryption` in `umi.js`, dump data
/*

# get encrypted password
open page http://jwgl.just.edu.cn:8080/sso.jsp
js: username.value='hi';checkPassLogin();console.log(password.value)

*/
