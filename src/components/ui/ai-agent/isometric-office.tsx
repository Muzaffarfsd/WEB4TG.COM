import { useRef, useEffect, useCallback } from 'react';
import type { Agent, Particle, Drone, Roomba, Toast, IsometricOfficeProps } from './office-config';
import { buildLayout, updateAgents } from './office-agents';
import {
    drawRoom, drawArcade, drawCouch, drawVending, drawCoffeeTable,
    drawDesk, drawChair, drawPerson, drawParticle, drawConnections,
    drawWhiteboard, drawClock, drawWifiRouter, drawRoomba,
    drawToast, drawWaterCooler, drawCables, drawBookshelf, drawDrone,
} from './office-renderer';

function createDrone(W: number, H: number): Drone {
    const wallBot = H * 0.30;
    const floorBot = H * 0.93;
    return {
        x: W * 0.3, y: wallBot + (floorBot - wallBot) * 0.15,
        targetX: W * 0.4, targetY: wallBot + (floorBot - wallBot) * 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: 25,
        waitTimer: 0,
        propellerAngle: 0,
    };
}

function createRoomba(W: number, H: number): Roomba {
    const wallBot = H * 0.30;
    const floorBot = H * 0.93;
    return {
        x: W * 0.35, y: wallBot + (floorBot - wallBot) * 0.8,
        angle: Math.random() * Math.PI * 2,
        speed: 12,
        turnTimer: 3 + Math.random() * 4,
        ledPhase: Math.random() * Math.PI * 2,
    };
}

function updateDrone(drone: Drone, dt: number, t: number, W: number, H: number, deskPos: {x: number; y: number}[]) {
    drone.propellerAngle += dt * 40;

    if (drone.waitTimer > 0) {
        drone.waitTimer -= dt;
        return;
    }

    const dx = drone.targetX - drone.x;
    const dy = drone.targetY - drone.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 3) {
        drone.waitTimer = 1.5 + Math.random() * 2;
        const wallBot = H * 0.30;
        const floorBot = H * 0.93;
        const fH = floorBot - wallBot;

        if (deskPos.length > 0) {
            const target = deskPos[Math.floor(Math.random() * deskPos.length)];
            drone.targetX = target.x + (Math.random() - 0.5) * 30;
            drone.targetY = Math.max(wallBot + fH * 0.08, target.y - 35 + Math.random() * 10);
        } else {
            drone.targetX = W * 0.1 + Math.random() * W * 0.8;
            drone.targetY = wallBot + fH * 0.1 + Math.random() * fH * 0.3;
        }
    } else {
        const speed = drone.speed * dt;
        drone.x += (dx / dist) * speed;
        drone.y += (dy / dist) * speed;
    }
}

function updateRoomba(rb: Roomba, dt: number, W: number, H: number) {
    const wallBot = H * 0.30;
    const floorBot = H * 0.93;
    const rL = W * 0.06, rR = W * 0.52;

    rb.turnTimer -= dt;
    if (rb.turnTimer <= 0) {
        rb.angle += (Math.random() - 0.5) * Math.PI;
        rb.turnTimer = 2 + Math.random() * 5;
    }

    const nx = rb.x + Math.cos(rb.angle) * rb.speed * dt;
    const ny = rb.y + Math.sin(rb.angle) * rb.speed * dt;

    if (nx > rL + 10 && nx < rR - 10 && ny > wallBot + 25 && ny < floorBot - 10) {
        rb.x = nx; rb.y = ny;
    } else {
        rb.angle += Math.PI + (Math.random() - 0.5) * 0.5;
        rb.turnTimer = 1 + Math.random() * 2;
    }
}

export const IsometricOffice = ({ niche, activeNiche, currentStage }: IsometricOfficeProps) => {
    const cvRef = useRef<HTMLCanvasElement>(null);
    const afRef = useRef(0);
    const ags = useRef<Agent[]>([]);
    const deskPos = useRef<{x: number; y: number; isOrch: boolean}[]>([]);
    const pts = useRef<Particle[]>([]);
    const droneRef = useRef<Drone | null>(null);
    const roombaRef = useRef<Roomba | null>(null);
    const toastsRef = useRef<Toast[]>([]);
    const lastToastTime = useRef(0);
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
        if (!droneRef.current) droneRef.current = createDrone(W, H);
        if (!roombaRef.current) roombaRef.current = createRoomba(W, H);
    }, [niche.agentTeam]);

    useEffect(() => {
        if (activeNiche !== pN.current || currentStage !== pS.current) {
            pN.current = activeNiche; pS.current = currentStage;
            const c = cvRef.current; if (!c) return;
            const dpr = window.devicePixelRatio || 1;
            const W = c.width / dpr, H = c.height / dpr;
            rebuildLayout(W, H);
            pts.current = []; clk.current = 0;
            droneRef.current = createDrone(W, H);
            roombaRef.current = createRoomba(W, H);
            toastsRef.current = [];
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

            const rL = W * 0.04;
            const divX = W * 0.54;

            const srvX = rL + 8, srvY = wallBot + 10;
            const srvH = floorBot - wallBot - 20;
            drawCables(ctx, srvX, srvY, srvH, deskPos.current, niche.color, t);

            const wbX = rL + (divX - rL) * 0.36;
            const wbY = wallBot * 0.35 + 2;
            drawWhiteboard(ctx, wbX, wbY, niche.color, t, workingAgents, agList.length);

            const clockX = rL + (divX - rL) * 0.78;
            const clockY = wallBot * 0.45 + 4;
            drawClock(ctx, clockX, clockY, niche.color, t);

            const wifiX = (rL + divX) / 2;
            const wifiY = wallBot * 0.15 + 2;
            drawWifiRouter(ctx, wifiX, wifiY, niche.color, t);

            const rR = W * 0.96;
            const winX = divX + (rR - divX) * 0.5 - 25;
            const bsX = winX - 42;
            const bsY = wallBot * 0.25 + 2;
            drawBookshelf(ctx, bsX, bsY, niche.color);

            const coolerX = rL + 14;
            const coolerY = wallBot + fH * 0.50;
            drawWaterCooler(ctx, coolerX, coolerY, niche.color, t);

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

            if (roombaRef.current && !noMo.current) {
                updateRoomba(roombaRef.current, dt, W, H);
                drawRoomba(ctx, roombaRef.current, niche.color, t);
            }

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

            if (droneRef.current && !noMo.current) {
                updateDrone(droneRef.current, dt, t, W, H, deskPos.current);
                drawDrone(ctx, droneRef.current, niche.color, t);
            }

            if (!noMo.current && t - lastToastTime.current > 4) {
                const workingAg = agList.filter(a => a.state === 'working' && a !== orch);
                if (workingAg.length > 0) {
                    const ag = workingAg[Math.floor(Math.random() * workingAg.length)];
                    const msgs = ['Task done', 'Готово', 'Report sent', 'Анализ ✓', 'Данные ↑', 'Синхрон.'];
                    const icons = ['✓', '📊', '📤', '⚡', '📈', '🔄'];
                    const mi = Math.floor(Math.random() * msgs.length);
                    toastsRef.current.push({
                        x: ag.x, y: ag.y - 35,
                        text: msgs[mi], icon: icons[mi],
                        opacity: 1, life: 0, maxLife: 2.5,
                        col: mi === 0 || mi === 3 ? '#22c55e' : niche.color,
                    });
                    lastToastTime.current = t;
                }
            }

            toastsRef.current = toastsRef.current.filter(toast => {
                toast.life += dt;
                if (toast.life > toast.maxLife * 0.6) {
                    toast.opacity = Math.max(0, 1 - (toast.life - toast.maxLife * 0.6) / (toast.maxLife * 0.4));
                }
                if (toast.life >= toast.maxLife) return false;
                drawToast(ctx, toast);
                return true;
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
