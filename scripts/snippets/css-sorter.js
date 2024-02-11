// https://registry.npmmirror.com/$
const url = "/stylelint-config-recess-order/4.6.0/files/groups.js";
const module = {};
eval(await (await fetch(url)).text());
const rules = new Map(
  module.exports
    .flatMap((o) => o.properties)
    .filter((e) => !e.includes(":"))
    .map((k, i) => [k, i])
);
document.body.innerHTML = `<style>body{display:grid;gap:8px;height:calc(100vh - 20px)}</style><textarea id=$i></textarea><textarea id=$o readonly></textarea>`;
$i.oninput = () => {
  let o = "";
  const block = [];
  for (const line of $i.value.split("\n")) {
    if (line.endsWith(";")) {
      block.push(line);
    } else {
      if (block.length != 0) {
        const idx = (e) => rules.get(e.split(":")[0].trim()) ?? -1;
        block.sort((a, b) => idx(a) - idx(b));
        o += block.join("\n") + "\n";
        block.length = 0;
      }
      o += line + "\n";
    }
  }
  $o.value = o;
};
