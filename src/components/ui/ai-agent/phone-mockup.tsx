import { useRef, useEffect } from 'react';
import { Mic, MessageSquare, Send } from 'lucide-react';
import type { ChatMessage, NicheScenario } from './data';
import { VOICE_BAR_HEIGHTS } from './data';

const TypingIndicator = () => (
    <div className="flex items-center gap-1 px-4 py-3">
        <div className="flex gap-1">
            {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]/60" style={{ animation: `typingBounce 1.4s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
        </div>
    </div>
);

const VoiceMessage = ({ color = '#8B5CF6' }: { color?: string }) => (
    <div className="flex items-center gap-2 px-1">
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
            <Mic className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <div className="flex-1 flex items-center gap-0.5">
            {VOICE_BAR_HEIGHTS.map((h, i) => (
                <div key={i} className="w-[2.5px] rounded-full" style={{ height: `${h}px`, backgroundColor: `${color}50`, animation: `typingBounce 2s ease-in-out ${i * 0.08}s infinite` }} />
            ))}
        </div>
        <span className="text-[10px] text-white/40 flex-shrink-0">0:08</span>
    </div>
);

interface PhoneMockupProps {
    niche: NicheScenario;
    activeNiche: number;
    allPreviousMessages: ChatMessage[];
    visibleMessages: ChatMessage[];
    isTyping: boolean;
}

export const PhoneMockup = ({ niche, activeNiche, allPreviousMessages, visibleMessages, isTyping }: PhoneMockupProps) => {
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [visibleMessages, isTyping]);

    const renderMessage = (msg: ChatMessage, animated: boolean, idx?: number) => (
        <div key={`${activeNiche}-${msg.id}`} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`} style={animated ? { animation: `messageAppear 0.35s ease-out ${(idx || 0) * 0.05}s both` } : undefined}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed font-sans whitespace-pre-line ${msg.sender === 'user' ? 'text-white rounded-br-md' : 'bg-white/[0.06] text-white/80 rounded-bl-md'}`} style={msg.sender === 'user' ? { background: `linear-gradient(135deg, ${niche.color}, ${niche.color}cc)` } : undefined}>
                {msg.isVoice ? <VoiceMessage color={niche.color} /> : msg.text}
            </div>
        </div>
    );

    return (
        <div className="w-[272px] sm:w-[290px]" key={`phone-${activeNiche}`} style={{ animation: 'nicheSwitch 0.45s ease-out both' }}>
            <div className="relative w-full h-[590px] sm:h-[629px]">
                <div className="absolute -inset-[2.5px] rounded-[52px] sm:rounded-[55px] z-0" style={{ background: 'linear-gradient(175deg, #78787a 0%, #636366 15%, #48484a 30%, #3a3a3c 50%, #2c2c2e 70%, #1c1c1e 100%)' }} />
                <div className="absolute -inset-10 rounded-[65px] z-[-1] transition-all duration-1000 pointer-events-none" style={{ boxShadow: `0 0 120px -15px ${niche.color}30, 0 0 200px -50px ${niche.color}18, 0 25px 70px -15px rgba(0,0,0,0.85)`, animation: 'glowPulse 4s ease-in-out infinite' }} />

                <div className="absolute right-[-2.5px] top-[22%] w-[2.5px] h-[10%] rounded-r-sm z-20" style={{ background: 'linear-gradient(180deg, #78787a, #48484a, #2c2c2e)' }} />
                <div className="absolute left-[-2.5px] top-[16%] w-[2.5px] h-[5.5%] rounded-l-sm z-20" style={{ background: 'linear-gradient(180deg, #78787a, #48484a, #2c2c2e)' }} />
                <div className="absolute left-[-2.5px] top-[24%] w-[2.5px] h-[8.5%] rounded-l-sm z-20" style={{ background: 'linear-gradient(180deg, #78787a, #48484a, #2c2c2e)' }} />
                <div className="absolute left-[-2.5px] top-[35%] w-[2.5px] h-[8.5%] rounded-l-sm z-20" style={{ background: 'linear-gradient(180deg, #78787a, #48484a, #2c2c2e)' }} />

                <div className="absolute inset-0 rounded-[50px] sm:rounded-[53px] bg-[#000000] overflow-hidden z-[1] flex flex-col">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[2px] rounded-b-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent z-30 pointer-events-none" />

                    <div className="relative px-5 pt-[14px] pb-0 z-10 flex-shrink-0">
                        <div className="flex items-center justify-between text-[10px] text-white/60 font-sans font-semibold">
                            <span className="w-12 tabular-nums">9:41</span>
                            <div className="absolute left-1/2 -translate-x-1/2 top-[10px]">
                                <div className="relative w-[90px] h-[25px] bg-black rounded-full border border-white/[0.05]" style={{ boxShadow: 'inset 0 0 3px rgba(0,0,0,0.8)' }}>
                                    <div className="absolute left-[20px] top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full" style={{ background: 'radial-gradient(circle, #1a1a2e 40%, #0d0d12 100%)', boxShadow: 'inset 0 0.5px 1px rgba(255,255,255,0.04)' }} />
                                </div>
                            </div>
                            <div className="flex items-center gap-[5px] w-12 justify-end">
                                <svg width="13" height="9" viewBox="0 0 16 12" fill="none"><rect x="0" y="7" width="3" height="5" rx="0.7" fill="white" fillOpacity="0.5"/><rect x="4.2" y="5" width="3" height="7" rx="0.7" fill="white" fillOpacity="0.5"/><rect x="8.4" y="2.5" width="3" height="9.5" rx="0.7" fill="white" fillOpacity="0.5"/><rect x="12.6" y="0" width="3" height="12" rx="0.7" fill="white" fillOpacity="0.5"/></svg>
                                <svg width="13" height="9" viewBox="0 0 15 11" fill="none"><path d="M7.5.5C5 .5 2.8 1.5 1.2 3.2l1.3 1.3C3.8 3.2 5.5 2.3 7.5 2.3s3.7.9 5 2.2l1.3-1.3C12.2 1.5 10 .5 7.5.5z" fill="white" fillOpacity="0.5"/><path d="M7.5 4C6 4 4.7 4.7 3.8 5.8L5 7c.7-.8 1.5-1.2 2.5-1.2S9.3 6.2 10 7l1.2-1.2C10.3 4.7 9 4 7.5 4z" fill="white" fillOpacity="0.5"/><circle cx="7.5" cy="9.5" r="1.3" fill="white" fillOpacity="0.5"/></svg>
                                <div className="flex items-center"><div className="w-[20px] h-[10px] rounded-[2.5px] border border-white/40 flex items-center p-[1.5px]"><div className="w-[11px] h-[6px] rounded-[1.5px] bg-white/50" /></div><div className="w-[1.5px] h-[4px] rounded-r-sm bg-white/25 ml-[0.5px]" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="px-3.5 pt-2 pb-1.5 flex-shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="relative">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br ${niche.gradient}`} style={{ boxShadow: `0 3px 12px ${niche.color}33` }}>
                                    <niche.icon className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#34C759] border-[1.5px] border-black" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[12px] text-white/90 font-medium font-sans leading-tight">{niche.agentName}</div>
                                <div className="flex items-center gap-1">
                                    <span className="text-[9px] text-white/30">{niche.agentRole}</span>
                                    <span className="text-[7px] text-white/12">·</span>
                                    <span className="text-[9px] text-[#34C759]/80">онлайн</span>
                                </div>
                            </div>
                            <div className="px-1.5 py-0.5 rounded-full text-[7px] font-bold font-sans border text-white/20 flex-shrink-0" style={{ borderColor: `${niche.color}20`, backgroundColor: `${niche.color}06` }}>AI</div>
                        </div>
                    </div>
                    <div className="mx-3"><div className="h-px bg-white/[0.05]" /></div>

                    <div ref={chatRef} className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-2 scroll-smooth ai-agent-chat-scroll" role="log" aria-label={`Демонстрация AI-агента ${niche.agentName}`} aria-live="polite">
                        {allPreviousMessages.map(msg => renderMessage(msg, false))}
                        {visibleMessages.map((msg, i) => renderMessage(msg, true, i))}
                        {isTyping && <div className="flex justify-start"><div className="bg-white/[0.06] rounded-2xl rounded-bl-md"><TypingIndicator /></div></div>}
                    </div>

                    <div className="px-2.5 pb-2.5 pt-1.5 flex-shrink-0">
                        <div className="flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.06] px-3 py-2">
                            <MessageSquare className="w-3.5 h-3.5 text-white/12 flex-shrink-0" />
                            <span className="text-[11px] text-white/12 font-sans flex-1">Сообщение...</span>
                            <Send className="w-3.5 h-3.5 flex-shrink-0" style={{ color: `${niche.color}35` }} />
                        </div>
                    </div>
                    <div className="flex justify-center pb-[6px] flex-shrink-0"><div className="w-[100px] h-[4px] rounded-full bg-white/15" /></div>
                </div>
            </div>
        </div>
    );
};
