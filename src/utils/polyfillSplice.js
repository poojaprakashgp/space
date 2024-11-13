Array.prototype.splicee = function(start, deletecount){
let originalLen = this.length;
let newitems = [], deletedItems =[];
  const items = [];
    for (let i = 2; i < arguments.length; i++) {
      items[items.length] = arguments[i];
    }

if(start<0){
start = originalLen+start;
}
if(start>originalLen)start = originalLen;

if(deletecount>0){
  for(let i=start;i<start+deletecount;i++){
   deletedItems[deletedItems.length] = this[i];
  }
}

let temp =[], index =0;
for(let i=0;i<start;i++){
 temp.push(this[i]);
}

for(let i=0;i<items.length;i++){
 temp.push(items[i]);
}
for(let i=start+deletecount;i<originalLen;i++){
 temp.push(this[i])
}
this.length =0;
for(let i=0;i<temp.length;i++){
 this[i] = temp[i]
}
return deletedItems
}
let arr = [1,2,3,4,5,6]
console.log(arr.splicee(3, 2, 7,9), arr)
