const currying = (v) => {
  const arr = [v];
  const f = (v) => {
    if (v === undefined) {
      let sum = 0;
      for (const e of arr) sum += e;
      return sum;
    } else {
      arr.push(v);
      return f;
    }
  };
  return f;
};

console.log(currying(1)(2)(3)());
