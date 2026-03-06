import { Eye } from 'lucide-react';
import type { NicheScenario, StageData } from './data';
import { PropensityBar } from './propensity-bar';

interface ResultPanelProps {
    niche: NicheScenario;
    stage: StageData;
    activeNiche: number;
    currentStage: number;
    totalStages: number;
    animKey: number;
    prevPropensity?: number;
}

export const ResultPanel = ({ niche, stage, activeNiche, currentStage, totalStages, animKey, prevPropensity }: ResultPanelProps) => (
    <div className="lg:col-span-7 order-2" key={`right-${animKey}`} style={{ animation: 'slideInRight 0.4s ease-out both' }}>
        <div className="mb-5" key={`metric-${activeNiche}`} style={{ animation: 'resultPop 0.5s ease-out both' }}>
            <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/[0.06] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${niche.color}, transparent)`, opacity: 0.4 }} />
                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex-shrink-0">
                        <div className="text-[clamp(2rem,5vw,3rem)] font-instrument-serif font-normal leading-none" style={{ color: niche.color }}>{niche.heroMetric.value}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[14px] sm:text-[15px] text-white/80 font-sans font-medium">{niche.heroMetric.label}</div>
                        <div className="text-[11px] sm:text-[12px] text-white/60 mt-0.5">{niche.heroMetric.sub}</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${niche.color}10` }}>
                        <niche.icon className="w-5 h-5" style={{ color: niche.color }} />
                    </div>
                </div>
            </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.06] mb-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${niche.color}12` }}>
                        <Eye className="w-3.5 h-3.5" style={{ color: niche.color }} />
                    </div>
                    <div>
                        <span className="text-[12px] text-white/70 font-sans font-medium">{stage.title}</span>
                        <span className="text-[10px] text-white/60 ml-2 hidden sm:inline">{stage.subtitle}</span>
                    </div>
                </div>
                <div className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono" style={{ backgroundColor: `${niche.color}10`, color: `${niche.color}90`, border: `1px solid ${niche.color}20` }}>
                    {currentStage + 1}/{totalStages}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {stage.resultCards.map((card, i) => (
                    <div key={`${activeNiche}-${currentStage}-${i}`} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group" style={{ animation: `fadeSlideIn 0.3s ease-out ${i * 0.07}s both` }}>
                        <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${card.color}10` }}>
                                <card.icon className="w-3.5 h-3.5" style={{ color: card.color }} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-[9px] text-white/60 uppercase tracking-wider mb-0.5">{card.label}</div>
                                <div className="text-[13px] text-white/85 font-medium">{card.value}</div>
                                {card.detail && <div className="text-[10px] text-white/60 mt-0.5 leading-snug">{card.detail}</div>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <PropensityBar key={`prop-${activeNiche}-${currentStage}`} value={stage.propensity} color={niche.color} prevValue={prevPropensity} />
    </div>
);
