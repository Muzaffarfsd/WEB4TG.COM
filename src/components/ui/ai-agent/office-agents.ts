import type { NicheScenario } from './data';
import type { Agent, Particle } from './office-config';
import {
    SKINS, HAIRS, SHIRTS, CYCLE,
    PH_WALK_TO_END, PH_WORK_END, PH_WALK_BACK_START, PH_WALK_BACK_END,
    lerp, easeIO, clamp01,
} from './office-config';

export function buildLayout(
    team: NicheScenario['agentTeam'],
    W: number,
    H: number,
): { agents: Agent[]; deskPositions: { x: number; y: number; isOrch: boolean }[] } {
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

    const allDesks: { x: number; y: number; isOrch: boolean }[] = [
        { x: orchDesk.x, y: orchDesk.y, isOrch: true },
    ];

    const agents = team.map((a, i) => {
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

    return { agents, deskPositions: allDesks };
}

export function updateAgents(
    agList: Agent[],
    t: number,
    dt: number,
    noMotion: boolean,
    particles: Particle[],
    nicheColor: string,
    orch: Agent | undefined,
): void {
    if (!noMotion) {
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
                    if (!particles.some(p => p.idx === i && !p.ret)) {
                        particles.push({
                            fx: orch.x, fy: orch.y - 25,
                            tx: a.loungeX, ty: a.loungeY - 15,
                            p: 0, spd: 1.4, idx: i, ret: false, col: nicheColor,
                        });
                    }
                }
            } else if (ap < PH_WORK_END) {
                a.state = 'working';
                a.x = a.deskX; a.y = a.deskY;
                a.workProgress = Math.min(1, a.workProgress + dt * 0.2);

                if (orch && ap > PH_WORK_END - 0.04 && ap < PH_WORK_END - 0.02) {
                    if (!particles.some(p => p.idx === i && p.ret)) {
                        particles.push({
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
}
