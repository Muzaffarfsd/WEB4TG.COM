import { useState, useEffect, useCallback, useRef } from 'react';
import { useScrollReveal } from '../../hooks/use-animations';
import {
    Bot, User, Search, Package, CreditCard, CheckCircle, TrendingUp,
    Brain, ShoppingCart, Sparkles, MessageSquare, Clock, ArrowRight,
    Zap, Eye, Heart, BarChart3, Shield, Globe
} from 'lucide-react';

interface ChatMessage {
    id: number;
    sender: 'user' | 'ai';
    text: string;
    typing?: boolean;
}

interface AgentInsight {
    icon: typeof Bot;
    label: string;
    value: string;
    color: string;
}

interface StageData {
    title: string;
    subtitle: string;
    messages: ChatMessage[];
    insights: AgentInsight[];
    technique: string;
    techniqueDesc: string;
    sidePanel: 'analysis' | 'inventory' | 'recommendation' | 'cart' | 'payment' | 'complete';
}

const stages: StageData[] = [
    {
        title: "Приветствие и квалификация",
        subtitle: "AI определяет намерение клиента",
        messages: [
            { id: 1, sender: 'user', text: 'Привет! Ищу кроссовки для бега, бюджет до 15 000₽' },
            { id: 2, sender: 'ai', text: 'Здравствуйте! 🏃 Отличный выбор. Подскажите, по какому покрытию планируете бегать — асфальт, трейл или беговая дорожка?' },
        ],
        insights: [
            { icon: Brain, label: 'Намерение', value: 'Покупка • 94%', color: '#22c55e' },
            { icon: User, label: 'Сегмент', value: 'Спорт / Бег', color: '#8B5CF6' },
            { icon: TrendingUp, label: 'Бюджет', value: '10–15 000 ₽', color: '#f59e0b' },
            { icon: Globe, label: 'Язык', value: 'Русский', color: '#3b82f6' },
        ],
        technique: 'SPIN-квалификация',
        techniqueDesc: 'AI задаёт уточняющий вопрос о ситуации клиента, чтобы сузить выборку и повысить точность рекомендации',
        sidePanel: 'analysis',
    },
    {
        title: "Поиск по каталогу",
        subtitle: "Проверка наличия и подбор товаров",
        messages: [
            { id: 3, sender: 'user', text: 'В основном асфальт, бегаю 3-4 раза в неделю' },
            { id: 4, sender: 'ai', text: '🔍 Проверяю каталог... Нашёл 3 идеальные модели для асфальта в вашем бюджете. Все в наличии!' },
        ],
        insights: [
            { icon: Search, label: 'Запрос', value: 'Бег / Асфальт / ≤15к', color: '#8B5CF6' },
            { icon: Package, label: 'Найдено', value: '47 → 3 модели', color: '#22c55e' },
            { icon: Clock, label: 'Время поиска', value: '0.3 сек', color: '#3b82f6' },
            { icon: BarChart3, label: 'Релевантность', value: '97%', color: '#f59e0b' },
        ],
        technique: 'Умная фильтрация',
        techniqueDesc: 'AI анализирует 47 товаров по 12 параметрам за 0.3 секунды и выбирает 3 лучших совпадения',
        sidePanel: 'inventory',
    },
    {
        title: "Персональная рекомендация",
        subtitle: "AI предлагает лучший вариант",
        messages: [
            { id: 5, sender: 'ai', text: '⭐ Рекомендую Nike Pegasus 41 — 12 990₽\n\n✅ Амортизация Zoom Air\n✅ Рейтинг 4.8 из 5\n✅ Идеально для 3-4 пробежек/нед\n\nТакже есть Asics Gel-Nimbus (14 500₽) и New Balance 1080 (13 900₽)' },
            { id: 6, sender: 'user', text: 'Nike Pegasus интересно, а какой размер посоветуете?' },
        ],
        insights: [
            { icon: Heart, label: 'Топ-выбор', value: 'Nike Pegasus 41', color: '#ef4444' },
            { icon: Sparkles, label: 'Персонализация', value: 'По профилю', color: '#8B5CF6' },
            { icon: TrendingUp, label: 'Конверсия', value: '+34% с AI', color: '#22c55e' },
            { icon: Eye, label: 'Просмотры модели', value: '2.4k / мес', color: '#3b82f6' },
        ],
        technique: 'Якорь + социальное доказательство',
        techniqueDesc: 'AI начинает с лучшего варианта (якорь), добавляет рейтинг и статистику для подтверждения выбора',
        sidePanel: 'recommendation',
    },
    {
        title: "Оформление заказа",
        subtitle: "Быстрое добавление в корзину",
        messages: [
            { id: 7, sender: 'ai', text: 'По данным покупателей с похожей стопой — размер 43 (US 10). 📦 Есть в наличии 4 пары!\n\nДобавить в корзину?' },
            { id: 8, sender: 'user', text: 'Да, добавляйте!' },
            { id: 9, sender: 'ai', text: '✅ Добавлено! К Nike Pegasus отлично подойдут спортивные носки Stance Run (590₽) — 87% клиентов берут вместе. Добавить?' },
        ],
        insights: [
            { icon: ShoppingCart, label: 'Корзина', value: '1 товар • 12 990₽', color: '#8B5CF6' },
            { icon: Zap, label: 'Апсейл', value: 'Носки +590₽', color: '#f59e0b' },
            { icon: TrendingUp, label: 'Средний чек', value: '+18% с допродажей', color: '#22c55e' },
            { icon: Shield, label: 'Гарантия', value: '30 дней возврат', color: '#3b82f6' },
        ],
        technique: 'Кросс-селл + срочность',
        techniqueDesc: 'AI предлагает сопутствующий товар на основе паттернов покупок, увеличивая средний чек на 18%',
        sidePanel: 'cart',
    },
    {
        title: "Оплата",
        subtitle: "Безопасная оплата в 1 клик",
        messages: [
            { id: 10, sender: 'user', text: 'Давайте с носками!' },
            { id: 11, sender: 'ai', text: '🧾 Ваш заказ:\n\n• Nike Pegasus 41 — 12 990₽\n• Stance Run носки — 590₽\n━━━━━━━━━━━\nИтого: 13 580₽\n\n💳 Выберите способ оплаты:' },
        ],
        insights: [
            { icon: CreditCard, label: 'Методы', value: '6 способов', color: '#8B5CF6' },
            { icon: Shield, label: 'Шифрование', value: 'AES-256', color: '#22c55e' },
            { icon: Clock, label: 'Обработка', value: '< 2 сек', color: '#3b82f6' },
            { icon: CheckCircle, label: 'Конверсия', value: '96.8%', color: '#f59e0b' },
        ],
        technique: 'Бесшовный чекаут',
        techniqueDesc: 'Оплата прямо в чате без перехода на внешний сайт — конверсия в оплату 96.8% против 34% у обычных магазинов',
        sidePanel: 'payment',
    },
    {
        title: "Заказ оформлен!",
        subtitle: "Полный цикл за 2 минуты",
        messages: [
            { id: 12, sender: 'ai', text: '✅ Оплата прошла успешно!\n\n📦 Заказ #TG-48291\n🚚 Доставка: завтра, 12:00–18:00\n📍 Трекинг появится в этом чате\n\nСпасибо за покупку! Хорошей пробежки! 🏃' },
        ],
        insights: [
            { icon: CheckCircle, label: 'Статус', value: 'Оплачено', color: '#22c55e' },
            { icon: Package, label: 'Доставка', value: 'Завтра', color: '#8B5CF6' },
            { icon: MessageSquare, label: 'Сообщений', value: '12 за 2 мин', color: '#3b82f6' },
            { icon: TrendingUp, label: 'Чек +18%', value: 'Допродажа', color: '#f59e0b' },
        ],
        technique: 'Пост-продажный сервис',
        techniqueDesc: 'AI автоматически отправит трекинг, напомнит оставить отзыв и предложит аксессуары через 7 дней',
        sidePanel: 'complete',
    },
];

const paymentMethods = [
    { name: 'Apple Pay', icon: '🍏' },
    { name: 'Google Pay', icon: '🟢' },
    { name: 'СБП', icon: '⚡' },
    { name: 'Карта', icon: '💳' },
    { name: 'ЮKassa', icon: '🟣' },
    { name: 'Crypto', icon: '₿' },
];

const inventoryItems = [
    { name: 'Nike Pegasus 41', sizes: [41, 42, 43, 44, 45], stock: 4, price: '12 990₽', match: 97 },
    { name: 'Asics Gel-Nimbus', sizes: [42, 43, 44], stock: 2, price: '14 500₽', match: 89 },
    { name: 'New Balance 1080', sizes: [41, 43, 44, 45], stock: 6, price: '13 900₽', match: 85 },
];

const TypingIndicator = () => (
    <div className="flex items-center gap-1 px-4 py-3">
        <div className="flex gap-1">
            {[0, 1, 2].map(i => (
                <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]/60"
                    style={{
                        animation: `typingBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }}
                />
            ))}
        </div>
    </div>
);

const SidePanelContent = ({ type, active }: { type: string; active: boolean }) => {
    if (!active) return null;

    switch (type) {
        case 'analysis':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">NLP Анализ</div>
                    {['Определение языка', 'Извлечение сущностей', 'Анализ намерения', 'Классификация сегмента'].map((step, i) => (
                        <div key={i} className="flex items-center gap-2.5" style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 0.15}s both` }}>
                            <div className="w-5 h-5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-3 h-3 text-[#22c55e]" />
                            </div>
                            <span className="text-[12px] text-white/70">{step}</span>
                        </div>
                    ))}
                    <div className="mt-4 p-3 rounded-lg bg-[#8B5CF6]/5 border border-[#8B5CF6]/10">
                        <div className="text-[10px] text-[#8B5CF6]/60 uppercase tracking-wider mb-2">Контекст</div>
                        <div className="text-[11px] text-white/50 leading-relaxed">
                            intent: <span className="text-[#22c55e]">purchase</span><br />
                            category: <span className="text-[#8B5CF6]">running_shoes</span><br />
                            budget_max: <span className="text-[#f59e0b]">15000</span><br />
                            confidence: <span className="text-[#22c55e]">0.94</span>
                        </div>
                    </div>
                </div>
            );
        case 'inventory':
            return (
                <div className="space-y-2.5">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">Каталог / Наличие</div>
                    {inventoryItems.map((item, i) => (
                        <div
                            key={i}
                            className={`p-3 rounded-lg border transition-all duration-300 ${i === 0
                                ? 'bg-[#8B5CF6]/8 border-[#8B5CF6]/20'
                                : 'bg-white/[0.02] border-white/[0.05]'
                                }`}
                            style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 0.12}s both` }}
                        >
                            <div className="flex justify-between items-start mb-1.5">
                                <span className="text-[12px] text-white/90 font-medium">{item.name}</span>
                                <span className="text-[11px] text-[#8B5CF6]">{item.price}</span>
                            </div>
                            <div className="flex gap-1 mb-2">
                                {item.sizes.map(s => (
                                    <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/50">
                                        {s}
                                    </span>
                                ))}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-white/40">Склад: {item.stock} шт</span>
                                <div className="flex items-center gap-1">
                                    <div className="h-1 w-12 rounded-full bg-white/[0.05] overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-[#22c55e]"
                                            style={{ width: `${item.match}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-[#22c55e]">{item.match}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        case 'recommendation':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">AI Ранжирование</div>
                    <div className="p-3 rounded-lg bg-[#8B5CF6]/8 border border-[#8B5CF6]/20" style={{ animation: 'fadeSlideIn 0.4s ease-out both' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                            <span className="text-[12px] text-white/90 font-medium">Факторы выбора</span>
                        </div>
                        {[
                            { name: 'Соответствие профилю', score: 97 },
                            { name: 'Цена / качество', score: 92 },
                            { name: 'Популярность', score: 88 },
                            { name: 'Отзывы', score: 96 },
                        ].map((factor, i) => (
                            <div key={i} className="flex items-center gap-2 mb-2" style={{ animation: `fadeSlideIn 0.3s ease-out ${0.1 + i * 0.1}s both` }}>
                                <span className="text-[11px] text-white/50 w-28 flex-shrink-0">{factor.name}</span>
                                <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]"
                                        style={{
                                            width: `${factor.score}%`,
                                            animation: `barGrow 0.6s ease-out ${0.3 + i * 0.1}s both`,
                                        }}
                                    />
                                </div>
                                <span className="text-[10px] text-[#8B5CF6] w-8 text-right">{factor.score}%</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.3s both' }}>
                        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Стратегия</div>
                        <div className="text-[11px] text-white/60 leading-relaxed">
                            Применены техники: <span className="text-[#8B5CF6]">якорный эффект</span>, <span className="text-[#22c55e]">социальное доказательство</span>, <span className="text-[#f59e0b]">ограничение выбора до 3</span>
                        </div>
                    </div>
                </div>
            );
        case 'cart':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">Корзина</div>
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]" style={{ animation: 'fadeSlideIn 0.3s ease-out both' }}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[12px] text-white/80">Nike Pegasus 41</span>
                            <span className="text-[12px] text-white/90">12 990₽</span>
                        </div>
                        <span className="text-[10px] text-white/40">Размер 43 • Чёрный</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#f59e0b]/5 border border-[#f59e0b]/15 border-dashed" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.15s both' }}>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Zap className="w-3 h-3 text-[#f59e0b]" />
                            <span className="text-[10px] text-[#f59e0b] uppercase tracking-wider">Допродажа</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[12px] text-white/70">Stance Run носки</span>
                            <span className="text-[12px] text-white/80">590₽</span>
                        </div>
                        <div className="text-[10px] text-white/40 mt-1">87% клиентов берут вместе</div>
                    </div>
                    <div className="h-px bg-white/[0.06] my-2" />
                    <div className="flex justify-between items-center" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.3s both' }}>
                        <span className="text-[13px] text-white/60">Итого</span>
                        <span className="text-[15px] text-white font-medium">13 580₽</span>
                    </div>
                    <div className="mt-3 p-2.5 rounded-lg bg-[#22c55e]/5 border border-[#22c55e]/15" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.4s both' }}>
                        <div className="text-[10px] text-[#22c55e] text-center">Средний чек увеличен на +4.5% через допродажу</div>
                    </div>
                </div>
            );
        case 'payment':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">Платёжный шлюз</div>
                    <div className="grid grid-cols-2 gap-2">
                        {paymentMethods.map((method, i) => (
                            <div
                                key={i}
                                className={`p-2.5 rounded-lg border text-center cursor-default transition-all duration-300 ${i === 0
                                    ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/25 ring-1 ring-[#8B5CF6]/20'
                                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
                                    }`}
                                style={{ animation: `fadeSlideIn 0.3s ease-out ${i * 0.07}s both` }}
                            >
                                <div className="text-lg mb-0.5">{method.icon}</div>
                                <div className="text-[10px] text-white/60">{method.name}</div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] mt-2" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.5s both' }}>
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-3.5 h-3.5 text-[#22c55e]" />
                            <span className="text-[11px] text-white/70">Безопасность</span>
                        </div>
                        <div className="text-[10px] text-white/40 leading-relaxed">
                            PCI DSS Level 1 • 3D Secure • Токенизация • Данные карт не хранятся
                        </div>
                    </div>
                </div>
            );
        case 'complete':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">Результат</div>
                    <div className="p-4 rounded-lg bg-[#22c55e]/5 border border-[#22c55e]/15 text-center" style={{ animation: 'fadeSlideIn 0.4s ease-out both' }}>
                        <CheckCircle className="w-8 h-8 text-[#22c55e] mx-auto mb-2" />
                        <div className="text-[14px] text-white/90 font-medium mb-1">Заказ оформлен</div>
                        <div className="text-[11px] text-white/50">12 сообщений • 2 минуты</div>
                    </div>
                    <div className="space-y-2 mt-3">
                        {[
                            { label: 'Без участия оператора', icon: Bot },
                            { label: 'Допродажа +590₽', icon: TrendingUp },
                            { label: 'Конверсия 96.8%', icon: BarChart3 },
                            { label: 'Работает 24/7 / 150+ языков', icon: Globe },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]"
                                style={{ animation: `fadeSlideIn 0.3s ease-out ${0.15 + i * 0.1}s both` }}
                            >
                                <stat.icon className="w-3.5 h-3.5 text-[#8B5CF6] flex-shrink-0" />
                                <span className="text-[11px] text-white/60">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        default:
            return null;
    }
};

export const AiAgentSection = () => {
    const revealRef = useScrollReveal({ stagger: 0.06 });
    const [currentStage, setCurrentStage] = useState(0);
    const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [sidePanelKey, setSidePanelKey] = useState(0);
    const chatRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInViewRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const allPreviousMessages = stages.slice(0, currentStage).flatMap(s => s.messages);
    const currentMessages = stages[currentStage]?.messages || [];

    const prefersReducedMotion = useRef(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        prefersReducedMotion.current = mq.matches;
        const handler = (e: MediaQueryListEvent) => { prefersReducedMotion.current = e.matches; };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                isInViewRef.current = entry.isIntersecting;
            },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isPaused || !isInViewRef.current) return;
        clearTimer();

        setVisibleMessages([]);
        setSidePanelKey(prev => prev + 1);
        let msgIndex = 0;

        const showNext = () => {
            if (msgIndex >= currentMessages.length) {
                timerRef.current = setTimeout(() => {
                    if (currentStage < stages.length - 1) {
                        setCurrentStage(prev => prev + 1);
                    } else {
                        timerRef.current = setTimeout(() => {
                            setCurrentStage(0);
                        }, 5000);
                    }
                }, 3500);
                return;
            }

            const msg = currentMessages[msgIndex];
            const reduced = prefersReducedMotion.current;
            if (msg.sender === 'ai') {
                setIsTyping(true);
                timerRef.current = setTimeout(() => {
                    setIsTyping(false);
                    setVisibleMessages(prev => [...prev, msg]);
                    msgIndex++;
                    timerRef.current = setTimeout(showNext, reduced ? 400 : 1200);
                }, reduced ? 300 : 1500);
            } else {
                setVisibleMessages(prev => [...prev, msg]);
                msgIndex++;
                timerRef.current = setTimeout(showNext, reduced ? 300 : 1000);
            }
        };

        timerRef.current = setTimeout(showNext, 800);
        return clearTimer;
    }, [currentStage, isPaused, clearTimer, currentMessages]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [visibleMessages, isTyping]);

    const handleStageClick = (index: number) => {
        clearTimer();
        setIsPaused(false);
        setCurrentStage(index);
    };

    const handleTogglePause = () => {
        setIsPaused(prev => !prev);
    };

    const stage = stages[currentStage];

    return (
        <section ref={sectionRef} id="ai-agent" className="relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8 overflow-hidden">
            <div className="absolute w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/[0.03] blur-[100px] top-[20%] right-[-10%] pointer-events-none" />
            <div className="absolute w-[400px] h-[400px] rounded-full bg-[#7C3AED]/[0.02] blur-[80px] bottom-[10%] left-[-5%] pointer-events-none" />

            <div ref={revealRef} className="max-w-7xl mx-auto relative">
                <div data-reveal className="text-center mb-12 sm:mb-16">
                    <span className="section-label justify-center">
                        <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
                        AI-Агент
                        <span className="w-8 h-px bg-[#8B5CF6]/40 ml-3" />
                    </span>
                    <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Продавец, который
                        <br />
                        <span className="italic gradient-text">никогда не спит</span>
                    </h2>
                    <p className="text-[clamp(0.875rem,1.5vw,1.05rem)] text-white/70 mt-4 sm:mt-5 font-sans font-light leading-relaxed max-w-2xl mx-auto">
                        AI-консультант обрабатывает заказы от первого сообщения до оплаты. Без операторов, без задержек — 24/7 на 150+ языках.
                    </p>
                </div>

                <div data-reveal className="flex gap-2 justify-center flex-wrap mb-8 sm:mb-10">
                    {stages.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => handleStageClick(i)}
                            aria-label={`Этап ${i + 1}: ${s.title}`}
                            aria-current={i === currentStage ? 'step' : undefined}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-[12px] font-sans transition-all duration-300 border cursor-pointer ${i === currentStage
                                ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/30 text-white/90'
                                : i < currentStage
                                    ? 'bg-white/[0.03] border-white/[0.08] text-white/50'
                                    : 'bg-white/[0.02] border-white/[0.05] text-white/30 hover:text-white/50 hover:border-white/[0.1]'
                                }`}
                        >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-medium ${i === currentStage
                                ? 'bg-[#8B5CF6] text-white'
                                : i < currentStage
                                    ? 'bg-[#22c55e]/20 text-[#22c55e]'
                                    : 'bg-white/[0.06] text-white/30'
                                }`}>
                                {i < currentStage ? '✓' : i + 1}
                            </span>
                            <span className="hidden sm:inline">{s.title}</span>
                        </button>
                    ))}
                    <button
                        onClick={handleTogglePause}
                        aria-label={isPaused ? 'Запустить автовоспроизведение' : 'Поставить на паузу'}
                        className="ml-2 px-3 py-1.5 rounded-full text-[11px] sm:text-[12px] font-sans border bg-white/[0.02] border-white/[0.05] text-white/40 hover:text-white/60 hover:border-white/[0.12] transition-all duration-300 cursor-pointer"
                    >
                        {isPaused ? '▶ Запустить' : '⏸ Пауза'}
                    </button>
                </div>

                <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
                    <div className="lg:col-span-3 order-2 lg:order-1">
                        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.06] h-full">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                                    <Brain className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                </div>
                                <span className="text-[12px] text-white/60 font-sans">Метрики AI</span>
                            </div>
                            <div className="space-y-3">
                                {stage.insights.map((insight, i) => (
                                    <div
                                        key={`${currentStage}-${i}`}
                                        className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                                        style={{ animation: `fadeSlideIn 0.35s ease-out ${i * 0.08}s both` }}
                                    >
                                        <div
                                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: `${insight.color}10`, borderColor: `${insight.color}20` }}
                                        >
                                            <insight.icon className="w-3.5 h-3.5" style={{ color: insight.color }} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[10px] text-white/35 leading-none mb-0.5">{insight.label}</div>
                                            <div className="text-[12px] text-white/80 font-medium truncate">{insight.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 pt-4 border-t border-white/[0.05]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
                                    <span className="text-[11px] text-[#8B5CF6]/80 font-medium">{stage.technique}</span>
                                </div>
                                <p className="text-[10px] text-white/40 leading-relaxed">{stage.techniqueDesc}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 order-1 lg:order-2">
                        <div className="max-w-[380px] mx-auto">
                            <div className="relative rounded-[2rem] border border-white/[0.08] bg-[#08080c] shadow-2xl shadow-black/50 overflow-hidden">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[26px] bg-[#08080c] rounded-b-2xl z-10" />

                                <div className="pt-8 pb-2 px-4 bg-gradient-to-b from-[#0c0a14] to-transparent">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center">
                                            <Bot className="w-4.5 h-4.5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-[13px] text-white/90 font-medium font-sans">AI Консультант</div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                                                <span className="text-[10px] text-[#22c55e]/80">онлайн</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-1">
                                    <div className="h-px bg-white/[0.06]" />
                                </div>

                                <div ref={chatRef} className="h-[420px] sm:h-[460px] overflow-y-auto px-3 py-3 space-y-2 scroll-smooth ai-agent-chat-scroll" role="log" aria-label="Демонстрация чата с AI-агентом" aria-live="polite">
                                    {allPreviousMessages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed font-sans whitespace-pre-line ${msg.sender === 'user'
                                                    ? 'bg-[#8B5CF6] text-white rounded-br-md'
                                                    : 'bg-white/[0.06] text-white/80 rounded-bl-md'
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}

                                    {visibleMessages.map((msg, i) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                            style={{ animation: `messageAppear 0.35s ease-out ${i * 0.05}s both` }}
                                        >
                                            <div
                                                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed font-sans whitespace-pre-line ${msg.sender === 'user'
                                                    ? 'bg-[#8B5CF6] text-white rounded-br-md'
                                                    : 'bg-white/[0.06] text-white/80 rounded-bl-md'
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-white/[0.06] rounded-2xl rounded-bl-md">
                                                <TypingIndicator />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="px-3 pb-4 pt-2">
                                    <div className="flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.08] px-4 py-2.5">
                                        <MessageSquare className="w-4 h-4 text-white/20 flex-shrink-0" />
                                        <span className="text-[12px] text-white/20 font-sans">Написать сообщение...</span>
                                        <ArrowRight className="w-4 h-4 text-[#8B5CF6]/40 ml-auto flex-shrink-0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 order-3">
                        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.06] h-full">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                                    <Eye className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                </div>
                                <span className="text-[12px] text-white/60 font-sans">Под капотом</span>
                            </div>
                            <div className="text-[13px] text-white/80 font-medium font-sans mb-1">{stage.title}</div>
                            <div className="text-[11px] text-white/40 font-sans mb-4">{stage.subtitle}</div>
                            <SidePanelContent key={sidePanelKey} type={stage.sidePanel} active={true} />
                        </div>
                    </div>
                </div>

                <div data-reveal className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
                    {[
                        { value: '2 мин', label: 'От запроса до оплаты', icon: Clock },
                        { value: '96.8%', label: 'Конверсия в оплату', icon: TrendingUp },
                        { value: '24/7', label: 'Без выходных', icon: Zap },
                        { value: '150+', label: 'Языков поддержки', icon: Globe },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="glow-card rounded-xl p-4 sm:p-5 text-center"
                        >
                            <stat.icon className="w-4 h-4 text-[#8B5CF6]/50 mx-auto mb-2" />
                            <div className="text-[clamp(1.2rem,2.5vw,1.5rem)] font-instrument-serif gradient-text font-normal">{stat.value}</div>
                            <div className="text-[10px] sm:text-[11px] text-white/40 mt-1 font-sans">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
