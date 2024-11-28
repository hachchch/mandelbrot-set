const canvas=document.querySelector(".canvas");
const ctx=canvas.getContext("2d");
let rMin=-1
let rMax=1 //実部の最大値
let iMin=-1 //虚部の最小値
let iMax=1 //虚部の最大値
var dots=[];
let scale=1;
var dotization=0.5;
var size=4**dotization;
var offset=[canvas.width/2,canvas.height/2];
//繰り返す回数の上限
const N=1000;
function draw(offsetx,offsety){
ctx.clearRect(0,0,canvas.width,canvas.height);
var pt=Date.now();
if(dotization!=0){
size=4**dotization;
offsetx=(offsetx-canvas.width/(2*scale));
offsety=(offsety-canvas.height/(2*scale));
console.log("ドット作成開始");
var pt1=Date.now();
dots=[];
for(let K=0; K<canvas.width; K+=size){
for(let k=0; k<canvas.height; k+=size){
    dots.push({
        cx:((K/scale)+offsetx)+size/2,
        cy:((k/scale)+offsety)+size/2,
        x:K,
        y:k
    });
}
}
console.log(`ドット終了(${Date.now()-pt1}ミリ秒)`);
console.log("描画開始");
pt=Date.now();
for(const d of dots){
const cR=rMin+(d.cx/canvas.width)*(rMax-rMin)
const cI=iMin+(d.cy/canvas.height)*(iMax-iMin)
    //収束判定
    let zR=0;
    let zI=0;
    let i=0; 
    d.n=0;
    while(i<N){
        if((zR**2)+(zI**2)>2**2){
            //発散
        break;
        }
    d.n++;
    const ZI=cI+2*zR*zI;
    zR=cR+(zR**2)-(zI**2);
    zI=ZI;
        i++;
    }
    ctx.fillStyle = (d.n === N) ? 'black' : `hsl(255, 100%, ${(d.n/N)*100}%)`;
    ctx.beginPath()
    ctx.lineTo(d.x,d.y);
    ctx.lineTo(d.x+size,d.y);
    ctx.lineTo(d.x+size,d.y+size);
    ctx.lineTo(d.x,d.y+size);
    ctx.lineTo(d.x,d.y);
    ctx.fill()
    ctx.closePath()
}
}else{
console.log("描画開始");
//なるべく軽量化するために
offsetx=(offsetx-canvas.width/(2*scale));
offsety=(offsety-canvas.height/(2*scale));
for(let K=0; K<canvas.width; K+=1){
for(let k=0; k<canvas.height; k+=1){
    /*プロパティ*/
    let x=((K/scale)+offsetx)+1/2;
    let y=((k/scale)+offsety)+1/2;
const cR=rMin+(x/canvas.width)*(rMax-rMin)
const cI=iMin+(y/canvas.height)*(iMax-iMin)
    //収束判定
    let zR=0;
    let zI=0;
    let i=0;
    while(i<N){
        if((zR**2)+(zI**2)>4){
            //発散
        break;
        }
    const ZI=cI+2*zR*zI;
    zR=cR+(zR**2)-(zI**2);
    zI=ZI;
    i++;
    }
    ctx.fillStyle = (i === N) ? 'black' : `hsl(255, 100%, ${100*i/N}%)`;  
    ctx.beginPath()
    ctx.lineTo(K,k);
    ctx.lineTo(K+1,k);
    ctx.lineTo(K+1,k+1);
    ctx.lineTo(K,k+1);
    ctx.lineTo(K,k);
    ctx.fill()
    ctx.closePath()
}
}
}
console.log(`描画終了(${Date.now()-pt}ミリ秒)`);
}
draw(canvas.width/2,canvas.height/2);
canvas.addEventListener("click",(e)=>{
    let dx=e.offsetX-canvas.width/2;
    let dy=e.offsetY-canvas.height/2;
    console.log(dx/scale,dy/scale);
    offset=[offset[0]+(dx/scale),offset[1]+(dy/scale)];
    draw(offset[0],offset[1]);
});
window.addEventListener("keyup",(e)=>{
    if(e.code==="KeyL"){
    scale=scale*2;
    draw(offset[0],offset[1]);
    }
    if(e.code==="KeyO"){
        dotization+=0.5;
        draw(offset[0],offset[1]);
    }
    if(e.code==="KeyP"){
        if(dotization!=0){
            dotization-=0.5;
            draw(offset[0],offset[1]);
        }
    }
    if(e.code==="KeyJ"){
    scale=scale*0.5;
    draw(offset[0],offset[1]);
    }
});
