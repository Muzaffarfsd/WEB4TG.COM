import { Check, ArrowRight, Sparkles, Bot, Smartphone, Zap, Brain, MessageSquare, BarChart3 } from "lucide-react";
import { useScrollReveal } from '../../hooks/use-animations';

export const PricingSection = () => {
    const revealRef = useScrollReveal({ stagger: 0.1 });

    return (
        <section id="pricing" className="relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8">
            <div ref={revealRef} className="max-w-6xl mx-auto relative">
                <div data-reveal className="text-center mb-12 sm:mb-16">
                    <span className="section-label justify-center">
                        <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
                        Цены
                        <span className="w-8 h-px bg-[#8B5CF6]/40 ml-3" />
                    </span>
                    <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Прозрачные цены —
                        <br />
                        <span className="italic gradient-text">без сюрпризов</span>
                    </h2>
                    <p className="text-[clamp(0.8125rem,1.3vw,0.95rem)] text-white/50 mt-4 sm:mt-5 font-sans font-light max-w-xl mx-auto">
                        Разработка приложения, подписка на поддержку и AI-агент — три понятных блока
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-2.5 sm:gap-3">

                    {/* BLOCK 1: APP DEVELOPMENT — spans 5 cols, featured */}
                    <div data-reveal className="lg:col-span-5 relative overflow-hidden rounded-2xl glow-card border-[#8B5CF6]/20 shadow-[0_0_60px_-15px_rgba(139,92,246,0.15)]">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/40 to-transparent" />
                        <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full" style={{ maskImage: 'linear-gradient(white, transparent)' }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/[0.03] to-[#8B5CF6]/[0.01]" style={{ maskImage: 'radial-gradient(farthest-side at top, white, transparent)' }} />
                        </div>

                        <div className="flex items-center gap-3 p-4 sm:p-5">
                            <h3 className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full py-1 px-3 font-sans uppercase tracking-wider m-0">
                                <Smartphone className="w-3 h-3" />
                                Разработка
                            </h3>
                            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-medium text-white/60 border border-white/[0.08] rounded-full py-1 px-2.5 font-sans">
                                <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
                                Telegram Mini App
                            </span>
                            <div className="ml-auto">
                                <a href="https://t.me/w4tg_bot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-medium font-sans bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:from-[#7C3AED] hover:to-[#6D28D9] transition-all duration-300 shadow-lg shadow-[#8B5CF6]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]">
                                    Обсудить проект
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row p-4 sm:p-5 pt-2">
                            <div className="pb-4 lg:w-[35%] lg:pr-6">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-3xl sm:text-4xl md:text-5xl font-semibold gradient-text font-sans tracking-tight">от 150К</span>
                                    <span className="text-[12px] sm:text-sm text-white/40 font-sans">₽</span>
                                </div>
                                <p className="text-[11px] sm:text-[12px] text-white/40 mt-2 font-sans">
                                    7-14 дней • предоплата 35%
                                    <br />остаток после сдачи
                                </p>
                            </div>
                            <ul className="grid gap-3 text-[12px] sm:text-[13px] lg:w-[65%]">
                                {[
                                    "Дизайн интерфейса премиум-класса",
                                    "Полная интеграция с Telegram Bot API",
                                    "Платежи: Stripe, ЮKassa, Apple Pay, СБП",
                                    "Каталог, корзина, заказы, CRM",
                                    "Push-уведомления (95% открытие)",
                                    "PWA — работает офлайн",
                                ].map((f, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-white/70 font-sans font-light">
                                        <div className="w-[18px] h-[18px] rounded-full bg-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                        </div>
                                        <span className="leading-relaxed">{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* BLOCK 2: STARTER SUBSCRIPTION — spans 3 cols */}
                    <div data-reveal className="lg:col-span-3 relative overflow-hidden rounded-2xl glow-card">
                        <div className="flex items-center gap-3 p-4 sm:p-5">
                            <h3 className="inline-flex items-center text-[10px] font-semibold text-white/70 bg-white/[0.06] border border-white/[0.08] rounded-full py-1 px-3 font-sans uppercase tracking-wider m-0">
                                Минимальный
                            </h3>
                            <div className="ml-auto">
                                <a href="https://t.me/w4tg_bot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] sm:text-[12px] font-medium font-sans border border-white/[0.1] text-white/70 hover:text-white hover:border-white/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]">
                                    Выбрать
                                </a>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1 px-4 sm:px-5 pb-2">
                            <span className="text-3xl sm:text-4xl font-semibold gradient-text-white font-sans tracking-tight">9 900</span>
                            <span className="text-[12px] text-white/40 font-sans">₽/мес</span>
                        </div>
                        <ul className="grid gap-3 p-4 sm:p-5 pt-2 text-[12px] sm:text-[13px]">
                            {[
                                "Хостинг (99.9% uptime)",
                                "Мелкие правки и фиксы",
                                "Поддержка по email",
                                "Бэкапы — раз в месяц",
                            ].map((f, i) => (
                                <li key={i} className="flex items-center gap-2.5 text-white/60 font-sans font-light">
                                    <div className="w-[18px] h-[18px] rounded-full bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                                        <Check className="w-2.5 h-2.5 text-white/50" strokeWidth={3} />
                                    </div>
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* BLOCK 3: STANDARD SUBSCRIPTION — spans 4 cols */}
                    <div data-reveal className="lg:col-span-4 relative overflow-hidden rounded-2xl glow-card border-[#8B5CF6]/10">
                        {/* Popular badge */}
                        <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/30 to-transparent" />
                        <div className="flex items-center gap-3 p-4 sm:p-5">
                            <h3 className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full py-1 px-3 font-sans uppercase tracking-wider m-0">
                                <Sparkles className="w-3 h-3" />
                                Стандартный
                            </h3>
                            <span className="hidden sm:inline-flex text-[9px] font-medium text-[#8B5CF6]/80 border border-[#8B5CF6]/20 bg-[#8B5CF6]/[0.06] rounded-full py-0.5 px-2 font-sans uppercase tracking-wider">
                                Популярный
                            </span>
                            <div className="ml-auto">
                                <a href="https://t.me/w4tg_bot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-medium font-sans bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:from-[#7C3AED] hover:to-[#6D28D9] transition-all duration-300 shadow-lg shadow-[#8B5CF6]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]">
                                    Выбрать
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1 px-4 sm:px-5 pb-2">
                            <span className="text-3xl sm:text-4xl font-semibold gradient-text-white font-sans tracking-tight">14 900</span>
                            <span className="text-[12px] text-white/40 font-sans">₽/мес</span>
                        </div>
                        <ul className="grid gap-3 p-4 sm:p-5 pt-2 text-[12px] sm:text-[13px]">
                            {[
                                "Ответ за 2 часа в рабочее время",
                                "Бесплатные обновления и доработки",
                                "Бэкапы — раз в неделю",
                                "Аналитика, отчёты, мониторинг",
                            ].map((f, i) => (
                                <li key={i} className="flex items-center gap-2.5 text-white/70 font-sans font-light">
                                    <div className="w-[18px] h-[18px] rounded-full bg-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                    </div>
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* BLOCK 4: PREMIUM SUBSCRIPTION — spans 4 cols */}
                    <div data-reveal className="lg:col-span-4 relative overflow-hidden rounded-2xl glow-card">
                        <div className="flex items-center gap-3 p-4 sm:p-5">
                            <h3 className="inline-flex items-center text-[10px] font-semibold text-white/70 bg-white/[0.06] border border-white/[0.08] rounded-full py-1 px-3 font-sans uppercase tracking-wider m-0">
                                Премиум
                            </h3>
                            <div className="ml-auto">
                                <a href="https://t.me/w4tg_bot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] sm:text-[12px] font-medium font-sans border border-white/[0.1] text-white/70 hover:text-white hover:border-white/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]">
                                    Выбрать
                                </a>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1 px-4 sm:px-5 pb-2">
                            <span className="text-3xl sm:text-4xl font-semibold gradient-text-white font-sans tracking-tight">24 900</span>
                            <span className="text-[12px] text-white/40 font-sans">₽/мес</span>
                        </div>
                        <ul className="grid gap-3 p-4 sm:p-5 pt-2 text-[12px] sm:text-[13px]">
                            {[
                                "Персональный менеджер проекта",
                                "Бизнес-консалтинг и стратегия",
                                "Ежедневные бэкапы + мониторинг",
                                "Приоритет в очереди разработки",
                            ].map((f, i) => (
                                <li key={i} className="flex items-center gap-2.5 text-white/60 font-sans font-light">
                                    <div className="w-[18px] h-[18px] rounded-full bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                                        <Check className="w-2.5 h-2.5 text-white/50" strokeWidth={3} />
                                    </div>
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* BLOCK 5: AI AGENT — spans full 8 cols */}
                    <div data-reveal className="lg:col-span-8 relative overflow-hidden rounded-2xl glow-card border-[#22c55e]/10">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent" />
                        <div className="pointer-events-none absolute top-0 right-0 h-full w-1/2" style={{ maskImage: 'linear-gradient(to left, white, transparent)' }}>
                            <div className="absolute inset-0 bg-gradient-to-l from-[#22c55e]/[0.02] to-transparent" />
                        </div>

                        <div className="flex items-center gap-3 p-4 sm:p-5">
                            <h3 className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full py-1 px-3 font-sans uppercase tracking-wider m-0">
                                <Bot className="w-3 h-3" />
                                AI-Агент
                            </h3>
                            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-medium text-white/60 border border-white/[0.08] rounded-full py-1 px-2.5 font-sans">
                                <Brain className="w-3 h-3 text-[#22c55e]/60" />
                                Gemini + ElevenLabs
                            </span>
                            <div className="ml-auto">
                                <a href="https://t.me/w4tg_bot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-medium font-sans bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white hover:from-[#16a34a] hover:to-[#15803d] transition-all duration-300 shadow-lg shadow-[#22c55e]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]">
                                    Запустить агента
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row p-4 sm:p-5 pt-2 gap-6">
                            <div className="lg:w-[30%]">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-3xl sm:text-4xl md:text-5xl font-semibold font-sans tracking-tight" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>от 200К</span>
                                    <span className="text-[12px] sm:text-sm text-white/40 font-sans">₽</span>
                                </div>
                                <p className="text-[11px] sm:text-[12px] text-white/40 mt-2 font-sans">
                                    Разработка 14-21 день
                                    <br />+ подписка от 19 900₽/мес
                                </p>
                            </div>
                            <div className="lg:w-[70%]">
                                <div className="grid sm:grid-cols-2 gap-3 text-[12px] sm:text-[13px]">
                                    {[
                                        { icon: MessageSquare, text: "Продаёт, консультирует, записывает — 24/7 на 150+ языках" },
                                        { icon: Brain, text: "SPIN-продажи, Чалдини, Challenger — автоматически" },
                                        { icon: Zap, text: "17 AI-инструментов: корзина, оплата, CRM, бронирование" },
                                        { icon: BarChart3, text: "Аналитика: конверсия, LTV, propensity score в реальном времени" },
                                    ].map((f, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-white/70 font-sans font-light">
                                            <div className="w-[18px] h-[18px] rounded-full bg-[#22c55e] flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <f.icon className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
                                            </div>
                                            <span className="leading-relaxed">{f.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 px-4 sm:px-5 pb-4 sm:pb-5">
                            {[
                                { value: '73%', label: 'диалогов → продажа' },
                                { value: '0.3с', label: 'время ответа' },
                                { value: '96.8%', label: 'конверсия оплаты' },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22c55e]/[0.06] border border-[#22c55e]/10">
                                    <span className="text-[12px] sm:text-[13px] font-semibold font-sans" style={{ color: '#22c55e' }}>{s.value}</span>
                                    <span className="text-[10px] sm:text-[11px] text-white/40 font-sans">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <p data-reveal className="text-[11px] sm:text-[12px] text-white/30 text-center mt-6 font-sans">
                    Все цены указаны без НДС. Годовая оплата подписки — скидка 20%.
                </p>
            </div>
        </section>
    );
};
