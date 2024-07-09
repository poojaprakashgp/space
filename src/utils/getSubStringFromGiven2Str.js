function GetSubstring(input1, input2) {
    if (!input1 || !input2) {
        return "";
    }
    
    // Count frequency of characters in input2
    let charCountInput2 = new Map();
    for (let char of input2) {
        charCountInput2.set(char, (charCountInput2.get(char) || 0) + 1);
    }
    
    // Variables to track minimum substring
    let minLength = Infinity;
    let minStart = 0;
    let charCount = input2.length;
    
    // Sliding window variables
    let left = 0;
    let start = 0;
    let end = 0;
    
    while (end < input1.length) {
        // If the current character in input1 is needed
        if (charCountInput2.has(input1[end])) {
            if (charCountInput2.get(input1[end]) > 0) {
                charCount--;
            }
            charCountInput2.set(input1[end], charCountInput2.get(input1[end]) - 1);
        }
        
        // Move end pointer to the right
        end++;
        
        // When all characters are found, try to minimize the window from the left
        while (charCount === 0) {
            // Update minimum length if smaller window found
            if (end - start < minLength) {
                minLength = end - start;
                minStart = start;
            }
            
            // Move start pointer to the right
            if (charCountInput2.has(input1[start])) {
                charCountInput2.set(input1[start], charCountInput2.get(input1[start]) + 1);
                if (charCountInput2.get(input1[start]) > 0) {
                    charCount++;
                }
            }
            start++;
        }
    }
    
    // Return the shortest substring containing all characters from input2
    if (minLength === Infinity) {
        return "";
    } else {
        return input1.substring(minStart, minStart + minLength);
    }
}

// Example usage:
let input1 = "My Name is Fran";
let input2 = "rim";
console.log(GetSubstring(input1, input2));  // Output: "me is Fr"
