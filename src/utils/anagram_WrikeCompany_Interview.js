// Please read through the task and write the code needed to solve it. Ensure that the tests are passing. In addition, you can leave a to-do note about edge cases that might not be covered. Act as you are writing production code, do not rush.


/*

*** ANAGRAMS ***

Anagram is a word or phrase that is created from the same letters (including their count) as the base string. Letter case, spaces and punctuation is ignored.  

Some anagrams:

"evil" = "vile"
"a gentleman" = "elegant man"
"silent" = "listen"

Create a function that checks if two provided strings are anagrams of each other; return true or false. We expect an effective solution in terms of speed and memory. Estimate your solution using O notation

Example
Input: "silent", "listen"
Output: true

*/


const isAnagram = (s1, s2) => {
  //please put y
  let str1 = s1.split(' ').join('')
  let str2 = s2.split(' ').join('')
  if(str1.length!== str2.length){
   return false;
  }
  const map = new Map();
  
  for(let i=0;i<str1.length;i++){
     if(map.has(str1[i])){
        map.set(str1[i], ((map.get(str1[i]) ) +1) )
     }else{
       map.set(str1[i], 1);
     }
  }
console.log([...map])
  for(let i=0;i<str2.length;i++){
    if(map.has(str2[i])){
      map.set(str2[i], (map.get(str2[i])-1))
      if(map.get(str2[i]) == 0){
       map.delete(str2[i]);
      }
     }else{
       return false;
     }
  }

  if(map.size == 0){
   return true
  }

  return false;
}

console.log(isAnagram("the eyes", "they see")); // should be true
console.log(isAnagram("dormitory", "dirty room")); // should be true
console.log(isAnagram("pass", "asap")); // should be false
console.log(isAnagram("stopper", "poster")); // should be false



