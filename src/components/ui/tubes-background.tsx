import { useEffect, useRef } from 'react';

const IFRAME_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'">
<style>
*{margin:0;padding:0}
html,body{width:100%;height:100%;overflow:hidden;background:transparent}
canvas{display:block;width:100%;height:100%}
</style>
</head><body>
<canvas id="c"></canvas>
<script>
(function(){
  var evts=['mousemove','mousedown','mouseup','mouseenter','mouseleave',
    'touchstart','touchmove','touchend','touchcancel','click','dblclick',
    'contextmenu','wheel','pointerdown','pointermove','pointerup',
    'pointerenter','pointerleave','pointerover','pointerout'];
  function block(e){e.stopImmediatePropagation();e.preventDefault();}
  evts.forEach(function(ev){
    document.addEventListener(ev,block,{capture:true,passive:false});
    window.addEventListener(ev,block,{capture:true,passive:false});
  });

  var canvas=document.getElementById('c');
  evts.forEach(function(ev){
    canvas.addEventListener(ev,block,{capture:true,passive:false});
  });

  var ctx=canvas.getContext('2d');
  var dpr=Math.min(window.devicePixelRatio||1,2);
  var w=window.innerWidth,h=window.innerHeight;

  function resize(){
    w=window.innerWidth;h=window.innerHeight;
    canvas.width=w*dpr;canvas.height=h*dpr;
    canvas.style.width=w+'px';canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  window.addEventListener('resize',resize);

  var TUBES=[
    {speed:0.0004,color:'rgba(139,92,246,0.12)',glow:'rgba(139,92,246,0.06)',w:1.5,off:0,amp:80,wc:2.5,v:false},
    {speed:0.0006,color:'rgba(124,58,237,0.10)',glow:'rgba(124,58,237,0.05)',w:2,off:1.2,amp:100,wc:2,v:false},
    {speed:0.0003,color:'rgba(167,139,250,0.08)',glow:'rgba(167,139,250,0.04)',w:2.5,off:2.5,amp:120,wc:1.8,v:false},
    {speed:0.0005,color:'rgba(139,92,246,0.09)',glow:'rgba(139,92,246,0.045)',w:1.8,off:3.8,amp:90,wc:3,v:false},
    {speed:0.00035,color:'rgba(109,40,217,0.07)',glow:'rgba(109,40,217,0.035)',w:3,off:5,amp:140,wc:1.5,v:false},
    {speed:0.00045,color:'rgba(139,92,246,0.06)',glow:'rgba(139,92,246,0.03)',w:2,off:0.8,amp:100,wc:2.2,v:false},
    {speed:0.0005,color:'rgba(167,139,250,0.07)',glow:'rgba(167,139,250,0.035)',w:1.5,off:4.2,amp:70,wc:2.8,v:false},
    {speed:0.0004,color:'rgba(124,58,237,0.08)',glow:'rgba(124,58,237,0.04)',w:2.2,off:1.8,amp:110,wc:2,v:true},
    {speed:0.00055,color:'rgba(139,92,246,0.06)',glow:'rgba(139,92,246,0.03)',w:1.8,off:3,amp:90,wc:2.5,v:true},
    {speed:0.0003,color:'rgba(109,40,217,0.05)',glow:'rgba(109,40,217,0.025)',w:2.8,off:5.5,amp:130,wc:1.6,v:true}
  ];

  var tubes=TUBES.map(function(t,i){
    return Object.assign({},t,{
      baseY:t.v?(0.2+(i-7)*0.3):(0.1+i*0.11)
    });
  });

  var mouse={x:0,y:0,lerpX:0,lerpY:0};
  Object.defineProperty(mouse,'x',{get:function(){return 0},set:function(){},configurable:false});
  Object.defineProperty(mouse,'y',{get:function(){return 0},set:function(){},configurable:false});
  Object.defineProperty(mouse,'lerpX',{get:function(){return 0},set:function(){},configurable:false});
  Object.defineProperty(mouse,'lerpY',{get:function(){return 0},set:function(){},configurable:false});

  var segs=100,time=0;

  function pt(tube,t){
    var wave=Math.sin(t*Math.PI*2*tube.wc+time*tube.speed+tube.off)*tube.amp
      +Math.sin(t*Math.PI*4*tube.wc+time*tube.speed*0.6+tube.off*2)*(tube.amp*0.25);
    if(tube.v){return[w*tube.baseY+wave,t*(h+200)-100];}
    return[t*(w+200)-100,h*tube.baseY+wave];
  }

  function drawTube(tube){
    ctx.shadowBlur=15;ctx.shadowColor=tube.glow;
    ctx.strokeStyle=tube.color;ctx.lineWidth=tube.w;
    ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();
    var s=pt(tube,0);ctx.moveTo(s[0],s[1]);
    for(var i=1;i<=segs;i++){
      var cp=pt(tube,(i-0.5)/segs);
      var p=pt(tube,i/segs);
      ctx.quadraticCurveTo(cp[0],cp[1],p[0],p[1]);
    }
    ctx.stroke();ctx.shadowBlur=0;
  }

  var animId;
  function draw(){
    time+=1;
    ctx.clearRect(0,0,w,h);
    tubes.forEach(drawTube);
    animId=requestAnimationFrame(draw);
  }
  draw();

  document.addEventListener('visibilitychange',function(){
    if(document.hidden){cancelAnimationFrame(animId);}
    else{draw();}
  });
})();
<\/script>
</body></html>`;

export function TubesBackground() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const blob = new Blob([IFRAME_HTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none" style={{ isolation: 'isolate' }} inert>
      <iframe
        ref={iframeRef}
        title="background"
        className="absolute inset-0 w-full h-full block border-0"
        style={{
          pointerEvents: 'none',
          background: 'transparent',
          colorScheme: 'normal',
        }}
        sandbox="allow-scripts"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
