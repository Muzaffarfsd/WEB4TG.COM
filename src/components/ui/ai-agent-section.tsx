import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useScrollReveal } from '../../hooks/use-animations';
import {
    Brain, Clock,
    Zap, Globe, Volume2,
    ArrowUpRight,
    Timer
} from 'lucide-react';
import { niches, AUTOPLAY_STAGE_DURATION } from './ai-agent/data';
import type { ChatMessage } from './ai-agent/data';
import { PhoneMockup } from './ai-agent/phone-mockup';
import { ResultPanel } from './ai-agent/result-panel';
import { BeforeAfterCards } from './ai-agent/before-after-cards';

export const AiAgentSection = () => {
    const revealRef = useScrollReveal({ stagger: 0.06 });
    const [activeNiche, setActiveNiche] = useState(0);
    const [currentStage, setCurrentStage] = useState(0);
    const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [animKey, setAnimKey] = useState(0);
    const [progressKey, setProgressKey] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInViewRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prefersReducedMotion = useRef(false);

    const niche = niches[activeNiche];
    const stagesData = niche.stages;
    const allPreviousMessages = stagesData.slice(0, currentStage).flatMap(s => s.messages);
    const currentMessages = stagesData[currentStage]?.messages || [];
    const stage = stagesData[currentStage];

    const prevPropensity = useMemo(() => {
        return currentStage > 0 ? stagesData[currentStage - 1].propensity : undefined;
    }, [currentStage, stagesData]);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        prefersReducedMotion.current = mq.matches;
        const handler = (e: MediaQueryListEvent) => { prefersReducedMotion.current = e.matches; };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const clearTimer = useCallback(() => {
        if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { isInViewRef.current = e.isIntersecting; }, { threshold: 0.15 });
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (isPaused || !isInViewRef.current) return;
        clearTimer();
        setVisibleMessages([]);
        setAnimKey(p => p + 1);
        setProgressKey(p => p + 1);
        let msgIdx = 0;
        const showNext = () => {
            if (msgIdx >= currentMessages.length) {
                const wait = AUTOPLAY_STAGE_DURATION - (currentMessages.length * 1800);
                timerRef.current = setTimeout(() => {
                    if (currentStage < stagesData.length - 1) {
                        setCurrentStage(p => p + 1);
                    } else {
                        timerRef.current = setTimeout(() => {
                            setActiveNiche((activeNiche + 1) % niches.length);
                            setCurrentStage(0);
                        }, 2500);
                    }
                }, Math.max(wait, 2000));
                return;
            }
            const msg = currentMessages[msgIdx];
            const red = prefersReducedMotion.current;
            if (msg.sender === 'agent') {
                setIsTyping(true);
                timerRef.current = setTimeout(() => {
                    setIsTyping(false);
                    setVisibleMessages(p => [...p, msg]);
                    msgIdx++;
                    timerRef.current = setTimeout(showNext, red ? 400 : 1200);
                }, red ? 300 : 1400);
            } else {
                setVisibleMessages(p => [...p, msg]);
                msgIdx++;
                timerRef.current = setTimeout(showNext, red ? 300 : 900);
            }
        };
        timerRef.current = setTimeout(showNext, 600);
        return clearTimer;
    }, [currentStage, activeNiche, isPaused, clearTimer, currentMessages, stagesData.length]);

    const handleNicheClick = (i: number) => { clearTimer(); setActiveNiche(i); setCurrentStage(0); setIsPaused(false); };
    const handleStageClick = (i: number) => { clearTimer(); setIsPaused(false); setCurrentStage(i); };

    return (
        <section ref={sectionRef} id="ai-agent" className="relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8 overflow-hidden" style={{ contain: 'layout style' }}>
            <div className="absolute w-[600px] h-[600px] rounded-full blur-[120px] top-[15%] right-[-10%] pointer-events-none transition-colors duration-1000" style={{ backgroundColor: `${niche.color}06` }} />
            <div className="absolute w-[400px] h-[400px] rounded-full bg-[#7C3AED]/[0.02] blur-[80px] bottom-[10%] left-[-5%] pointer-events-none" />

            <div ref={revealRef} className="max-w-7xl mx-auto relative">
                <div data-reveal className="text-center mb-12 sm:mb-16">
                    <span className="section-label justify-center">
                        <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
                        AI-Агент для вашего бизнеса
                        <span className="w-8 h-px bg-[#8B5CF6]/40 ml-3" />
                    </span>
                    <h2 className="text-[clamp(1.75rem,4.5vw,3.25rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Каждый неотвеченный чат —
                        <br />
                        <span className="italic gradient-text">потерянная продажа</span>
                    </h2>
                    <p className="text-[clamp(0.875rem,1.5vw,1.05rem)] text-white/50 mt-4 sm:mt-5 font-sans font-light leading-relaxed max-w-2xl mx-auto">
                        Разрабатываем AI-агента <span className="text-white/80 font-medium">под ваш бизнес за 14 дней</span>. Он отвечает за 0.3 секунды, закрывает <span className="text-white/80 font-medium">73% диалогов в продажу</span> и работает когда ваши менеджеры спят.
                    </p>
                </div>

                <div data-reveal className="flex gap-2 sm:gap-3 justify-center flex-wrap mb-3 sm:mb-4">
                    {niches.map((n, i) => (
                        <button key={n.id} onClick={() => handleNicheClick(i)} aria-label={n.name}
                            className={`group flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-[12px] sm:text-[13px] font-sans font-medium transition-all duration-300 border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${i === activeNiche ? 'text-white/90 shadow-lg' : 'bg-white/[0.02] border-white/[0.06] text-white/35 hover:text-white/55 hover:border-white/[0.12]'}`}
                            style={i === activeNiche ? { backgroundColor: `${n.color}12`, borderColor: `${n.color}30`, boxShadow: `0 4px 24px ${n.color}15` } : undefined}
                        >
                            <n.icon className="w-4 h-4 transition-colors" style={{ color: i === activeNiche ? n.color : undefined }} />
                            <span className="hidden sm:inline">{n.name}</span>
                            <span className="sm:hidden">{n.shortName}</span>
                        </button>
                    ))}
                </div>

                <div data-reveal className="max-w-2xl mx-auto mb-8 sm:mb-10">
                    <div className="flex gap-1.5 sm:gap-2 justify-center flex-wrap mb-3">
                        {stagesData.map((s, i) => (
                            <button key={`${activeNiche}-${i}`} onClick={() => handleStageClick(i)} aria-label={`Этап ${i + 1}: ${s.title}`} aria-current={i === currentStage ? 'step' : undefined}
                                className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-sans font-medium transition-all duration-300 border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/50 ${i === currentStage ? 'text-white/80' : i < currentStage ? 'bg-white/[0.02] border-white/[0.06] text-white/40' : 'bg-white/[0.01] border-white/[0.04] text-white/20 hover:text-white/40'}`}
                                style={i === currentStage ? { backgroundColor: `${niche.color}10`, borderColor: `${niche.color}25` } : undefined}
                            >
                                <span className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[8px] font-bold transition-all ${i === currentStage ? 'text-white' : i < currentStage ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-white/[0.05] text-white/20'}`} style={i === currentStage ? { backgroundColor: niche.color } : undefined}>
                                    {i < currentStage ? '✓' : i + 1}
                                </span>
                                <span className="hidden sm:inline">{s.title}</span>
                            </button>
                        ))}
                        <button onClick={() => setIsPaused(p => !p)} aria-label={isPaused ? 'Продолжить' : 'Пауза'} className="ml-1 px-3 py-1.5 sm:py-2 rounded-full text-[11px] font-sans border bg-white/[0.02] border-white/[0.06] text-white/30 hover:text-white/50 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/50">
                            {isPaused ? '▶' : '⏸'}
                        </button>
                    </div>
                    {!isPaused && (
                        <div className="h-[2px] rounded-full bg-white/[0.04] overflow-hidden mx-auto max-w-md">
                            <div key={progressKey} className="h-full rounded-full" style={{ backgroundColor: niche.color, animation: `progressShrink ${AUTOPLAY_STAGE_DURATION}ms linear both` }} />
                        </div>
                    )}
                </div>

                <div data-reveal className="max-w-3xl mx-auto mb-8 sm:mb-10">
                    <BeforeAfterCards niche={niche} activeNiche={activeNiche} />
                </div>

                <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
                    <div className="lg:col-span-5 order-1 flex justify-center">
                        <PhoneMockup niche={niche} activeNiche={activeNiche} allPreviousMessages={allPreviousMessages} visibleMessages={visibleMessages} isTyping={isTyping} />
                    </div>

                    <ResultPanel niche={niche} stage={stage} activeNiche={activeNiche} currentStage={currentStage} totalStages={stagesData.length} animKey={animKey} prevPropensity={prevPropensity} />
                </div>

                <div data-reveal className="mt-10 sm:mt-14 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    {[
                        { label: 'Gemini Flash/Pro', icon: Brain },
                        { label: 'ElevenLabs v3', icon: Volume2 },
                        { label: '17 AI-tools', icon: Zap },
                        { label: '150+ языков', icon: Globe },
                        { label: '0.3с ответ', icon: Timer },
                        { label: '24/7', icon: Clock },
                    ].map((t, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06] text-[10px] sm:text-[11px] text-white/35 font-sans">
                            <t.icon className="w-3 h-3 text-[#8B5CF6]/40" />
                            {t.label}
                        </div>
                    ))}
                </div>

                <div data-reveal className="mt-6 sm:mt-8 flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
                    {[
                        { value: '12+', label: 'агентов запущено' },
                        { value: '47 000+', label: 'диалогов обработано' },
                        { value: '89%', label: 'закрытий в продажу' },
                    ].map((s, i) => (
                        <div key={i} className="text-center">
                            <div className="text-[clamp(1.1rem,2vw,1.4rem)] font-instrument-serif gradient-text font-normal">{s.value}</div>
                            <div className="text-[10px] text-white/30 mt-0.5 font-sans">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div data-reveal className="mt-8 sm:mt-10 text-center">
                    <a href="https://t.me/w4tg_bot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl text-[14px] sm:text-[15px] font-sans font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] transition-all duration-300 shadow-xl shadow-[#8B5CF6]/20 hover:shadow-[#8B5CF6]/30 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]">
                        Запустить AI-агента за 14 дней
                        <ArrowUpRight className="w-[18px] h-[18px]" />
                    </a>
                    <p className="text-[12px] text-white/30 mt-3 font-sans">Бесплатная консультация 15 мин · NDA · Демо на ваших данных</p>
                </div>
            </div>
        </section>
    );
};
