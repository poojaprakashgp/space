function curry(fn) {
  return function partial() {
    console.log(fn.length, fn, arguments.length, arguments)
    if (arguments.length >= fn.length) {
      return fn.apply(this, arguments);
    }

    var partialArgs = Array.prototype.slice.call(arguments);
    console.log("par", partialArgs)
    var bindArgs = [this].concat(partialArgs);
    console.log("binding args")
    return partial.bind.apply(partial, bindArgs);
  };
}
