let board=[],score=0,energy=0,level=1,selected=null;const size=8;const root=document.getElementById("board");
function randomItem(){return ITEMS[Math.floor(Math.random()*ITEMS.length)]}
function create(){board=[];for(let y=0;y<size;y++){board[y]=[];for(let x=0;x<size;x++)board[y][x]=randomItem()}draw()}
function draw(){root.innerHTML="";board.forEach((r,y)=>r.forEach((v,x)=>{let e=document.createElement("div");e.className="cell";e.innerHTML=v;e.onclick=()=>clickCell(x,y);root.appendChild(e)}));scoreEl();}
function scoreEl(){document.getElementById("score").textContent=score;document.getElementById("energy").textContent=energy;document.getElementById("level").textContent=level}
function clickCell(x,y){if(!selected){selected=[x,y];root.children[y*8+x].classList.add("selected");return}let [a,b]=selected;if(Math.abs(a-x)+Math.abs(b-y)==1){[board[b][a],board[y][x]]=[board[y][x],board[b][a]];if(find()){remove();drop();fill();score+=100;energy+=100}}selected=null;draw()}
function find(){for(let y=0;y<8;y++)for(let x=0;x<6;x++)if(board[y][x]==board[y][x+1]&&board[y][x]==board[y][x+2])return true;return false}
function remove(){for(let y=0;y<8;y++)for(let x=0;x<6;x++)if(board[y][x]==board[y][x+1]&&board[y][x]==board[y][x+2])board[y][x]=board[y][x+1]=board[y][x+2]=""}
function drop(){for(let x=0;x<8;x++){let c=board.map(r=>r[x]).filter(Boolean);for(let y=7;y>=0;y--)board[y][x]=c.pop()||""}}
function fill(){for(let y=0;y<8;y++)for(let x=0;x<8;x++)if(!board[y][x])board[y][x]=randomItem()}
document.getElementById("restart").onclick=()=>{score=energy=0;create()};create();