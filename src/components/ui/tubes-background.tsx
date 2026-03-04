import { useEffect, useRef } from 'react';

export function TubesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const evts: string[] = [
      'mousemove','mousedown','mouseup','mouseenter','mouseleave',
      'touchstart','touchmove','touchend','touchcancel','click','dblclick',
      'contextmenu','pointerdown','pointermove','pointerup',
      'pointerenter','pointerleave','pointerover','pointerout'
    ];
    const block = (e: Event) => { e.stopImmediatePropagation(); e.preventDefault(); };
    evts.forEach(ev => {
      container.addEventListener(ev, block, { capture: true, passive: false } as any);
      canvas.addEventListener(ev, block, { capture: true, passive: false } as any);
    });

    (async () => {
      try {
        const mod = await import(
          /* @vite-ignore */
          'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
        );
        const TubesCursor = mod.default;

        const app = TubesCursor(canvas, {
          mouse: { disabled: true, lerp: 0 },
          cursor: { enabled: false },
          tubes: {
            colors: ["#8B5CF6", "#7C3AED", "#A78BFA"],
            lights: {
              intensity: 200,
              colors: ["#8B5CF6", "#A78BFA", "#7C3AED", "#6D28D9"]
            }
          }
        });

        if (app && app.mouse) {
          ['x', 'y', 'lerpX', 'lerpY'].forEach(prop => {
            try {
              Object.defineProperty(app.mouse, prop, {
                get: () => 0,
                set: () => {},
                configurable: false
              });
            } catch (_) {}
          });
        }
      } catch (e) {
        runCanvasFallback(canvas);
      }
    })();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ isolation: 'isolate' }}
      inert
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ pointerEvents: 'none', touchAction: 'none' }}
      />
    </div>
  );
}

function runCanvasFallback(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = window.innerWidth, h = window.innerHeight;

  const resize = () => {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  const TUBES = [
    { speed: 0.0004, r: 139, g: 92, b: 246, w: 4, off: 0, amp: 80, wc: 2.5, v: false },
    { speed: 0.0006, r: 124, g: 58, b: 237, w: 5, off: 1.2, amp: 100, wc: 2, v: false },
    { speed: 0.0003, r: 167, g: 139, b: 250, w: 6, off: 2.5, amp: 120, wc: 1.8, v: false },
    { speed: 0.0005, r: 139, g: 92, b: 246, w: 4.5, off: 3.8, amp: 90, wc: 3, v: false },
    { speed: 0.00035, r: 109, g: 40, b: 217, w: 7, off: 5, amp: 140, wc: 1.5, v: false },
    { speed: 0.00045, r: 167, g: 139, b: 250, w: 5, off: 0.8, amp: 100, wc: 2.2, v: false },
    { speed: 0.0005, r: 139, g: 92, b: 246, w: 4, off: 4.2, amp: 70, wc: 2.8, v: false },
    { speed: 0.0004, r: 124, g: 58, b: 237, w: 5.5, off: 1.8, amp: 110, wc: 2, v: true },
    { speed: 0.00055, r: 167, g: 139, b: 250, w: 4.5, off: 3, amp: 90, wc: 2.5, v: true },
    { speed: 0.0003, r: 109, g: 40, b: 217, w: 6, off: 5.5, amp: 130, wc: 1.6, v: true },
  ];

  interface TubeData {
    speed: number; r: number; g: number; b: number; w: number;
    off: number; amp: number; wc: number; v: boolean; baseY: number;
  }

  const tubes: TubeData[] = TUBES.map((t, i) => ({
    ...t,
    baseY: t.v ? (0.2 + (i - 7) * 0.3) : (0.1 + i * 0.11),
  }));

  const segs = 100;
  let time = 0;

  const pt = (tube: TubeData, t: number): [number, number] => {
    const wave = Math.sin(t * Math.PI * 2 * tube.wc + time * tube.speed + tube.off) * tube.amp
      + Math.sin(t * Math.PI * 4 * tube.wc + time * tube.speed * 0.6 + tube.off * 2) * (tube.amp * 0.25);
    if (tube.v) return [w * tube.baseY + wave, t * (h + 200) - 100];
    return [t * (w + 200) - 100, h * tube.baseY + wave];
  };

  const buildPath = (tube: TubeData) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= segs; i++) pts.push(pt(tube, i / segs));
    return pts;
  };

  const strokePath = (pts: [number, number][]) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1], cur = pts[i];
      ctx.quadraticCurveTo(prev[0], prev[1], (prev[0] + cur[0]) / 2, (prev[1] + cur[1]) / 2);
    }
    ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
    ctx.stroke();
  };

  const drawTube = (tube: TubeData) => {
    const pts = buildPath(tube);
    const { r, g, b } = tube;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    ctx.shadowBlur = 35;
    ctx.shadowColor = `rgba(${r},${g},${b},0.25)`;
    ctx.strokeStyle = `rgba(${r},${g},${b},0.05)`;
    ctx.lineWidth = tube.w * 3.5;
    strokePath(pts);

    ctx.shadowBlur = 15;
    ctx.shadowColor = `rgba(${r},${g},${b},0.4)`;
    ctx.strokeStyle = `rgba(${r},${g},${b},0.15)`;
    ctx.lineWidth = tube.w * 1.5;
    strokePath(pts);

    ctx.shadowBlur = 6;
    ctx.shadowColor = `rgba(${r},${g},${b},0.6)`;
    ctx.strokeStyle = `rgba(${r},${g},${b},0.45)`;
    ctx.lineWidth = tube.w * 0.5;
    strokePath(pts);

    ctx.restore();
  };

  let animId: number;
  const draw = () => {
    time += 1;
    ctx.clearRect(0, 0, w, h);
    tubes.forEach(drawTube);
    animId = requestAnimationFrame(draw);
  };
  draw();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });
}
