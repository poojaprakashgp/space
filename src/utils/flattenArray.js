let arr = [1,3,[4,6, [2]], [[[23]]]];

function flattenArr(arr, result=[]){
  for(let i=0;i<arr.length;i++){
    if(Array.isArray(arr[i])){
        flattenArr(arr[i], result);
    }else{
      result.push(arr[i])
    }
  }
  return result
}
console.log(flattenArr(arr))

let arr = [1, 3, [4, 6, [2]], [[[23]]]];

function flattenArr(arr) {
  const result = [];
  const stack = [];

  for(let i=arr.length-1;i>=0;i--){
    stack.push(arr[i])
  }
 
  while (stack.length) {
    const value = stack.pop();
   
    if (Array.isArray(value)) {
      stack.push(...value);
    } else {
      result.push(value);
    }
  }

  return result;
}

console.log(flattenArr(arr)); // Output: [1, 3, 4, 6, 2, 23]

  Array.prototype.myflat = function (depth = 1) {
    const result = [];
    const flatten = (arr, depth) => {
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i]) && depth > 0) {
          flatten(arr[i], depth - 1);
        } else {
          result.push(arr[i]);
        }
      }
    };

    flatten(this, depth); // `this` refers to the array instance
    return result;
  };
