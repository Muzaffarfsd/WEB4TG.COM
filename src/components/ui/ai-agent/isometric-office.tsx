import { useRef, useEffect, useCallback, useState } from 'react';
import type { Agent, Particle, Drone, Roomba, Toast, OfficeCat, CodeParticle, IsometricOfficeProps } from './office-config';
import type { LOD } from './office-config';
import { MAX_DPR, detectLOD, downgradeLOD, ha, FPS_LOW_THRESHOLD, FPS_LOW_DURATION } from './office-config';
import { buildLayout, updateAgents } from './office-agents';
import {
    renderStaticLayer, drawRoomDynamic,
    drawArcade, drawCouch, drawVending, drawCoffeeTable,
    drawDesk, drawChair, drawPerson, drawParticle, drawConnections,
    drawWhiteboard, drawClock, drawWifiRouter, drawRoomba,
    drawToast, drawWaterCooler, drawCables, drawBookshelf, drawDrone,
    drawDeskAccessories, drawOfficeCat, drawNeonSign, drawCodeParticle,
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

function createCat(W: number, H: number): OfficeCat {
    const wallBot = H * 0.30;
    const floorBot = H * 0.93;
    const divX = W * 0.54;
    const rR = W * 0.96;
    return {
        x: divX + (rR - divX) * 0.5,
        y: wallBot + (floorBot - wallBot) * 0.7,
        targetX: divX + (rR - divX) * 0.3,
        targetY: wallBot + (floorBot - wallBot) * 0.65,
        state: 'sit',
        stateTimer: 3 + Math.random() * 5,
        direction: 1,
        tailPhase: Math.random() * Math.PI * 2,
    };
}

function updateCat(cat: OfficeCat, dt: number, W: number, H: number) {
    const wallBot = H * 0.30;
    const floorBot = H * 0.93;
    const divX = W * 0.54;
    const rR = W * 0.96;

    cat.stateTimer -= dt;
    if (cat.stateTimer <= 0) {
        const states: OfficeCat['state'][] = ['walk', 'sit', 'sleep', 'groom'];
        const weights = [0.3, 0.3, 0.25, 0.15];
        let r = Math.random(), acc = 0;
        let newState: OfficeCat['state'] = 'sit';
        for (let i = 0; i < states.length; i++) {
            acc += weights[i];
            if (r < acc) { newState = states[i]; break; }
        }
        cat.state = newState;
        cat.stateTimer = newState === 'walk' ? 2 + Math.random() * 3
            : newState === 'sleep' ? 5 + Math.random() * 8
            : 3 + Math.random() * 4;

        if (newState === 'walk') {
            cat.targetX = divX + 15 + Math.random() * (rR - divX - 30);
            cat.targetY = wallBot + (floorBot - wallBot) * (0.5 + Math.random() * 0.35);
            cat.direction = cat.targetX > cat.x ? 1 : -1;
        }
    }

    if (cat.state === 'walk') {
        const dx = cat.targetX - cat.x;
        const dy = cat.targetY - cat.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 2) {
            const speed = 18 * dt;
            cat.x += (dx / dist) * speed;
            cat.y += (dy / dist) * speed;
            cat.direction = dx > 0 ? 1 : -1;
        } else {
            cat.state = 'sit';
            cat.stateTimer = 2 + Math.random() * 4;
        }
    }

    cat.x = Math.max(divX + 10, Math.min(rR - 10, cat.x));
    cat.y = Math.max(wallBot + 20, Math.min(floorBot - 5, cat.y));
}

function updateDrone(drone: Drone, dt: number, _t: number, W: number, H: number, deskPos: {x: number; y: number}[]) {
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
    const sortedDesks = useRef<{x: number; y: number; isOrch: boolean}[]>([]);
    const pts = useRef<Particle[]>([]);
    const droneRef = useRef<Drone | null>(null);
    const roombaRef = useRef<Roomba | null>(null);
    const catRef = useRef<OfficeCat | null>(null);
    const toastsRef = useRef<Toast[]>([]);
    const codeParticlesRef = useRef<CodeParticle[]>([]);
    const lastCodeParticleTime = useRef(0);
    const lastToastTime = useRef(0);
    const clk = useRef(0);
    const pN = useRef(-1);
    const pS = useRef(-1);
    const noMo = useRef(false);
    const visRef = useRef(true);
    const staticCache = useRef<OffscreenCanvas | HTMLCanvasElement | null>(null);
    const cacheSize = useRef({ w: 0, h: 0, col: '' });
    const lodRef = useRef<LOD>('high');
    const fpsFrames = useRef(0);
    const fpsAccTime = useRef(0);
    const fpsLowStart = useRef<number | null>(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
    const parallaxSmooth = useRef({ x: 0, y: 0 });
    const [tooltip, setTooltip] = useState<{ name: string; role: string; left: number; top: number } | null>(null);
    const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        noMo.current = mq.matches;
        const fn = (e: MediaQueryListEvent) => { noMo.current = e.matches; };
        mq.addEventListener('change', fn);
        return () => mq.removeEventListener('change', fn);
    }, []);

    useEffect(() => {
        const cv = cvRef.current; if (!cv) return;
        const AGENT_HIT_RADIUS = 22;
        const onMove = (e: MouseEvent) => {
            const r = cv.getBoundingClientRect();
            const normX = (e.clientX - r.left) / r.width;
            const normY = (e.clientY - r.top) / r.height;
            mouseRef.current = { x: normX, y: normY, active: true };

            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
            const W = cv.width / dpr;
            const H = cv.height / dpr;
            const canvasX = normX * W;
            const canvasY = normY * H;

            let found: Agent | null = null;
            const agList = ags.current;
            for (let i = 0; i < agList.length; i++) {
                const a = agList[i];
                const dx = canvasX - a.x;
                const dy = canvasY - (a.y - 10);
                if (dx * dx + dy * dy < AGENT_HIT_RADIUS * AGENT_HIT_RADIUS) {
                    found = a;
                    break;
                }
            }

            if (tooltipTimeout.current) { clearTimeout(tooltipTimeout.current); tooltipTimeout.current = null; }

            if (found) {
                cv.style.cursor = 'pointer';
                setTooltip({
                    name: found.name,
                    role: found.role,
                    left: e.clientX - r.left,
                    top: e.clientY - r.top,
                });
            } else {
                cv.style.cursor = '';
                tooltipTimeout.current = setTimeout(() => setTooltip(null), 60);
            }
        };
        const onLeave = () => {
            mouseRef.current = { x: 0.5, y: 0.5, active: false };
            cv.style.cursor = '';
            setTooltip(null);
        };
        cv.addEventListener('mousemove', onMove);
        cv.addEventListener('mouseleave', onLeave);
        return () => {
            cv.removeEventListener('mousemove', onMove);
            cv.removeEventListener('mouseleave', onLeave);
            if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
        };
    }, []);

    const startLoop = useRef<(() => void) | null>(null);

    useEffect(() => {
        const cv = cvRef.current; if (!cv) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                const wasVisible = visRef.current;
                visRef.current = entry.isIntersecting;
                if (entry.isIntersecting && !wasVisible && startLoop.current) {
                    startLoop.current();
                }
            },
            { threshold: 0.05 },
        );
        io.observe(cv);
        return () => io.disconnect();
    }, []);

    const rebuildLayout = useCallback((W: number, H: number) => {
        const result = buildLayout(niche.agentTeam, W, H);
        ags.current = result.agents;
        deskPos.current = result.deskPositions;
        sortedDesks.current = [...result.deskPositions].sort((a, b) => a.y - b.y);
        if (!droneRef.current) droneRef.current = createDrone(W, H);
        if (!roombaRef.current) roombaRef.current = createRoomba(W, H);
        if (!catRef.current) catRef.current = createCat(W, H);
        lodRef.current = detectLOD(W);
    }, [niche.agentTeam]);

    const invalidateCache = useCallback(() => { staticCache.current = null; }, []);

    useEffect(() => {
        if (activeNiche !== pN.current || currentStage !== pS.current) {
            pN.current = activeNiche; pS.current = currentStage;
            const c = cvRef.current; if (!c) return;
            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
            const W = c.width / dpr, H = c.height / dpr;
            rebuildLayout(W, H);
            pts.current = []; clk.current = 0;
            droneRef.current = createDrone(W, H);
            roombaRef.current = createRoomba(W, H);
            catRef.current = createCat(W, H);
            toastsRef.current = [];
            codeParticlesRef.current = [];
            invalidateCache();
        }
    }, [activeNiche, currentStage, niche.agentTeam, rebuildLayout, invalidateCache]);

    useEffect(() => {
        const cv = cvRef.current; if (!cv) return;
        const ctx = cv.getContext('2d'); if (!ctx) return;
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

        const resize = () => {
            const r = cv.getBoundingClientRect();
            cv.width = r.width * dpr; cv.height = r.height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            rebuildLayout(r.width, r.height);
            invalidateCache();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(cv);
        let prev = 0;

        const animate = (ts: number) => {
            if (!visRef.current) return;
            afRef.current = requestAnimationFrame(animate);

            const dt = Math.min((ts - prev) / 1000, 0.05);
            prev = ts;

            fpsFrames.current++;
            fpsAccTime.current += dt;
            if (fpsAccTime.current >= 0.5) {
                const fps = fpsFrames.current / fpsAccTime.current;
                fpsFrames.current = 0;
                fpsAccTime.current = 0;

                if (fps < FPS_LOW_THRESHOLD) {
                    if (fpsLowStart.current === null) {
                        fpsLowStart.current = ts / 1000;
                    } else if ((ts / 1000) - fpsLowStart.current >= FPS_LOW_DURATION) {
                        const next = downgradeLOD(lodRef.current);
                        if (next !== lodRef.current) {
                            lodRef.current = next;
                            staticCache.current = null;
                        }
                        fpsLowStart.current = null;
                    }
                } else {
                    fpsLowStart.current = null;
                }
            }

            clk.current += dt;
            const t = clk.current;
            const W = cv.width / dpr;
            const H = cv.height / dpr;
            const lod = lodRef.current;

            ctx.clearRect(0, 0, W, H);

            const PARALLAX_MAX = 4;
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const targetPX = (mx - 0.5) * 2 * PARALLAX_MAX;
            const targetPY = (my - 0.5) * 2 * PARALLAX_MAX;
            const smoothFactor = 1 - Math.pow(0.05, dt);
            parallaxSmooth.current.x += (targetPX - parallaxSmooth.current.x) * smoothFactor;
            parallaxSmooth.current.y += (targetPY - parallaxSmooth.current.y) * smoothFactor;
            if (!noMo.current) {
                ctx.save();
                ctx.translate(parallaxSmooth.current.x, parallaxSmooth.current.y);
            }

            if (!staticCache.current || cacheSize.current.w !== W || cacheSize.current.h !== H || cacheSize.current.col !== niche.color) {
                staticCache.current = renderStaticLayer(W, H, niche.color, lod);
                cacheSize.current = { w: W, h: H, col: niche.color };
            }
            ctx.drawImage(staticCache.current, 0, 0);

            const wallBot = H * 0.30;
            const floorBot = H * 0.93;
            const fH = floorBot - wallBot;
            const lL = W * 0.56, lR = W * 0.93;

            const agList = ags.current;
            const orch = agList[0];

            updateAgents(agList, t, dt, noMo.current, pts.current, niche.color, orch);

            let walkingAgents = 0, workingAgents = 0, idleAgents = 0;
            for (let i = 0; i < agList.length; i++) {
                const s = agList[i].state;
                if (s === 'walk_to_desk' || s === 'walk_back') walkingAgents++;
                else if (s === 'working') workingAgents++;
                else idleAgents++;
            }

            drawRoomDynamic(ctx, W, H, niche.color, t, walkingAgents, lod);

            const rL = W * 0.04;
            const divX = W * 0.54;

            if (lod !== 'low') {
                const srvX = rL + 8, srvY = wallBot + 10;
                const srvH = floorBot - wallBot - 20;
                drawCables(ctx, srvX, srvY, srvH, deskPos.current, niche.color, t);
            }

            const wbX = rL + (divX - rL) * 0.36;
            const wbY = wallBot * 0.35 + 2;
            drawWhiteboard(ctx, wbX, wbY, niche.color, t, workingAgents, agList.length);

            if (lod !== 'low') {
                const clockX = rL + (divX - rL) * 0.78;
                const clockY = wallBot * 0.45 + 4;
                drawClock(ctx, clockX, clockY, niche.color, t);
            }

            if (lod === 'high') {
                const wifiX = (rL + divX) / 2;
                const wifiY = wallBot * 0.15 + 2;
                drawWifiRouter(ctx, wifiX, wifiY, niche.color, t);
            }

            if (lod !== 'low') {
                const rR = W * 0.96;
                const winX = divX + (rR - divX) * 0.5 - 25;
                const bsX = winX - 42;
                const bsY = wallBot * 0.25 + 2;
                drawBookshelf(ctx, bsX, bsY, niche.color);
            }

            if (lod !== 'low') {
                const coolerX = rL + 14;
                const coolerY = wallBot + fH * 0.50;
                drawWaterCooler(ctx, coolerX, coolerY, niche.color, t);
            }

            if (lod !== 'low') {
                const neonX = divX + (W * 0.96 - divX) * 0.5 - 23;
                const neonY = wallBot * 0.2 + 2;
                drawNeonSign(ctx, neonX, neonY, niche.color, t);
            }

            const arcadeX = lL + (lR - lL) * 0.15;
            const arcadeY = wallBot + fH * 0.50;
            let arcadePlayer: Agent | null = null;
            for (let i = 1; i < agList.length; i++) {
                if (agList[i].state === 'idle') { arcadePlayer = agList[i]; break; }
            }
            drawArcade(ctx, arcadeX, arcadeY, niche.color, t, arcadePlayer);

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

            if (roombaRef.current && !noMo.current && lod !== 'low') {
                updateRoomba(roombaRef.current, dt, W, H);
                drawRoomba(ctx, roombaRef.current, niche.color, t);
            }

            const desks = sortedDesks.current;
            for (let i = 0; i < desks.length; i++) {
                const d = desks[i];
                let isWorking = false, ph = 0, agIdx = i;
                for (let j = 0; j < agList.length; j++) {
                    const a = agList[j];
                    if (a.deskX === d.x && a.deskY === d.y && a.state === 'working') {
                        isWorking = true; ph = a.phase; agIdx = j; break;
                    }
                }
                drawChair(ctx, d.x, d.y, niche.color, d.isOrch);
                drawDesk(ctx, d.x, d.y, niche.color, d.isOrch, isWorking, t, ph);
                if (lod !== 'low') {
                    drawDeskAccessories(ctx, d.x, d.y, d.isOrch, niche.color, agIdx, t);
                }
            }

            const sorted = [...agList].sort((a, b) => a.y - b.y);
            for (let i = 0; i < sorted.length; i++) {
                const a = sorted[i];
                const isO = a === orch;
                const isWalking = a.state === 'walk_to_desk' || a.state === 'walk_back';
                drawPerson(ctx, a, niche.color, isO, t, isWalking, noMo.current);
            }

            if (droneRef.current && !noMo.current && lod !== 'low') {
                updateDrone(droneRef.current, dt, t, W, H, deskPos.current);
                drawDrone(ctx, droneRef.current, niche.color, t);
            }

            if (catRef.current && !noMo.current && lod !== 'low') {
                updateCat(catRef.current, dt, W, H);
                drawOfficeCat(ctx, catRef.current, niche.color, t);
            }

            if (!noMo.current && t - lastToastTime.current > (lod === 'low' ? 6 : 4)) {
                const workingAg: Agent[] = [];
                for (let i = 0; i < agList.length; i++) {
                    if (agList[i].state === 'working' && agList[i] !== orch) workingAg.push(agList[i]);
                }
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

            if (!noMo.current && lod !== 'low' && t - lastCodeParticleTime.current > 0.3) {
                const workingAg: Agent[] = [];
                for (let i = 0; i < agList.length; i++) {
                    if (agList[i].state === 'working') workingAg.push(agList[i]);
                }
                if (workingAg.length > 0 && codeParticlesRef.current.length < 20) {
                    const ag = workingAg[Math.floor(Math.random() * workingAg.length)];
                    const symbols = ['{', '}', '0', '1', '</', '>', '()', '=>', '[]', '&&', '||', '+=', 'fn', 'if', '**', ';;', '!=', '<<', '::', '01'];
                    const sym = symbols[Math.floor(Math.random() * symbols.length)];
                    const dH2 = ag === orch ? 24 : 20;
                    const monH = ag === orch ? 28 : 22;
                    const monY = ag.deskY - dH2 / 2 - monH - 4;
                    codeParticlesRef.current.push({
                        x: ag.deskX + (Math.random() - 0.5) * 30,
                        y: ag.deskY - 15 + (Math.random() - 0.5) * 10,
                        targetX: ag.deskX + (Math.random() - 0.5) * 10,
                        targetY: monY + monH / 2,
                        symbol: sym,
                        alpha: 1,
                        speed: 0.6 + Math.random() * 0.4,
                        progress: 0,
                        col: niche.color,
                        size: 5 + Math.random() * 3,
                    });
                    lastCodeParticleTime.current = t;
                }
            }

            codeParticlesRef.current = codeParticlesRef.current.filter(cp => {
                cp.progress += dt * cp.speed;
                if (cp.progress > 0.7) {
                    cp.alpha = Math.max(0, 1 - (cp.progress - 0.7) / 0.3);
                }
                if (cp.progress >= 1) return false;
                drawCodeParticle(ctx, cp);
                return true;
            });

            ctx.font = '600 11px Inter, sans-serif';
            ctx.textAlign = 'center';
            const parts: string[] = [];
            if (workingAgents > 0) parts.push(`⚙ ${workingAgents} работают`);
            if (walkingAgents > 0) parts.push(`→ ${walkingAgents} в пути`);
            if (idleAgents > 0) parts.push(`☕ ${idleAgents} отдыхают`);
            const statusText = `${agList.length} AI-агентов · ${parts.join(' · ')}`;
            const stW = ctx.measureText(statusText).width + 24;
            const stH = 22;
            const stX = W / 2 - stW / 2;
            const stY = H - stH - 4;
            ctx.fillStyle = 'rgba(8,6,16,0.7)';
            ctx.beginPath(); ctx.roundRect(stX, stY, stW, stH, 8); ctx.fill();
            ctx.strokeStyle = ha(niche.color, 0.12);
            ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.roundRect(stX, stY, stW, stH, 8); ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.03)';
            ctx.fillRect(stX + 2, stY + 1, stW - 4, stH / 2 - 1);
            ctx.fillStyle = 'rgba(255,255,255,0.22)';
            ctx.fillText(statusText, W / 2, stY + 15);
            ctx.textAlign = 'start';

            if (!noMo.current) {
                ctx.restore();
            }
        };

        startLoop.current = () => {
            cancelAnimationFrame(afRef.current);
            prev = performance.now();
            afRef.current = requestAnimationFrame(animate);
        };
        afRef.current = requestAnimationFrame(animate);
        return () => { cancelAnimationFrame(afRef.current); startLoop.current = null; ro.disconnect(); };
    }, [niche, activeNiche, rebuildLayout, invalidateCache]);

    return (
        <div className="relative w-full office-canvas-wrap">
            <canvas
                ref={cvRef}
                className="w-full h-full rounded-xl"
                aria-label={`Офис AI-агентов: ${niche.agentTeam.map(a => a.name).join(', ')}`}
                role="img"
            />
            {tooltip && (
                <div
                    style={{
                        position: 'absolute',
                        left: tooltip.left,
                        top: tooltip.top - 48,
                        transform: 'translateX(-50%)',
                        pointerEvents: 'none',
                        zIndex: 20,
                        background: 'rgba(8,6,16,0.88)',
                        border: `1px solid ${ha(niche.color, 0.3)}`,
                        borderRadius: 8,
                        padding: '6px 12px',
                        whiteSpace: 'nowrap',
                        boxShadow: `0 4px 16px rgba(0,0,0,0.4), 0 0 8px ${ha(niche.color, 0.15)}`,
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    <div style={{ color: '#fff', fontSize: 12, fontWeight: 600, lineHeight: '16px' }}>
                        {tooltip.name}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, lineHeight: '14px' }}>
                        {tooltip.role}
                    </div>
                </div>
            )}
        </div>
    );
};
