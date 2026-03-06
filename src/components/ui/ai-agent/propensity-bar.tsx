import { Gauge, ArrowRight } from 'lucide-react';

export const PropensityBar = ({ value, color, prevValue }: { value: number; color: string; prevValue?: number }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.2s both' }}>
        <div className="flex items-center gap-1.5 flex-shrink-0">
            <Gauge className="w-3.5 h-3.5" style={{ color }} />
            <span className="text-[10px] text-white/60 uppercase tracking-wider">Propensity</span>
        </div>
        <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}66, ${color})`, animation: 'propensityFill 1s ease-out 0.4s both', boxShadow: `0 0 12px ${color}40` }} />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
            {prevValue && <><span className="text-[11px] text-white/60">{prevValue}</span><ArrowRight className="w-2.5 h-2.5 text-white/60" /></>}
            <span className="text-[13px] font-bold" style={{ color }}>{value}</span>
        </div>
    </div>
);
