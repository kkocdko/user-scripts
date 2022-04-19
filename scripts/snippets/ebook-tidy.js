const fs = require("fs");
let t = fs.readFileSync("ebook-tidy.bin").toString().trim();
t = t.split("\n").map((s) => s.trim().split("\t").slice(0, 2));
t = t.map(([k, s]) => [k, s.split(" x ").map((v) => (Number(v) * 4) / 10)]);
t = t.map(([k, [w, h]]) => [`/${k}"`, `/${k}" width="${w}" height="${h}"`]);
// console.log(t);
fs.readdirSync("Z:\\text_proc").forEach((n) => {
  let p = `Z:\\text_proc\\${n}`;
  let s = fs.readFileSync(p).toString();
  t.forEach(([from, to]) => s=s.replaceAll(from, to));
  fs.writeFileSync(p, s);
});
