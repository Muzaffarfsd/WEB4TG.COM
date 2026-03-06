import type { Agent } from './office-config';
import { ha } from './office-config';

export function drawArcade(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, col: string, t: number, player?: Agent | null,
) {
    const w = 34, h = 60;
    const cL = x - w / 2, cT = y - h;

    ctx.save();
    ctx.filter = 'blur(6px)';
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(x, y + 3, w * 0.6, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.filter = 'none';
    ctx.restore();

    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(x, y + 2, w * 0.55, 4, 0, 0, Math.PI * 2); ctx.fill();

    const cabG = ctx.createLinearGradient(cL, cT, cL + w, y);
    cabG.addColorStop(0, '#1c1535');
    cabG.addColorStop(0.3, '#15102d');
    cabG.addColorStop(0.7, '#110e28');
    cabG.addColorStop(1, '#0c0a1c');
    ctx.fillStyle = cabG;
    ctx.beginPath();
    ctx.moveTo(cL + 3, cT);
    ctx.lineTo(cL + w - 3, cT);
    ctx.quadraticCurveTo(cL + w, cT, cL + w, cT + 3);
    ctx.lineTo(cL + w - 1, cT + 28);
    ctx.lineTo(cL + w + 2, cT + 36);
    ctx.lineTo(cL + w + 1, y);
    ctx.quadraticCurveTo(cL + w + 1, y + 2, cL + w - 1, y + 2);
    ctx.lineTo(cL + 1, y + 2);
    ctx.quadraticCurveTo(cL - 1, y + 2, cL - 1, y);
    ctx.lineTo(cL - 2, cT + 36);
    ctx.lineTo(cL + 1, cT + 28);
    ctx.lineTo(cL, cT + 3);
    ctx.quadraticCurveTo(cL, cT, cL + 3, cT);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = ha(col, 0.18);
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fillRect(cL + 1, cT + 1, w / 2 - 1, h - 2);

    const sideG = ctx.createLinearGradient(cL + w - 2, cT, cL + w, y);
    sideG.addColorStop(0, ha(col, 0.06));
    sideG.addColorStop(0.5, ha(col, 0.02));
    sideG.addColorStop(1, ha(col, 0.04));
    ctx.fillStyle = sideG;
    ctx.fillRect(cL + w - 3, cT + 5, 3, h - 7);

    const mH = 8;
    const mG = ctx.createLinearGradient(cL, cT, cL, cT + mH);
    mG.addColorStop(0, ha(col, 0.35));
    mG.addColorStop(0.5, ha(col, 0.25));
    mG.addColorStop(1, ha(col, 0.1));
    ctx.fillStyle = mG;
    ctx.beginPath(); ctx.roundRect(cL + 1, cT, w - 2, mH, [3, 3, 0, 0]); ctx.fill();

    ctx.strokeStyle = ha(col, 0.3); ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.roundRect(cL + 1, cT, w - 2, mH, [3, 3, 0, 0]); ctx.stroke();

    const marqueeFlicker = 0.8 + Math.sin(t * 6) * 0.1 + Math.sin(t * 9.3) * 0.05;
    ctx.font = 'bold 6px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillText('ARCADE', x + 0.5, cT + 6);
    ctx.fillStyle = `rgba(255,255,255,${0.85 * marqueeFlicker})`;
    ctx.fillText('ARCADE', x, cT + 5.5);

    ctx.fillStyle = ha(col, 0.4 * marqueeFlicker);
    for (let li = 0; li < 5; li++) {
        const lx = cL + 3 + li * 7;
        const on = Math.sin(t * 4 + li * 1.5) > 0;
        if (on) {
            ctx.beginPath(); ctx.arc(lx, cT + mH - 1.5, 0.8, 0, Math.PI * 2); ctx.fill();
        }
    }
    ctx.textAlign = 'start';

    const scrX = x - 12, scrY = cT + mH + 2, scrW = 24, scrH = 18;
    ctx.fillStyle = '#020208';
    ctx.beginPath(); ctx.roundRect(scrX - 1, scrY - 1, scrW + 2, scrH + 2, 1.5); ctx.fill();
    ctx.strokeStyle = 'rgba(50,40,70,0.5)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(scrX - 1, scrY - 1, scrW + 2, scrH + 2, 1.5); ctx.stroke();

    const scG = ctx.createLinearGradient(scrX, scrY, scrX + scrW, scrY + scrH);
    scG.addColorStop(0, 'rgba(5,3,15,0.9)');
    scG.addColorStop(1, 'rgba(8,5,20,0.9)');
    ctx.fillStyle = scG;
    ctx.fillRect(scrX, scrY, scrW, scrH);

    const starCount = 15;
    for (let si = 0; si < starCount; si++) {
        const sx2 = scrX + 1 + ((si * 7.3) % (scrW - 2));
        const sy2 = scrY + 1 + ((si * 5.1) % (scrH - 6));
        const sb = 0.08 + (si * 0.37) % 0.12;
        ctx.fillStyle = `rgba(255,255,255,${sb})`;
        ctx.fillRect(sx2, sy2, 0.5, 0.5);
    }

    const shipX = scrX + scrW / 2 + Math.sin(t * 1.5) * 6;
    const shipY = scrY + scrH - 4;
    ctx.fillStyle = ha('#22c55e', 0.8);
    ctx.beginPath();
    ctx.moveTo(shipX, shipY - 3);
    ctx.lineTo(shipX - 3, shipY + 1);
    ctx.lineTo(shipX - 1, shipY);
    ctx.lineTo(shipX - 1, shipY + 2);
    ctx.lineTo(shipX + 1, shipY + 2);
    ctx.lineTo(shipX + 1, shipY);
    ctx.lineTo(shipX + 3, shipY + 1);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = ha('#22c55e', 0.15);
    ctx.beginPath(); ctx.arc(shipX, shipY, 5, 0, Math.PI * 2); ctx.fill();

    const bulletActive = Math.sin(t * 5) > -0.3;
    if (bulletActive) {
        const bY = shipY - 4 - ((t * 25) % 12);
        if (bY > scrY + 1) {
            ctx.fillStyle = 'rgba(255,255,100,0.9)';
            ctx.fillRect(shipX - 0.3, bY, 0.6, 2);
            ctx.fillStyle = 'rgba(255,255,100,0.2)';
            ctx.fillRect(shipX - 1, bY - 0.5, 2, 3);
        }
    }

    const invRows = 2, invCols = 5;
    const invW2 = 2.5, invSpX = (scrW - 4) / invCols;
    const invDrift = Math.sin(t * 0.8) * 3;
    for (let ir = 0; ir < invRows; ir++) {
        for (let ic = 0; ic < invCols; ic++) {
            const ix2 = scrX + 2 + ic * invSpX + invDrift;
            const iy2 = scrY + 3 + ir * 5;
            const alive = ((ir * invCols + ic + Math.floor(t * 0.3)) * 7) % 10 > 2;
            if (alive && ix2 > scrX && ix2 + invW2 < scrX + scrW) {
                const invColor = ir === 0 ? ha(col, 0.7) : ha('#ef4444', 0.6);
                ctx.fillStyle = invColor;
                ctx.fillRect(ix2, iy2, invW2, 1.5);
                ctx.fillRect(ix2 + 0.5, iy2 + 1.5, invW2 - 1, 1);
                ctx.fillRect(ix2 - 0.3, iy2 + 1, 0.6, 0.6);
                ctx.fillRect(ix2 + invW2 - 0.3, iy2 + 1, 0.6, 0.6);
            }
        }
    }

    ctx.fillStyle = ha('#22c55e', 0.4);
    ctx.font = 'bold 3px monospace'; ctx.textAlign = 'right';
    const score = Math.floor(t * 10) % 9999;
    ctx.fillText(`${score}`, scrX + scrW - 1, scrY + scrH - 1);
    ctx.textAlign = 'start';

    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = ha('#22c55e', 0.3);
        ctx.fillRect(scrX + 1 + i * 3.5, scrY + scrH - 2.5, 2, 1.5);
    }

    ctx.fillStyle = `rgba(100,80,200,${0.04 + Math.sin(t * 2) * 0.02})`;
    ctx.fillRect(scrX - 4, scrY - 2, scrW + 8, scrH + 4);

    const scanY = scrY + ((t * 15) % scrH);
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.fillRect(scrX, scanY, scrW, 1);

    const ctrlY = cT + mH + scrH + 6;
    const ctrlG = ctx.createLinearGradient(x - 12, ctrlY, x + 12, ctrlY + 14);
    ctrlG.addColorStop(0, '#0c0918');
    ctrlG.addColorStop(1, '#08060f');
    ctx.fillStyle = ctrlG;
    ctx.beginPath(); ctx.roundRect(x - 13, ctrlY, 26, 14, 1.5); ctx.fill();
    ctx.strokeStyle = 'rgba(50,40,65,0.4)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.roundRect(x - 13, ctrlY, 26, 14, 1.5); ctx.stroke();

    const joyX = x - 5, joyY = ctrlY + 7;
    ctx.fillStyle = '#1a1630';
    ctx.beginPath(); ctx.arc(joyX, joyY, 4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(60,50,80,0.4)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.arc(joyX, joyY, 4, 0, Math.PI * 2); ctx.stroke();

    const jTilt = Math.sin(t * 3) * 0.3;
    ctx.fillStyle = '#2a2440';
    ctx.save(); ctx.translate(joyX, joyY); ctx.rotate(jTilt);
    ctx.beginPath(); ctx.roundRect(-1.2, -6, 2.4, 6, 1); ctx.fill();
    ctx.fillStyle = ha(col, 0.5);
    ctx.beginPath(); ctx.arc(0, -6, 2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    const btnColors = [ha('#ef4444', 0.7), ha('#3b82f6', 0.6), ha('#22c55e', 0.6)];
    const btnLabels = ['A', 'B', 'C'];
    for (let bi = 0; bi < 3; bi++) {
        const bx = x + 3 + bi * 5;
        const by = ctrlY + 5 + (bi === 1 ? -1 : 0);
        const pressed = Math.sin(t * 8 + bi * 2.5) > 0.8;
        ctx.fillStyle = pressed ? btnColors[bi] : ha(btnColors[bi].slice(0, 7), 0.4);
        ctx.beginPath(); ctx.arc(bx, by, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 0.3;
        ctx.beginPath(); ctx.arc(bx, by, 2.2, 0, Math.PI * 2); ctx.stroke();
        if (pressed) {
            ctx.fillStyle = ha(btnColors[bi].slice(0, 7), 0.2);
            ctx.beginPath(); ctx.arc(bx, by, 4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.font = 'bold 2px monospace'; ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillText(btnLabels[bi], bx, by + 5.5);
    }
    ctx.textAlign = 'start';

    const coinY = ctrlY + 16;
    ctx.fillStyle = 'rgba(20,16,32,0.6)';
    ctx.beginPath(); ctx.roundRect(x - 3, coinY, 6, 4, 1); ctx.fill();
    ctx.strokeStyle = 'rgba(60,50,80,0.3)'; ctx.lineWidth = 0.4;
    ctx.beginPath(); ctx.roundRect(x - 3, coinY, 6, 4, 1); ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(x - 1, coinY + 1, 2, 2);
    ctx.font = '500 2.5px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillText('COIN', x, coinY + 7);

    ctx.fillStyle = ha(col, 0.05);
    ctx.beginPath();
    ctx.moveTo(cL + 2, cT + mH + 2);
    ctx.lineTo(cL + 6, cT + mH + 8);
    ctx.lineTo(cL + 2, cT + mH + 14);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cL + 2, cT + mH + 16);
    ctx.lineTo(cL + 5, cT + mH + 20);
    ctx.lineTo(cL + 2, cT + mH + 24);
    ctx.closePath(); ctx.fill();

    const spkY = y - 12;
    ctx.fillStyle = 'rgba(20,16,30,0.5)';
    ctx.beginPath(); ctx.roundRect(x - 6, spkY, 12, 8, 1); ctx.fill();
    for (let si = 0; si < 4; si++) {
        for (let sj = 0; sj < 6; sj++) {
            ctx.fillStyle = 'rgba(30,25,45,0.8)';
            ctx.fillRect(x - 5 + sj * 2, spkY + 1 + si * 2, 1.2, 1.2);
        }
    }

    const spkGlow = Math.abs(Math.sin(t * 4)) * 0.06;
    ctx.fillStyle = ha(col, spkGlow);
    ctx.beginPath(); ctx.roundRect(x - 6, spkY, 12, 8, 1); ctx.fill();

    ctx.strokeStyle = ha(col, 0.08);
    ctx.lineWidth = 1.5;
    ctx.setLineDash([1, 2]);
    ctx.beginPath();
    ctx.moveTo(cL + 0.5, cT + 3);
    ctx.lineTo(cL + 0.5, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cL + w - 0.5, cT + 3);
    ctx.lineTo(cL + w - 0.5, y);
    ctx.stroke();
    ctx.setLineDash([]);

    if (player) {
        const px2 = x + w / 2 + 10;
        const py2 = y + 2;

        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath(); ctx.ellipse(px2, py2 + 1, 7, 2, 0, 0, Math.PI * 2); ctx.fill();

        const pBob = Math.abs(Math.sin(t * 6)) * 0.3;
        const pHY = py2 - 18 - pBob;

        ctx.fillStyle = '#1a1830';
        ctx.beginPath(); ctx.roundRect(px2 - 2.5, py2 - 5, 5, 7, 1.5); ctx.fill();
        ctx.fillStyle = '#222040';
        ctx.beginPath(); ctx.ellipse(px2, py2 + 0.5, 4, 1.5, 0, 0, Math.PI * 2); ctx.fill();

        const pShG = ctx.createLinearGradient(px2 - 6, pHY + 6, px2 + 6, pHY + 16);
        pShG.addColorStop(0, player.shirt);
        pShG.addColorStop(1, ha(player.shirt, 0.6));
        ctx.fillStyle = pShG;
        ctx.beginPath(); ctx.roundRect(px2 - 6, pHY + 6, 12, 10, 3); ctx.fill();

        ctx.fillStyle = ha(player.shirt, 0.85);
        ctx.beginPath(); ctx.roundRect(px2 - 7, pHY + 5.5, 14, 4, [2, 2, 0, 0]); ctx.fill();

        ctx.save();
        ctx.translate(px2 - 7, pHY + 8);
        ctx.rotate(-0.6 + Math.sin(t * 4) * 0.15);
        const laG = ctx.createLinearGradient(0, 0, 0, 5);
        laG.addColorStop(0, player.shirt);
        laG.addColorStop(1, ha(player.shirt, 0.5));
        ctx.fillStyle = laG;
        ctx.beginPath(); ctx.roundRect(-2, 0, 4, 6, 2); ctx.fill();
        ctx.fillStyle = player.skin;
        ctx.beginPath(); ctx.arc(0, 7, 2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(px2 + 7, pHY + 8);
        ctx.rotate(0.6 - Math.sin(t * 4 + 1) * 0.15);
        const raG = ctx.createLinearGradient(0, 0, 0, 5);
        raG.addColorStop(0, player.shirt);
        raG.addColorStop(1, ha(player.shirt, 0.5));
        ctx.fillStyle = raG;
        ctx.beginPath(); ctx.roundRect(-2, 0, 4, 6, 2); ctx.fill();
        ctx.fillStyle = player.skin;
        ctx.beginPath(); ctx.arc(0, 7, 2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        const pHR = 7;
        const hdG = ctx.createRadialGradient(px2 - 1, pHY - 1, 0, px2, pHY, pHR);
        hdG.addColorStop(0, '#fff3');
        hdG.addColorStop(0.15, player.skin);
        hdG.addColorStop(1, ha(player.skin, 0.7));
        ctx.fillStyle = hdG;
        ctx.beginPath(); ctx.arc(px2, pHY, pHR, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = player.skin;
        ctx.beginPath(); ctx.arc(px2 - pHR + 1, pHY + 1, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(px2 + pHR - 1, pHY + 1, 2, 0, Math.PI * 2); ctx.fill();

        const hs = player.hairStyle % 5;
        ctx.fillStyle = player.hair;
        if (hs <= 1) {
            ctx.beginPath(); ctx.arc(px2, pHY - 1, pHR + 1, Math.PI + 0.3, -0.3); ctx.fill();
        } else {
            ctx.beginPath(); ctx.ellipse(px2, pHY - pHR * 0.3, pHR + 1.5, pHR * 0.7, 0, Math.PI, Math.PI * 2); ctx.fill();
        }

        const peO = pHR * 0.3;
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.ellipse(px2 - peO, pHY + 1, 1.5, 1.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(px2 + peO, pHY + 1, 1.5, 1.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1a1520';
        ctx.beginPath(); ctx.arc(px2 - peO - 0.3, pHY + 1.3, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(px2 + peO - 0.3, pHY + 1.3, 0.8, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = ha(player.skin, 0.5);
        ctx.beginPath();
        ctx.moveTo(px2 - 1.2, pHY + pHR * 0.35);
        ctx.quadraticCurveTo(px2, pHY + pHR * 0.5, px2 + 1.2, pHY + pHR * 0.35);
        ctx.stroke();

        if (player.glasses) {
            ctx.strokeStyle = 'rgba(200,200,255,0.45)'; ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.ellipse(px2 - peO, pHY + 1, 2, 1.5, 0, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.ellipse(px2 + peO, pHY + 1, 2, 1.5, 0, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(px2 - peO + 2, pHY + 1); ctx.lineTo(px2 + peO - 2, pHY + 1); ctx.stroke();
        }

        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.font = 'bold 8px Inter, sans-serif';
        ctx.fillText(player.name, px2 + 0.6, pHY - pHR - 4);
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.fillText(player.name, px2, pHY - pHR - 5);
        ctx.textAlign = 'start';

        ctx.fillStyle = ha(col, 0.05);
        ctx.beginPath(); ctx.arc(px2, pHY, 14, 0, Math.PI * 2); ctx.fill();
    }
}

export function drawCouch(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, col: string,
) {
    const cW = 60, cH = 20, backH = 14;

    ctx.save();
    ctx.filter = 'blur(8px)';
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath(); ctx.ellipse(x, y + 4, cW * 0.55, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.filter = 'none';
    ctx.restore();

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

    ctx.save();
    ctx.filter = 'blur(6px)';
    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.beginPath(); ctx.ellipse(x, y + 3, w2 * 0.5, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.filter = 'none';
    ctx.restore();

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

    ctx.globalAlpha = 0.04;
    ctx.fillStyle = col; ctx.fillRect(glassX - 2, glassY - 2, glassW + 4, glassH + 4);
    ctx.globalAlpha = 1;

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

    ctx.save();
    ctx.filter = 'blur(7px)';
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.beginPath(); ctx.ellipse(x, y + legH + 3, dW * 0.48, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.filter = 'none';
    ctx.restore();

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

        ctx.globalAlpha = 0.15;
        ctx.fillStyle = col; ctx.fillRect(sX - 4, sY - 4, sW + 8, sH + 8);
        ctx.globalAlpha = 1;

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

export function drawDeskAccessories(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, isOrch: boolean, col: string, agentIdx: number, t: number,
) {
    const dW = isOrch ? 82 : 62;
    const item = agentIdx % 4;

    if (item === 0 || item === 2) {
        const cupX = x + dW / 2 - 10;
        const cupY = y - 4;
        ctx.fillStyle = 'rgba(80,60,40,0.35)';
        ctx.beginPath(); ctx.roundRect(cupX - 3, cupY - 6, 6, 6, [0, 0, 1, 1]); ctx.fill();
        ctx.fillStyle = ha(col, 0.12);
        ctx.beginPath(); ctx.ellipse(cupX, cupY - 6, 3, 1.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(80,60,40,0.25)'; ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(cupX + 3, cupY - 4);
        ctx.quadraticCurveTo(cupX + 5.5, cupY - 3, cupX + 3, cupY - 1);
        ctx.stroke();

        for (let si = 0; si < 3; si++) {
            const steamPhase = (t * 0.8 + si * 0.7 + agentIdx * 1.3) % 2;
            if (steamPhase < 1.5) {
                const sp = steamPhase / 1.5;
                const sx = cupX + Math.sin(t * 1.5 + si * 2) * 1.5;
                const sy = cupY - 7 - sp * 8;
                const sa = 0.08 * (1 - sp);
                ctx.strokeStyle = `rgba(200,200,220,${sa})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(sx, sy + 2);
                ctx.quadraticCurveTo(sx + Math.sin(t * 2 + si) * 2, sy - 1, sx - Math.sin(t * 1.7 + si) * 1.5, sy - 3);
                ctx.stroke();
            }
        }
    }

    if (item === 1 || item === 3) {
        const potX = x - dW / 2 + 8;
        const potY = y - 3;
        ctx.fillStyle = 'rgba(120,80,50,0.3)';
        ctx.beginPath(); ctx.roundRect(potX - 2.5, potY - 4, 5, 4, [0, 0, 1, 1]); ctx.fill();
        ctx.fillStyle = '#22882a';
        ctx.beginPath(); ctx.ellipse(potX, potY - 6, 3, 4, 0, Math.PI + 0.3, -0.3); ctx.fill();
        ctx.fillStyle = '#2aaa35';
        ctx.beginPath(); ctx.ellipse(potX - 1, potY - 7, 2, 3, -0.2, Math.PI + 0.5, -0.5); ctx.fill();
    }

    if (item === 2 && !isOrch) {
        const frameX = x + dW / 2 - 18;
        const frameY = y - 12;
        ctx.fillStyle = 'rgba(50,40,65,0.4)';
        ctx.beginPath(); ctx.roundRect(frameX, frameY, 7, 9, 0.5); ctx.fill();
        ctx.fillStyle = 'rgba(100,80,130,0.15)';
        ctx.fillRect(frameX + 1, frameY + 1, 5, 7);
    }
}
