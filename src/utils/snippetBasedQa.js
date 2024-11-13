var length = 10;
function fn(){
console.log(this.length, arguments.length, )
}
var obj = {
length:5,
name:'poja',
getName: function(f){
console.log(this.name, this.length)
}
}
//obj.getName(fn,3, 43, 5435);
const a = obj.getName;
a()


(function(){
console.log(1)
setTimeout(()=>(function(){console.log(2)})())
console.log(3)
})()

function cun(){
const a=b=c=1;
/* above line can be written as below 
c=1;
b=c;
const a=b;
*/
}
cun();
console.log(typeof a, typeof b, typeof c)

let dummy={
  price:199,
  get_price:function(){
   return this.price
  }
}
let r = Object.create(dummy); // r will not have direct props of dummy instead 
// r will be having prototype of dummy means when things not found in r it will look into dummy properties, so when you try to add prop which is there in dummy to r it get added as r's direct propety but still even after delete of r's direct property it will have dummy properties like price
r.price = 299;
delete r.price;
console.log(r.get_price())
