class CustomPromise{ 

  constructor(executor){
    this.state = "pending";
    this.value = undefined;
    this.handlers = [];
    
    try{
       executor(this.resolve.bind(this), this.reject.bind(this))
    }catch(error){
       this.reject(error)
    }
  }
  
  resolve(value){
   if(this.state !== 'pending') return;
   this.state = "finished";
   this.value = value;
   this.handlers.forEach(handler=>this.executeHandler(handler))
  }
  
  reject(error){
   if(this.state !== 'pending') return;
   this.state = "rejected";
   this.value = error;
   this.handlers.forEach(handler=>this.executeHandler(handler))
  }
  
  then(onFullfill, onFailur){
    return new CustomPromise((resolve, reject)=>{
       this.addHandler({
        onFullfill: onFullfill?(result)=> resolve(onFullfill(result)): resolve,
        onFailur: onFailur?(result)=> reject(onFailur(result)): reject
       })
    })
  }
  
  addHandler(handler){
    if(this.state=="pending"){
    this.handlers.push(handler)
    }else{
    this.executeHandler(handler);
    }
  }
  
  executeHandler(handler){
    if(this.state == 'finished'){
      handler.onFullfill(this.value)
    }else if(this.state == "rejected"){
    	handler.onFailur(this.value)
    }
  }
  
}

const promise = new CustomPromise((resolve, reject) => {
  setTimeout(() => {
    const success = true; // Simulated success condition
    if (success) {
      resolve('Data fetched successfully');
    } else {
      reject('Failed to fetch data');
    }
  }, 2000); // Simulate a 2-second delay
});
promise.then(
  (result) => {
    console.log('Success:', result);
    return 'Next step';
  },
  (error) => {
    console.error('Error:', error);
  }
).then(
  (result) => {
    console.log('Chained then:', result);
  }
).catch(
  (error) => {
    console.error('Catch:', error);
  }
);
