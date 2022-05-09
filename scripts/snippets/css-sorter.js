// https://cdn.jsdelivr.net/npm/stylelint-config-recess-order@3.0.0/index.js
const module = {};
eval(await (await fetch(location)).text());
const rules = module.exports.rules["order/properties-order"]
  .flatMap((o) => o.properties)
  .filter((e) => !e.includes(":"));
document.body.innerHTML = `<style>body{display:grid;gap:8px;height:calc(100vh - 20px)}</style><textarea id=$i></textarea><textarea id=$o readonly></textarea>`;
$i.oninput = () => {
  const raw = $i.value;
  let dist = "";
  const group = [];
  for (const line of raw.split("\n")) {
    if (line.endsWith(";")) {
      group.push(line);
    } else {
      if (group.length != 0) {
        const f = (e) => rules.indexOf(e.split(":")[0].trim());
        group.sort((a, b) => f(a) - f(b));
        dist += group.join("\n") + "\n";
        group.length = 0;
      }
      dist += line + "\n";
    }
  }
  $o.value = dist;
};
