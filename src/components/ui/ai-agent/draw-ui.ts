import type { Agent } from './office-config';
import { ha } from './office-config';

export function drawPerson(
    ctx: CanvasRenderingContext2D,
    a: Agent, col: string, isOrch: boolean, t: number, isWalking: boolean, noMotion: boolean,
) {
    const sc = isOrch ? 1.25 : 1;
    const bob = noMotion ? 0 : (isWalking
        ? Math.abs(Math.sin(a.walkT * 8 * Math.PI)) * 2.5
        : Math.sin(t * 1.5 + a.phase) * 0.8);
    const hR = 9 * sc;
    const hY = a.y - 22 * sc - bob;
    const hX = a.x;

    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(hX, a.y + 2, 10 * sc, 3, 0, 0, Math.PI * 2); ctx.fill();

    const bW = 16 * sc, bH = 13 * sc;
    const bY = hY + hR - 1;

    const shG = ctx.createLinearGradient(hX - bW / 2, bY, hX + bW / 2, bY + bH);
    shG.addColorStop(0, a.shirt);
    shG.addColorStop(0.7, ha(a.shirt, 0.7));
    shG.addColorStop(1, ha(a.shirt, 0.45));
    ctx.fillStyle = shG;
    ctx.beginPath(); ctx.roundRect(hX - bW / 2, bY, bW, bH, [4 * sc, 4 * sc, 2 * sc, 2 * sc]); ctx.fill();

    ctx.fillStyle = ha(a.shirt, 0.85);
    ctx.beginPath();
    ctx.roundRect(hX - (bW + 4 * sc) / 2, bY - 1, bW + 4 * sc, 6 * sc, [3 * sc, 3 * sc, 0, 0]);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(hX - bW / 2 + 1, bY + 1, bW / 2 - 2, bH - 2);

    ctx.fillStyle = a.skin;
    ctx.beginPath();
    ctx.moveTo(hX - 2.5 * sc, bY + 1);
    ctx.lineTo(hX + 2.5 * sc, bY + 1);
    ctx.lineTo(hX + 1.5 * sc, bY + 5 * sc);
    ctx.lineTo(hX - 1.5 * sc, bY + 5 * sc);
    ctx.closePath(); ctx.fill();

    if (isWalking && !noMotion) {
        const legPhase = Math.sin(a.walkT * 8 * Math.PI);
        [-1, 1].forEach(side => {
            const lOff = side * legPhase * 3;
            ctx.fillStyle = '#1a1830';
            ctx.beginPath(); ctx.roundRect(hX + side * 3.5 * sc - 2.5 * sc, bY + bH, 5 * sc, 10 * sc + lOff * side * 0.3, 2); ctx.fill();
            ctx.fillStyle = '#222040';
            ctx.beginPath(); ctx.ellipse(hX + side * 3.5 * sc, bY + bH + 10 * sc + lOff * side * 0.3, 4 * sc, 2 * sc, 0, 0, Math.PI * 2); ctx.fill();
        });

        [-1, 1].forEach(side => {
            const aOff = -side * legPhase * 0.3;
            ctx.save();
            ctx.translate(hX + side * (bW / 2 + 1), bY + 3 * sc);
            ctx.rotate(aOff);
            const armG = ctx.createLinearGradient(0, 0, 0, bH * 0.5);
            armG.addColorStop(0, a.shirt);
            armG.addColorStop(1, ha(a.shirt, 0.6));
            ctx.fillStyle = armG;
            ctx.beginPath(); ctx.roundRect(-3 * sc, 0, 6 * sc, bH * 0.5, 3 * sc); ctx.fill();
            ctx.fillStyle = a.skin;
            ctx.beginPath(); ctx.arc(0, bH * 0.5 + 1, 3 * sc, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        });
    } else {
        [-1, 1].forEach(side => {
            ctx.save();
            ctx.translate(hX + side * (bW / 2 + 1), bY + 3 * sc);
            const rot = a.state === 'working' ? (Math.sin(t * 3.5 + a.phase + side) * 0.12) : 0;
            ctx.rotate(rot);
            const armG = ctx.createLinearGradient(0, 0, 0, bH * 0.5);
            armG.addColorStop(0, a.shirt);
            armG.addColorStop(1, ha(a.shirt, 0.6));
            ctx.fillStyle = armG;
            ctx.beginPath(); ctx.roundRect(-3 * sc, 0, 6 * sc, bH * 0.5, 3 * sc); ctx.fill();
            ctx.fillStyle = a.skin;
            ctx.beginPath(); ctx.arc(0, bH * 0.5 + 1, 3 * sc, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        });
    }

    const hdG = ctx.createRadialGradient(hX - 2 * sc, hY - 2 * sc, 0, hX, hY, hR * 1.1);
    hdG.addColorStop(0, '#fff4');
    hdG.addColorStop(0.15, a.skin);
    hdG.addColorStop(0.85, ha(a.skin, 0.85));
    hdG.addColorStop(1, ha(a.skin, 0.7));
    ctx.fillStyle = hdG;
    ctx.beginPath(); ctx.arc(hX, hY, hR, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = ha(a.skin, 0.3);
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.arc(hX, hY, hR, 0, Math.PI * 2); ctx.stroke();

    const earR = 2.5 * sc;
    ctx.fillStyle = a.skin;
    ctx.beginPath(); ctx.arc(hX - hR + 1, hY + 1, earR, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hX + hR - 1, hY + 1, earR, 0, Math.PI * 2); ctx.fill();

    const hs = a.hairStyle % 5;
    const hairDark = ha(a.hair, 0.8);
    ctx.fillStyle = a.hair;
    if (hs === 0) {
        ctx.beginPath();
        ctx.ellipse(hX, hY - hR * 0.3, hR + 2 * sc, hR * 0.75, 0, Math.PI, Math.PI * 2); ctx.fill();
        ctx.fillStyle = hairDark;
        ctx.beginPath();
        ctx.ellipse(hX + 3 * sc, hY - hR * 0.4, hR * 0.4, hR * 0.3, 0.2, Math.PI, Math.PI * 2); ctx.fill();
        ctx.fillStyle = a.hair;
        ctx.fillRect(hX + hR - 0.5, hY - hR * 0.3, 3 * sc, hR * 0.7);
    } else if (hs === 1) {
        ctx.beginPath();
        ctx.arc(hX, hY - 1, hR + 1.5 * sc, Math.PI + 0.3, -0.3); ctx.fill();
        ctx.fillStyle = hairDark;
        ctx.beginPath();
        ctx.ellipse(hX, hY - hR * 0.5, hR * 0.6, hR * 0.25, -0.15, Math.PI, Math.PI * 2); ctx.fill();
    } else if (hs === 2) {
        ctx.beginPath();
        ctx.ellipse(hX, hY - hR * 0.35, hR + 2.5 * sc, hR * 0.65, 0, Math.PI + 0.4, -0.4); ctx.fill();
        ctx.fillStyle = a.hair;
        ctx.fillRect(hX - hR - 1.5 * sc, hY - hR * 0.35, 3 * sc, hR);
        ctx.fillRect(hX + hR - 1 * sc, hY - hR * 0.35, 3 * sc, hR);
    } else if (hs === 3) {
        ctx.beginPath();
        ctx.ellipse(hX, hY - hR * 0.25, hR + 1 * sc, hR * 0.8, 0, Math.PI, Math.PI * 2); ctx.fill();
        for (let spike = 0; spike < 5; spike++) {
            const sA = Math.PI + 0.6 + (spike / 4) * (Math.PI - 1.2);
            ctx.beginPath();
            ctx.moveTo(hX + Math.cos(sA) * (hR + 1), hY + Math.sin(sA) * (hR + 1));
            ctx.lineTo(hX + Math.cos(sA) * (hR + 5 * sc), hY + Math.sin(sA) * (hR + 5 * sc) - 2);
            ctx.lineTo(hX + Math.cos(sA + 0.25) * (hR + 1), hY + Math.sin(sA + 0.25) * (hR + 1));
            ctx.closePath(); ctx.fill();
        }
    } else {
        ctx.beginPath();
        ctx.arc(hX, hY, hR + 1.5 * sc, Math.PI + 0.2, -0.2); ctx.fill();
        ctx.fillRect(hX - hR - 1 * sc, hY - 2, 2.5 * sc, hR + 4);
        ctx.fillRect(hX + hR - 1 * sc, hY - 2, 2.5 * sc, hR + 4);
        ctx.beginPath();
        ctx.ellipse(hX - hR * 0.3, hY + hR + 1, hR * 0.5, 3 * sc, -0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath();
        ctx.ellipse(hX + hR * 0.3, hY + hR + 1, hR * 0.5, 3 * sc, 0.3, 0, Math.PI * 2); ctx.fill();
    }

    const eY = hY + 1 * sc, eO = hR * 0.32;
    const eW = 3.5 * sc, eH = 3 * sc;

    const browY = eY - eH / 2 - 1.5 * sc;
    ctx.strokeStyle = ha(a.hair, 0.7);
    ctx.lineWidth = 1.2 * sc;
    const browRaise = a.state === 'idle' ? 0.5 : (a.state === 'working' ? -0.3 : 0);
    ctx.beginPath();
    ctx.moveTo(hX - eO - eW / 2 + 0.5, browY + browRaise + 0.5);
    ctx.quadraticCurveTo(hX - eO, browY + browRaise - 1, hX - eO + eW / 2 - 0.5, browY + browRaise + 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(hX + eO - eW / 2 + 0.5, browY + browRaise + 0.5);
    ctx.quadraticCurveTo(hX + eO, browY + browRaise - 1, hX + eO + eW / 2 - 0.5, browY + browRaise + 0.5);
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.ellipse(hX - eO, eY, eW / 2, eH / 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hX + eO, eY, eW / 2, eH / 2, 0, 0, Math.PI * 2); ctx.fill();

    const lookX = a.state === 'working' ? -0.3 : (isWalking ? Math.sin(a.walkT * 4) * 0.5 : 0);
    ctx.fillStyle = '#1a1520';
    ctx.beginPath(); ctx.arc(hX - eO + lookX, eY + 0.3, 1.5 * sc, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hX + eO + lookX, eY + 0.3, 1.5 * sc, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(hX - eO - 0.5 + lookX, eY - 0.3, 0.5 * sc, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hX + eO - 0.5 + lookX, eY - 0.3, 0.5 * sc, 0, Math.PI * 2); ctx.fill();

    if (a.glasses) {
        ctx.strokeStyle = 'rgba(200,200,255,0.5)';
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.ellipse(hX - eO, eY, eW / 2 + 1, eH / 2 + 0.5, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(hX + eO, eY, eW / 2 + 1, eH / 2 + 0.5, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(hX - eO + eW / 2 + 1, eY); ctx.lineTo(hX + eO - eW / 2 - 1, eY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(hX - eO - eW / 2 - 1, eY); ctx.lineTo(hX - hR + 1, eY - 1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(hX + eO + eW / 2 + 1, eY); ctx.lineTo(hX + hR - 1, eY - 1); ctx.stroke();
    }

    if (a.headphones) {
        ctx.strokeStyle = 'rgba(80,70,100,0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(hX, hY - 2, hR + 2.5 * sc, Math.PI + 0.5, -0.5); ctx.stroke();
        ctx.fillStyle = 'rgba(60,50,80,0.9)';
        ctx.beginPath(); ctx.roundRect(hX - hR - 3.5 * sc, hY - 2, 4 * sc, 7 * sc, 2); ctx.fill();
        ctx.beginPath(); ctx.roundRect(hX + hR - 0.5 * sc, hY - 2, 4 * sc, 7 * sc, 2); ctx.fill();
    }

    if (a.state === 'idle') {
        ctx.fillStyle = ha(a.skin, 0.6);
        ctx.beginPath(); ctx.arc(hX, hY + hR * 0.42, 2 * sc, 0, Math.PI); ctx.fill();
    } else if (a.state === 'working') {
        ctx.strokeStyle = ha(a.skin, 0.5);
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(hX - 1.5 * sc, hY + hR * 0.42);
        ctx.lineTo(hX + 1.5 * sc, hY + hR * 0.42);
        ctx.stroke();

        if (!noMotion) {
            const blink = Math.sin(t * 0.8 + a.phase * 3);
            if (blink > 0.97) {
                ctx.strokeStyle = a.skin; ctx.lineWidth = eH;
                ctx.beginPath();
                ctx.moveTo(hX - eO - eW / 2, eY); ctx.lineTo(hX - eO + eW / 2, eY);
                ctx.moveTo(hX + eO - eW / 2, eY); ctx.lineTo(hX + eO + eW / 2, eY);
                ctx.stroke();
            }
        }
    } else {
        ctx.fillStyle = ha(a.skin, 0.6);
        ctx.beginPath(); ctx.arc(hX, hY + hR * 0.42, 1.5 * sc, 0, Math.PI); ctx.fill();
    }

    ctx.fillStyle = ha(a.skin, 0.35);
    ctx.beginPath(); ctx.arc(hX - hR * 0.4, hY + hR * 0.15, 2 * sc, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hX + hR * 0.4, hY + hR * 0.15, 2 * sc, 0, Math.PI * 2); ctx.fill();

    if (a.state === 'working' && !noMotion && Math.sin(t * 7 + a.phase) > 0.85) {
        ctx.fillStyle = ha(col, 0.5);
        ctx.font = `600 ${9 * sc}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('···', hX, hY - hR - 4 * sc);
        ctx.textAlign = 'start';
    }

    if (a.state === 'idle' && !noMotion) {
        const bubbleT = (t * 0.3 + a.phase * 2) % 6;
        if (bubbleT < 3) {
            const emojis = ['💡', '☕', '🎮', '💬', '🎵', '📱'];
            const eIdx = Math.floor((a.phase * 10 + Math.floor(t * 0.15)) % emojis.length);
            const bAlpha = bubbleT < 0.5 ? bubbleT / 0.5 : (bubbleT > 2.5 ? (3 - bubbleT) / 0.5 : 1);
            const bY2 = hY - hR - 8 * sc - bubbleT * 2;
            ctx.globalAlpha = bAlpha * 0.6;
            ctx.fillStyle = 'rgba(10,8,18,0.75)';
            ctx.beginPath(); ctx.roundRect(hX - 8, bY2 - 7, 16, 14, 5); ctx.fill();
            ctx.strokeStyle = ha(col, 0.15);
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.roundRect(hX - 8, bY2 - 7, 16, 14, 5); ctx.stroke();
            ctx.fillStyle = 'rgba(10,8,18,0.75)';
            ctx.beginPath(); ctx.arc(hX - 2, bY2 + 8, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(hX - 4, bY2 + 11, 1, 0, Math.PI * 2); ctx.fill();
            ctx.font = `${9 * sc}px serif`;
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.fillText(emojis[eIdx], hX, bY2 + 4);
            ctx.textAlign = 'start';
            ctx.globalAlpha = 1;
        }
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
                ctx.beginPath(); ctx.arc(sx, sy, 1.2, 0, Math.PI * 2); ctx.fill();
            }
        }
    }

    if (isOrch) {
        ctx.strokeStyle = ha(col, 0.35); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(hX, hY, hR + 5, 0, Math.PI * 2); ctx.stroke();

        const crY = hY - hR - 4 * sc;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(hX, crY - 6 * sc);
        ctx.lineTo(hX - 6 * sc, crY);
        ctx.lineTo(hX - 3 * sc, crY - 1);
        ctx.lineTo(hX - 2 * sc, crY + 2);
        ctx.lineTo(hX, crY);
        ctx.lineTo(hX + 2 * sc, crY + 2);
        ctx.lineTo(hX + 3 * sc, crY - 1);
        ctx.lineTo(hX + 6 * sc, crY);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = ha('#ffd700', 0.3);
        ctx.beginPath();
        ctx.moveTo(hX, crY - 6 * sc);
        ctx.lineTo(hX + 6 * sc, crY);
        ctx.lineTo(hX + 2 * sc, crY + 2);
        ctx.lineTo(hX, crY);
        ctx.closePath(); ctx.fill();

        ctx.globalAlpha = 0.1;
        ctx.beginPath(); ctx.arc(hX, hY, hR + 10, 0, Math.PI * 2);
        ctx.fillStyle = col; ctx.fill();
        ctx.globalAlpha = 1;
    }

    if (a.state === 'working') {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath(); ctx.arc(hX + hR + 3, hY - hR + 1, 4.5 * sc, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#050505'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = 'white'; ctx.font = `bold ${6 * sc}px Inter, sans-serif`;
        ctx.textAlign = 'center'; ctx.fillText('✓', hX + hR + 3, hY - hR + 3.5); ctx.textAlign = 'start';
    }

    ctx.textAlign = 'center';

    const labelY = hY - hR - (isOrch ? 18 : 10) * sc;
    const roleY = labelY - 10 * sc;

    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.font = `bold ${(isOrch ? 11 : 10) * sc}px Inter, sans-serif`;
    ctx.fillText(a.name, hX + 0.8, labelY + 1);
    ctx.fillStyle = `rgba(255,255,255,${isOrch ? 0.92 : 0.75})`;
    ctx.fillText(a.name, hX, labelY);

    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.font = `600 ${(isOrch ? 8 : 7) * sc}px Inter, sans-serif`;
    ctx.fillText(a.role, hX + 0.8, roleY + 1);
    ctx.fillStyle = ha(col, 0.7);
    ctx.fillText(a.role, hX, roleY);
    ctx.textAlign = 'start';
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
    x: number, y: number, col: string, _t: number,
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

    const now = new Date();
    const hrs = now.getHours() % 12;
    const mins = now.getMinutes();
    const secs = now.getSeconds() + now.getMilliseconds() / 1000;

    const hourAng = ((hrs + mins / 60) / 12) * Math.PI * 2 - Math.PI / 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(hourAng) * (r - 5), y + Math.sin(hourAng) * (r - 5));
    ctx.stroke();

    const minAng = (mins / 60) * Math.PI * 2 - Math.PI / 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(minAng) * (r - 3), y + Math.sin(minAng) * (r - 3));
    ctx.stroke();

    const secAng = (secs / 60) * Math.PI * 2 - Math.PI / 2;
    ctx.strokeStyle = ha(col, 0.6);
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(secAng) * (r - 2.5), y + Math.sin(secAng) * (r - 2.5));
    ctx.stroke();

    ctx.fillStyle = ha(col, 0.5);
    ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();

    ctx.globalAlpha = 0.06;
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(x, y, r + 4, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
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

export function drawNeonSign(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, col: string, t: number,
) {
    const w = 46, h = 16;

    ctx.fillStyle = 'rgba(8,6,14,0.6)';
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 2); ctx.fill();

    const flicker = 0.7 + Math.sin(t * 4.3) * 0.1 + Math.sin(t * 7.1) * 0.05;
    const glitch = Math.sin(t * 13.7) > 0.97 ? 0.3 : 1;
    const alpha = flicker * glitch;

    ctx.shadowColor = col;
    ctx.shadowBlur = 8 * alpha;
    ctx.font = 'bold 9px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = ha(col, 0.9 * alpha);
    ctx.fillText('W4TG', x + w / 2, y + 11);
    ctx.shadowBlur = 0;

    ctx.fillStyle = ha(col, 0.15 * alpha);
    ctx.fillText('W4TG', x + w / 2, y + 11);

    const glowG = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, 35);
    glowG.addColorStop(0, ha(col, 0.04 * alpha));
    glowG.addColorStop(1, ha(col, 0));
    ctx.fillStyle = glowG;
    ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, 35, 0, Math.PI * 2); ctx.fill();

    ctx.font = '500 4px Inter, sans-serif';
    ctx.fillStyle = ha(col, 0.25 * alpha);
    ctx.fillText('STUDIO', x + w / 2, y + h + 5);
    ctx.textAlign = 'start';
}
