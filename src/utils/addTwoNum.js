function addNum(num1, num2){
  const num1len = num1.length;
  const num2len = num2.length;
  const maxlen = num2len> num1len? num2len:num1len;
  let sum = '', carry = 0;
  
  for(let i=1;i<=maxlen;i++){
    const n1 = +num1.charAt(num1len-i);
    const n2 = +num2.charAt(num2len-i); // num2.charAt(index which is not in the string) = '', +'' = 0
    let tempsum = n1+n2+carry;
    carry = tempsum/10 | 0;
    tempsum = tempsum % 10;
    if(i==maxlen && carry){
      sum = carry*10 + tempsum + sum;
    }else{
      sum = tempsum+sum;
    }
  }
  return sum;
}

console.log(addNum('99999999999999999999999999','1'))
