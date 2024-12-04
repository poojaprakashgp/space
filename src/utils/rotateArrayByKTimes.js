const arr = [1, 2, 3, 4, 5];
const k = 2;
function rotateArryByKTimes(arr, k){
  if(arr.length==k || k===0 || arr.length<=1 || k<0)return arr;
  const res = [];let len;
  len = k%arr.length;
  console.log(len)
  for(let i=len;i<arr.length;i++){
   res.push(arr[i])
  }

  for(let i=0;i<len;i++){
   res.push(arr[i]);
  }
	return res;
}
console.log(rotateArryByKTimes(arr, k))

