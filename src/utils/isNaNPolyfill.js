if (!Number.isNaN) {
  Number.isNaN = function (value) {
    return value !== value;
  };
}

// Example 1: Non-NaN value
console.log(Number.isNaN(123));    // false
console.log(Number.isNaN('123'));  // false

// Example 2: NaN value
console.log(Number.isNaN(NaN));    // true

// Example 3: Coercion issues in global isNaN
console.log(isNaN('123abc'));      // true (string is coerced)
console.log(Number.isNaN('123abc'));// false (no coercion)
