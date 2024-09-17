class Emitter{
 constructor(){
  this.subscriptions = new Map();
 }
 
 subscribe(eventName, callback){
 
   if(!callback || typeof callback !== 'function'){
     throw new TypeError("callback should be a function")
   }
   
   if(!this.subscriptions.has(eventName)){
     this.subscriptions.set(eventName, new Map());
   }
   const eventSubcription = this.subscriptions.get(eventName);
   const subcriptionId = Symbol();
   eventSubcription.set(subcriptionId, callback);
   
   return { 
   release: function(){
     if(!eventSubcription.has(subcriptionId)){
      throw new Error("subscription already released")
     }
     eventSubcription.delete(subcriptionId);
   }
   }
 }
 
 emit(eventName, ...args){
  const events = this.subscriptions.get(eventName);
  if(!events){return;}
  events.forEach((ele)=> ele(...args))
 }
}

const emitter = new Emitter();
let channel = '';
const subscription = emitter.subscribe('modify', (link)=>{
 channel = link;
 console.log(channel);
})
emitter.emit('modify', 'youtube/devtools')
emitter.emit('modify', 'youtube/devtools/sdsda')

subscription.release();
console.log("====channel==", channel)
emitter.emit('modify', 'youtube/devtools/1')
//subscription.release();
console.log(channel, "after")
