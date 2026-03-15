'use client';

import { useEffect, useRef, useState } from 'react';

const IFRAME_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'unsafe-inline'; connect-src https://cdn.jsdelivr.net; img-src data: blob:">
<style>
*{margin:0;padding:0;overflow:hidden}
html,body{width:100%;height:100%;background:#000000}
canvas{display:block;width:100%;height:100%}
</style>
</head><body>
<canvas id="c"></canvas>
<script type="module">

var canvas = document.getElementById('c');

var evts=['mousemove','mousedown','mouseup','mouseenter','mouseleave',
  'touchstart','touchmove','touchend','touchcancel','click','dblclick',
  'contextmenu','pointerdown','pointermove','pointerup',
  'pointerenter','pointerleave','pointerover','pointerout'];
function block(e){e.stopImmediatePropagation();e.preventDefault();}
evts.forEach(function(ev){
  document.addEventListener(ev,block,{capture:true,passive:false});
  window.addEventListener(ev,block,{capture:true,passive:false});
  canvas.addEventListener(ev,block,{capture:true,passive:false});
});

try {
  var _origWarn = console.warn;
  console.warn = function() {
    var msg = arguments[0];
    if (typeof msg === 'string' && (msg.indexOf('WebGPU') !== -1 || msg.indexOf('WebGL') !== -1)) return;
    _origWarn.apply(console, arguments);
  };
  var mod = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
  console.warn = _origWarn;
  var TubesCursor = mod.default;

  var app = TubesCursor(canvas, {
    mouse: { disabled: true, lerp: 0 },
    cursor: { enabled: false },
    tubes: {
      count: 5,
      radius: 0.07,
      colors: ["#8B5CF6", "#7C3AED", "#A78BFA"],
      lights: {
        intensity: 150,
        colors: ["#8B5CF6", "#A78BFA", "#7C3AED"]
      }
    }
  });
  if (app && app.mouse) {
    ['x','y','lerpX','lerpY'].forEach(function(prop){
      try {
        Object.defineProperty(app.mouse, prop, {
          get: function(){ return 0; },
          set: function(){},
          configurable: true
        });
      } catch(e){}
    });
  }

} catch(e) {
  console.log('tubes1 CDN unavailable, using canvas fallback', e);

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio||1,2);
  var w = window.innerWidth, h = window.innerHeight;
  function resize(){
    w=window.innerWidth;h=window.innerHeight;
    canvas.width=w*dpr;canvas.height=h*dpr;
    canvas.style.width=w+'px';canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  window.addEventListener('resize',resize);
  var TUBES=[
    {speed:0.0004,r:139,g:92,b:246,w:4,off:0,amp:80,wc:2.5,v:false},
    {speed:0.0006,r:124,g:58,b:237,w:5,off:1.2,amp:100,wc:2,v:false},
    {speed:0.0003,r:167,g:139,b:250,w:6,off:2.5,amp:120,wc:1.8,v:false},
    {speed:0.0005,r:139,g:92,b:246,w:4.5,off:3.8,amp:90,wc:3,v:false},
    {speed:0.0004,r:124,g:58,b:237,w:5.5,off:1.8,amp:110,wc:2,v:true},
    {speed:0.00055,r:167,g:139,b:250,w:4.5,off:3,amp:90,wc:2.5,v:true}
  ];
  var tubes=TUBES.map(function(t,i){
    return Object.assign({},t,{baseY:t.v?(0.2+(i-7)*0.3):(0.1+i*0.11)});
  });
  var segs=60,time=0;
  function pt(tube,t){
    var wave=Math.sin(t*Math.PI*2*tube.wc+time*tube.speed+tube.off)*tube.amp
      +Math.sin(t*Math.PI*4*tube.wc+time*tube.speed*0.6+tube.off*2)*(tube.amp*0.25);
    if(tube.v){return[w*tube.baseY+wave,t*(h+200)-100];}
    return[t*(w+200)-100,h*tube.baseY+wave];
  }
  function buildPath(tube){
    var pts=[];for(var i=0;i<=segs;i++){pts.push(pt(tube,i/segs));}return pts;
  }
  function strokePath(pts){
    ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
    for(var i=1;i<pts.length;i++){
      var prev=pts[i-1],cur=pts[i];
      ctx.quadraticCurveTo(prev[0],prev[1],(prev[0]+cur[0])/2,(prev[1]+cur[1])/2);
    }
    ctx.lineTo(pts[pts.length-1][0],pts[pts.length-1][1]);ctx.stroke();
  }
  function drawTube(tube){
    var pts=buildPath(tube);var r=tube.r,g=tube.g,b=tube.b;
    ctx.lineCap='round';ctx.lineJoin='round';
    ctx.save();ctx.globalCompositeOperation='lighter';
    ctx.shadowBlur=35;ctx.shadowColor='rgba('+r+','+g+','+b+',0.25)';
    ctx.strokeStyle='rgba('+r+','+g+','+b+',0.05)';ctx.lineWidth=tube.w*3.5;strokePath(pts);
    ctx.shadowBlur=15;ctx.shadowColor='rgba('+r+','+g+','+b+',0.4)';
    ctx.strokeStyle='rgba('+r+','+g+','+b+',0.15)';ctx.lineWidth=tube.w*1.5;strokePath(pts);
    ctx.shadowBlur=6;ctx.shadowColor='rgba('+r+','+g+','+b+',0.6)';
    ctx.strokeStyle='rgba('+r+','+g+','+b+',0.45)';ctx.lineWidth=tube.w*0.5;strokePath(pts);
    ctx.restore();
  }
  var animId;
  function draw(){time+=1;ctx.clearRect(0,0,w,h);tubes.forEach(drawTube);animId=requestAnimationFrame(draw);}
  draw();
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){cancelAnimationFrame(animId);}else{draw();}
  });
}

<\/script>
</body></html>`;

export function TubesBackground() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const init = () => setReady(true);
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(init, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    } else {
      const timer = setTimeout(init, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const blob = new Blob([IFRAME_HTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <div
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ isolation: 'isolate', animation: 'tubesFadeIn 2s ease-out both' }}
    >
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <iframe
          ref={iframeRef}
          title="background"
          className="absolute inset-0 w-full h-full block border-0 pointer-events-none"
          style={{
            pointerEvents: 'none',
            background: '#000000',
            colorScheme: 'normal',
          }}
          sandbox="allow-scripts"
          tabIndex={-1}
          aria-hidden="true"
          inert
        />
      </div>
    </div>
  );
}
