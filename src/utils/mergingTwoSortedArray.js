let arr1 = [1,4,8] , arr2= [2, 3,4, 5, 6, 7];
 
 let len = arr1.length> arr2.length ? arr1.length:arr2.length;
 
let i=0,j=0, merge = [];

while(i<arr1.length && j< arr2.length){
if(arr1[i]<arr2[j]){
 merge.push(arr1[i]);
 i++
}else{
merge.push(arr2[j]);
 j++
}
}

while(i<arr1.length){
merge.push(arr1[i]);
i++;
}

while(j<arr2.length){
merge.push(arr2[j]);
j++;
}

console.log(merge)
