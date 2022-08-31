let sum = 0;
require("child_process")
  .execSync("ps -aux | grep chrome")
  .toString()
  .trim()
  .split("\n")
  .forEach((v) => (sum += v.replace(/\s+/g, ",").split(",")[5] - 0));
console.log(sum / 1024);

// const currying = (v) => {
//   const arr = [v];
//   const f = (v) => {
//     if (v === undefined) {
//       let sum = 0;
//       for (const e of arr) sum += e;
//       return sum;
//     } else {
//       arr.push(v);
//       return f;
//     }
//   };
//   return f;
// };

// console.log(currying(1)(2)(3)());
