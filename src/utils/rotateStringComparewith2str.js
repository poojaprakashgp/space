let s1='abc', s2='abc', numberOfRotate=1;

function compareRotatedStr(t1, t2){
  let len1 = t1.length;
  if(len1<t2.length || len1>t2.length){return false}
  if(len1 == numberOfRotate)return t1==t2;
  while(true){
  if(len1 == numberOfRotate)return t1==t2;
   let start = len1-numberOfRotate++;
    let res = '';
    for(let i=start;i<len1;i++){
      res += t1[i];
    }
    for(let i=0;i<start;i++){
     res+=t1[i];
    }
    if(res == t2){
      return true;
    }
  }
}

console.log(compareRotatedStr(s1, s2))




