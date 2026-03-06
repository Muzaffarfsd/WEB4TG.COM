import type { Agent, Particle, Drone, Roomba, Toast } from './office-config';
import { ha } from './office-config';

export function drawRoom(
    ctx: CanvasRenderingContext2D,
    W: number, H: number, col: string, t: number, agentsWalking: number,
) {
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

    const ceilingLights = [
        { x: rL + (divX - rL) * 0.3, y: wallBot },
        { x: rL + (divX - rL) * 0.7, y: wallBot },
        { x: divX + (rR - divX) * 0.5, y: wallBot },
    ];
    ceilingLights.forEach((cl2, ci) => {
        ctx.fillStyle = ha(col, 0.15 + Math.sin(t * 0.8 + ci * 1.5) * 0.04);
        ctx.fillRect(cl2.x - 12, wallTop + 1, 24, 3);
        ctx.fillStyle = ha(col, 0.4);
        ctx.beginPath(); ctx.arc(cl2.x, wallTop + 3, 2, 0, Math.PI * 2); ctx.fill();

        const coneH = (floorBot - wallBot) * 0.6;
        const coneG = ctx.createLinearGradient(cl2.x, cl2.y, cl2.x, cl2.y + coneH);
        coneG.addColorStop(0, ha(col, 0.035));
        coneG.addColorStop(0.5, ha(col, 0.015));
        coneG.addColorStop(1, ha(col, 0));
        ctx.fillStyle = coneG;
        ctx.beginPath();
        ctx.moveTo(cl2.x - 8, cl2.y);
        ctx.lineTo(cl2.x + 8, cl2.y);
        ctx.lineTo(cl2.x + 45, cl2.y + coneH);
        ctx.lineTo(cl2.x - 45, cl2.y + coneH);
        ctx.closePath();
        ctx.fill();
    });

    const winX = divX + (rR - divX) * 0.5 - 25;
    const winW = 50, winH2 = (wallBot - wallTop) * 0.5;
    const winY2 = wallTop + (wallBot - wallTop) * 0.15;
    ctx.fillStyle = '#08081a';
    ctx.beginPath(); ctx.roundRect(winX, winY2, winW, winH2, 2); ctx.fill();
    ctx.strokeStyle = 'rgba(80,70,110,0.3)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(winX, winY2, winW, winH2, 2); ctx.stroke();
    const skyG = ctx.createLinearGradient(winX, winY2, winX, winY2 + winH2);
    skyG.addColorStop(0, 'rgba(15,12,35,0.6)');
    skyG.addColorStop(0.6, 'rgba(20,15,40,0.5)');
    skyG.addColorStop(1, 'rgba(30,22,55,0.4)');
    ctx.fillStyle = skyG;
    ctx.fillRect(winX + 2, winY2 + 2, winW - 4, winH2 - 4);
    const starCount = 6;
    for (let si = 0; si < starCount; si++) {
        const sx = winX + 5 + (si * 7.3) % (winW - 10);
        const sy = winY2 + 4 + (si * 5.1) % (winH2 * 0.5);
        const sa = 0.15 + 0.12 * Math.sin(t * 1.2 + si * 2.1);
        ctx.fillStyle = `rgba(255,255,255,${sa})`;
        ctx.beginPath(); ctx.arc(sx, sy, 0.8, 0, Math.PI * 2); ctx.fill();
    }
    const cityY = winY2 + winH2 - 8;
    for (let bi = 0; bi < 7; bi++) {
        const bx = winX + 4 + bi * 6.5;
        const bh = 3 + (bi * 3.7) % 5;
        ctx.fillStyle = 'rgba(25,20,45,0.7)';
        ctx.fillRect(bx, cityY - bh, 4, bh);
        if (Math.sin(t * 0.5 + bi * 1.3) > 0.2) {
            ctx.fillStyle = 'rgba(255,220,100,0.2)';
            ctx.fillRect(bx + 1, cityY - bh + 1, 1, 1);
        }
    }
    ctx.save(); ctx.shadowColor = 'rgba(100,80,180,0.15)'; ctx.shadowBlur = 30;
    ctx.fillStyle = 'rgba(80,60,160,0.03)';
    ctx.fillRect(winX - 20, winY2 + winH2, winW + 40, 20);
    ctx.restore();

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
}

export function drawArcade(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, col: string, t: number,
) {
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
}

export function drawCouch(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, col: string,
) {
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
}

export function drawVending(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, col: string, t: number,
) {
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
}

export function drawCoffeeTable(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, col: string, t: number,
) {
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
}

export function drawDesk(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, col: string, isOrch: boolean, working: boolean, t: number, ph: number,
) {
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
}

export function drawChair(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, col: string, isOrch: boolean,
) {
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
}

export function drawPerson(
    ctx: CanvasRenderingContext2D,
    a: Agent, col: string, isOrch: boolean, t: number, isWalking: boolean, noMotion: boolean,
) {
    const bob = noMotion ? 0 : (isWalking
        ? Math.abs(Math.sin(a.walkT * 8 * Math.PI)) * 2.5
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

    if (isWalking && !noMotion) {
        const legPhase = Math.sin(a.walkT * 8 * Math.PI);
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

    if (a.state === 'idle') {
        ctx.fillStyle = ha(a.skin, 0.6);
        ctx.beginPath(); ctx.arc(hX, hY + hR * 0.4, 1.8, 0, Math.PI); ctx.fill();
        ctx.strokeStyle = ha(a.skin, 0.3);
        ctx.lineWidth = 0.3;
        ctx.beginPath(); ctx.arc(hX, hY + hR * 0.4, 1.8, 0, Math.PI); ctx.stroke();
    } else if (a.state === 'working') {
        ctx.fillStyle = ha(a.skin, 0.5);
        ctx.beginPath();
        ctx.moveTo(hX - 1.2, hY + hR * 0.45);
        ctx.lineTo(hX + 1.2, hY + hR * 0.45);
        ctx.stroke();

        if (!noMotion) {
            const blink = Math.sin(t * 0.8 + a.phase * 3);
            if (blink > 0.97) {
                ctx.strokeStyle = ha(col, 0.3); ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(hX - eO - 2, eY + 1.5); ctx.lineTo(hX - eO + 1, eY + 1.5);
                ctx.moveTo(hX + eO - 1.5, eY + 1.5); ctx.lineTo(hX + eO + 1.5, eY + 1.5);
                ctx.stroke();
            }
        }
    } else {
        ctx.fillStyle = ha(a.skin, 0.6);
        ctx.beginPath(); ctx.arc(hX, hY + hR * 0.45, 1.2, 0, Math.PI); ctx.fill();
    }

    if (a.state === 'working' && !noMotion && Math.sin(t * 7 + a.phase) > 0.85) {
        ctx.fillStyle = ha(col, 0.45);
        ctx.font = '600 8px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('···', hX, hY - hR - 3);
        ctx.textAlign = 'start';
    }

    if (a.state === 'working' && !noMotion) {
        const sparkPhase = (t * 0.4 + a.phase) % 1;
        if (sparkPhase > 0.85) {
            const sparkAlpha = (sparkPhase - 0.85) / 0.15;
            for (let si = 0; si < 4; si++) {
                const sAng = (si / 4) * Math.PI * 2 + t * 3;
                const sDist = 4 + sparkAlpha * 6;
                const sx = hX + hR + 3 + Math.cos(sAng) * sDist;
                const sy = hY - hR + 1 + Math.sin(sAng) * sDist;
                ctx.fillStyle = ha('#ffd700', 0.4 * (1 - sparkAlpha));
                ctx.beginPath(); ctx.arc(sx, sy, 1, 0, Math.PI * 2); ctx.fill();
            }
        }
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
}

export function drawParticle(
    ctx: CanvasRenderingContext2D,
    p: Particle, t: number,
) {
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
}

export function drawWhiteboard(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, col: string, t: number, workingCount: number, totalAgents: number,
) {
    const w = 56, h = 36;
    ctx.fillStyle = '#1a1730';
    ctx.strokeStyle = 'rgba(80,70,110,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

    ctx.font = 'bold 5px Inter, sans-serif';
    ctx.fillStyle = ha(col, 0.6);
    ctx.textAlign = 'center';
    ctx.fillText('KANBAN', x + w / 2, y + 8);

    const colW = (w - 8) / 3;
    const labels = ['TODO', 'WIP', 'DONE'];
    const labelCols = ['rgba(255,255,255,0.15)', ha('#f59e0b', 0.5), ha('#22c55e', 0.5)];
    labels.forEach((lb, i) => {
        const cx = x + 4 + i * colW;
        ctx.fillStyle = labelCols[i];
        ctx.font = 'bold 4px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(lb, cx + colW / 2, y + 14);

        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 0.3;
        ctx.beginPath(); ctx.moveTo(cx + colW, y + 10); ctx.lineTo(cx + colW, y + h - 3); ctx.stroke();
    });

    const done = Math.min(3, workingCount);
    const wip = Math.min(2, Math.max(0, workingCount - done));
    const todo = Math.min(3, totalAgents - workingCount);

    const stickerCols = [ha('#ef4444', 0.35), ha('#f59e0b', 0.35), ha('#3b82f6', 0.35), ha('#22c55e', 0.35), ha(col, 0.35)];
    const drawSticker = (sx: number, sy: number, ci: number, animated: boolean) => {
        const sc = stickerCols[ci % stickerCols.length];
        const sOff = animated ? Math.sin(t * 2 + ci * 1.5) * 0.3 : 0;
        ctx.fillStyle = sc;
        ctx.beginPath(); ctx.roundRect(sx, sy + sOff, colW - 4, 4.5, 0.8); ctx.fill();
    };

    for (let i = 0; i < todo; i++) drawSticker(x + 4 + 2, y + 16 + i * 6, i, false);
    for (let i = 0; i < wip; i++) drawSticker(x + 4 + colW + 2, y + 16 + i * 6, i + 3, true);
    for (let i = 0; i < done; i++) drawSticker(x + 4 + colW * 2 + 2, y + 16 + i * 6, i + 1, false);

    ctx.textAlign = 'start';
}

export function drawClock(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, col: string, t: number,
) {
    const r = 10;
    ctx.fillStyle = '#0e0c1a';
    ctx.strokeStyle = 'rgba(80,70,110,0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = 'rgba(20,16,32,0.8)';
    ctx.beginPath(); ctx.arc(x, y, r - 1.5, 0, Math.PI * 2); ctx.fill();

    for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const iR = i % 3 === 0 ? r - 3 : r - 2.5;
        const oR = r - 1.5;
        ctx.strokeStyle = i % 3 === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)';
        ctx.lineWidth = i % 3 === 0 ? 0.8 : 0.4;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(ang) * iR, y + Math.sin(ang) * iR);
        ctx.lineTo(x + Math.cos(ang) * oR, y + Math.sin(ang) * oR);
        ctx.stroke();
    }

    const hourAng = (t * 0.02) * Math.PI * 2 - Math.PI / 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(hourAng) * (r - 5), y + Math.sin(hourAng) * (r - 5));
    ctx.stroke();

    const minAng = (t * 0.2) * Math.PI * 2 - Math.PI / 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(minAng) * (r - 3), y + Math.sin(minAng) * (r - 3));
    ctx.stroke();

    const secAng = (t * 1.0) * Math.PI * 2 - Math.PI / 2;
    ctx.strokeStyle = ha(col, 0.6);
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(secAng) * (r - 2.5), y + Math.sin(secAng) * (r - 2.5));
    ctx.stroke();

    ctx.fillStyle = ha(col, 0.5);
    ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.globalAlpha = 0.06;
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(x, y, r + 2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}

export function drawWifiRouter(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, col: string, t: number,
) {
    ctx.fillStyle = '#181428';
    ctx.strokeStyle = 'rgba(60,50,80,0.3)';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.roundRect(x - 8, y - 3, 16, 6, 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = Math.sin(t * 4) > 0 ? '#22c55e' : ha(col, 0.3);
    ctx.beginPath(); ctx.arc(x - 3, y, 1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = ha(col, 0.4);
    ctx.beginPath(); ctx.arc(x + 3, y, 1, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = 'rgba(40,35,55,0.6)';
    ctx.save(); ctx.translate(x - 4, y - 3); ctx.rotate(-0.3);
    ctx.fillRect(-0.5, -6, 1, 6); ctx.restore();
    ctx.save(); ctx.translate(x + 4, y - 3); ctx.rotate(0.3);
    ctx.fillRect(-0.5, -6, 1, 6); ctx.restore();

    const wavePulse = (t * 1.5) % 3;
    for (let i = 0; i < 3; i++) {
        const waveR = 6 + i * 5;
        const waveAlpha = Math.max(0, 0.12 - Math.abs(wavePulse - i) * 0.06);
        if (waveAlpha > 0.01) {
            ctx.strokeStyle = ha(col, waveAlpha);
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.arc(x, y - 6, waveR, -Math.PI * 0.7, -Math.PI * 0.3);
            ctx.stroke();
        }
    }
}

export function drawRoomba(
    ctx: CanvasRenderingContext2D,
    rb: Roomba, col: string, t: number,
) {
    const r = 6;

    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(rb.x, rb.y + 1.5, r + 1, 2, 0, 0, Math.PI * 2); ctx.fill();

    const bodyG = ctx.createRadialGradient(rb.x - 1, rb.y - 1, 0, rb.x, rb.y, r);
    bodyG.addColorStop(0, '#2a2440');
    bodyG.addColorStop(1, '#1a1630');
    ctx.fillStyle = bodyG;
    ctx.beginPath(); ctx.arc(rb.x, rb.y, r, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = 'rgba(60,50,80,0.3)';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(rb.x, rb.y, r, 0, Math.PI * 2); ctx.stroke();

    ctx.strokeStyle = 'rgba(80,70,100,0.2)';
    ctx.lineWidth = 0.3;
    ctx.beginPath(); ctx.arc(rb.x, rb.y, r - 2, 0, Math.PI * 2); ctx.stroke();

    const ledPulse = 0.4 + Math.sin(t * 3 + rb.ledPhase) * 0.3;
    ctx.fillStyle = ha(col, ledPulse);
    ctx.beginPath(); ctx.arc(rb.x, rb.y - 2, 1.5, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.shadowColor = col; ctx.shadowBlur = 6;
    ctx.fillStyle = ha(col, ledPulse * 0.4);
    ctx.beginPath(); ctx.arc(rb.x, rb.y - 2, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    const dirX = Math.cos(rb.angle) * (r - 1);
    const dirY = Math.sin(rb.angle) * (r - 1);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath(); ctx.arc(rb.x + dirX, rb.y + dirY, 1, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = ha(col, 0.03);
    ctx.lineWidth = 0.3;
    const trailLen = 5;
    for (let i = 1; i <= trailLen; i++) {
        const tx = rb.x - Math.cos(rb.angle) * i * 3;
        const ty = rb.y - Math.sin(rb.angle) * i * 3;
        ctx.globalAlpha = 0.3 * (1 - i / trailLen);
        ctx.beginPath(); ctx.arc(tx, ty, 0.5, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
}

export function drawToast(
    ctx: CanvasRenderingContext2D,
    toast: Toast,
) {
    if (toast.opacity <= 0) return;
    ctx.save();
    ctx.globalAlpha = toast.opacity;

    const tw = ctx.measureText(toast.text).width + 16;
    const th = 14;
    const tx = toast.x - tw / 2;
    const ty = toast.y - toast.life * 8;

    ctx.fillStyle = 'rgba(10,8,18,0.85)';
    ctx.strokeStyle = ha(toast.col, 0.3);
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 4); ctx.fill(); ctx.stroke();

    ctx.save();
    ctx.shadowColor = toast.col; ctx.shadowBlur = 6;
    ctx.fillStyle = ha(toast.col, 0.15);
    ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 4); ctx.fill();
    ctx.restore();

    ctx.font = '600 7px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = toast.col === '#22c55e'
        ? 'rgba(34,197,94,0.9)' : `rgba(255,255,255,0.85)`;
    ctx.fillText(`${toast.icon} ${toast.text}`, toast.x, ty + 10);
    ctx.textAlign = 'start';

    ctx.restore();
}

export function drawWaterCooler(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, col: string, t: number,
) {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath(); ctx.ellipse(x, y + 2, 6, 2, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#1a1630';
    ctx.strokeStyle = 'rgba(60,50,80,0.3)';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.roundRect(x - 5, y - 22, 10, 24, 1.5); ctx.fill(); ctx.stroke();

    ctx.fillStyle = 'rgba(40,120,220,0.12)';
    ctx.beginPath(); ctx.roundRect(x - 4, y - 20, 8, 10, 1); ctx.fill();

    ctx.fillStyle = 'rgba(60,160,255,0.08)';
    ctx.beginPath(); ctx.roundRect(x - 3.5, y - 19, 7, 8, 0.5); ctx.fill();

    const bubblePhase = (t * 2) % 4;
    for (let i = 0; i < 3; i++) {
        const by = y - 12 - ((bubblePhase + i * 1.3) % 4) * 2;
        const bx = x - 1.5 + Math.sin(t * 3 + i * 2.1) * 1.5;
        const ba = 0.12 - ((bubblePhase + i * 1.3) % 4) * 0.025;
        if (ba > 0.02 && by > y - 20 && by < y - 12) {
            ctx.fillStyle = `rgba(100,180,255,${ba})`;
            ctx.beginPath(); ctx.arc(bx, by, 0.8, 0, Math.PI * 2); ctx.fill();
        }
    }

    ctx.fillStyle = 'rgba(100,180,255,0.08)';
    ctx.beginPath();
    ctx.ellipse(x, y - 22, 4.5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(100,180,255,0.12)';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.ellipse(x, y - 22, 4.5, 6, 0, 0, Math.PI * 2); ctx.stroke();

    ctx.fillStyle = ha(col, 0.08);
    ctx.fillRect(x - 4, y - 8, 8, 5);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath(); ctx.arc(x - 1.5, y - 5, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = ha('#3b82f6', 0.15);
    ctx.beginPath(); ctx.arc(x + 1.5, y - 5, 1.5, 0, Math.PI * 2); ctx.fill();

    ctx.font = '500 4px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.textAlign = 'center';
    ctx.fillText('H₂O', x, y + 8);
    ctx.textAlign = 'start';
}

export function drawCables(
    ctx: CanvasRenderingContext2D,
    srvX: number, srvY: number, srvH: number,
    desks: { x: number; y: number; isOrch: boolean }[],
    col: string, t: number,
) {
    const cableStart = { x: srvX + 16, y: srvY + srvH * 0.3 };

    ctx.strokeStyle = 'rgba(40,35,55,0.12)';
    ctx.lineWidth = 0.6;

    desks.forEach((d, i) => {
        if (i > 3) return;
        const endX = d.x - 20;
        const endY = d.y + (d.isOrch ? 20 : 16);

        ctx.beginPath();
        ctx.moveTo(cableStart.x, cableStart.y + i * 6);

        const midX1 = cableStart.x + 8;
        const floorY = endY + 4;
        ctx.lineTo(midX1, cableStart.y + i * 6);
        ctx.lineTo(midX1, floorY);
        ctx.lineTo(endX, floorY);
        ctx.lineTo(endX, endY);

        ctx.strokeStyle = `rgba(40,35,55,${0.08 + i * 0.02})`;
        ctx.stroke();

        const pulsePos = ((t * 0.5 + i * 0.3) % 1);
        const pathLen = Math.abs(midX1 - cableStart.x) + Math.abs(floorY - (cableStart.y + i * 6)) + Math.abs(endX - midX1) + Math.abs(endY - floorY);
        const pDist = pulsePos * pathLen;
        let px = cableStart.x, py = cableStart.y + i * 6;

        const seg1 = Math.abs(midX1 - cableStart.x);
        const seg2 = Math.abs(floorY - (cableStart.y + i * 6));
        const seg3 = Math.abs(endX - midX1);

        if (pDist < seg1) {
            px = cableStart.x + pDist;
        } else if (pDist < seg1 + seg2) {
            px = midX1;
            py = cableStart.y + i * 6 + (pDist - seg1);
        } else if (pDist < seg1 + seg2 + seg3) {
            px = midX1 + (pDist - seg1 - seg2);
            py = floorY;
        } else {
            px = endX;
            py = floorY - (pDist - seg1 - seg2 - seg3);
        }

        ctx.fillStyle = ha(col, 0.25);
        ctx.beginPath(); ctx.arc(px, py, 1.2, 0, Math.PI * 2); ctx.fill();
    });
}

export function drawBookshelf(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, col: string,
) {
    const w = 36, h = 28;

    ctx.fillStyle = '#1a1428';
    ctx.strokeStyle = 'rgba(60,50,80,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 1.5); ctx.fill(); ctx.stroke();

    const shelfY1 = y + h * 0.33;
    const shelfY2 = y + h * 0.66;
    ctx.fillStyle = 'rgba(40,35,55,0.4)';
    ctx.fillRect(x + 1, shelfY1, w - 2, 1.5);
    ctx.fillRect(x + 1, shelfY2, w - 2, 1.5);

    const bookColors = [
        ha('#ef4444', 0.3), ha('#3b82f6', 0.35), ha(col, 0.3),
        ha('#22c55e', 0.25), ha('#f59e0b', 0.3), ha('#ec4899', 0.25),
        ha('#6366f1', 0.3), ha('#14b8a6', 0.3), ha('#f97316', 0.25),
    ];

    const drawBooks = (sy: number, count: number, startIdx: number) => {
        const bw = (w - 6) / count;
        for (let i = 0; i < count; i++) {
            const bh = 6 + (i * 2.3) % 4;
            ctx.fillStyle = bookColors[(startIdx + i) % bookColors.length];
            ctx.beginPath();
            ctx.roundRect(x + 3 + i * bw, sy - bh - 1, bw - 1.5, bh, 0.5);
            ctx.fill();

            if (i % 3 === 0) {
                ctx.fillStyle = 'rgba(255,255,255,0.06)';
                ctx.fillRect(x + 3 + i * bw + 1, sy - bh, bw - 3.5, 0.5);
            }
        }
    };

    drawBooks(shelfY1, 5, 0);
    drawBooks(shelfY2, 4, 5);

    const potX = x + w - 8, potY = y + h - 2;
    ctx.fillStyle = 'rgba(180,100,50,0.25)';
    ctx.beginPath(); ctx.roundRect(potX - 3, potY - 4, 6, 4, 1); ctx.fill();
    ctx.fillStyle = '#1a6a1a';
    ctx.beginPath(); ctx.ellipse(potX, potY - 6, 4, 5, 0, Math.PI + 0.3, -0.3); ctx.fill();
    ctx.fillStyle = '#22882a';
    ctx.beginPath(); ctx.ellipse(potX - 1, potY - 7, 3, 4, -0.2, Math.PI + 0.5, -0.5); ctx.fill();
}

export function drawDrone(
    ctx: CanvasRenderingContext2D,
    drone: Drone, col: string, t: number,
) {
    const hover = Math.sin(t * 4 + drone.phase) * 1.5;
    const dx = drone.x;
    const dy = drone.y + hover;

    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.beginPath();
    ctx.ellipse(dx, drone.y + 12, 5, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2a2440';
    ctx.strokeStyle = 'rgba(80,70,110,0.4)';
    ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.roundRect(dx - 5, dy - 2, 10, 4, 1.5); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#1e1a35';
    ctx.fillRect(dx - 7, dy - 1, 14, 2);

    const pAngle = drone.propellerAngle;
    [-7, 7].forEach(off => {
        const pX = dx + off;
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 0.4;
        const pLen = 3.5 * Math.abs(Math.cos(pAngle));
        ctx.beginPath();
        ctx.moveTo(pX - pLen, dy - 2);
        ctx.lineTo(pX + pLen, dy - 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.beginPath();
        ctx.ellipse(pX, dy - 2, 4, 1, 0, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = ha(col, 0.5 + Math.sin(t * 6) * 0.2);
    ctx.beginPath(); ctx.arc(dx, dy + 1.5, 1.2, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.shadowColor = col; ctx.shadowBlur = 10;
    ctx.fillStyle = ha(col, 0.15);
    ctx.beginPath(); ctx.arc(dx, dy + 1.5, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    const beam = 0.08 + Math.sin(t * 3) * 0.03;
    ctx.fillStyle = ha(col, beam);
    ctx.beginPath();
    ctx.moveTo(dx - 2, dy + 3);
    ctx.lineTo(dx + 2, dy + 3);
    ctx.lineTo(dx + 5, drone.y + 12);
    ctx.lineTo(dx - 5, drone.y + 12);
    ctx.closePath();
    ctx.fill();
}

export function drawConnections(
    ctx: CanvasRenderingContext2D,
    agList: Agent[], orch: Agent, col: string, t: number,
) {
    agList.forEach(a => {
        if (a === orch || a.state === 'idle') return;
        ctx.beginPath();
        ctx.moveTo(orch.x, orch.y - 10);
        const mx = (orch.x + a.x) / 2, my = (orch.y + a.y) / 2 - 18;
        ctx.quadraticCurveTo(mx, my, a.x, a.y - 10);
        ctx.strokeStyle = ha(col, a.state === 'working' ? 0.12 : 0.05);
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 5]);
        ctx.lineDashOffset = -t * 15;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;
    });
}
