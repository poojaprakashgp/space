const generateColor = () => {
let letters ="ABCEDEF0123456789";
const len =6;let color = '#';

for(let i=0;i<len;i++){
  color = color+ letters[Math.floor(Math.random() * letters.length)]
}
return color
}

console.log("===", generateColor())
