import { useRef, useEffect, useCallback } from 'react';
import type { NicheScenario } from './data';

interface IsometricOfficeProps {
    niche: NicheScenario;
    activeNiche: number;
    currentStage: number;
}

interface Agent {
    name: string;
    role: string;
    deskX: number; deskY: number;
    loungeX: number; loungeY: number;
    x: number; y: number;
    phase: number;
    walkDelay: number;
    state: 'idle' | 'walk_to_desk' | 'working' | 'walk_back';
    walkT: number;
    workProgress: number;
    skin: string;
    hair: string;
    shirt: string;
    cycleOffset: number;
}

const SKINS = ['#f0d0b0', '#d4a878', '#c49070', '#e8c4a0', '#b87848', '#f2dcc8'];
const HAIRS = ['#1a1420', '#3a2210', '#8a6030', '#c49050', '#582010', '#222'];
const SHIRTS = ['#6d5acd', '#4a90d9', '#2ecc71', '#e67e22', '#e74c3c', '#1abc9c', '#9b59b6', '#f39c12'];

interface Particle {
    fx: number; fy: number; tx: number; ty: number;
    p: number; spd: number; idx: number; ret: boolean; col: string;
}

const ha = (hex: string, a: number) =>
    hex + Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeIO = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

const CYCLE = 14;
const PH_WALK_TO_START = 0.0;
const PH_WALK_TO_END = 0.12;
const PH_WORK_END = 0.65;
const PH_WALK_BACK_START = 0.65;
const PH_WALK_BACK_END = 0.77;
const PH_IDLE_END = 1.0;

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

    const buildLayout = useCallback((team: NicheScenario['agentTeam'], W: number, H: number) => {
        const wallBot = H * 0.30;
        const floorBot = H * 0.93;
        const fH = floorBot - wallBot;

        const wL = W * 0.07, wR = W * 0.52;
        const lL = W * 0.56, lR = W * 0.93;

        const orchDesk = { x: (wL + wR) / 2, y: wallBot + fH * 0.12 };

        const desks = [
            { x: wL + (wR - wL) * 0.22, y: wallBot + fH * 0.40 },
            { x: wL + (wR - wL) * 0.78, y: wallBot + fH * 0.40 },
            { x: wL + (wR - wL) * 0.22, y: wallBot + fH * 0.68 },
            { x: wL + (wR - wL) * 0.78, y: wallBot + fH * 0.68 },
            { x: wL + (wR - wL) * 0.50, y: wallBot + fH * 0.54 },
        ];

        const lounges = [
            { x: lL + (lR - lL) * 0.18, y: wallBot + fH * 0.30 },
            { x: lL + (lR - lL) * 0.55, y: wallBot + fH * 0.58 },
            { x: lL + (lR - lL) * 0.85, y: wallBot + fH * 0.35 },
            { x: lL + (lR - lL) * 0.35, y: wallBot + fH * 0.62 },
            { x: lL + (lR - lL) * 0.70, y: wallBot + fH * 0.55 },
        ];

        const allDesks: {x: number; y: number; isOrch: boolean}[] = [
            { x: orchDesk.x, y: orchDesk.y, isOrch: true },
        ];

        ags.current = team.map((a, i) => {
            if (i === 0) {
                return {
                    name: a.name, role: a.role,
                    deskX: orchDesk.x, deskY: orchDesk.y,
                    loungeX: orchDesk.x, loungeY: orchDesk.y,
                    x: orchDesk.x, y: orchDesk.y,
                    phase: Math.random() * Math.PI * 2,
                    walkDelay: 0, state: 'working' as const,
                    walkT: 0, workProgress: 0,
                    skin: SKINS[0], hair: HAIRS[0], shirt: SHIRTS[0],
                    cycleOffset: 0,
                };
            }
            const di = (i - 1) % desks.length;
            const li = (i - 1) % lounges.length;
            allDesks.push({ x: desks[di].x, y: desks[di].y, isOrch: false });
            const stagger = ((i - 1) / Math.max(1, team.length - 2));
            return {
                name: a.name, role: a.role,
                deskX: desks[di].x, deskY: desks[di].y,
                loungeX: lounges[li].x, loungeY: lounges[li].y,
                x: lounges[li].x, y: lounges[li].y,
                phase: Math.random() * Math.PI * 2,
                walkDelay: 0,
                state: 'idle' as const, walkT: 0, workProgress: 0,
                skin: SKINS[i % SKINS.length],
                hair: HAIRS[i % HAIRS.length],
                shirt: SHIRTS[i % SHIRTS.length],
                cycleOffset: stagger * CYCLE,
            };
        });
        deskPos.current = allDesks;
    }, []);

    useEffect(() => {
        if (activeNiche !== pN.current || currentStage !== pS.current) {
            pN.current = activeNiche; pS.current = currentStage;
            const c = cvRef.current; if (!c) return;
            const dpr = window.devicePixelRatio || 1;
            buildLayout(niche.agentTeam, c.width / dpr, c.height / dpr);
            pts.current = []; clk.current = 0;
        }
    }, [activeNiche, currentStage, niche.agentTeam, buildLayout]);

    useEffect(() => {
        const cv = cvRef.current; if (!cv) return;
        const ctx = cv.getContext('2d'); if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;

        const resize = () => {
            const r = cv.getBoundingClientRect();
            cv.width = r.width * dpr; cv.height = r.height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            buildLayout(niche.agentTeam, r.width, r.height);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(cv);
        let prev = 0;

        const drawRoom = (W: number, H: number, col: string, t: number, agentsWalking: number) => {
            const rL = W * 0.04, rR = W * 0.96;
            const wallTop = H * 0.04, wallBot = H * 0.30, floorBot = H * 0.93;

            const wG = ctx.createLinearGradient(rL, wallTop, rL, wallBot);
            wG.addColorStop(0, '#100e18');
            wG.addColorStop(0.5, '#141020');
            wG.addColorStop(1, '#0c0a14');
            ctx.fillStyle = wG;
            ctx.fillRect(rL, wallTop, rR - rL, wallBot - wallTop);

            ctx.strokeStyle = 'rgba(255,255,255,0.015)';
            ctx.lineWidth = 0.5;
            const bH = 14, bW = 26;
            for (let row = 0; row < Math.ceil((wallBot - wallTop) / bH); row++) {
                const y = wallTop + row * bH;
                const off = row % 2 === 0 ? 0 : bW / 2;
                for (let x = rL + off; x < rR; x += bW) {
                    ctx.strokeRect(x, y, bW, bH);
                }
            }

            ctx.fillStyle = ha(col, 0.05);
            ctx.fillRect(rL, wallBot - 3, rR - rL, 3);

            ctx.strokeStyle = ha(col, 0.1);
            ctx.lineWidth = 1;
            ctx.strokeRect(rL, wallTop, rR - rL, wallBot - wallTop);

            const fG = ctx.createLinearGradient(rL, wallBot, rL, floorBot);
            fG.addColorStop(0, '#0a0812');
            fG.addColorStop(1, '#06050c');
            ctx.fillStyle = fG;
            ctx.fillRect(rL, wallBot, rR - rL, floorBot - wallBot);

            const ts = 28;
            for (let tx2 = rL; tx2 < rR; tx2 += ts) {
                for (let ty = wallBot; ty < floorBot; ty += ts) {
                    const chk = (Math.floor((tx2 - rL) / ts) + Math.floor((ty - wallBot) / ts)) % 2 === 0;
                    ctx.fillStyle = chk ? 'rgba(139,92,246,0.018)' : 'rgba(255,255,255,0.006)';
                    ctx.fillRect(tx2 + 0.3, ty + 0.3, ts - 0.6, ts - 0.6);
                }
            }
            ctx.strokeStyle = 'rgba(139,92,246,0.025)';
            ctx.lineWidth = 0.3;
            for (let x = rL; x <= rR; x += ts) { ctx.beginPath(); ctx.moveTo(x, wallBot); ctx.lineTo(x, floorBot); ctx.stroke(); }
            for (let y = wallBot; y <= floorBot; y += ts) { ctx.beginPath(); ctx.moveTo(rL, y); ctx.lineTo(rR, y); ctx.stroke(); }

            const divX = W * 0.54;
            ctx.strokeStyle = ha(col, 0.06);
            ctx.lineWidth = 1.5;
            ctx.setLineDash([6, 4]);
            ctx.beginPath(); ctx.moveTo(divX, wallBot + 4); ctx.lineTo(divX, floorBot - 4); ctx.stroke();
            ctx.setLineDash([]);

            ctx.font = '600 9px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillText('⚡ РАБОЧАЯ ЗОНА', (rL + divX) / 2 + 1, wallBot + 14);
            ctx.fillText('☕ ЛАУНЖ', (divX + rR) / 2 + 1, wallBot + 14);
            ctx.fillStyle = ha(col, 0.35);
            ctx.fillText('⚡ РАБОЧАЯ ЗОНА', (rL + divX) / 2, wallBot + 13);
            ctx.fillText('☕ ЛАУНЖ', (divX + rR) / 2, wallBot + 13);
            ctx.textAlign = 'start';

            const stripY = wallTop + 2;
            for (let lx = rL + 30; lx < rR - 30; lx += 80) {
                ctx.fillStyle = ha(col, 0.03);
                ctx.fillRect(lx, stripY, 50, 2);
                ctx.save();
                ctx.shadowColor = col;
                ctx.shadowBlur = 8;
                ctx.fillStyle = ha(col, 0.08);
                ctx.fillRect(lx + 5, stripY, 40, 1);
                ctx.restore();
            }

            const screens = [
                { x: rL + (divX - rL) * 0.18, y: wallTop + 10, w: 52, h: 32, type: 'tasks' },
                { x: rL + (divX - rL) * 0.55, y: wallTop + 8, w: 62, h: 38, type: 'analytics' },
                { x: rL + (divX - rL) * 0.88, y: wallTop + 12, w: 48, h: 30, type: 'efficiency' },
            ];
            screens.forEach(s => {
                ctx.fillStyle = '#06050c';
                ctx.strokeStyle = 'rgba(60,50,80,0.5)';
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.roundRect(s.x, s.y, s.w, s.h, 3); ctx.fill(); ctx.stroke();
                ctx.fillStyle = 'rgba(40,35,55,0.3)';
                ctx.fillRect(s.x + s.w / 2 - 1, s.y + s.h, 2, 6);
                ctx.fillRect(s.x + s.w / 2 - 6, s.y + s.h + 6, 12, 2);

                const ix = s.x + 3, iy = s.y + 3, iw = s.w - 6, ih = s.h - 6;
                const sG = ctx.createLinearGradient(ix, iy, ix + iw, iy + ih);
                sG.addColorStop(0, ha(col, 0.12)); sG.addColorStop(1, ha(col, 0.04));
                ctx.fillStyle = sG; ctx.fillRect(ix, iy, iw, ih);

                ctx.font = '600 7px Inter, sans-serif';
                ctx.fillStyle = ha(col, 0.6);
                ctx.textAlign = 'left';

                if (s.type === 'analytics') {
                    ctx.fillText('ANALYTICS', ix + 2, iy + 8);
                    const bars = 7;
                    const bw2 = (iw - 6) / bars - 1.5;
                    for (let i = 0; i < bars; i++) {
                        const bh2 = (ih - 14) * (0.15 + 0.7 * Math.abs(Math.sin(t * 0.6 + i * 0.8)));
                        ctx.fillStyle = ha(col, 0.35);
                        ctx.fillRect(ix + 3 + i * (bw2 + 1.5), iy + ih - bh2 - 2, bw2, bh2);
                    }
                } else if (s.type === 'tasks') {
                    ctx.fillText('TASKS', ix + 2, iy + 8);
                    for (let i = 0; i < 4; i++) {
                        const lw = iw * (0.25 + 0.55 * Math.abs(Math.sin(t * 0.4 + i * 1.1)));
                        ctx.fillStyle = 'rgba(255,255,255,0.1)';
                        ctx.fillRect(ix + 3, iy + 12 + i * 5, lw - 4, 2);
                        ctx.fillStyle = i < 2 ? ha('#22c55e', 0.4) : ha(col, 0.3);
                        ctx.beginPath(); ctx.arc(ix + iw - 6, iy + 13 + i * 5, 2, 0, Math.PI * 2); ctx.fill();
                    }
                } else {
                    ctx.fillText('STATUS', ix + 2, iy + 8);
                    const cR = Math.min(iw, ih) * 0.25;
                    const cX = ix + iw / 2, cY = iy + ih / 2 + 3;
                    ctx.beginPath(); ctx.arc(cX, cY, cR, 0, Math.PI * 2);
                    ctx.strokeStyle = ha(col, 0.15); ctx.lineWidth = 2; ctx.stroke();
                    ctx.beginPath(); ctx.arc(cX, cY, cR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 1.5);
                    ctx.strokeStyle = ha(col, 0.5); ctx.lineWidth = 3; ctx.stroke();
                    ctx.font = 'bold 9px Inter, sans-serif'; ctx.textAlign = 'center';
                    ctx.fillStyle = ha(col, 0.7); ctx.fillText('92%', cX, cY + 3);
                    ctx.textAlign = 'start';
                }

                ctx.save();
                ctx.shadowColor = col; ctx.shadowBlur = 15; ctx.globalAlpha = 0.06;
                ctx.fillStyle = col; ctx.fillRect(ix, iy, iw, ih);
                ctx.restore();
            });

            const walkingCount = agentsWalking;
            if (walkingCount > 0) {
                const alertPulse = Math.sin(t * 5);
                const mainScreen = screens[1];
                ctx.save();
                ctx.shadowColor = '#ef4444';
                ctx.shadowBlur = 14 + alertPulse * 6;
                ctx.strokeStyle = ha('#ef4444', 0.4 + alertPulse * 0.2);
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.roundRect(mainScreen.x - 2, mainScreen.y - 2, mainScreen.w + 4, mainScreen.h + 4, 4);
                ctx.stroke();
                ctx.restore();
            }

            const srvX = rL + 8, srvY = wallBot + 10;
            const srvW = 16, srvH = floorBot - wallBot - 20;
            ctx.fillStyle = '#08060e';
            ctx.strokeStyle = 'rgba(50,42,65,0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(srvX, srvY, srvW, srvH, 2); ctx.fill(); ctx.stroke();
            for (let i = 0; i < 5; i++) {
                const ry = srvY + 5 + i * (srvH / 6);
                ctx.fillStyle = 'rgba(25,20,38,0.6)';
                ctx.fillRect(srvX + 2, ry, srvW - 4, 7);
                ctx.fillStyle = Math.sin(t * 3 + i * 1.3) > 0 ? '#22c55e' : ha(col, 0.4);
                ctx.beginPath(); ctx.arc(srvX + srvW - 4, ry + 3.5, 1.5, 0, Math.PI * 2); ctx.fill();
            }
            ctx.font = '500 5px Inter, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.12)';
            ctx.textAlign = 'center'; ctx.fillText('SRV', srvX + srvW / 2, srvY + srvH + 8); ctx.textAlign = 'start';

            const plX = rL + 32, plY = floorBot - 8;
            ctx.fillStyle = '#2a1a0e';
            ctx.fillRect(plX - 5, plY - 10, 10, 12);
            ctx.fillStyle = '#3a2818';
            ctx.beginPath(); ctx.ellipse(plX, plY - 10, 6, 2.5, 0, 0, Math.PI * 2); ctx.fill();
            [-.5, -.15, .2, .55].forEach((ang, i) => {
                ctx.save(); ctx.translate(plX, plY - 12); ctx.rotate(ang);
                ctx.fillStyle = i % 2 === 0 ? '#1a5a1a' : '#22882a';
                ctx.beginPath(); ctx.ellipse(0, -10 - i * 1.5, 3.5, 9, 0, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            });
        };

        const drawArcade = (x: number, y: number, col: string, t: number) => {
            const w2 = 32, h2 = 56;

            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath(); ctx.ellipse(x, y + 2, w2 * 0.5, 3, 0, 0, Math.PI * 2); ctx.fill();

            const cabG = ctx.createLinearGradient(x - w2 / 2, y - h2, x + w2 / 2, y);
            cabG.addColorStop(0, '#1a1530');
            cabG.addColorStop(0.5, '#12102a');
            cabG.addColorStop(1, '#0e0c1e');
            ctx.fillStyle = cabG;
            ctx.beginPath(); ctx.roundRect(x - w2 / 2, y - h2, w2, h2, 3); ctx.fill();
            ctx.strokeStyle = ha(col, 0.2);
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(x - w2 / 2, y - h2, w2, h2, 3); ctx.stroke();

            ctx.fillStyle = ha(col, 0.15);
            ctx.fillRect(x - w2 / 2 + 1, y - h2, w2 - 2, 3);

            const scrX = x - 11, scrY = y - h2 + 8, scrW = 22, scrH = 18;
            ctx.fillStyle = '#040308';
            ctx.fillRect(scrX, scrY, scrW, scrH);
            const sG = ctx.createLinearGradient(scrX, scrY, scrX + scrW, scrY + scrH);
            sG.addColorStop(0, ha(col, 0.25)); sG.addColorStop(1, ha('#22c55e', 0.15));
            ctx.fillStyle = sG;
            ctx.fillRect(scrX + 1, scrY + 1, scrW - 2, scrH - 2);

            const px = 3;
            for (let py = 0; py < 4; py++) {
                for (let ppx = 0; ppx < 5; ppx++) {
                    if (Math.sin(t * 2 + py * 3 + ppx * 1.7) > 0.3) {
                        ctx.fillStyle = ha(col, 0.5);
                        ctx.fillRect(scrX + 2 + ppx * (px + 1), scrY + 2 + py * (px + 1), px, px);
                    }
                }
            }

            const invY = scrY + 14;
            ctx.fillStyle = ha('#22c55e', 0.6);
            ctx.fillRect(scrX + 8, invY, 3, 2);
            const bulletOff = (t * 30) % 12;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(scrX + 9, invY - bulletOff, 1, 2);

            ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.globalAlpha = 0.1;
            ctx.fillStyle = col; ctx.fillRect(scrX, scrY, scrW, scrH); ctx.restore();

            const ctrlY = y - h2 + 30;
            ctx.fillStyle = '#0a0816';
            ctx.fillRect(x - 10, ctrlY, 20, 12);

            ctx.fillStyle = ha(col, 0.5);
            ctx.beginPath(); ctx.arc(x - 4, ctrlY + 6, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(x + 4, ctrlY + 4, 2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#22c55e';
            ctx.beginPath(); ctx.arc(x + 4, ctrlY + 9, 2, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = 'rgba(40,35,55,0.6)';
            ctx.fillRect(x - 8, ctrlY + 14, 16, 3);

            ctx.font = 'bold 7px monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillText('ARCADE', x + 1, y - h2 - 2);
            ctx.fillStyle = ha(col, 0.7);
            ctx.fillText('ARCADE', x, y - h2 - 3);
            ctx.textAlign = 'start';
        };

        const drawCouch = (x: number, y: number, col: string) => {
            const cW = 60, cH = 20, backH = 14;

            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.beginPath(); ctx.ellipse(x, y + 3, cW * 0.5, 4, 0, 0, Math.PI * 2); ctx.fill();

            const seatG = ctx.createLinearGradient(x - cW / 2, y - cH, x + cW / 2, y);
            seatG.addColorStop(0, '#201838'); seatG.addColorStop(1, '#18122c');
            ctx.fillStyle = seatG;
            ctx.beginPath(); ctx.roundRect(x - cW / 2, y - cH / 2, cW, cH, 4); ctx.fill();
            ctx.strokeStyle = ha(col, 0.12); ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(x - cW / 2, y - cH / 2, cW, cH, 4); ctx.stroke();

            ctx.fillStyle = '#1a1430';
            ctx.beginPath(); ctx.roundRect(x - cW / 2, y - cH / 2 - backH, cW, backH + 2, [4, 4, 0, 0]); ctx.fill();
            ctx.strokeStyle = ha(col, 0.08); ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.roundRect(x - cW / 2, y - cH / 2 - backH, cW, backH + 2, [4, 4, 0, 0]); ctx.stroke();

            [x - cW / 2 - 4, x + cW / 2 - 2].forEach(ax => {
                ctx.fillStyle = '#1c1632';
                ctx.beginPath(); ctx.roundRect(ax, y - cH / 2 - 4, 6, cH + 4, 2); ctx.fill();
            });

            ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(x - 10, y - cH / 2 + 2); ctx.lineTo(x - 10, y + cH / 2 - 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x + 10, y - cH / 2 + 2); ctx.lineTo(x + 10, y + cH / 2 - 2); ctx.stroke();

            ctx.fillStyle = ha(col, 0.08);
            ctx.beginPath(); ctx.ellipse(x - 15, y - 4, 7, 5, -0.2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(x + 15, y - 4, 7, 5, 0.2, 0, Math.PI * 2); ctx.fill();
        };

        const drawVending = (x: number, y: number, col: string, t: number) => {
            const w2 = 24, h2 = 50;

            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath(); ctx.ellipse(x, y + 2, w2 * 0.45, 3, 0, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#0c0a18';
            ctx.strokeStyle = 'rgba(60,50,80,0.35)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(x - w2 / 2, y - h2, w2, h2, 2); ctx.fill(); ctx.stroke();

            const glassX = x - w2 / 2 + 2, glassY = y - h2 + 3;
            const glassW = w2 - 4, glassH = h2 * 0.55;
            ctx.fillStyle = 'rgba(139,92,246,0.04)';
            ctx.fillRect(glassX, glassY, glassW, glassH);
            ctx.strokeStyle = 'rgba(60,50,80,0.3)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(glassX, glassY, glassW, glassH);

            const itemColors = ['#8B5CF6', '#ef4444', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899'];
            const cols2 = 3, rows = 3;
            const iw = (glassW - 4) / cols2, ih2 = (glassH - 4) / rows;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols2; c++) {
                    const ci = (r * cols2 + c) % itemColors.length;
                    ctx.fillStyle = ha(itemColors[ci], 0.4);
                    ctx.beginPath();
                    ctx.roundRect(glassX + 2 + c * iw + 1, glassY + 2 + r * ih2 + 1, iw - 2, ih2 - 2, 1.5);
                    ctx.fill();
                }
            }

            const panelY = y - h2 + 3 + glassH + 3;
            ctx.fillStyle = 'rgba(20,16,30,0.8)';
            ctx.fillRect(x - 8, panelY, 16, 10);
            ctx.fillStyle = ha('#22c55e', 0.5);
            ctx.font = 'bold 5px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(Math.sin(t) > 0 ? '₽50' : 'OK', x, panelY + 7);
            ctx.textAlign = 'start';

            ctx.fillStyle = 'rgba(40,35,55,0.5)';
            ctx.fillRect(x - 6, y - 8, 12, 6);

            ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.globalAlpha = 0.04;
            ctx.fillStyle = col; ctx.fillRect(glassX, glassY, glassW, glassH); ctx.restore();

            ctx.font = 'bold 6px monospace'; ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillText('DRINKS', x + 1, y - h2 - 2);
            ctx.fillStyle = ha(col, 0.5);
            ctx.fillText('DRINKS', x, y - h2 - 3);
            ctx.textAlign = 'start';
        };

        const drawCoffeeTable = (x: number, y: number, col: string, t: number) => {
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.beginPath(); ctx.ellipse(x, y + 2, 14, 3, 0, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = 'rgba(35,28,50,0.7)';
            ctx.fillRect(x - 1.5, y - 8, 3, 12);

            ctx.fillStyle = '#1a1430';
            ctx.strokeStyle = 'rgba(50,42,65,0.4)'; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.roundRect(x - 14, y - 12, 28, 6, 2); ctx.fill(); ctx.stroke();

            ctx.fillStyle = 'rgba(80,60,40,0.35)';
            ctx.beginPath(); ctx.ellipse(x - 4, y - 12, 3, 4, 0, Math.PI, Math.PI * 2); ctx.fill();
            ctx.fillRect(x - 7, y - 12, 6, 4);
            ctx.fillStyle = ha(col, 0.12);
            ctx.beginPath(); ctx.ellipse(x - 4, y - 12, 2.5, 3, 0, 0, Math.PI); ctx.fill();
            if (Math.sin(t * 2) > 0.5) {
                ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(x - 3, y - 16);
                ctx.quadraticCurveTo(x - 4, y - 20, x - 2, y - 22);
                ctx.stroke();
            }

            ctx.fillStyle = 'rgba(30,120,200,0.15)';
            ctx.fillRect(x + 3, y - 14, 8, 5);
            ctx.fillStyle = 'rgba(255,255,255,0.06)';
            for (let li = 0; li < 3; li++) {
                ctx.fillRect(x + 4, y - 13 + li * 1.5, 5, 0.8);
            }
        };

        const drawDesk = (x: number, y: number, col: string, isOrch: boolean, working: boolean, t: number, ph: number) => {
            const dW = isOrch ? 82 : 62, dH2 = isOrch ? 24 : 20, legH = isOrch ? 22 : 18;

            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath(); ctx.ellipse(x, y + legH + 2, dW * 0.42, 3, 0, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = 'rgba(45,38,60,0.6)';
            ctx.fillRect(x - dW / 2 + 5, y + 1, 2.5, legH);
            ctx.fillRect(x + dW / 2 - 7, y + 1, 2.5, legH);
            ctx.fillRect(x - dW / 4, y + 1, 2, legH);
            ctx.fillRect(x + dW / 4 - 2, y + 1, 2, legH);

            const topG = ctx.createLinearGradient(x - dW / 2, y - dH2 / 2, x + dW / 2, y + dH2 / 2);
            topG.addColorStop(0, isOrch ? '#201838' : '#181328');
            topG.addColorStop(1, isOrch ? '#16102c' : '#100c1e');
            ctx.fillStyle = topG;
            ctx.beginPath(); ctx.roundRect(x - dW / 2, y - dH2 / 2, dW, dH2, 3); ctx.fill();
            ctx.strokeStyle = isOrch ? ha(col, 0.2) : 'rgba(55,48,72,0.25)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(x - dW / 2, y - dH2 / 2, dW, dH2, 3); ctx.stroke();

            if (isOrch) {
                ctx.fillStyle = ha(col, 0.04);
                ctx.beginPath(); ctx.roundRect(x - dW / 2 + 3, y - dH2 / 2 + 2, dW - 6, dH2 - 4, 1); ctx.fill();
            }

            const monW = isOrch ? 38 : 28, monH = isOrch ? 28 : 22;
            const monY2 = y - dH2 / 2 - monH - 4;

            ctx.fillStyle = 'rgba(30,25,42,0.5)';
            ctx.fillRect(x - 1.5, monY2 + monH, 3, 6);
            ctx.beginPath(); ctx.ellipse(x, monY2 + monH + 6, 7, 2.5, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(30,25,42,0.4)'; ctx.fill();

            ctx.fillStyle = '#07060c';
            ctx.strokeStyle = isOrch ? ha(col, 0.3) : 'rgba(55,48,72,0.4)';
            ctx.lineWidth = isOrch ? 2 : 1.5;
            ctx.beginPath(); ctx.roundRect(x - monW / 2, monY2, monW, monH, 3); ctx.fill(); ctx.stroke();

            const sX = x - monW / 2 + 3, sY = monY2 + 3, sW = monW - 6, sH = monH - 6;
            if (working || isOrch) {
                const pulse = 0.4 + Math.sin(t * 2 + ph) * 0.15;
                const scG = ctx.createLinearGradient(sX, sY, sX + sW, sY + sH);
                scG.addColorStop(0, ha(col, pulse * 0.55)); scG.addColorStop(1, ha(col, pulse * 0.2));
                ctx.fillStyle = scG; ctx.fillRect(sX, sY, sW, sH);

                if (working) {
                    const lines = isOrch ? 5 : 3;
                    for (let i = 0; i < lines; i++) {
                        const lw = sW * (0.2 + 0.55 * Math.abs(Math.sin(t * 3 + i * 1.3 + ph)));
                        ctx.fillStyle = 'rgba(255,255,255,0.15)';
                        ctx.fillRect(sX + 2, sY + 3 + i * (isOrch ? 4 : 5), lw - 2, 1.5);
                    }
                    if (Math.sin(t * 5 + ph) > 0) {
                        const ci = Math.floor(t * 2 + ph) % (isOrch ? 5 : 3);
                        const cxP = sX + 2 + sW * (0.2 + 0.55 * Math.abs(Math.sin(t * 3 + ci * 1.3 + ph))) - 2;
                        ctx.fillStyle = 'rgba(255,255,255,0.7)';
                        ctx.fillRect(cxP, sY + 3 + ci * (isOrch ? 4 : 5), 1, 4);
                    }
                }

                ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = isOrch ? 30 : 18; ctx.globalAlpha = 0.15;
                ctx.fillStyle = col; ctx.fillRect(sX, sY, sW, sH); ctx.restore();

                ctx.fillStyle = ha(col, 0.04);
                ctx.beginPath();
                ctx.moveTo(x - monW * 0.6, monY2 + monH + 10);
                ctx.lineTo(x + monW * 0.6, monY2 + monH + 10);
                ctx.lineTo(x + monW * 0.3, y + dH2 / 2 + 4);
                ctx.lineTo(x - monW * 0.3, y + dH2 / 2 + 4);
                ctx.closePath(); ctx.fill();

                const glowR = isOrch ? 45 : 30;
                const gG = ctx.createRadialGradient(x, y - dH2 / 2, 0, x, y - dH2 / 2, glowR);
                gG.addColorStop(0, ha(col, 0.06)); gG.addColorStop(1, ha(col, 0));
                ctx.fillStyle = gG;
                ctx.beginPath(); ctx.arc(x, y - dH2 / 2, glowR, 0, Math.PI * 2); ctx.fill();
            } else {
                ctx.fillStyle = 'rgba(12,10,18,0.8)'; ctx.fillRect(sX, sY, sW, sH);
            }

            if (isOrch) {
                [-18, 18].forEach(off => {
                    const sw = 16, sh = 12;
                    ctx.fillStyle = '#07060c';
                    ctx.strokeStyle = ha(col, 0.18); ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.roundRect(x + off - sw / 2, monY2 + 4, sw, sh, 2); ctx.fill(); ctx.stroke();
                    if (working) {
                        ctx.fillStyle = ha(col, 0.18);
                        ctx.fillRect(x + off - sw / 2 + 2, monY2 + 6, sw - 4, sh - 4);
                    }
                    ctx.fillStyle = 'rgba(30,25,42,0.4)'; ctx.fillRect(x + off - 1, monY2 + 4 + sh, 2, 3);
                });
            }

            const kbW = isOrch ? 24 : 18, kbH = isOrch ? 8 : 7;
            const kbX = x - kbW / 2, kbY = y - 2;
            ctx.fillStyle = 'rgba(30,25,45,0.7)';
            ctx.beginPath(); ctx.roundRect(kbX, kbY, kbW, kbH, 1.5); ctx.fill();
            const ks = 2.2, kg = 0.8;
            const kpr = Math.floor((kbW - 3) / (ks + kg));
            for (let r = 0; r < 3; r++) {
                for (let k = 0; k < kpr; k++) {
                    const kx2 = kbX + 1.5 + k * (ks + kg);
                    const ky2 = kbY + 1.5 + r * (ks + kg);
                    if (kx2 + ks > kbX + kbW - 1) continue;
                    ctx.fillStyle = working && Math.sin(t * 14 + k * 0.8 + r * 2.3 + ph) > 0.75
                        ? ha(col, 0.35) : 'rgba(50,42,65,0.45)';
                    ctx.fillRect(kx2, ky2, ks, ks);
                }
            }

            const mX = x + kbW / 2 + 6, mY = kbY + 1;
            ctx.fillStyle = 'rgba(35,28,48,0.6)';
            ctx.beginPath(); ctx.roundRect(mX, mY, 5, 7, 2); ctx.fill();
        };

        const drawChair = (x: number, y: number, col: string, isOrch: boolean) => {
            const cY = y + (isOrch ? 16 : 12);
            const sW = isOrch ? 20 : 16, sH = 6;
            ctx.fillStyle = isOrch ? ha(col, 0.1) : 'rgba(30,25,45,0.7)';
            ctx.beginPath(); ctx.roundRect(x - sW / 2, cY, sW, sH, 3); ctx.fill();
            const bW = isOrch ? 18 : 14, bH2 = isOrch ? 18 : 14;
            ctx.fillStyle = isOrch ? ha(col, 0.12) : 'rgba(35,28,48,0.7)';
            ctx.strokeStyle = isOrch ? ha(col, 0.2) : 'rgba(50,42,65,0.3)';
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.roundRect(x - bW / 2, cY - bH2, bW, bH2, 3); ctx.fill(); ctx.stroke();
            ctx.fillStyle = 'rgba(25,20,38,0.5)'; ctx.fillRect(x - 1, cY + sH, 2, 6);
            [x - sW / 2 + 2, x + sW / 2 - 2, x].forEach(wx => {
                ctx.fillStyle = 'rgba(20,16,32,0.7)';
                ctx.beginPath(); ctx.arc(wx, cY + sH + 6, 1.5, 0, Math.PI * 2); ctx.fill();
            });
        };

        const drawPerson = (a: Agent, col: string, isOrch: boolean, t: number, isWalking: boolean) => {
            const bob = noMo.current ? 0 : (isWalking
                ? Math.abs(Math.sin(a.walkT * 20 * Math.PI)) * 3
                : Math.sin(t * 1.5 + a.phase) * 1);
            const hR = isOrch ? 10 : 8;
            const hY = a.y - (isOrch ? 24 : 18) - bob;
            const hX = a.x;

            const bW = isOrch ? 18 : 14, bH2 = isOrch ? 14 : 11;
            const bY = hY + hR - 2;

            const shG = ctx.createLinearGradient(hX, bY, hX, bY + bH2);
            shG.addColorStop(0, a.shirt);
            shG.addColorStop(1, ha(a.shirt, 0.55));
            ctx.fillStyle = shG;
            ctx.beginPath(); ctx.roundRect(hX - bW / 2, bY, bW, bH2, 3); ctx.fill();

            ctx.fillStyle = ha(a.shirt, 0.7);
            ctx.beginPath(); ctx.roundRect(hX - (bW + 4) / 2, bY, bW + 4, 5, 2); ctx.fill();

            ctx.fillStyle = ha(a.shirt, 0.3);
            ctx.fillRect(hX - 0.5, bY + 3, 1, bH2 - 4);

            if (isWalking && !noMo.current) {
                const legPhase = Math.sin(a.walkT * 18 * Math.PI);
                [-1, 1].forEach(side => {
                    const lOff = side * legPhase * 3;
                    ctx.fillStyle = '#1a1830';
                    ctx.fillRect(hX + side * 3 - 2, bY + bH2, 4, 9 + lOff * side * 0.3);
                    ctx.fillStyle = '#151225';
                    ctx.beginPath(); ctx.ellipse(hX + side * 3, bY + bH2 + 9 + lOff * side * 0.3, 3, 2, 0, 0, Math.PI * 2); ctx.fill();
                });

                [-1, 1].forEach(side => {
                    const aOff = -side * legPhase * 0.3;
                    ctx.save();
                    ctx.translate(hX + side * (bW / 2 + 1), bY + 4);
                    ctx.rotate(aOff);
                    ctx.fillStyle = a.shirt;
                    ctx.beginPath(); ctx.roundRect(-2.5, 0, 5, bH2 * 0.55, 2); ctx.fill();
                    ctx.fillStyle = a.skin;
                    ctx.beginPath(); ctx.arc(0, bH2 * 0.55 + 1, 3, 0, Math.PI * 2); ctx.fill();
                    ctx.restore();
                });
            } else {
                [-1, 1].forEach(side => {
                    ctx.save();
                    ctx.translate(hX + side * (bW / 2 + 1), bY + 4);
                    const rot = a.state === 'working' ? (Math.sin(t * 3.5 + a.phase + side) * 0.15) : 0;
                    ctx.rotate(rot);
                    ctx.fillStyle = a.shirt;
                    ctx.beginPath(); ctx.roundRect(-2.5, 0, 5, bH2 * 0.5, 2); ctx.fill();
                    ctx.fillStyle = a.skin;
                    ctx.beginPath(); ctx.arc(0, bH2 * 0.5 + 1, 3, 0, Math.PI * 2); ctx.fill();
                    ctx.restore();
                });
            }

            const hdG = ctx.createRadialGradient(hX - 1, hY - 2, 0, hX, hY, hR);
            hdG.addColorStop(0, a.skin);
            hdG.addColorStop(0.8, ha(a.skin, 0.88));
            ctx.fillStyle = hdG;
            ctx.beginPath(); ctx.arc(hX, hY, hR, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = a.hair;
            const hs = Math.floor(a.phase * 3) % 3;
            if (hs === 0) {
                ctx.beginPath();
                ctx.ellipse(hX, hY - hR * 0.35, hR + 1.5, hR * 0.7, 0, Math.PI, Math.PI * 2); ctx.fill();
                ctx.fillRect(hX + hR - 1, hY - hR * 0.35, 2.5, hR * 0.6);
            } else if (hs === 1) {
                ctx.beginPath();
                ctx.arc(hX, hY - 1, hR + 1, Math.PI + 0.4, -0.4); ctx.fill();
            } else {
                ctx.beginPath();
                ctx.ellipse(hX, hY - hR * 0.4, hR + 2, hR * 0.6, 0, Math.PI + 0.5, -0.5); ctx.fill();
                ctx.fillRect(hX - hR - 1, hY - hR * 0.4, 2.5, hR * 0.9);
                ctx.fillRect(hX + hR - 1, hY - hR * 0.4, 2.5, hR * 0.9);
            }

            const eY = hY + 1, eO = hR * 0.3;
            ctx.fillStyle = '#1a1520';
            ctx.fillRect(hX - eO - 1.8, eY, 3, 2.5);
            ctx.fillRect(hX + eO - 1, eY, 3, 2.5);
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(hX - eO - 0.2, eY + 0.8, 0.6, 0, Math.PI * 2);
            ctx.arc(hX + eO + 0.4, eY + 0.8, 0.6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = ha(a.skin, 0.6);
            ctx.beginPath(); ctx.arc(hX, hY + hR * 0.45, 1.2, 0, Math.PI); ctx.fill();

            if (a.state === 'working' && !noMo.current && Math.sin(t * 7 + a.phase) > 0.85) {
                ctx.fillStyle = ha(col, 0.45);
                ctx.font = '600 8px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('···', hX, hY - hR - 3);
                ctx.textAlign = 'start';
            }

            if (isOrch) {
                ctx.strokeStyle = ha(col, 0.4); ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(hX, hY, hR + 5, 0, Math.PI * 2); ctx.stroke();

                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.moveTo(hX, hY - hR - 8);
                ctx.lineTo(hX - 5, hY - hR - 2);
                ctx.lineTo(hX - 2, hY - hR - 3);
                ctx.lineTo(hX, hY - hR);
                ctx.lineTo(hX + 2, hY - hR - 3);
                ctx.lineTo(hX + 5, hY - hR - 2);
                ctx.closePath(); ctx.fill();

                ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 18; ctx.globalAlpha = 0.15;
                ctx.beginPath(); ctx.arc(hX, hY, hR + 10, 0, Math.PI * 2);
                ctx.fillStyle = col; ctx.fill(); ctx.restore();
            }

            if (a.state === 'working') {
                ctx.fillStyle = '#22c55e';
                ctx.beginPath(); ctx.arc(hX + hR + 3, hY - hR + 1, 4, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#050505'; ctx.lineWidth = 1.5; ctx.stroke();
                ctx.fillStyle = 'white'; ctx.font = 'bold 5px Inter, sans-serif';
                ctx.textAlign = 'center'; ctx.fillText('✓', hX + hR + 3, hY - hR + 3); ctx.textAlign = 'start';
            }

            ctx.textAlign = 'center';

            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.font = `bold ${isOrch ? 11 : 10}px Inter, sans-serif`;
            ctx.fillText(a.name, hX + 1, hY - hR - (isOrch ? 14 : 8) + 1);
            ctx.fillStyle = `rgba(255,255,255,${isOrch ? 0.92 : 0.72})`;
            ctx.fillText(a.name, hX, hY - hR - (isOrch ? 14 : 8));

            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.font = `600 ${isOrch ? 8 : 7}px Inter, sans-serif`;
            ctx.fillText(a.role, hX + 1, hY - hR - (isOrch ? 24 : 17) + 1);
            ctx.fillStyle = ha(col, 0.7);
            ctx.fillText(a.role, hX, hY - hR - (isOrch ? 24 : 17));
            ctx.textAlign = 'start';
        };

        const drawParticle = (p: Particle, t: number) => {
            const x = p.fx + (p.tx - p.fx) * p.p;
            const arc = -55 * Math.sin(p.p * Math.PI);
            const y = p.fy + (p.ty - p.fy) * p.p + arc;
            const r = 3.5 + Math.sin(t * 6 + p.idx) * 1.2;
            ctx.save(); ctx.shadowColor = p.col; ctx.shadowBlur = 18;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = p.col; ctx.fill(); ctx.restore();
            ctx.beginPath(); ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = ha(p.col, 0.06); ctx.fill();
            for (let i = 1; i <= 4; i++) {
                const tp = Math.max(0, p.p - i * 0.025);
                const tx2 = p.fx + (p.tx - p.fx) * tp;
                const ty2 = p.fy + (p.ty - p.fy) * tp - 55 * Math.sin(tp * Math.PI);
                ctx.beginPath(); ctx.arc(tx2, ty2, r * (1 - i / 5) * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = ha(p.col, 0.08 * (1 - i / 5)); ctx.fill();
            }
        };

        const drawConnections = (agList: Agent[], orch: Agent, col: string) => {
            agList.forEach(a => {
                if (a === orch || a.state === 'idle') return;
                ctx.beginPath();
                ctx.moveTo(orch.x, orch.y);
                const mx = (orch.x + a.x) / 2, my = (orch.y + a.y) / 2 - 12;
                ctx.quadraticCurveTo(mx, my, a.x, a.y);
                ctx.strokeStyle = ha(col, a.state === 'working' ? 0.1 : 0.04);
                ctx.lineWidth = 0.6;
                ctx.setLineDash([3, 5]); ctx.stroke(); ctx.setLineDash([]);
            });
        };

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

            if (!noMo.current) {
                agList.forEach((a, i) => {
                    if (i === 0) { a.state = 'working'; return; }

                    const agentTime = (t + a.cycleOffset) % CYCLE;
                    const ap = agentTime / CYCLE;

                    if (ap < PH_WALK_TO_END) {
                        const rawT = clamp01(ap / PH_WALK_TO_END);
                        a.state = 'walk_to_desk';
                        a.walkT = rawT;
                        const e = easeIO(rawT);
                        a.x = lerp(a.loungeX, a.deskX, e);
                        a.y = lerp(a.loungeY, a.deskY, e);

                        if (orch && rawT > 0.01 && rawT < 0.06) {
                            if (!pts.current.some(p => p.idx === i && !p.ret)) {
                                pts.current.push({
                                    fx: orch.x, fy: orch.y - 25,
                                    tx: a.loungeX, ty: a.loungeY - 15,
                                    p: 0, spd: 1.4, idx: i, ret: false, col: niche.color,
                                });
                            }
                        }
                    } else if (ap < PH_WORK_END) {
                        a.state = 'working';
                        a.x = a.deskX; a.y = a.deskY;
                        a.workProgress = Math.min(1, a.workProgress + dt * 0.2);

                        if (orch && ap > PH_WORK_END - 0.04 && ap < PH_WORK_END - 0.02) {
                            if (!pts.current.some(p => p.idx === i && p.ret)) {
                                pts.current.push({
                                    fx: a.x, fy: a.y - 15,
                                    tx: orch.x, ty: orch.y - 25,
                                    p: 0, spd: 1.6, idx: i, ret: true, col: '#22c55e',
                                });
                            }
                        }
                    } else if (ap < PH_WALK_BACK_END) {
                        const rawT = clamp01((ap - PH_WALK_BACK_START) / (PH_WALK_BACK_END - PH_WALK_BACK_START));
                        a.state = 'walk_back';
                        a.walkT = rawT;
                        const e = easeIO(rawT);
                        a.x = lerp(a.deskX, a.loungeX, e);
                        a.y = lerp(a.deskY, a.loungeY, e);
                    } else {
                        a.state = 'idle';
                        a.x = a.loungeX; a.y = a.loungeY;
                        a.walkT = 0; a.workProgress = 0;
                    }
                });
            } else {
                agList.forEach((a, i) => {
                    if (i === 0) { a.state = 'working'; return; }
                    a.state = 'working'; a.x = a.deskX; a.y = a.deskY;
                });
            }

            const walkingAgents = agList.filter(a => a.state === 'walk_to_desk' || a.state === 'walk_back').length;
            const workingAgents = agList.filter(a => a.state === 'working').length;
            const idleAgents = agList.filter(a => a.state === 'idle').length;

            drawRoom(W, H, niche.color, t, walkingAgents);

            const arcadeX = lL + (lR - lL) * 0.15;
            const arcadeY = wallBot + fH * 0.50;
            drawArcade(arcadeX, arcadeY, niche.color, t);

            const couchX = lL + (lR - lL) * 0.55;
            const couchY = wallBot + fH * 0.72;
            drawCouch(couchX, couchY, niche.color);

            const vendX = lL + (lR - lL) * 0.88;
            const vendY = wallBot + fH * 0.48;
            drawVending(vendX, vendY, niche.color, t);

            const coffeeX = lL + (lR - lL) * 0.45;
            const coffeeY = wallBot + fH * 0.45;
            drawCoffeeTable(coffeeX, coffeeY, niche.color, t);

            if (orch) drawConnections(agList, orch, niche.color);

            const desksToRender = [...deskPos.current].sort((a, b) => a.y - b.y);
            desksToRender.forEach(d => {
                const sittingAgent = agList.find(a => a.deskX === d.x && a.deskY === d.y && a.state === 'working');
                const isWorking = !!sittingAgent;
                const ph = sittingAgent ? sittingAgent.phase : 0;
                drawChair(d.x, d.y, niche.color, d.isOrch);
                drawDesk(d.x, d.y, niche.color, d.isOrch, isWorking, t, ph);
            });

            const sorted = [...agList].sort((a, b) => a.y - b.y);
            sorted.forEach(a => {
                const isO = a === orch;
                const isWalking = a.state === 'walk_to_desk' || a.state === 'walk_back';
                drawPerson(a, niche.color, isO, t, isWalking);
            });

            pts.current = pts.current.filter(p => {
                p.p += dt * p.spd;
                if (p.p >= 1) return false;
                drawParticle(p, t); return true;
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
    }, [niche, activeNiche, buildLayout]);

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
