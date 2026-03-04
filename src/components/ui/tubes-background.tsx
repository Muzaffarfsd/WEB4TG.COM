import { useEffect, useRef } from 'react';

interface Tube {
  baseY: number;
  speed: number;
  color: string;
  glowColor: string;
  width: number;
  offset: number;
  amplitude: number;
  wavesCount: number;
  vertical: boolean;
}

const TUBES: Omit<Tube, 'baseY'>[] = [
  { speed: 0.0004, color: 'rgba(139, 92, 246, 0.25)', glowColor: 'rgba(139, 92, 246, 0.12)', width: 1.5, offset: 0, amplitude: 80, wavesCount: 2.5, vertical: false },
  { speed: 0.0006, color: 'rgba(124, 58, 237, 0.20)', glowColor: 'rgba(124, 58, 237, 0.10)', width: 2, offset: 1.2, amplitude: 100, wavesCount: 2, vertical: false },
  { speed: 0.0003, color: 'rgba(167, 139, 250, 0.18)', glowColor: 'rgba(167, 139, 250, 0.08)', width: 2.5, offset: 2.5, amplitude: 120, wavesCount: 1.8, vertical: false },
  { speed: 0.0005, color: 'rgba(139, 92, 246, 0.20)', glowColor: 'rgba(139, 92, 246, 0.09)', width: 1.8, offset: 3.8, amplitude: 90, wavesCount: 3, vertical: false },
  { speed: 0.00035, color: 'rgba(109, 40, 217, 0.15)', glowColor: 'rgba(109, 40, 217, 0.07)', width: 3, offset: 5, amplitude: 140, wavesCount: 1.5, vertical: false },
  { speed: 0.00045, color: 'rgba(139, 92, 246, 0.14)', glowColor: 'rgba(139, 92, 246, 0.06)', width: 2, offset: 0.8, amplitude: 100, wavesCount: 2.2, vertical: false },
  { speed: 0.0005, color: 'rgba(167, 139, 250, 0.16)', glowColor: 'rgba(167, 139, 250, 0.07)', width: 1.5, offset: 4.2, amplitude: 70, wavesCount: 2.8, vertical: false },
  { speed: 0.0004, color: 'rgba(124, 58, 237, 0.18)', glowColor: 'rgba(124, 58, 237, 0.08)', width: 2.2, offset: 1.8, amplitude: 110, wavesCount: 2, vertical: true },
  { speed: 0.00055, color: 'rgba(139, 92, 246, 0.14)', glowColor: 'rgba(139, 92, 246, 0.06)', width: 1.8, offset: 3, amplitude: 90, wavesCount: 2.5, vertical: true },
  { speed: 0.0003, color: 'rgba(109, 40, 217, 0.12)', glowColor: 'rgba(109, 40, 217, 0.05)', width: 2.8, offset: 5.5, amplitude: 130, wavesCount: 1.6, vertical: true },
];

export function TubesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const tubes: Tube[] = TUBES.map((t, i) => ({
      ...t,
      baseY: t.vertical
        ? (0.2 + (i - 7) * 0.3)
        : (0.1 + i * 0.11),
    }));

    const segments = 100;
    let time = 0;

    const getPoint = (tube: Tube, t: number, time: number): [number, number] => {
      const wave = Math.sin(t * Math.PI * 2 * tube.wavesCount + time * tube.speed + tube.offset) * tube.amplitude
        + Math.sin(t * Math.PI * 4 * tube.wavesCount + time * tube.speed * 0.6 + tube.offset * 2) * (tube.amplitude * 0.25);

      if (tube.vertical) {
        const baseX = w * tube.baseY;
        return [baseX + wave, t * (h + 200) - 100];
      }
      const baseY = h * tube.baseY;
      return [t * (w + 200) - 100, baseY + wave];
    };

    const drawTube = (tube: Tube) => {
      ctx.shadowBlur = 20;
      ctx.shadowColor = tube.glowColor;
      ctx.strokeStyle = tube.color;
      ctx.lineWidth = tube.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      const [sx, sy] = getPoint(tube, 0, time);
      ctx.moveTo(sx, sy);

      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const tPrev = (i - 0.5) / segments;
        const [cpx, cpy] = getPoint(tube, tPrev, time);
        const [px, py] = getPoint(tube, t, time);
        ctx.quadraticCurveTo(cpx, cpy, px, py);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const draw = () => {
      time += 1;
      ctx.clearRect(0, 0, w, h);

      tubes.forEach(drawTube);

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        draw();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
}
