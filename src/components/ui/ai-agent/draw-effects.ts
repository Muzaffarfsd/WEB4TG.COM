import type { Agent, Particle, Drone, Roomba, Toast, OfficeCat, CodeParticle } from './office-config';
import { ha } from './office-config';

export function drawParticle(
    ctx: CanvasRenderingContext2D,
    p: Particle, t: number,
) {
    const x = p.fx + (p.tx - p.fx) * p.p;
    const arc = -55 * Math.sin(p.p * Math.PI);
    const y = p.fy + (p.ty - p.fy) * p.p + arc;
    const r = 3.5 + Math.sin(t * 6 + p.idx) * 1.2;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = p.col; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r + 4, 0, Math.PI * 2);
    ctx.fillStyle = ha(p.col, 0.15); ctx.fill();
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

export function drawConnections(
    ctx: CanvasRenderingContext2D,
    agList: Agent[], orch: Agent, col: string, t: number,
) {
    agList.forEach(a => {
        if (a === orch || a.state === 'idle') return;
        const ox = orch.x, oy = orch.y - 10;
        const ax = a.x, ay = a.y - 10;
        const mx = (ox + ax) / 2, my = (oy + ay) / 2 - 22;
        const isWorking = a.state === 'working';
        const alpha = isWorking ? 0.14 : 0.06;

        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.quadraticCurveTo(mx, my, ax, ay);
        ctx.strokeStyle = ha(col, alpha * 2);
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.15;
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.quadraticCurveTo(mx, my, ax, ay);
        ctx.strokeStyle = ha(col, alpha);
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.lineDashOffset = -t * 18;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;

        if (isWorking) {
            const nodeT = (t * 0.8 + a.phase) % 1;
            const nx = ox + (ax - ox) * nodeT + (mx - (ox + ax) / 2) * 4 * nodeT * (1 - nodeT);
            const ny = oy + (ay - oy) * nodeT + (my - (oy + ay) / 2) * 4 * nodeT * (1 - nodeT);
            ctx.fillStyle = ha(col, 0.35);
            ctx.beginPath(); ctx.arc(nx, ny, 2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = ha(col, 0.12);
            ctx.beginPath(); ctx.arc(nx, ny, 5, 0, Math.PI * 2); ctx.fill();
        }
    });
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

    ctx.fillStyle = ha(col, 0.12);
    ctx.beginPath(); ctx.arc(dx, dy + 1.5, 4, 0, Math.PI * 2); ctx.fill();

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

    ctx.fillStyle = ha(col, ledPulse * 0.3);
    ctx.beginPath(); ctx.arc(rb.x, rb.y - 2, 3.5, 0, Math.PI * 2); ctx.fill();

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

    ctx.fillStyle = ha(toast.col, 0.12);
    ctx.beginPath(); ctx.roundRect(tx - 2, ty - 2, tw + 4, th + 4, 5); ctx.fill();

    ctx.font = '600 7px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = toast.col === '#22c55e'
        ? 'rgba(34,197,94,0.9)' : `rgba(255,255,255,0.85)`;
    ctx.fillText(`${toast.icon} ${toast.text}`, toast.x, ty + 10);
    ctx.textAlign = 'start';

    ctx.restore();
}

export function drawCodeParticle(
    ctx: CanvasRenderingContext2D,
    cp: CodeParticle,
) {
    if (cp.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = cp.alpha * 0.8;

    const x = cp.x + (cp.targetX - cp.x) * cp.progress;
    const y = cp.y + (cp.targetY - cp.y) * cp.progress;
    const drift = Math.sin(cp.progress * Math.PI * 3 + cp.size * 10) * 4;

    ctx.font = `bold ${cp.size}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillStyle = ha(cp.col, 0.6);
    ctx.fillText(cp.symbol, x + drift, y);

    ctx.fillStyle = ha(cp.col, 0.15);
    ctx.beginPath(); ctx.arc(x + drift, y - cp.size * 0.3, cp.size * 0.8, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
}

export function drawOfficeCat(
    ctx: CanvasRenderingContext2D,
    cat: OfficeCat, col: string, t: number,
) {
    const { x, y, state, direction, tailPhase } = cat;
    const dir = direction > 0 ? 1 : -1;

    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.beginPath(); ctx.ellipse(x, y + 1, 5, 1.5, 0, 0, Math.PI * 2); ctx.fill();

    if (state === 'sleep') {
        ctx.fillStyle = '#2a2040';
        ctx.beginPath(); ctx.ellipse(x, y - 2, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#332850';
        ctx.beginPath(); ctx.ellipse(x + dir * 3, y - 4, 3, 2.5, dir * 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#332850';
        ctx.beginPath();
        ctx.moveTo(x + dir * 5, y - 6);
        ctx.lineTo(x + dir * 7, y - 8);
        ctx.lineTo(x + dir * 5.5, y - 4.5);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + dir * 3, y - 6);
        ctx.lineTo(x + dir * 4, y - 8.5);
        ctx.lineTo(x + dir * 3.5, y - 4.5);
        ctx.closePath(); ctx.fill();

        const tAngle = Math.sin(t * 0.5 + tailPhase) * 0.4;
        ctx.strokeStyle = '#2a2040'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - dir * 4, y - 1);
        ctx.quadraticCurveTo(x - dir * 7, y - 3 + tAngle * 3, x - dir * 8, y - 5 + tAngle * 5);
        ctx.stroke();

        const zzPhase = (t * 0.5) % 3;
        if (zzPhase < 2) {
            ctx.font = `bold ${4 + zzPhase}px Inter, sans-serif`;
            ctx.fillStyle = `rgba(255,255,255,${0.1 * (1 - zzPhase / 2)})`;
            ctx.textAlign = 'center';
            ctx.fillText('z', x + dir * 6 + zzPhase * 3, y - 8 - zzPhase * 4);
            if (zzPhase > 0.5) {
                ctx.font = `bold ${3 + zzPhase * 0.5}px Inter, sans-serif`;
                ctx.fillText('z', x + dir * 8 + zzPhase * 2, y - 6 - zzPhase * 3);
            }
            ctx.textAlign = 'start';
        }
        return;
    }

    if (state === 'sit' || state === 'groom') {
        ctx.fillStyle = '#2a2040';
        ctx.beginPath(); ctx.ellipse(x, y - 3, 4, 4.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#332850';
        ctx.beginPath(); ctx.ellipse(x, y - 8, 3.5, 3, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#332850';
        ctx.beginPath();
        ctx.moveTo(x - 2, y - 11);
        ctx.lineTo(x - 3.5, y - 14);
        ctx.lineTo(x - 0.5, y - 10);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + 2, y - 11);
        ctx.lineTo(x + 3.5, y - 14);
        ctx.lineTo(x + 0.5, y - 10);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = ha(col, 0.5);
        ctx.beginPath(); ctx.arc(x - 1.2, y - 8, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + 1.2, y - 8, 0.7, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = 'rgba(255,180,180,0.35)';
        ctx.beginPath(); ctx.ellipse(x, y - 7, 0.6, 0.4, 0, 0, Math.PI * 2); ctx.fill();

        const tAngle2 = Math.sin(t * 1.2 + tailPhase) * 0.6;
        ctx.strokeStyle = '#2a2040'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + dir * 3, y - 1);
        ctx.quadraticCurveTo(x + dir * 6, y - 3 + tAngle2 * 3, x + dir * 7.5, y - 5 + tAngle2 * 5);
        ctx.stroke();

        if (state === 'groom') {
            const gpaw = Math.sin(t * 4) * 0.5;
            ctx.fillStyle = '#2a2040';
            ctx.beginPath(); ctx.ellipse(x + 1, y - 6 + gpaw, 1.2, 2, 0.3, 0, Math.PI * 2); ctx.fill();
        }

        ctx.fillStyle = '#1a1430';
        ctx.beginPath(); ctx.ellipse(x - 2, y + 0.5, 1.2, 0.8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x + 2, y + 0.5, 1.2, 0.8, 0, 0, Math.PI * 2); ctx.fill();
        return;
    }

    const walkBob = Math.sin(t * 8) * 0.5;
    ctx.fillStyle = '#2a2040';
    ctx.beginPath(); ctx.ellipse(x, y - 3 + walkBob, 4.5, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#332850';
    ctx.beginPath(); ctx.ellipse(x + dir * 3.5, y - 6 + walkBob, 3, 2.5, dir * 0.15, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#332850';
    ctx.beginPath();
    ctx.moveTo(x + dir * 4, y - 8 + walkBob);
    ctx.lineTo(x + dir * 5.5, y - 11 + walkBob);
    ctx.lineTo(x + dir * 4.5, y - 7 + walkBob);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + dir * 2.5, y - 8 + walkBob);
    ctx.lineTo(x + dir * 3, y - 11.5 + walkBob);
    ctx.lineTo(x + dir * 3.5, y - 7 + walkBob);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = ha(col, 0.5);
    ctx.beginPath(); ctx.arc(x + dir * 4.5, y - 6.5 + walkBob, 0.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + dir * 3, y - 6.5 + walkBob, 0.6, 0, Math.PI * 2); ctx.fill();

    const legPhase = Math.sin(t * 10);
    [-1.5, 1.5].forEach((off, i) => {
        const loff = i === 0 ? legPhase : -legPhase;
        ctx.fillStyle = '#1a1430';
        ctx.fillRect(x + off - 0.5, y - 1, 1, 2.5 + loff * 0.3);
    });

    const tAngle3 = Math.sin(t * 2 + tailPhase) * 0.8;
    ctx.strokeStyle = '#2a2040'; ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(x - dir * 4, y - 2 + walkBob);
    ctx.quadraticCurveTo(x - dir * 7, y - 4 + tAngle3 * 3 + walkBob, x - dir * 8, y - 7 + tAngle3 * 4 + walkBob);
    ctx.stroke();
}
