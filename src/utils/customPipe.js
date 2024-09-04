const pipe = (fns) => (x) =>
  fns.reduce((acc, fn) => {acc = fn(acc);return acc}, x);
  
  const times = (y) => (x) => x * y;
const plus = (y) => (x) => x + y;
const subtract = (y) => (x) => x - y;
const divide = (y) => (x) => x / y;
const twice = pipe([times(2)]); // equivalent to (x) => x * 2
const increment = pipe([plus(1)]); // equivalent to (x) => x + 1
const multiplyAndAdd = pipe([times(2), plus(3)]); // equivalent to (x) => x * 2 + 3
const subtractAndDivide = pipe([subtract(3), divide(4)]); // equivalent to (x) => (x - 3) / 4
console.log(twice(3)); // output: 6
console.log(increment(3)); // output: 4
console.log(multiplyAndAdd(3)); // output: 9
console.log(subtractAndDivide(3)); // output: 0
