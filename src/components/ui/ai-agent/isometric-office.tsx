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
    sx: number;
    sy: number;
    working: boolean;
    progress: number;
    delay: number;
    phase: number;
    row: number;
}

interface Particle {
    fx: number; fy: number; tx: number; ty: number;
    p: number; spd: number; idx: number; ret: boolean; col: string;
}

const ha = (hex: string, a: number) =>
    hex + Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');

export const IsometricOffice = ({ niche, activeNiche, currentStage }: IsometricOfficeProps) => {
    const cvRef = useRef<HTMLCanvasElement>(null);
    const afRef = useRef(0);
    const ags = useRef<Agent[]>([]);
    const pts = useRef<Particle[]>([]);
    const clk = useRef(0);
    const pN = useRef(-1);
    const pS = useRef(-1);
    const noMotion = useRef(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        noMotion.current = mq.matches;
        const fn = (e: MediaQueryListEvent) => { noMotion.current = e.matches; };
        mq.addEventListener('change', fn);
        return () => mq.removeEventListener('change', fn);
    }, []);

    const buildLayout = useCallback((team: NicheScenario['agentTeam'], W: number, H: number) => {
        const roomLeft = W * 0.12;
        const roomRight = W * 0.88;
        const roomTop = H * 0.38;
        const roomBottom = H * 0.88;
        const rW = roomRight - roomLeft;
        const rH = roomBottom - roomTop;

        const orchX = roomLeft + rW * 0.5;
        const orchY = roomTop + rH * 0.08;

        const positions: { x: number; y: number; row: number }[] = [
            { x: orchX, y: orchY, row: 0 },
        ];

        const workers = team.length - 1;
        if (workers <= 3) {
            const spacing = rW / (workers + 1);
            for (let i = 0; i < workers; i++) {
                positions.push({ x: roomLeft + spacing * (i + 1), y: roomTop + rH * 0.55, row: 1 });
            }
        } else if (workers <= 5) {
            const row1 = Math.ceil(workers / 2);
            const row2 = workers - row1;
            const s1 = rW / (row1 + 1);
            for (let i = 0; i < row1; i++) {
                positions.push({ x: roomLeft + s1 * (i + 1), y: roomTop + rH * 0.4, row: 1 });
            }
            const s2 = rW / (row2 + 1);
            for (let i = 0; i < row2; i++) {
                positions.push({ x: roomLeft + s2 * (i + 1), y: roomTop + rH * 0.72, row: 2 });
            }
        } else {
            const row1 = Math.ceil(workers / 2);
            const row2 = workers - row1;
            const s1 = rW / (row1 + 1);
            for (let i = 0; i < row1; i++) {
                positions.push({ x: roomLeft + s1 * (i + 1), y: roomTop + rH * 0.38, row: 1 });
            }
            const s2 = rW / (row2 + 1);
            for (let i = 0; i < row2; i++) {
                positions.push({ x: roomLeft + s2 * (i + 1), y: roomTop + rH * 0.72, row: 2 });
            }
        }

        ags.current = team.map((a, i) => {
            const pos = positions[i] || positions[positions.length - 1];
            return {
                name: a.name, role: a.role,
                sx: pos.x, sy: pos.y,
                working: false, progress: 0,
                delay: i * 380 + 500,
                phase: Math.random() * Math.PI * 2,
                row: pos.row,
            };
        });
    }, []);

    useEffect(() => {
        if (activeNiche !== pN.current || currentStage !== pS.current) {
            pN.current = activeNiche; pS.current = currentStage;
            const c = cvRef.current; if (!c) return;
            const dpr = window.devicePixelRatio || 1;
            buildLayout(niche.agentTeam, c.width / dpr, c.height / dpr);
            pts.current = []; clk.current = 0;
            ags.current.forEach(a => { a.working = false; a.progress = 0; });
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

        const drawRoom = (W: number, H: number, col: string, t: number) => {
            const rL = W * 0.08, rR = W * 0.92;
            const wallTop = H * 0.06;
            const wallBot = H * 0.36;
            const floorBot = H * 0.92;

            const wallGradL = ctx.createLinearGradient(rL, wallTop, rL, wallBot);
            wallGradL.addColorStop(0, '#12101a');
            wallGradL.addColorStop(0.5, '#161322');
            wallGradL.addColorStop(1, '#0e0c16');
            ctx.fillStyle = wallGradL;
            ctx.fillRect(rL, wallTop, (rR - rL) / 2, wallBot - wallTop);

            const wallGradR = ctx.createLinearGradient(rL + (rR - rL) / 2, wallTop, rR, wallBot);
            wallGradR.addColorStop(0, '#161322');
            wallGradR.addColorStop(0.5, '#1a1628');
            wallGradR.addColorStop(1, '#12101a');
            ctx.fillStyle = wallGradR;
            ctx.fillRect(rL + (rR - rL) / 2, wallTop, (rR - rL) / 2, wallBot - wallTop);

            ctx.strokeStyle = ha(col, 0.08);
            ctx.lineWidth = 1;
            ctx.strokeRect(rL, wallTop, rR - rL, wallBot - wallTop);

            const brickH = 16;
            const brickW = 28;
            ctx.strokeStyle = 'rgba(255,255,255,0.015)';
            ctx.lineWidth = 0.5;
            for (let row = 0; row < Math.ceil((wallBot - wallTop) / brickH); row++) {
                const y = wallTop + row * brickH;
                const offset = row % 2 === 0 ? 0 : brickW / 2;
                for (let x = rL + offset; x < rR; x += brickW) {
                    ctx.strokeRect(x, y, brickW, brickH);
                }
            }

            const moldH = 4;
            ctx.fillStyle = ha(col, 0.06);
            ctx.fillRect(rL, wallBot - moldH, rR - rL, moldH);
            ctx.fillStyle = '#0a0812';
            ctx.fillRect(rL, wallBot - 1, rR - rL, 2);

            const floorGrad = ctx.createLinearGradient(rL, wallBot, rL, floorBot);
            floorGrad.addColorStop(0, '#0c0a14');
            floorGrad.addColorStop(1, '#080610');
            ctx.fillStyle = floorGrad;
            ctx.fillRect(rL, wallBot, rR - rL, floorBot - wallBot);

            const tileSize = 32;
            for (let tx = rL; tx < rR; tx += tileSize) {
                for (let ty = wallBot; ty < floorBot; ty += tileSize) {
                    const checker = (Math.floor((tx - rL) / tileSize) + Math.floor((ty - wallBot) / tileSize)) % 2 === 0;
                    ctx.fillStyle = checker ? 'rgba(139,92,246,0.02)' : 'rgba(255,255,255,0.008)';
                    ctx.fillRect(tx + 0.5, ty + 0.5, tileSize - 1, tileSize - 1);
                }
            }
            ctx.strokeStyle = 'rgba(139,92,246,0.03)';
            ctx.lineWidth = 0.5;
            for (let tx = rL; tx <= rR; tx += tileSize) {
                ctx.beginPath(); ctx.moveTo(tx, wallBot); ctx.lineTo(tx, floorBot); ctx.stroke();
            }
            for (let ty = wallBot; ty <= floorBot; ty += tileSize) {
                ctx.beginPath(); ctx.moveTo(rL, ty); ctx.lineTo(rR, ty); ctx.stroke();
            }

            ctx.strokeStyle = ha(col, 0.04);
            ctx.lineWidth = 1;
            ctx.strokeRect(rL, wallBot, rR - rL, floorBot - wallBot);

            const wScreens = [
                { x: rL + (rR - rL) * 0.15, y: wallTop + 12, w: 60, h: 36 },
                { x: rL + (rR - rL) * 0.42, y: wallTop + 8, w: 72, h: 42 },
                { x: rL + (rR - rL) * 0.72, y: wallTop + 14, w: 56, h: 34 },
            ];

            wScreens.forEach((s, si) => {
                ctx.fillStyle = '#060510';
                ctx.strokeStyle = 'rgba(60,50,80,0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(s.x, s.y, s.w, s.h, 3);
                ctx.fill(); ctx.stroke();

                ctx.fillStyle = 'rgba(50,45,65,0.3)';
                ctx.fillRect(s.x + s.w / 2 - 1.5, s.y + s.h, 3, 8);
                ctx.fillRect(s.x + s.w / 2 - 8, s.y + s.h + 8, 16, 3);

                const innerX = s.x + 3, innerY = s.y + 3;
                const innerW = s.w - 6, innerH = s.h - 6;
                const sGrad = ctx.createLinearGradient(innerX, innerY, innerX + innerW, innerY + innerH);
                sGrad.addColorStop(0, ha(col, 0.15));
                sGrad.addColorStop(1, ha(col, 0.06));
                ctx.fillStyle = sGrad;
                ctx.fillRect(innerX, innerY, innerW, innerH);

                if (si === 1) {
                    const bars = 6;
                    const barW = (innerW - 8) / bars - 2;
                    for (let i = 0; i < bars; i++) {
                        const bh = innerH * (0.2 + 0.6 * Math.abs(Math.sin(t * 0.8 + i * 0.9)));
                        ctx.fillStyle = ha(col, 0.4);
                        ctx.fillRect(innerX + 4 + i * (barW + 2), innerY + innerH - bh - 2, barW, bh);
                    }
                    ctx.font = '600 7px Inter, sans-serif';
                    ctx.fillStyle = ha(col, 0.6);
                    ctx.fillText('ANALYTICS', innerX + 4, innerY + 9);
                } else if (si === 0) {
                    for (let i = 0; i < 5; i++) {
                        ctx.fillStyle = 'rgba(255,255,255,0.12)';
                        const lw = innerW * (0.3 + 0.5 * Math.abs(Math.sin(t * 0.5 + i)));
                        ctx.fillRect(innerX + 4, innerY + 6 + i * 6, lw - 4, 2);
                    }
                    ctx.font = '600 7px Inter, sans-serif';
                    ctx.fillStyle = ha(col, 0.6);
                    ctx.fillText('TASKS', innerX + 4, innerY + 9);
                } else {
                    const circR = Math.min(innerW, innerH) * 0.28;
                    const circX = innerX + innerW / 2;
                    const circY = innerY + innerH / 2 + 4;
                    ctx.beginPath();
                    ctx.arc(circX, circY, circR, 0, Math.PI * 2);
                    ctx.strokeStyle = ha(col, 0.2);
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(circX, circY, circR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 1.4);
                    ctx.strokeStyle = ha(col, 0.5);
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    ctx.font = 'bold 10px Inter, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = ha(col, 0.7);
                    ctx.fillText('89%', circX, circY + 4);
                    ctx.textAlign = 'start';
                    ctx.font = '600 6px Inter, sans-serif';
                    ctx.fillStyle = ha(col, 0.5);
                    ctx.textAlign = 'center';
                    ctx.fillText('EFFICIENCY', circX, circY + circR + 8);
                    ctx.textAlign = 'start';
                }

                ctx.save();
                ctx.shadowColor = col;
                ctx.shadowBlur = 20;
                ctx.globalAlpha = 0.08;
                ctx.fillStyle = col;
                ctx.fillRect(innerX, innerY, innerW, innerH);
                ctx.restore();
            });

            const serverX = rR - 30;
            const serverY = wallBot + 8;
            const serverW = 18;
            const serverH = floorBot - wallBot - 16;
            ctx.fillStyle = '#0a0814';
            ctx.strokeStyle = 'rgba(60,50,80,0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(serverX, serverY, serverW, serverH, 2);
            ctx.fill(); ctx.stroke();

            for (let i = 0; i < 6; i++) {
                const ry = serverY + 6 + i * (serverH / 7);
                ctx.fillStyle = 'rgba(30,25,45,0.6)';
                ctx.fillRect(serverX + 3, ry, serverW - 6, 8);
                ctx.fillStyle = Math.sin(t * 3 + i * 1.5) > 0 ? '#22c55e' : ha(col, 0.5);
                ctx.beginPath();
                ctx.arc(serverX + serverW - 5, ry + 4, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.font = '500 5px Inter, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.textAlign = 'center';
            ctx.fillText('SERVER', serverX + serverW / 2, serverY + serverH + 8);
            ctx.textAlign = 'start';

            const plantX = rL + 14;
            const plantY = floorBot - 10;
            ctx.fillStyle = '#2a1a0e';
            ctx.fillRect(plantX - 6, plantY - 12, 12, 14);
            ctx.fillStyle = '#3a2a18';
            ctx.beginPath();
            ctx.ellipse(plantX, plantY - 12, 7, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#1a4a1a';
            ctx.save();
            const leafAngles = [-0.6, -0.2, 0.15, 0.5, 0.8];
            leafAngles.forEach((ang, i) => {
                ctx.save();
                ctx.translate(plantX, plantY - 14);
                ctx.rotate(ang);
                ctx.beginPath();
                ctx.ellipse(0, -12 - i * 2, 4, 10 + i, 0, 0, Math.PI * 2);
                ctx.fillStyle = i % 2 === 0 ? '#1a5a1a' : '#226a22';
                ctx.fill();
                ctx.restore();
            });
            ctx.restore();

            const cableStartX = serverX;
            const cableY1 = serverY + serverH * 0.3;
            const cableY2 = serverY + serverH * 0.6;
            ctx.strokeStyle = ha(col, 0.06);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cableStartX, cableY1);
            ctx.quadraticCurveTo(cableStartX - 20, cableY1 + 15, cableStartX - 15, wallBot);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cableStartX, cableY2);
            ctx.quadraticCurveTo(cableStartX - 30, cableY2 + 10, cableStartX - 25, wallBot);
            ctx.stroke();
        };

        const drawWorkstation = (x: number, y: number, col: string, isOrch: boolean, working: boolean, t: number, phase: number) => {
            const dW = isOrch ? 90 : 68;
            const dH = isOrch ? 28 : 22;
            const dTop = y;
            const legH = isOrch ? 24 : 20;

            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.beginPath();
            ctx.ellipse(x, y + legH + 4, dW * 0.45, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            const legW = 3;
            const legColor = isOrch ? 'rgba(60,50,80,0.7)' : 'rgba(45,38,58,0.7)';
            ctx.fillStyle = legColor;
            ctx.fillRect(x - dW / 2 + 6, dTop + 2, legW, legH);
            ctx.fillRect(x + dW / 2 - 6 - legW, dTop + 2, legW, legH);
            ctx.fillRect(x - dW / 4, dTop + 2, legW, legH);
            ctx.fillRect(x + dW / 4 - legW, dTop + 2, legW, legH);

            const topGrad = ctx.createLinearGradient(x - dW / 2, dTop - dH / 2, x + dW / 2, dTop + dH / 2);
            if (isOrch) {
                topGrad.addColorStop(0, '#201838');
                topGrad.addColorStop(0.5, '#1c1432');
                topGrad.addColorStop(1, '#18102c');
            } else {
                topGrad.addColorStop(0, '#1a1528');
                topGrad.addColorStop(0.5, '#161222');
                topGrad.addColorStop(1, '#120e1c');
            }

            ctx.fillStyle = topGrad;
            ctx.strokeStyle = isOrch ? ha(col, 0.2) : 'rgba(60,50,80,0.25)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(x - dW / 2, dTop - dH / 2, dW, dH, 3);
            ctx.fill(); ctx.stroke();

            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.fillRect(x - dW / 2 + 2, dTop - dH / 2 + 2, dW - 4, 1);

            if (isOrch) {
                ctx.strokeStyle = ha(col, 0.08);
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.roundRect(x - dW / 2 + 4, dTop - dH / 2 + 3, dW - 8, dH - 6, 1);
                ctx.stroke();
            }

            const monW = isOrch ? 42 : 30;
            const monH = isOrch ? 32 : 24;
            const monX = x;
            const monY = dTop - dH / 2 - monH - 6;

            ctx.fillStyle = 'rgba(35,30,50,0.6)';
            ctx.fillRect(monX - 2, monY + monH, 4, 8);
            ctx.beginPath();
            ctx.ellipse(monX, monY + monH + 8, 8, 3, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(35,30,50,0.5)';
            ctx.fill();

            ctx.fillStyle = '#08060e';
            ctx.strokeStyle = isOrch ? ha(col, 0.3) : 'rgba(60,50,80,0.4)';
            ctx.lineWidth = isOrch ? 2 : 1.5;
            ctx.beginPath();
            ctx.roundRect(monX - monW / 2, monY, monW, monH, 3);
            ctx.fill(); ctx.stroke();

            const bevelSize = 3;
            ctx.fillStyle = 'rgba(30,25,42,0.4)';
            ctx.fillRect(monX - monW / 2, monY, monW, bevelSize);
            ctx.fillStyle = 'rgba(10,8,16,0.4)';
            ctx.fillRect(monX - monW / 2, monY + monH - bevelSize, monW, bevelSize);

            const sX = monX - monW / 2 + 3;
            const sY = monY + 3;
            const sW = monW - 6;
            const sH = monH - 6;

            if (working || isOrch) {
                const pulse = 0.4 + Math.sin(t * 2 + phase) * 0.15;
                const sGrad = ctx.createLinearGradient(sX, sY, sX + sW, sY + sH);
                sGrad.addColorStop(0, ha(col, pulse * 0.6));
                sGrad.addColorStop(1, ha(col, pulse * 0.25));
                ctx.fillStyle = sGrad;
                ctx.fillRect(sX, sY, sW, sH);

                if (working) {
                    const lines = isOrch ? 6 : 4;
                    for (let i = 0; i < lines; i++) {
                        const lw = sW * (0.2 + 0.6 * Math.abs(Math.sin(t * 3.5 + i * 1.3 + phase)));
                        ctx.fillStyle = 'rgba(255,255,255,0.15)';
                        ctx.fillRect(sX + 3, sY + 4 + i * (isOrch ? 4 : 4.5), lw - 3, 1.5);
                    }
                    if (Math.sin(t * 5 + phase) > 0) {
                        const ci = Math.floor(t * 2 + phase) % (isOrch ? 6 : 4);
                        const cxPos = sX + 3 + sW * (0.2 + 0.6 * Math.abs(Math.sin(t * 3.5 + ci * 1.3 + phase))) - 3;
                        ctx.fillStyle = 'rgba(255,255,255,0.7)';
                        ctx.fillRect(cxPos, sY + 4 + ci * (isOrch ? 4 : 4.5), 1, 5);
                    }
                }

                ctx.save();
                ctx.shadowColor = col;
                ctx.shadowBlur = isOrch ? 30 : 18;
                ctx.globalAlpha = 0.15;
                ctx.fillStyle = col;
                ctx.fillRect(sX, sY, sW, sH);
                ctx.restore();

                ctx.fillStyle = ha(col, 0.04);
                ctx.beginPath();
                ctx.moveTo(monX - monW * 0.6, monY + monH + 15);
                ctx.lineTo(monX + monW * 0.6, monY + monH + 15);
                ctx.lineTo(monX + monW * 0.3, dTop + dH / 2);
                ctx.lineTo(monX - monW * 0.3, dTop + dH / 2);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.fillStyle = 'rgba(15,12,22,0.8)';
                ctx.fillRect(sX, sY, sW, sH);
            }

            if (isOrch) {
                [-22, 22].forEach(off => {
                    const smW = 18; const smH = 14;
                    const smX = monX + off; const smY = monY + 4;
                    ctx.fillStyle = '#08060e';
                    ctx.strokeStyle = ha(col, 0.2);
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.roundRect(smX - smW / 2, smY, smW, smH, 2);
                    ctx.fill(); ctx.stroke();
                    if (working) {
                        ctx.fillStyle = ha(col, 0.2);
                        ctx.fillRect(smX - smW / 2 + 2, smY + 2, smW - 4, smH - 4);
                    }
                    ctx.fillStyle = 'rgba(35,30,50,0.5)';
                    ctx.fillRect(smX - 1, smY + smH, 2, 4);
                });
            }

            const kbW = isOrch ? 26 : 20;
            const kbH = isOrch ? 10 : 8;
            const kbX = x - kbW / 2;
            const kbY = dTop - 3;
            ctx.fillStyle = 'rgba(35,30,48,0.8)';
            ctx.strokeStyle = 'rgba(55,48,72,0.4)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.roundRect(kbX, kbY, kbW, kbH, 2);
            ctx.fill(); ctx.stroke();

            const keySize = 2.5;
            const keyGap = 1;
            const keysPerRow = Math.floor((kbW - 4) / (keySize + keyGap));
            for (let row = 0; row < 3; row++) {
                for (let k = 0; k < keysPerRow; k++) {
                    const kx = kbX + 2 + k * (keySize + keyGap) + (row === 2 ? 2 : 0);
                    const ky = kbY + 2 + row * (keySize + keyGap);
                    if (kx + keySize > kbX + kbW - 2) continue;
                    ctx.fillStyle = working && Math.sin(t * 15 + k * 0.7 + row * 2.1 + phase) > 0.7
                        ? ha(col, 0.35) : 'rgba(55,48,72,0.5)';
                    ctx.fillRect(kx, ky, keySize, keySize);
                }
            }

            const mX = x + kbW / 2 + 8;
            const mY = kbY + 2;
            ctx.fillStyle = 'rgba(40,35,55,0.7)';
            ctx.beginPath();
            ctx.roundRect(mX, mY, 6, 9, 3);
            ctx.fill();
            ctx.fillStyle = 'rgba(60,55,75,0.5)';
            ctx.fillRect(mX + 2, mY + 1, 2, 3);
        };

        const drawChair = (x: number, y: number, col: string, isOrch: boolean) => {
            const cY = y + (isOrch ? 18 : 14);

            ctx.fillStyle = 'rgba(30,25,42,0.5)';
            ctx.fillRect(x - 1.5, cY - 2, 3, 8);

            const seatW = isOrch ? 22 : 18;
            const seatH = isOrch ? 8 : 6;
            ctx.fillStyle = isOrch ? ha(col, 0.12) : 'rgba(35,30,48,0.8)';
            ctx.strokeStyle = isOrch ? ha(col, 0.2) : 'rgba(50,42,65,0.4)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.roundRect(x - seatW / 2, cY + 4, seatW, seatH, 3);
            ctx.fill(); ctx.stroke();

            const backW = isOrch ? 20 : 16;
            const backH = isOrch ? 22 : 18;
            const backY = cY - backH + 2;
            ctx.fillStyle = isOrch ? ha(col, 0.15) : 'rgba(38,32,52,0.85)';
            ctx.strokeStyle = isOrch ? ha(col, 0.25) : 'rgba(55,48,72,0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(x - backW / 2, backY, backW, backH, 4);
            ctx.fill(); ctx.stroke();

            if (isOrch) {
                ctx.fillStyle = ha(col, 0.08);
                ctx.beginPath();
                ctx.roundRect(x - backW / 2 + 3, backY + 3, backW - 6, backH - 6, 2);
                ctx.fill();
            }

            const wheelPositions = [
                [x - seatW / 2 + 2, cY + seatH + 3],
                [x + seatW / 2 - 2, cY + seatH + 3],
                [x, cY + seatH + 4],
            ];
            wheelPositions.forEach(([wx, wy]) => {
                ctx.fillStyle = 'rgba(25,20,35,0.8)';
                ctx.beginPath();
                ctx.arc(wx, wy, 2, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const drawPerson = (a: Agent, col: string, isOrch: boolean, t: number) => {
            const bob = noMotion.current ? 0 : Math.sin(t * 1.5 + a.phase) * 1.2;
            const baseY = a.sy + (isOrch ? 6 : 4) + bob;
            const headR = isOrch ? 10 : 8;
            const headY = baseY - (isOrch ? 18 : 14);

            const bodyW = isOrch ? 18 : 14;
            const bodyH = isOrch ? 14 : 11;
            const bodyY = headY + headR - 2;

            const torsoGrad = ctx.createLinearGradient(a.sx, bodyY, a.sx, bodyY + bodyH);
            torsoGrad.addColorStop(0, ha(col, 0.65));
            torsoGrad.addColorStop(1, ha(col, 0.35));
            ctx.fillStyle = torsoGrad;
            ctx.beginPath();
            ctx.roundRect(a.sx - bodyW / 2, bodyY, bodyW, bodyH, 3);
            ctx.fill();

            ctx.fillStyle = ha(col, 0.3);
            ctx.fillRect(a.sx - bodyW / 2 + 2, bodyY + bodyH * 0.4, bodyW - 4, 1);

            const shoulderW = bodyW + 4;
            ctx.fillStyle = ha(col, 0.5);
            ctx.beginPath();
            ctx.roundRect(a.sx - shoulderW / 2, bodyY, shoulderW, 5, 2);
            ctx.fill();

            const armLen = bodyH * 0.7;
            const armW = 4;
            const armAngle = a.working ? Math.sin(t * 4 + a.phase) * 0.15 : 0;
            [-1, 1].forEach(side => {
                ctx.save();
                ctx.translate(a.sx + side * (bodyW / 2 + 1), bodyY + 4);
                ctx.rotate(armAngle * side + 0.3 * side);
                ctx.fillStyle = ha(col, 0.45);
                ctx.beginPath();
                ctx.roundRect(-armW / 2, 0, armW, armLen, 2);
                ctx.fill();

                const skinGrad = ctx.createRadialGradient(0, armLen, 0, 0, armLen, 3.5);
                skinGrad.addColorStop(0, '#e8c4a8');
                skinGrad.addColorStop(1, '#c4986e');
                ctx.fillStyle = skinGrad;
                ctx.beginPath();
                ctx.arc(0, armLen, 3.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            const headGrad = ctx.createRadialGradient(a.sx - 1, headY - 2, 0, a.sx, headY, headR);
            headGrad.addColorStop(0, '#f2dcc8');
            headGrad.addColorStop(0.6, '#d4a984');
            headGrad.addColorStop(1, '#b88a6c');
            ctx.fillStyle = headGrad;
            ctx.beginPath();
            ctx.arc(a.sx, headY, headR, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#1a1520';
            const hairStyle = Math.floor(a.phase * 3) % 3;
            if (hairStyle === 0) {
                ctx.beginPath();
                ctx.arc(a.sx, headY - 2, headR + 1, Math.PI + 0.3, Math.PI * 2 - 0.3);
                ctx.quadraticCurveTo(a.sx + headR + 3, headY - 2, a.sx + headR, headY + 2);
                ctx.quadraticCurveTo(a.sx, headY - headR - 2, a.sx - headR, headY + 2);
                ctx.fill();
            } else if (hairStyle === 1) {
                ctx.beginPath();
                ctx.ellipse(a.sx, headY - headR * 0.4, headR + 1.5, headR * 0.7, 0, Math.PI, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.ellipse(a.sx, headY - headR * 0.3, headR + 2, headR * 0.65, 0, Math.PI + 0.5, Math.PI * 2 - 0.5);
                ctx.fill();
                ctx.fillRect(a.sx - headR - 1, headY - headR * 0.3, 3, headR);
                ctx.fillRect(a.sx + headR - 1, headY - headR * 0.3, 3, headR);
            }

            const eyeY = headY + 1;
            const eyeOff = headR * 0.3;
            ctx.fillStyle = '#1a1520';
            ctx.fillRect(a.sx - eyeOff - 2, eyeY, 3, 2);
            ctx.fillRect(a.sx + eyeOff - 1, eyeY, 3, 2);

            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(a.sx - eyeOff - 0.5, eyeY + 0.5, 0.6, 0, Math.PI * 2);
            ctx.arc(a.sx + eyeOff + 0.5, eyeY + 0.5, 0.6, 0, Math.PI * 2);
            ctx.fill();

            if (a.working && !noMotion.current && Math.sin(t * 8 + a.phase) > 0.8) {
                ctx.fillStyle = ha(col, 0.4);
                ctx.font = '500 6px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('···', a.sx, headY - headR - 3);
            }

            if (isOrch) {
                ctx.strokeStyle = ha(col, 0.4);
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(a.sx, headY, headR + 4, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = col;
                ctx.beginPath();
                ctx.moveTo(a.sx, headY - headR - 7);
                ctx.lineTo(a.sx - 5, headY - headR - 1);
                ctx.lineTo(a.sx + 5, headY - headR - 1);
                ctx.closePath();
                ctx.fill();
            }

            if (a.working) {
                ctx.fillStyle = '#22c55e';
                ctx.beginPath();
                ctx.arc(a.sx + headR + 3, headY - headR + 1, 3.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#050505';
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.fillStyle = 'white';
                ctx.font = 'bold 5px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('✓', a.sx + headR + 3, headY - headR + 3);
            }

            ctx.textAlign = 'center';
            ctx.font = `bold ${isOrch ? 11 : 10}px Inter, sans-serif`;
            ctx.fillStyle = `rgba(255,255,255,${isOrch ? 0.9 : 0.65})`;
            ctx.fillText(a.name, a.sx, headY - headR - (isOrch ? 14 : 8));

            ctx.font = `500 ${isOrch ? 8 : 7}px Inter, sans-serif`;
            ctx.fillStyle = ha(col, 0.65);
            ctx.fillText(a.role, a.sx, headY - headR - (isOrch ? 24 : 17));

            ctx.textAlign = 'start';
        };

        const drawParticle = (p: Particle, t: number) => {
            const x = p.fx + (p.tx - p.fx) * p.p;
            const arc = -60 * Math.sin(p.p * Math.PI);
            const y = p.fy + (p.ty - p.fy) * p.p + arc;
            const r = 4 + Math.sin(t * 6 + p.idx) * 1.5;

            ctx.save();
            ctx.shadowColor = p.col;
            ctx.shadowBlur = 22;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = p.col;
            ctx.fill();
            ctx.restore();

            ctx.beginPath();
            ctx.arc(x, y, r * 3, 0, Math.PI * 2);
            ctx.fillStyle = ha(p.col, 0.06);
            ctx.fill();

            for (let i = 1; i <= 5; i++) {
                const tp = Math.max(0, p.p - i * 0.02);
                const tx2 = p.fx + (p.tx - p.fx) * tp;
                const ty2 = p.fy + (p.ty - p.fy) * tp - 60 * Math.sin(tp * Math.PI);
                ctx.beginPath();
                ctx.arc(tx2, ty2, r * (1 - i / 6) * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = ha(p.col, 0.1 * (1 - i / 6));
                ctx.fill();
            }
        };

        const drawConnections = (agentList: Agent[], orch: Agent, col: string) => {
            agentList.forEach(a => {
                if (a === orch) return;
                ctx.beginPath();
                ctx.moveTo(orch.sx, orch.sy);
                ctx.quadraticCurveTo((orch.sx + a.sx) / 2, (orch.sy + a.sy) / 2 - 15, a.sx, a.sy);
                ctx.strokeStyle = ha(col, a.working ? 0.1 : 0.03);
                ctx.lineWidth = 0.8;
                ctx.setLineDash([3, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
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

            drawRoom(W, H, niche.color, t);

            const agentList = ags.current;
            const orch = agentList[0];
            if (orch) drawConnections(agentList, orch, niche.color);

            const sorted = [...agentList].sort((a, b) => a.sy - b.sy);

            sorted.forEach(a => {
                const isO = a === orch;
                drawChair(a.sx, a.sy, niche.color, isO);
                drawWorkstation(a.sx, a.sy, niche.color, isO, a.working, t, a.phase);
                drawPerson(a, niche.color, isO, t);
            });

            if (!noMotion.current) {
                const cycle = 7;
                const cp = (t % cycle) / cycle;

                if (orch) {
                    agentList.forEach((a, i) => {
                        if (i === 0) return;
                        const trig = (a.delay / 1000) / cycle;
                        if (cp >= trig && cp < trig + 0.18 && !a.working) {
                            a.working = true; a.progress = 0;
                            pts.current.push({
                                fx: orch.sx, fy: orch.sy - 30,
                                tx: a.sx, ty: a.sy - 20,
                                p: 0, spd: 1.4 + Math.random() * 0.4,
                                idx: i, ret: false, col: niche.color,
                            });
                        }
                        if (a.working) a.progress = Math.min(1, a.progress + dt * 0.35);
                        const ret = trig + 0.28;
                        if (cp >= ret && cp < ret + 0.1 && a.working && a.progress > 0.2) {
                            if (!pts.current.some(p => p.idx === i && p.ret)) {
                                pts.current.push({
                                    fx: a.sx, fy: a.sy - 20,
                                    tx: orch.sx, ty: orch.sy - 30,
                                    p: 0, spd: 1.6, idx: i, ret: true, col: '#22c55e',
                                });
                            }
                        }
                        if (cp < 0.03) { a.working = false; a.progress = 0; }
                    });
                }

                pts.current = pts.current.filter(p => {
                    p.p += dt * p.spd;
                    if (p.p >= 1) return false;
                    drawParticle(p, t);
                    return true;
                });
            } else {
                agentList.forEach((a, i) => { if (i > 0) a.working = true; });
            }

            ctx.font = '500 10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255,255,255,0.12)';
            ctx.fillText(`${agentList.length} AI-агентов · ${niche.name}`, W / 2, H - 8);
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
