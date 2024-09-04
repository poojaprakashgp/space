function curry(fn) {
  let parentargs = fn.length;
  return function curried(...args){
    console.log(arguments.length, parentargs)
    if( args.length >= parentargs ){
        return fn.call(this, ...args)
    }else{
       return function(...moreargs){
          return curried.apply(this, args.concat(moreargs))
       }
    }
  }
}

const join = (a, b, c) => {
   return `${a}_${b}_${c}`
}
const curriedJoin = curry(join)
console.log(curriedJoin(1, 2, 3) )// '1_2_3'
console.log(curriedJoin(1)(2, 3)) // '1_2_3'
console.log(curriedJoin(1, 2)(3) )// '1_2_3'
//Debounce: Executes the function only once, after a specified delay, when the event stops triggering.
//Throttling: Executes the function at regular intervals, even if the event continues to trigger.

function throttle(func, limit) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

// Usage
const handleResize = throttle(() => {
  console.log('Resizing window...');
}, 1000);

window.addEventListener('resize', handleResize);

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Usage
const handleSearch = debounce((event) => {
  console.log('Searching:', event.target.value);
}, 500);

document.getElementById('search-input').addEventListener('input', handleSearch);
