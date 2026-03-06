import type { LOD } from './office-config';
import {
    ha,
    ROOM_LEFT_PCT, ROOM_RIGHT_PCT, WALL_TOP_PCT, WALL_BOT_PCT, FLOOR_BOT_PCT, DIV_X_PCT,
} from './office-config';

function getRoomBounds(W: number, H: number) {
    const rL = W * ROOM_LEFT_PCT;
    const rR = W * ROOM_RIGHT_PCT;
    const wallTop = H * WALL_TOP_PCT;
    const wallBot = H * WALL_BOT_PCT;
    const floorBot = H * FLOOR_BOT_PCT;
    const divX = W * DIV_X_PCT;
    return { rL, rR, wallTop, wallBot, floorBot, divX };
}

export function renderStaticLayer(
    W: number, H: number, col: string, lod: LOD,
): OffscreenCanvas | HTMLCanvasElement {
    let oc: OffscreenCanvas | HTMLCanvasElement;
    try { oc = new OffscreenCanvas(W, H); } catch { oc = document.createElement('canvas'); oc.width = W; oc.height = H; }
    const ctx = oc.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    if (!ctx) return oc;

    const { rL, rR, wallTop, wallBot, floorBot, divX } = getRoomBounds(W, H);

    const wG = ctx.createLinearGradient(rL, wallTop, rL, wallBot);
    wG.addColorStop(0, '#100e18');
    wG.addColorStop(0.3, '#141020');
    wG.addColorStop(0.7, '#12101e');
    wG.addColorStop(1, '#0c0a14');
    ctx.fillStyle = wG;
    ctx.fillRect(rL, wallTop, rR - rL, wallBot - wallTop);

    if (lod !== 'low') {
        ctx.strokeStyle = 'rgba(255,255,255,0.015)';
        ctx.lineWidth = 0.5;
        const bH = 14, bW = lod === 'high' ? 26 : 52;
        for (let row = 0; row < Math.ceil((wallBot - wallTop) / bH); row++) {
            const y = wallTop + row * bH;
            const off = row % 2 === 0 ? 0 : bW / 2;
            for (let x = rL + off; x < rR; x += bW) {
                ctx.strokeRect(x, y, bW, bH);
            }
        }
    }

    ctx.fillStyle = ha(col, 0.06);
    ctx.fillRect(rL, wallBot - 4, rR - rL, 4);
    ctx.fillStyle = ha(col, 0.03);
    ctx.fillRect(rL, wallBot - 6, rR - rL, 2);

    ctx.strokeStyle = ha(col, 0.12);
    ctx.lineWidth = 1.2;
    ctx.strokeRect(rL, wallTop, rR - rL, wallBot - wallTop);

    const fG = ctx.createLinearGradient(rL, wallBot, rL, floorBot);
    fG.addColorStop(0, '#0a0812');
    fG.addColorStop(0.5, '#080710');
    fG.addColorStop(1, '#06050c');
    ctx.fillStyle = fG;
    ctx.fillRect(rL, wallBot, rR - rL, floorBot - wallBot);

    const ts = lod === 'low' ? 56 : 28;
    if (lod !== 'low') {
        for (let tx2 = rL; tx2 < rR; tx2 += ts) {
            for (let ty = wallBot; ty < floorBot; ty += ts) {
                const chk = (Math.floor((tx2 - rL) / ts) + Math.floor((ty - wallBot) / ts)) % 2 === 0;
                ctx.fillStyle = chk ? 'rgba(139,92,246,0.018)' : 'rgba(255,255,255,0.006)';
                ctx.fillRect(tx2 + 0.3, ty + 0.3, ts - 0.6, ts - 0.6);
            }
        }
    }
    ctx.strokeStyle = 'rgba(139,92,246,0.025)';
    ctx.lineWidth = 0.3;
    const gridStep = lod === 'low' ? ts * 2 : ts;
    for (let x = rL; x <= rR; x += gridStep) { ctx.beginPath(); ctx.moveTo(x, wallBot); ctx.lineTo(x, floorBot); ctx.stroke(); }
    for (let y = wallBot; y <= floorBot; y += gridStep) { ctx.beginPath(); ctx.moveTo(rL, y); ctx.lineTo(rR, y); ctx.stroke(); }

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
        ctx.fillStyle = ha(col, 0.08);
        ctx.fillRect(lx + 5, stripY, 40, 1);
    }

    const winW = 90, winH2 = (wallBot - wallTop) * 0.7;
    const winX = divX + (rR - divX) * 0.5 - winW / 2;
    const winY2 = wallTop + (wallBot - wallTop) * 0.1;
    ctx.fillStyle = '#05051a';
    ctx.beginPath(); ctx.roundRect(winX, winY2, winW, winH2, 3); ctx.fill();
    ctx.strokeStyle = 'rgba(80,70,120,0.4)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(winX, winY2, winW, winH2, 3); ctx.stroke();
    ctx.strokeStyle = 'rgba(60,50,90,0.2)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(winX + winW / 2, winY2 + 2); ctx.lineTo(winX + winW / 2, winY2 + winH2 - 2); ctx.stroke();

    const skyG = ctx.createLinearGradient(winX, winY2, winX, winY2 + winH2);
    skyG.addColorStop(0, 'rgba(8,5,30,0.9)');
    skyG.addColorStop(0.3, 'rgba(12,8,35,0.8)');
    skyG.addColorStop(0.7, 'rgba(18,12,42,0.6)');
    skyG.addColorStop(1, 'rgba(25,18,50,0.5)');
    ctx.fillStyle = skyG;
    ctx.fillRect(winX + 2, winY2 + 2, winW - 4, winH2 - 4);

    const moonX = winX + winW * 0.75, moonY = winY2 + 8;
    ctx.fillStyle = 'rgba(255,248,220,0.15)';
    ctx.beginPath(); ctx.arc(moonX, moonY, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,248,220,0.6)';
    ctx.beginPath(); ctx.arc(moonX, moonY, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,248,220,0.85)';
    ctx.beginPath(); ctx.arc(moonX, moonY, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#05051a';
    ctx.beginPath(); ctx.arc(moonX + 1.5, moonY - 1, 2, 0, Math.PI * 2); ctx.fill();

    const starPositions = [
        [0.08, 0.15], [0.18, 0.28], [0.3, 0.1], [0.42, 0.22], [0.55, 0.08],
        [0.62, 0.3], [0.85, 0.2], [0.12, 0.4], [0.38, 0.38], [0.7, 0.12],
        [0.25, 0.05], [0.5, 0.35], [0.78, 0.28], [0.15, 0.08], [0.9, 0.1],
    ];
    starPositions.forEach(([sx, sy], i) => {
        const sxp = winX + 3 + sx * (winW - 6);
        const syp = winY2 + 3 + sy * (winH2 * 0.5);
        const brightness = 0.1 + (i * 0.37) % 0.3;
        const radius = 0.4 + (i * 0.23) % 0.5;
        ctx.fillStyle = `rgba(255,255,255,${brightness})`;
        ctx.beginPath(); ctx.arc(sxp, syp, radius, 0, Math.PI * 2); ctx.fill();
    });

    const cityY = winY2 + winH2 - 2;
    const buildings = [
        { x: 0, w: 8, h: 18 }, { x: 9, w: 6, h: 12 }, { x: 16, w: 10, h: 22 },
        { x: 27, w: 7, h: 15 }, { x: 35, w: 12, h: 25 }, { x: 48, w: 5, h: 10 },
        { x: 54, w: 9, h: 20 }, { x: 64, w: 6, h: 14 }, { x: 71, w: 8, h: 17 },
        { x: 80, w: 7, h: 12 },
    ];
    buildings.forEach(b => {
        const bx = winX + 3 + (b.x / 88) * (winW - 6);
        const bw = (b.w / 88) * (winW - 6);
        const bG = ctx.createLinearGradient(bx, cityY - b.h, bx, cityY);
        bG.addColorStop(0, 'rgba(15,10,30,0.9)');
        bG.addColorStop(1, 'rgba(20,15,38,0.95)');
        ctx.fillStyle = bG;
        ctx.fillRect(bx, cityY - b.h, bw, b.h);
        ctx.strokeStyle = 'rgba(40,30,65,0.3)';
        ctx.lineWidth = 0.3;
        ctx.strokeRect(bx, cityY - b.h, bw, b.h);

        for (let wy = 2; wy < b.h - 2; wy += 3) {
            for (let wx = 1; wx < bw - 1; wx += 2.5) {
                const lit = ((b.x + wx + wy) * 7.3) % 10 > 5;
                if (lit) {
                    ctx.fillStyle = 'rgba(255,220,100,0.2)';
                    ctx.fillRect(bx + wx, cityY - b.h + wy, 1.2, 1.5);
                }
            }
        }

        if (b.h > 18) {
            ctx.fillStyle = 'rgba(255,60,60,0.3)';
            ctx.beginPath(); ctx.arc(bx + bw / 2, cityY - b.h - 1, 0.8, 0, Math.PI * 2); ctx.fill();
        }
    });

    const winGlowG = ctx.createLinearGradient(winX, winY2 + winH2, winX, winY2 + winH2 + 8);
    winGlowG.addColorStop(0, 'rgba(100,120,200,0.04)');
    winGlowG.addColorStop(1, 'rgba(100,120,200,0)');
    ctx.fillStyle = winGlowG;
    ctx.fillRect(winX - 5, winY2 + winH2, winW + 10, 8);

    if (lod !== 'low') {
        const posterX1 = rL + (divX - rL) * 0.08;
        const posterY1 = wallTop + 6;
        const pW = 22, pH = 16;
        ctx.fillStyle = '#0e0c1a';
        ctx.strokeStyle = 'rgba(80,70,110,0.25)';
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.roundRect(posterX1, posterY1, pW, pH, 1.5); ctx.fill(); ctx.stroke();
        ctx.fillStyle = ha(col, 0.12);
        ctx.fillRect(posterX1 + 2, posterY1 + 2, pW - 4, pH - 6);
        ctx.font = 'bold 4px Inter, sans-serif';
        ctx.fillStyle = ha(col, 0.4);
        ctx.textAlign = 'center';
        ctx.fillText('W4TG', posterX1 + pW / 2, posterY1 + pH - 2);
        ctx.textAlign = 'start';

        const posterX2 = rL + (divX - rL) * 0.92 - pW;
        ctx.fillStyle = '#0e0c1a';
        ctx.strokeStyle = 'rgba(80,70,110,0.25)';
        ctx.beginPath(); ctx.roundRect(posterX2, posterY1, pW, pH, 1.5); ctx.fill(); ctx.stroke();
        ctx.fillStyle = ha('#ffd700', 0.15);
        ctx.beginPath(); ctx.arc(posterX2 + pW / 2, posterY1 + pH / 2 - 1, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = ha('#ffd700', 0.35);
        const sx = posterX2 + pW / 2;
        const sy2 = posterY1 + pH / 2 - 1;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const a = (i * 4 * Math.PI / 5) - Math.PI / 2;
            const method = i === 0 ? 'moveTo' : 'lineTo';
            ctx[method](sx + Math.cos(a) * 3, sy2 + Math.sin(a) * 3);
            const a2 = a + 2 * Math.PI / 5;
            ctx.lineTo(sx + Math.cos(a2) * 1.2, sy2 + Math.sin(a2) * 1.2);
        }
        ctx.closePath(); ctx.fill();
        ctx.font = 'bold 3.5px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.textAlign = 'center';
        ctx.fillText('AWARD', posterX2 + pW / 2, posterY1 + pH - 1.5);
        ctx.textAlign = 'start';

        const logoX = divX - 28;
        const logoY = wallTop + 4;
        ctx.fillStyle = ha(col, 0.08);
        ctx.beginPath(); ctx.roundRect(logoX, logoY, 18, 18, 3); ctx.fill();
        ctx.strokeStyle = ha(col, 0.2); ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.roundRect(logoX, logoY, 18, 18, 3); ctx.stroke();
        ctx.fillStyle = ha(col, 0.5);
        ctx.font = 'bold 7px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('W4', logoX + 9, logoY + 12);
        ctx.textAlign = 'start';
    }

    if (lod === 'high') {
        const loungeFloor = wallBot + (floorBot - wallBot) * 0.55;
        const rugX = divX + (rR - divX) * 0.25;
        const rugW = (rR - divX) * 0.55;
        const rugH = (floorBot - wallBot) * 0.35;
        const rugG = ctx.createRadialGradient(
            rugX + rugW / 2, loungeFloor, 0,
            rugX + rugW / 2, loungeFloor, rugW * 0.5,
        );
        rugG.addColorStop(0, ha(col, 0.04));
        rugG.addColorStop(0.7, ha(col, 0.025));
        rugG.addColorStop(1, ha(col, 0));
        ctx.fillStyle = rugG;
        ctx.beginPath();
        ctx.ellipse(rugX + rugW / 2, loungeFloor, rugW / 2, rugH / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = ha(col, 0.04);
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.ellipse(rugX + rugW / 2, loungeFloor, rugW / 2 - 3, rugH / 2 - 2, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(rugX + rugW / 2, loungeFloor, rugW / 2 - 8, rugH / 2 - 5, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    const srvX = rL + 8, srvY = wallBot + 10;
    const srvW = 16, srvH = floorBot - wallBot - 20;
    const srvG = ctx.createLinearGradient(srvX, srvY, srvX + srvW, srvY + srvH);
    srvG.addColorStop(0, '#0a080e');
    srvG.addColorStop(0.5, '#08060e');
    srvG.addColorStop(1, '#060510');
    ctx.fillStyle = srvG;
    ctx.strokeStyle = 'rgba(50,42,65,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(srvX, srvY, srvW, srvH, 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = 'rgba(40,35,55,0.15)';
    ctx.fillRect(srvX + 1, srvY + 1, srvW - 2, 2);

    ctx.font = '500 5px Inter, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.textAlign = 'center'; ctx.fillText('SRV', srvX + srvW / 2, srvY + srvH + 8); ctx.textAlign = 'start';

    const plX = rL + 32, plY = floorBot - 8;
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath(); ctx.ellipse(plX, plY + 2, 8, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a1a0e';
    ctx.fillRect(plX - 5, plY - 10, 10, 12);
    ctx.fillStyle = '#3a2818';
    ctx.beginPath(); ctx.ellipse(plX, plY - 10, 6, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    [-.5, -.15, .2, .55].forEach((ang, i) => {
        ctx.save(); ctx.translate(plX, plY - 12); ctx.rotate(ang);
        const leafG = ctx.createRadialGradient(0, -10 - i * 1.5, 0, 0, -10 - i * 1.5, 9);
        leafG.addColorStop(0, i % 2 === 0 ? '#22882a' : '#2aaa35');
        leafG.addColorStop(1, i % 2 === 0 ? '#1a5a1a' : '#22882a');
        ctx.fillStyle = leafG;
        ctx.beginPath(); ctx.ellipse(0, -10 - i * 1.5, 3.5, 9, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 0.3;
        ctx.beginPath(); ctx.moveTo(0, -4 - i * 1.5); ctx.lineTo(0, -16 - i * 1.5); ctx.stroke();
        ctx.restore();
    });

    const vG = ctx.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.7);
    vG.addColorStop(0, 'rgba(0,0,0,0)');
    vG.addColorStop(0.6, 'rgba(0,0,0,0)');
    vG.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = vG;
    ctx.fillRect(0, 0, W, H);

    const cornerSize = 40;
    const cornerAlpha = 0.12;
    const corners = [
        { x: rL, y: wallBot, dx: 1, dy: 1 },
        { x: rR, y: wallBot, dx: -1, dy: 1 },
        { x: rL, y: floorBot, dx: 1, dy: -1 },
        { x: rR, y: floorBot, dx: -1, dy: -1 },
        { x: rL, y: wallTop, dx: 1, dy: 1 },
        { x: rR, y: wallTop, dx: -1, dy: 1 },
    ];
    corners.forEach(c => {
        const cG = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, cornerSize);
        cG.addColorStop(0, `rgba(0,0,0,${cornerAlpha})`);
        cG.addColorStop(0.5, `rgba(0,0,0,${cornerAlpha * 0.4})`);
        cG.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cG;
        ctx.fillRect(
            c.dx > 0 ? c.x : c.x - cornerSize,
            c.dy > 0 ? c.y : c.y - cornerSize,
            cornerSize, cornerSize,
        );
    });

    const edgeTopG = ctx.createLinearGradient(rL, wallBot, rL, wallBot + 18);
    edgeTopG.addColorStop(0, 'rgba(0,0,0,0.08)');
    edgeTopG.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = edgeTopG;
    ctx.fillRect(rL, wallBot, rR - rL, 18);

    const edgeLeftG = ctx.createLinearGradient(rL, wallBot, rL + 14, wallBot);
    edgeLeftG.addColorStop(0, 'rgba(0,0,0,0.06)');
    edgeLeftG.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = edgeLeftG;
    ctx.fillRect(rL, wallBot, 14, floorBot - wallBot);

    const edgeRightG = ctx.createLinearGradient(rR, wallBot, rR - 14, wallBot);
    edgeRightG.addColorStop(0, 'rgba(0,0,0,0.06)');
    edgeRightG.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = edgeRightG;
    ctx.fillRect(rR - 14, wallBot, 14, floorBot - wallBot);

    const edgeBotG = ctx.createLinearGradient(rL, floorBot, rL, floorBot - 14);
    edgeBotG.addColorStop(0, 'rgba(0,0,0,0.06)');
    edgeBotG.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = edgeBotG;
    ctx.fillRect(rL, floorBot - 14, rR - rL, 14);

    return oc;
}

export function drawRoomDynamic(
    ctx: CanvasRenderingContext2D,
    W: number, H: number, col: string, t: number, agentsWalking: number, lod: LOD,
) {
    const { rL, rR, wallTop, wallBot, floorBot, divX } = getRoomBounds(W, H);

    const ceilingLights = [
        { x: rL + (divX - rL) * 0.3, y: wallBot },
        { x: rL + (divX - rL) * 0.7, y: wallBot },
        { x: divX + (rR - divX) * 0.5, y: wallBot },
    ];
    ceilingLights.forEach((cl2, ci) => {
        const pulse = 0.15 + Math.sin(t * 0.8 + ci * 1.5) * 0.04;
        ctx.fillStyle = 'rgba(30,25,45,0.5)';
        ctx.fillRect(cl2.x - 1, wallTop + 1, 2, 8);

        ctx.fillStyle = ha(col, pulse * 0.8);
        ctx.beginPath(); ctx.roundRect(cl2.x - 14, wallTop + 8, 28, 5, 2); ctx.fill();
        ctx.strokeStyle = ha(col, 0.15); ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.roundRect(cl2.x - 14, wallTop + 8, 28, 5, 2); ctx.stroke();

        ctx.fillStyle = ha(col, 0.5 + Math.sin(t * 0.8 + ci) * 0.1);
        ctx.beginPath(); ctx.arc(cl2.x - 4, wallTop + 10, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cl2.x + 4, wallTop + 10, 1.5, 0, Math.PI * 2); ctx.fill();

        if (lod !== 'low') {
            const coneH = (floorBot - wallBot) * 0.6;
            const coneG = ctx.createLinearGradient(cl2.x, cl2.y, cl2.x, cl2.y + coneH);
            coneG.addColorStop(0, ha(col, 0.04));
            coneG.addColorStop(0.3, ha(col, 0.02));
            coneG.addColorStop(0.7, ha(col, 0.008));
            coneG.addColorStop(1, ha(col, 0));
            ctx.fillStyle = coneG;
            ctx.beginPath();
            ctx.moveTo(cl2.x - 10, cl2.y);
            ctx.lineTo(cl2.x + 10, cl2.y);
            ctx.lineTo(cl2.x + 50, cl2.y + coneH);
            ctx.lineTo(cl2.x - 50, cl2.y + coneH);
            ctx.closePath();
            ctx.fill();
        }
    });

    if (lod === 'high') {
        const dustCount = 12;
        for (let i = 0; i < dustCount; i++) {
            const seed = i * 1.618;
            const dx = rL + ((seed * 173.7) % 1) * (rR - rL);
            const baseY = wallBot + ((seed * 271.3) % 1) * (floorBot - wallBot);
            const dy = baseY + Math.sin(t * 0.3 + seed * 5) * 8;
            const driftX = dx + Math.sin(t * 0.2 + seed * 3) * 3;
            const alpha = 0.04 + Math.sin(t * 0.5 + seed * 7) * 0.02;
            ctx.fillStyle = `rgba(200,190,255,${alpha})`;
            ctx.beginPath(); ctx.arc(driftX, dy, 0.6, 0, Math.PI * 2); ctx.fill();
        }
    }

    const winW = 90, winH2 = (wallBot - wallTop) * 0.7;
    const winX = divX + (rR - divX) * 0.5 - winW / 2;
    const winY2 = wallTop + (wallBot - wallTop) * 0.1;
    const cityY = winY2 + winH2 - 2;
    if (lod !== 'low') {
        for (let bi = 0; bi < 10; bi++) {
            const bIdx = bi % 10;
            const bx = winX + 3 + (bIdx / 10) * (winW - 6);
            const bh = 10 + (bi * 3.7) % 15;
            for (let wy = 2; wy < bh - 2; wy += 3) {
                for (let wx = 0; wx < 6; wx += 2.5) {
                    if (Math.sin(t * 0.5 + bi * 1.3 + wx * 2.1 + wy * 0.7) > 0.3) {
                        ctx.fillStyle = 'rgba(255,220,100,0.25)';
                        ctx.fillRect(bx + wx, cityY - bh + wy, 1.2, 1.5);
                    }
                }
            }
        }

        const shootIdx = Math.floor(t * 0.15);
        const shootPhase = (t * 0.15) % 1;
        if (shootPhase < 0.3) {
            const sp = shootPhase / 0.3;
            const seed = shootIdx * 137.5;
            const sx1 = winX + 5 + (seed % (winW - 20));
            const sy1 = winY2 + 4 + (seed * 0.618) % (winH2 * 0.3);
            const sx2 = sx1 + 25;
            const sy2 = sy1 + 8;
            const cx = sx1 + (sx2 - sx1) * sp;
            const cy = sy1 + (sy2 - sy1) * sp;
            const tailLen = 12 * sp;
            const grad = ctx.createLinearGradient(cx - tailLen, cy - tailLen * 0.32, cx, cy);
            grad.addColorStop(0, 'rgba(255,255,255,0)');
            grad.addColorStop(1, `rgba(255,255,255,${0.4 * (1 - sp)})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(cx - tailLen, cy - tailLen * 0.32);
            ctx.lineTo(cx, cy);
            ctx.stroke();
            ctx.fillStyle = `rgba(255,255,255,${0.6 * (1 - sp)})`;
            ctx.beginPath(); ctx.arc(cx, cy, 1, 0, Math.PI * 2); ctx.fill();
        }

        if (lod === 'high') {
            ctx.save();
            ctx.beginPath(); ctx.rect(winX + 1, winY2 + 1, winW - 2, winH2 - 2); ctx.clip();
            for (let ri = 0; ri < 8; ri++) {
                const rs = (ri * 11.3 + t * 40) % (winH2 + 10);
                const rx = winX + 4 + (ri * 12.7) % (winW - 8);
                const ra = Math.max(0, 0.06 - Math.abs(rs - winH2 / 2) * 0.002);
                ctx.strokeStyle = `rgba(150,170,220,${ra})`;
                ctx.lineWidth = 0.3;
                ctx.beginPath(); ctx.moveTo(rx, winY2 + rs); ctx.lineTo(rx - 0.5, winY2 + rs + 4); ctx.stroke();
            }
            ctx.restore();
        }
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

        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.fillRect(s.x + 2, s.y + 2, s.w - 4, 2);

        ctx.fillStyle = 'rgba(40,35,55,0.3)';
        ctx.fillRect(s.x + s.w / 2 - 1.5, s.y + s.h, 3, 5);
        ctx.beginPath(); ctx.roundRect(s.x + s.w / 2 - 7, s.y + s.h + 5, 14, 2.5, 1); ctx.fill();

        const ix = s.x + 3, iy = s.y + 3, iw = s.w - 6, ih = s.h - 6;
        const scrG = ctx.createLinearGradient(ix, iy, ix + iw, iy + ih);
        scrG.addColorStop(0, ha(col, 0.1));
        scrG.addColorStop(1, ha(col, 0.04));
        ctx.fillStyle = scrG;
        ctx.fillRect(ix, iy, iw, ih);

        ctx.font = '600 7px Inter, sans-serif';
        ctx.fillStyle = ha(col, 0.6);
        ctx.textAlign = 'left';

        if (s.type === 'analytics') {
            ctx.fillText('ANALYTICS', ix + 2, iy + 8);
            ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 0.3;
            ctx.beginPath(); ctx.moveTo(ix, iy + 10); ctx.lineTo(ix + iw, iy + 10); ctx.stroke();
            const bars = lod === 'low' ? 4 : 7;
            const bw2 = (iw - 6) / bars - 1.5;
            for (let i = 0; i < bars; i++) {
                const bh2 = (ih - 14) * (0.15 + 0.7 * Math.abs(Math.sin(t * 0.6 + i * 0.8)));
                const barG = ctx.createLinearGradient(0, iy + ih - bh2 - 2, 0, iy + ih - 2);
                barG.addColorStop(0, ha(col, 0.45));
                barG.addColorStop(1, ha(col, 0.2));
                ctx.fillStyle = barG;
                ctx.beginPath();
                ctx.roundRect(ix + 3 + i * (bw2 + 1.5), iy + ih - bh2 - 2, bw2, bh2, [1, 1, 0, 0]);
                ctx.fill();
            }
        } else if (s.type === 'tasks') {
            ctx.fillText('TASKS', ix + 2, iy + 8);
            ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 0.3;
            ctx.beginPath(); ctx.moveTo(ix, iy + 10); ctx.lineTo(ix + iw, iy + 10); ctx.stroke();
            for (let i = 0; i < 4; i++) {
                const lw = iw * (0.25 + 0.55 * Math.abs(Math.sin(t * 0.4 + i * 1.1)));
                ctx.fillStyle = 'rgba(255,255,255,0.08)';
                ctx.beginPath(); ctx.roundRect(ix + 3, iy + 12 + i * 5, lw - 4, 2.5, 1); ctx.fill();
                ctx.fillStyle = i < 2 ? ha('#22c55e', 0.5) : ha(col, 0.3);
                ctx.beginPath(); ctx.arc(ix + iw - 6, iy + 13.5 + i * 5, 2, 0, Math.PI * 2); ctx.fill();
                if (i < 2) {
                    ctx.strokeStyle = ha('#22c55e', 0.2); ctx.lineWidth = 0.5;
                    ctx.beginPath(); ctx.arc(ix + iw - 6, iy + 13.5 + i * 5, 3.5, 0, Math.PI * 2); ctx.stroke();
                }
            }
        } else {
            ctx.fillText('STATUS', ix + 2, iy + 8);
            const cR = Math.min(iw, ih) * 0.25;
            const cX2 = ix + iw / 2, cY2 = iy + ih / 2 + 3;
            ctx.beginPath(); ctx.arc(cX2, cY2, cR, 0, Math.PI * 2);
            ctx.strokeStyle = ha(col, 0.12); ctx.lineWidth = 2.5; ctx.stroke();
            const progress = 0.75 + Math.sin(t * 0.3) * 0.05;
            ctx.beginPath(); ctx.arc(cX2, cY2, cR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
            ctx.strokeStyle = ha(col, 0.55); ctx.lineWidth = 3; ctx.stroke();
            ctx.font = 'bold 9px Inter, sans-serif'; ctx.textAlign = 'center';
            ctx.fillStyle = ha(col, 0.75);
            ctx.fillText(`${Math.round(progress * 100)}%`, cX2, cY2 + 3);
            ctx.textAlign = 'start';
        }

        if (lod === 'high') {
            const glowH = 10;
            const sGlow = ctx.createLinearGradient(s.x, s.y + s.h + 8, s.x, s.y + s.h + 8 + glowH);
            sGlow.addColorStop(0, ha(col, 0.03));
            sGlow.addColorStop(1, ha(col, 0));
            ctx.fillStyle = sGlow;
            ctx.fillRect(s.x - 5, s.y + s.h + 8, s.w + 10, glowH);
        }
    });

    if (agentsWalking > 0) {
        const alertPulse = Math.sin(t * 5);
        const mainScreen = screens[1];
        ctx.strokeStyle = ha('#ef4444', 0.35 + alertPulse * 0.15);
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(mainScreen.x - 2, mainScreen.y - 2, mainScreen.w + 4, mainScreen.h + 4, 4);
        ctx.stroke();
        ctx.fillStyle = ha('#ef4444', 0.02 + alertPulse * 0.01);
        ctx.beginPath(); ctx.roundRect(mainScreen.x - 2, mainScreen.y - 2, mainScreen.w + 4, mainScreen.h + 4, 4);
        ctx.fill();
    }

    const srvX = rL + 8, srvY = wallBot + 10;
    const srvW = 16, srvH = floorBot - wallBot - 20;
    for (let i = 0; i < 5; i++) {
        const ry = srvY + 5 + i * (srvH / 6);
        ctx.fillStyle = 'rgba(25,20,38,0.6)';
        ctx.beginPath(); ctx.roundRect(srvX + 2, ry, srvW - 4, 7, 1); ctx.fill();
        ctx.fillStyle = 'rgba(40,35,55,0.3)';
        ctx.fillRect(srvX + 3, ry + 1, srvW - 6, 1);
        const ledOn = Math.sin(t * 3 + i * 1.3) > 0;
        ctx.fillStyle = ledOn ? '#22c55e' : ha(col, 0.3);
        ctx.beginPath(); ctx.arc(srvX + srvW - 4, ry + 3.5, 1.5, 0, Math.PI * 2); ctx.fill();
        if (ledOn) {
            ctx.fillStyle = 'rgba(34,197,94,0.15)';
            ctx.beginPath(); ctx.arc(srvX + srvW - 4, ry + 3.5, 4, 0, Math.PI * 2); ctx.fill();
        }
    }
}
