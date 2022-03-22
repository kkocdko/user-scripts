// https://cdn.jsdelivr.net/npm/stylelint-config-recess-order@3.0.0/index.js
const module = {};
await fetch(location)
  .then((r) => r.text())
  .then((t) => eval(t));
const rules = module.exports.rules["order/properties-order"]
  .flatMap((o) => o.properties)
  .filter((e) => !e.includes(":"));

const raw = `
:host {
  position: fixed;
  top: 4px;
  left: 4px;
  z-index: 2147483647;
  height: 0;
}
#i {
  display: none;
}
* {
  float: left;
  padding: 1em;
  margin: 4px;
  line-height: 0;
  color: #fff;
  box-shadow: 0 0 0 1px #9997;
  user-select: none;
  background: #28e;
  border-radius: 8px;
  transition: 0.3s;
}
[for] ~ :active {
  background: #4af;
  transition: 0s;
}
:checked ~ * {
  opacity: 0.3;
  transform: translateY(-3em);
}
:checked + * {
  transform: translateY(3em);
}

`;

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
console.log(dist);
