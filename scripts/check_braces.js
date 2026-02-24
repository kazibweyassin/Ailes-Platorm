const fs=require('fs');
const lines=fs.readFileSync('C:/Users/Admin/PROJECTS/Ailes-Platorm/app/sponsor/page.tsx','utf8').split(/\r?\n/);
const pairs={'{':'}','(':')','[':']'};
let stack=[];
lines.forEach((line,i)=>{
  for(const ch of [...line]){
    if(pairs[ch]) stack.push([ch,i+1]);
    else if(Object.values(pairs).includes(ch)){
      if(stack.length===0) console.log('Unmatched closing',ch,'at',i+1);
      else{
        const [o,ln]=stack.pop();
        if(pairs[o]!==ch) console.log('Mismatch',o,'at',ln,'closed by',ch,'at',i+1);
      }
    }
  }
});
if(stack.length) stack.forEach(([o,ln])=>console.log('Unclosed',o,'at',ln));
console.log('done');
