const arrayLikeObject = {
  length: 0, // To track the number of elements

  // Push method
  push(item) {
    this[this.length] = item;
    this.length++;
  },

  // Pop method
  pop() {
    if (this.length === 0) {
      return undefined; // If no items, return undefined like an array
    }
    const lastItem = this[this.length - 1];
    delete this[this.length - 1];
    this.length--;
    return lastItem;
  }
};

// Example usage:
arrayLikeObject.push('apple');
arrayLikeObject.push('banana');
console.log(arrayLikeObject); // { '0': 'apple', '1': 'banana', length: 2 }

arrayLikeObject.pop(); // Removes 'banana'
console.log(arrayLikeObject); // { '0': 'apple', length: 1 }
