import type { NicheScenario } from './data';

export interface IsometricOfficeProps {
    niche: NicheScenario;
    activeNiche: number;
    currentStage: number;
}

export interface Agent {
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
    glasses: boolean;
    headphones: boolean;
    hairStyle: number;
}

export interface Particle {
    fx: number; fy: number; tx: number; ty: number;
    p: number; spd: number; idx: number; ret: boolean; col: string;
}

export interface Drone {
    x: number; y: number;
    targetX: number; targetY: number;
    phase: number;
    speed: number;
    waitTimer: number;
    propellerAngle: number;
}

export interface Roomba {
    x: number; y: number;
    angle: number;
    speed: number;
    turnTimer: number;
    ledPhase: number;
}

export interface Toast {
    x: number; y: number;
    text: string;
    icon: string;
    opacity: number;
    life: number;
    maxLife: number;
    col: string;
}

export interface OfficeCat {
    x: number; y: number;
    targetX: number; targetY: number;
    state: 'walk' | 'sit' | 'sleep' | 'groom';
    stateTimer: number;
    direction: number;
    tailPhase: number;
}

export interface CodeParticle {
    x: number; y: number;
    targetX: number; targetY: number;
    symbol: string;
    alpha: number;
    speed: number;
    progress: number;
    col: string;
    size: number;
}

export const SKINS = ['#f0d0b0', '#d4a878', '#c49070', '#e8c4a0', '#b87848', '#f2dcc8'];
export const HAIRS = ['#1a1420', '#3a2210', '#8a6030', '#c49050', '#582010', '#222'];
export const SHIRTS = ['#6d5acd', '#4a90d9', '#2ecc71', '#e67e22', '#e74c3c', '#1abc9c', '#9b59b6', '#f39c12'];

export const CYCLE = 14;
export const PH_WALK_TO_START = 0.0;
export const PH_WALK_TO_END = 0.12;
export const PH_WORK_END = 0.65;
export const PH_WALK_BACK_START = 0.65;
export const PH_WALK_BACK_END = 0.77;
export const PH_IDLE_END = 1.0;

export type LOD = 'high' | 'medium' | 'low';

const LOD_LEVELS: LOD[] = ['high', 'medium', 'low'];

export function lodIndex(lod: LOD): number {
    return LOD_LEVELS.indexOf(lod);
}

export function downgradeLOD(lod: LOD): LOD {
    const idx = lodIndex(lod);
    return idx < LOD_LEVELS.length - 1 ? LOD_LEVELS[idx + 1] : lod;
}

export function detectLOD(W: number): LOD {
    let level: LOD = 'high';
    if (W < 400) level = 'low';
    else if (W < 700) level = 'medium';

    const nav = navigator as any;
    const mem: number | undefined = nav.deviceMemory;
    const cores: number | undefined = nav.hardwareConcurrency;

    if (mem !== undefined && mem <= 2) {
        level = 'low';
    } else if (mem !== undefined && mem <= 4 && level === 'high') {
        level = 'medium';
    }

    if (cores !== undefined && cores <= 2) {
        level = 'low';
    } else if (cores !== undefined && cores <= 4 && level === 'high') {
        level = 'medium';
    }

    return level;
}

export const FPS_LOW_THRESHOLD = 30;
export const FPS_LOW_DURATION = 2;

export const ROOM_LEFT_PCT = 0.04;
export const ROOM_RIGHT_PCT = 0.96;
export const WALL_TOP_PCT = 0.04;
export const WALL_BOT_PCT = 0.30;
export const FLOOR_BOT_PCT = 0.93;
export const DIV_X_PCT = 0.54;

export const MAX_DPR = 2;

export const ha = (hex: string, a: number) =>
    hex + Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeIO = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
