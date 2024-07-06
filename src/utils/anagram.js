function areAnagrams(str1, str2) {
  // Remove any non-alphabetic characters and convert to lowercase
  const cleanString = (str) => str.replace(/[^\w]/g, '').toLowerCase();
  
  str1 = cleanString(str1);
  str2 = cleanString(str2);

  // If lengths are different, they cannot be anagrams
  if (str1.length !== str2.length) {
    return false;
  }

  // Create a frequency counter for the first string
  const charCount = {};

  for (let char of str1) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Subtract the frequencies based on the second string
  for (let char of str2) {
    if (!charCount[char]) {
      return false; // If a character is not found or goes below zero, not an anagram
    }
    charCount[char] -= 1;
  }
  // If all counts are zero, they are anagrams
  return true;
}

// Example usage
console.log(areAnagrams('listen', 'sillnt')); // true
console.log(areAnagrams('hello', 'world')); // false
console.log(areAnagrams('triangle', 'integral')); // true
console.log(areAnagrams('evil', 'vile')); // true
