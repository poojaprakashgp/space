var Inp = "Welcome to interview" ;
//| Out - "emocleW ot weivretni"

Inp='  Hello   world!   '
function reversesentence(){
  let result = '', word='';
  for(let i=Inp.length-1;i>=0;i--){
    if(Inp[i]== ' '){
     if(word){
      result = word+ Inp[i]+ result;
      word='';
     }
    }else{
     word = word + Inp[i]
    }
  }
  
  return (word+ ' '+ result).trim();
}

console.log(reversesentence())
