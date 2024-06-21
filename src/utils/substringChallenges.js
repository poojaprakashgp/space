function longestsunstr(s){
 let map = Array(128).fill(0);
 let count=0, end=0, begin=0, d=0, head=0;
 while(end<s.length){
   if(map[s.charCodeAt(end++)]++==0)count++;
   while(count>2){
      if(map[s.charCodeAt(begin++)]--==1){

      count--}
   }
   
    if (end - begin > d) {
            d = end - begin;
            head = begin;
        }
 }
 console.log(head, d, s.substring(head, head+d))
 return d
}

console.log(longestsunstr("acbbcdjas")) //logestsubstring with two distinct charector


function longestsunstrWithoutRepeatingChar(s){
 let map = Array(128).fill(0);
 let count=0, end=0, begin=0, d=0, head=0;
 while(end<s.length){
   if(map[s.charCodeAt(end++)]++>0)count++;
   while(count>0){
      if(map[s.charCodeAt(begin++)]-->1){

      count--}
   }
   
    if (end - begin > d) {
            d = end - begin;
            head = begin;
        }
 }
 console.log(head, d, s.substring(head, head+d))
 return d
}

console.log(longestsunstrWithoutRepeatingChar("acbbcdjas"))
