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
