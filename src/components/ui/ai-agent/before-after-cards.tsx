import { XCircle, CheckCircle } from 'lucide-react';
import type { NicheScenario } from './data';

export const BeforeAfterCards = ({ niche, activeNiche }: { niche: NicheScenario; activeNiche: number }) => (
    <div key={`ba-${activeNiche}`} className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ animation: 'nicheSwitch 0.4s ease-out both' }}>
        <div className="flex gap-3 p-3.5 rounded-xl bg-[#ef4444]/[0.04] border border-[#ef4444]/10">
            <XCircle className="w-4 h-4 text-[#ef4444]/60 flex-shrink-0 mt-0.5" />
            <div>
                <div className="text-[10px] text-[#ef4444]/50 uppercase tracking-wider font-semibold mb-1">Без агента</div>
                <div className="text-[12px] text-white/50 leading-relaxed">{niche.beforeAfter.before}</div>
            </div>
        </div>
        <div className="flex gap-3 p-3.5 rounded-xl bg-[#22c55e]/[0.04] border border-[#22c55e]/10">
            <CheckCircle className="w-4 h-4 text-[#22c55e]/60 flex-shrink-0 mt-0.5" />
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-[#22c55e]/50 uppercase tracking-wider font-semibold">Мультиагентная система</span>
                    <span className="text-[9px] font-bold text-[#22c55e] bg-[#22c55e]/[0.08] rounded-full px-1.5 py-0.5">{niche.beforeAfter.afterMetric}</span>
                </div>
                <div className="text-[12px] text-white/60 leading-relaxed">{niche.beforeAfter.after}</div>
            </div>
        </div>
    </div>
);
