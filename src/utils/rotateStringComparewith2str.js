const s1 = 'abc';
const s2 = 'bca'; // Example of a rotated string
const numberOfRotate = 1;

function compareRotatedStr(t1, t2, numRotate) {
  const len = t1.length;

  // Check if lengths are equal, otherwise return false
  if (len !== t2.length) return false;

  // Normalize the number of rotations
  const effectiveRotations = numRotate % len;

  // Create a rotated version of t1 (clockwise or to the right)
  const rotatedString = t1.slice(len - effectiveRotations) + t1.slice(0, len - effectiveRotations);

  // Return if the rotated string matches t2
  return rotatedString === t2;
}

// Usage
const result = compareRotatedStr(s1, s2, numberOfRotate);
console.log(result); // Output: true




