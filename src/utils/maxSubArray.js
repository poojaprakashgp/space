
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
function maxSubArray(arr){
 let max = arr[0], cursum = arr[0];
 for(let i=1;i<arr.length;i++){
  cursum = Math.max(arr[i], cursum+arr[i]);
  max = Math.max(cursum, max)
 }
 return max;
}

const findPairs = (arr, k) => {
  const set = new Set(arr);
  const result = [];
  arr.forEach((num) => {
    if (set.has(num + k)) result.push([num, num + k]);
  });
  return result;
};

console.log(findPairs([1, 7, 5, 9, 2, 12, 3], 2));
// Output: [[1, 3], [5, 7], [7, 9],[3, 5]]
