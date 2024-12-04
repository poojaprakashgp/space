const arr = [1, 2, 3, 4, 5];
const k = 6;
function rotateArryByKTimes(arr, k){
  if(arr.length==k || k===0 || arr.length<=1 || k<0 ||k>arr.length)return arr;
  const res = [];
  for(let i=arr.length-k;i<arr.length;i++){
   res.push(arr[i])
  }

  for(let i=0;i<arr.length-k;i++){
   res.push(arr[i]);
  }
	return res;
}
console.log(rotateArryByKTimes(arr, k))

