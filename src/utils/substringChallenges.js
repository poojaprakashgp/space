function longestsubstr(s){
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



function longestsubstr(s) {
  let map = new Map();
  let count = 0, end = 0, begin = 0, d = 0, head = 0;

  while (end < s.length) {
    if (!map.has(s[end])) {
      map.set(s[end], 0);
    }
    if (map.get(s[end]) === 0) {
      count++;
    }
    map.set(s[end], map.get(s[end]) + 1);
    end++;

    while (count > 2) {
      if (map.has(s[begin])) {
        if (map.get(s[begin]) === 1) {
          count--;
        }
        map.set(s[begin], map.get(s[begin]) - 1);
      }
      begin++;
    }

    if (end - begin > d) {
      d = end - begin;
      head = begin;
    }
  }

  console.log(head, d, s.substring(head, head + d));
  return d;
}

// Sample Input
console.log(longestsubstr("abcabcbb")); // Output: "bcb" or "bca" or any other valid substring

  


console.log(longestsubstr("acbbcdjas")) //logestsubstring with two distinct charector


function longestsubstrWithoutRepeatingChar(s) {
  let map = new Map();
  let count = 0, end = 0, begin = 0, d = 0, head = 0;

  while (end < s.length) {
    if (map.has(s[end]) && map.get(s[end]) > 0) {
      count++;
    }
    map.set(s[end], (map.get(s[end]) || 0) + 1);
    end++;

    while (count > 0) {
      if (map.has(s[begin]) && map.get(s[begin]) > 1) {
        map.set(s[begin], map.get(s[begin]) - 1);
        if (map.get(s[begin]) === 1) {
          count--;
        }
      } else {
        map.set(s[begin], map.get(s[begin]) - 1);
      }
      begin++;
    }

    if (end - begin > d) {
      d = end - begin;
      head = begin;
    }
  }

  console.log(head, d, s.substring(head, head + d));
  return d;
}

console.log(longestsubstrWithoutRepeatingChar("acbbcdjas"));
