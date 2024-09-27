const isNaN = function {
  if (!Number.isNaN) {
    Number.isNaN = function(value) {
      return value !== value;
    };
  }
}

isNan('12')
// This polyfill ensures a reliable check for NaN without the coercion issues of the global isNaN. You should prefer Number.isNaN in modern code as it behaves in a more predictable way.
