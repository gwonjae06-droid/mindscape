/* MINDSCAPE ambient night-sky: requestAnimationFrame with low allocations.
   60fps target; the browser/device determines actual frame rate. */
(()=>{
 'use strict';
 const canvas=document.getElementById('arcanaStars');
 if(!canvas)return;
 const ctx=canvas.getContext('2d',{alpha:true});
 if(!ctx)return;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 let w=1,h=1,dpr=1,points=[],raf=0,last=0,visible=!document.hidden;
 let cursorX=0,cursorY=0;
 function sprite(rgb){
  const sprite=document.createElement('canvas');sprite.width=sprite.height=32;
  const sc=sprite.getContext('2d'),c=16;
  const g=sc.createRadialGradient(c,c,0,c,c,16);
  g.addColorStop(0,'rgba('+rgb+',.95)');
  g.addColorStop(.18,'rgba('+rgb+',.38)');
  g.addColorStop(1,'rgba('+rgb+',0)');
  sc.fillStyle=g;sc.fillRect(0,0,32,32);
  sc.strokeStyle='rgba('+rgb+',.82)';
  sc.lineWidth=.55;sc.beginPath();sc.moveTo(16,6);sc.lineTo(16,26);sc.moveTo(7,16);sc.lineTo(25,16);sc.stroke();
  return sprite;
 }
 const gold=sprite('255,223,162'),violet=sprite('196,169,252');
 let randomSeed=43921;
 function random(){randomSeed=(1664525*randomSeed+1013904223)>>>0;return randomSeed/4294967296;}
 function resize(){
  w=window.innerWidth;h=window.innerHeight;dpr=Math.min(window.devicePixelRatio||1,1.5);
  canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));
  canvas.style.width=w+'px';canvas.style.height=h+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const count=reduce.matches?45:(w<650?48:86);
  points=Array.from({length:count},(_,i)=>({
   x:random()*w,y:random()*h,r:.45+random()*.9,
   dx:(random()-.5)*.18,dy:(random()-.5)*.11,
   phase:random()*Math.PI*2,speed:.35+random()*1.1,
   color:i%3===0?gold:violet,scale:i%19===0?2.3:1
  }));
  paint(0,0);
 }
 function paint(time,dt){
  ctx.clearRect(0,0,w,h);
  ctx.globalCompositeOperation='screen';
  for(let i=0;i<points.length;i++){
   const p=points[i];
   if(!reduce.matches){
    p.x+=p.dx*dt*55;p.y+=p.dy*dt*55;
    if(p.x>w+15)p.x=-15;if(p.x< -15)p.x=w+15;
    if(p.y>h+15)p.y=-15;if(p.y< -15)p.y=h+15;
   }
   const twinkle=reduce.matches?.65:.5+.5*Math.sin(time*p.speed+p.phase);
   const alpha=.12+twinkle*.32;
   const size=(p.scale>1?32:18)*p.scale;
   ctx.globalAlpha=alpha;
   ctx.drawImage(p.color,p.x-size/2+cursorX*.014,p.y-size/2+cursorY*.014,size,size);
  }
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 }
 function animate(timestamp){
  raf=0;
  if(!visible||reduce.matches)return;
  const seconds=timestamp*.001,dt=last?Math.min(.034,Math.max(0,(timestamp-last)*.001)):0;
  last=timestamp;
  paint(seconds,dt);
  raf=requestAnimationFrame(animate);
 }
 function start(){
  cancelAnimationFrame(raf);
  raf=0;last=0;
  if(!reduce.matches&&visible)raf=requestAnimationFrame(animate);
  else paint(0,0);
 }
 window.addEventListener('resize',()=>{resize();start();},{passive:true});
 window.addEventListener('pointermove',e=>{cursorX=e.clientX-w/2;cursorY=e.clientY-h/2;},{passive:true});
 document.addEventListener('visibilitychange',()=>{visible=!document.hidden;start();});
 if(reduce.addEventListener)reduce.addEventListener('change',()=>{resize();start();});
 resize();start();
})();
