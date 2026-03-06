import { useRef, useEffect, useCallback } from 'react';
import type { Agent, Particle, IsometricOfficeProps } from './office-config';
import { buildLayout, updateAgents } from './office-agents';
import {
    drawRoom, drawArcade, drawCouch, drawVending, drawCoffeeTable,
    drawDesk, drawChair, drawPerson, drawParticle, drawConnections,
} from './office-renderer';

export const IsometricOffice = ({ niche, activeNiche, currentStage }: IsometricOfficeProps) => {
    const cvRef = useRef<HTMLCanvasElement>(null);
    const afRef = useRef(0);
    const ags = useRef<Agent[]>([]);
    const deskPos = useRef<{x: number; y: number; isOrch: boolean}[]>([]);
    const pts = useRef<Particle[]>([]);
    const clk = useRef(0);
    const pN = useRef(-1);
    const pS = useRef(-1);
    const noMo = useRef(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        noMo.current = mq.matches;
        const fn = (e: MediaQueryListEvent) => { noMo.current = e.matches; };
        mq.addEventListener('change', fn);
        return () => mq.removeEventListener('change', fn);
    }, []);

    const rebuildLayout = useCallback((W: number, H: number) => {
        const result = buildLayout(niche.agentTeam, W, H);
        ags.current = result.agents;
        deskPos.current = result.deskPositions;
    }, [niche.agentTeam]);

    useEffect(() => {
        if (activeNiche !== pN.current || currentStage !== pS.current) {
            pN.current = activeNiche; pS.current = currentStage;
            const c = cvRef.current; if (!c) return;
            const dpr = window.devicePixelRatio || 1;
            rebuildLayout(c.width / dpr, c.height / dpr);
            pts.current = []; clk.current = 0;
        }
    }, [activeNiche, currentStage, niche.agentTeam, rebuildLayout]);

    useEffect(() => {
        const cv = cvRef.current; if (!cv) return;
        const ctx = cv.getContext('2d'); if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;

        const resize = () => {
            const r = cv.getBoundingClientRect();
            cv.width = r.width * dpr; cv.height = r.height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            rebuildLayout(r.width, r.height);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(cv);
        let prev = 0;

        const animate = (ts: number) => {
            const dt = Math.min((ts - prev) / 1000, 0.05);
            prev = ts;
            clk.current += dt;
            const t = clk.current;
            const W = cv.width / dpr;
            const H = cv.height / dpr;

            ctx.clearRect(0, 0, W, H);

            const wallBot = H * 0.30;
            const floorBot = H * 0.93;
            const fH = floorBot - wallBot;
            const lL = W * 0.56, lR = W * 0.93;

            const agList = ags.current;
            const orch = agList[0];

            updateAgents(agList, t, dt, noMo.current, pts.current, niche.color, orch);

            const walkingAgents = agList.filter(a => a.state === 'walk_to_desk' || a.state === 'walk_back').length;
            const workingAgents = agList.filter(a => a.state === 'working').length;
            const idleAgents = agList.filter(a => a.state === 'idle').length;

            drawRoom(ctx, W, H, niche.color, t, walkingAgents);

            const arcadeX = lL + (lR - lL) * 0.15;
            const arcadeY = wallBot + fH * 0.50;
            drawArcade(ctx, arcadeX, arcadeY, niche.color, t);

            const couchX = lL + (lR - lL) * 0.55;
            const couchY = wallBot + fH * 0.72;
            drawCouch(ctx, couchX, couchY, niche.color);

            const vendX = lL + (lR - lL) * 0.88;
            const vendY = wallBot + fH * 0.48;
            drawVending(ctx, vendX, vendY, niche.color, t);

            const coffeeX = lL + (lR - lL) * 0.45;
            const coffeeY = wallBot + fH * 0.45;
            drawCoffeeTable(ctx, coffeeX, coffeeY, niche.color, t);

            if (orch) drawConnections(ctx, agList, orch, niche.color, t);

            const desksToRender = [...deskPos.current].sort((a, b) => a.y - b.y);
            desksToRender.forEach(d => {
                const sittingAgent = agList.find(a => a.deskX === d.x && a.deskY === d.y && a.state === 'working');
                const isWorking = !!sittingAgent;
                const ph = sittingAgent ? sittingAgent.phase : 0;
                drawChair(ctx, d.x, d.y, niche.color, d.isOrch);
                drawDesk(ctx, d.x, d.y, niche.color, d.isOrch, isWorking, t, ph);
            });

            const sorted = [...agList].sort((a, b) => a.y - b.y);
            sorted.forEach(a => {
                const isO = a === orch;
                const isWalking = a.state === 'walk_to_desk' || a.state === 'walk_back';
                drawPerson(ctx, a, niche.color, isO, t, isWalking, noMo.current);
            });

            pts.current = pts.current.filter(p => {
                p.p += dt * p.spd;
                if (p.p >= 1) return false;
                drawParticle(ctx, p, t); return true;
            });

            ctx.font = '600 11px Inter, sans-serif';
            ctx.textAlign = 'center';
            const parts: string[] = [];
            if (workingAgents > 0) parts.push(`⚙ ${workingAgents} работают`);
            if (walkingAgents > 0) parts.push(`→ ${walkingAgents} в пути`);
            if (idleAgents > 0) parts.push(`☕ ${idleAgents} отдыхают`);
            const statusText = `${agList.length} AI-агентов · ${parts.join(' · ')}`;
            ctx.fillStyle = 'rgba(0,0,0,0.45)';
            ctx.fillText(statusText, W / 2 + 1, H - 7);
            ctx.fillStyle = 'rgba(255,255,255,0.18)';
            ctx.fillText(statusText, W / 2, H - 8);
            ctx.textAlign = 'start';

            afRef.current = requestAnimationFrame(animate);
        };

        afRef.current = requestAnimationFrame(animate);
        return () => { cancelAnimationFrame(afRef.current); ro.disconnect(); };
    }, [niche, activeNiche, rebuildLayout]);

    return (
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <canvas
                ref={cvRef}
                className="w-full h-full rounded-xl"
                aria-label={`Офис AI-агентов: ${niche.agentTeam.map(a => a.name).join(', ')}`}
                role="img"
            />
        </div>
    );
};
