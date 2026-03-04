import { useState, useEffect, useCallback, useRef } from 'react';
import { useScrollReveal } from '../../hooks/use-animations';
import {
    Bot, User, Search, CreditCard, CheckCircle, TrendingUp,
    Brain, Sparkles, MessageSquare, Clock, ArrowRight,
    Zap, Eye, BarChart3, Shield, Globe, Mic, Volume2,
    Target, Users, FileText, Gauge, Activity, ArrowUpRight
} from 'lucide-react';

interface ChatMessage {
    id: number;
    sender: 'user' | 'alex';
    text: string;
    isVoice?: boolean;
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
    sidePanel: 'context' | 'spin' | 'objection' | 'funnel' | 'voice' | 'closing';
}

const stages: StageData[] = [
    {
        title: "Первый контакт",
        subtitle: "29 сигналов контекста за 0.3 сек",
        messages: [
            { id: 1, sender: 'user', text: 'Привет, у меня ресторан в Москве, думаю над приложением для заказов' },
            { id: 2, sender: 'alex', text: 'Смотрите, ресторан — это как раз та ниша, где Mini App окупается быстрее всего. Доставка через Telegram без комиссий агрегаторов — это сразу +25% маржи)\n\nА сейчас заказы через агрегаторы идут или напрямую?' },
        ],
        insights: [
            { icon: Brain, label: 'Модель', value: 'Gemini Flash • 0.3', color: '#3b82f6' },
            { icon: Target, label: 'Воронка', value: 'Awareness', color: '#f59e0b' },
            { icon: Gauge, label: 'Propensity', value: '32 / 100', color: '#8B5CF6' },
            { icon: Globe, label: 'Стиль', value: 'RU • Тёплый', color: '#22c55e' },
        ],
        technique: 'SPIN: Situation',
        techniqueDesc: 'Алекс не спрашивает «чем помочь?». Он сразу даёт ценность (Value First по Чалдини) и задаёт S-вопрос о текущей ситуации, чтобы начать квалификацию',
        sidePanel: 'context',
    },
    {
        title: "Выявление боли",
        subtitle: "SPIN Selling — Problem & Implication",
        messages: [
            { id: 3, sender: 'user', text: 'Да, в основном Яндекс Еда и Деливери. Комиссия бешеная, 35% забирают' },
            { id: 4, sender: 'alex', text: 'Так, давайте прикинем. 35% комиссии — если у вас оборот хотя бы 500к в месяц через агрегаторы, это 175 тысяч ежемесячно. За полгода — больше миллиона. И это деньги, которые вы уже теряете)\n\nА свою базу клиентов в Telegram ведёте?' },
        ],
        insights: [
            { icon: Brain, label: 'Модель', value: 'Gemini Pro • 0.45', color: '#ef4444' },
            { icon: Target, label: 'Воронка', value: 'Interest ↑', color: '#f59e0b' },
            { icon: Gauge, label: 'Propensity', value: '48 → 58', color: '#8B5CF6' },
            { icon: Activity, label: 'Настроение', value: '↗ Улучшается', color: '#22c55e' },
        ],
        technique: 'Язык потерь (Канеман)',
        techniqueDesc: 'Люди боятся потерять в 2.5× сильнее, чем хотят приобрести. Алекс говорит «вы теряете 175к», а не «вы заработаете 175к» — это вызывает в 2.5 раза более сильную реакцию',
        sidePanel: 'spin',
    },
    {
        title: "Работа с возражениями",
        subtitle: "Challenger Mindset + социальное доказательство",
        messages: [
            { id: 5, sender: 'user', text: 'Ну это всё понятно, но разработка приложений — это дорого и долго. У нас фрилансер делал сайт полгода' },
            { id: 6, sender: 'alex', text: 'Знаете что, это самое частое заблуждение) Telegram Mini App — это не мобильное приложение. Не нужен App Store, не нужна модерация.\n\nВот кейс: DeluxeDine — ресторан похожего формата. Запустились за 10 дней, заказы через Mini App выросли на 40% за первый месяц. Без единой комиссии агрегатору.\n\nПоказать их кейс подробнее?' },
        ],
        insights: [
            { icon: Brain, label: 'Модель', value: 'Pro + Thinking', color: '#ef4444' },
            { icon: Target, label: 'Воронка', value: 'Consideration', color: '#f59e0b' },
            { icon: Gauge, label: 'Propensity', value: '58 → 71', color: '#8B5CF6' },
            { icon: Users, label: 'BANT', value: 'B: ? A: ✓ N: ✓ T: ?', color: '#3b82f6' },
        ],
        technique: 'Challenger + Чалдини #3',
        techniqueDesc: 'Алекс бросает вызов устаревшему представлению («это дорого и долго»), даёт конкретный кейс как социальное доказательство, и использует function call get_case_study для персонализации',
        sidePanel: 'objection',
    },
    {
        title: "Квалификация и демо",
        subtitle: "BANT + Function Calling",
        messages: [
            { id: 7, sender: 'user', text: 'Да, покажите. А сколько это стоит вообще?' },
            { id: 8, sender: 'alex', text: 'Шаблон «Ресторан» — 180 000₽. Это меню, корзина, оплата, трекинг курьера, push-уведомления.\n\n35% предоплата (63к), остаток после приёмки. Правки 14 дней бесплатно.\n\nЕсли ваш оборот 500к/мес — приложение окупается за 1 месяц, потому что 175к комиссий остаются у вас)\n\nКогда планируете запуск?' },
        ],
        insights: [
            { icon: Brain, label: 'Модель', value: 'Pro + Thinking', color: '#ef4444' },
            { icon: Target, label: 'Воронка', value: 'Decision', color: '#22c55e' },
            { icon: Gauge, label: 'Propensity', value: '71 → 82', color: '#8B5CF6' },
            { icon: Users, label: 'BANT', value: 'B: ✓ A: ✓ N: ✓ T: ?', color: '#22c55e' },
        ],
        technique: 'Рефрейминг цены + BANT',
        techniqueDesc: 'Алекс не просто называет цену — он сразу рефреймит через ROI (окупаемость за 1 месяц). Параллельно завершает BANT-квалификацию через вопрос о сроках',
        sidePanel: 'funnel',
    },
    {
        title: "Голосовое + закрытие",
        subtitle: "ElevenLabs v3 + техника закрытия",
        messages: [
            { id: 9, sender: 'user', text: 'Хочу до нового года успеть. Но надо ещё с партнёром обсудить' },
            { id: 10, sender: 'alex', text: 'Вот что скажу — ближайшие слоты в декабре уже заполняются. Если начать на этой неделе, к новому году уже будете принимать заказы)\n\nДавайте я подготовлю КП с вашими цифрами — покажете партнёру конкретику, а не просто идею. Готовлю?' },
            { id: 11, sender: 'alex', text: '🎤 Голосовое сообщение — 0:12', isVoice: true },
        ],
        insights: [
            { icon: Mic, label: 'Голос', value: 'whisper • bridge', color: '#f59e0b' },
            { icon: Target, label: 'Воронка', value: 'Decision → Action', color: '#22c55e' },
            { icon: Gauge, label: 'Propensity', value: '82 → 91', color: '#8B5CF6' },
            { icon: Volume2, label: 'Профиль', value: 'ElevenLabs v3', color: '#3b82f6' },
        ],
        technique: 'Дефицит + снятие риска',
        techniqueDesc: 'Алекс использует реальный дефицит слотов (Чалдини #5), снимает барьер «надо обсудить» через КП, и отправляет голосовое в доверительном whisper-профиле для усиления эмпатии',
        sidePanel: 'voice',
    },
    {
        title: "Сделка закрыта",
        subtitle: "От первого сообщения до КП за 3 минуты",
        messages: [
            { id: 12, sender: 'user', text: 'Да, готовьте КП!' },
            { id: 13, sender: 'alex', text: 'Отлично) Формирую коммерческое предложение с вашими данными.\n\n📄 КП_Ресторан_Москва.pdf\n\nТам внутри: ваш ROI, сроки, этапы, примеры. Если партнёр одобрит — бронирую слот и начинаем на этой неделе.\n\nБудут вопросы — пишите, я на связи)' },
        ],
        insights: [
            { icon: CheckCircle, label: 'Статус', value: 'КП отправлено', color: '#22c55e' },
            { icon: FileText, label: 'Инструмент', value: 'generate_kp', color: '#8B5CF6' },
            { icon: MessageSquare, label: 'Сообщений', value: '13 за 3 мин', color: '#3b82f6' },
            { icon: Gauge, label: 'Propensity', value: '91 → 95', color: '#22c55e' },
        ],
        technique: 'Следующий шаг + единство',
        techniqueDesc: 'Алекс использует function call generate_kp, создаёт конкретный следующий шаг (показать партнёру), и оставляет дверь открытой. Диалог сохраняется в RAG-базу как успешный кейс',
        sidePanel: 'closing',
    },
];

const functionTools = [
    { name: 'get_pricing', status: 'called', result: 'Ресторан: 180 000₽' },
    { name: 'get_case_study', status: 'called', result: 'DeluxeDine: +40%' },
    { name: 'calculate_project_cost', status: 'called', result: '180к + AI-агент' },
    { name: 'save_client_info', status: 'called', result: 'Ресторан, Москва' },
    { name: 'generate_kp', status: 'pending', result: 'Формируется...' },
    { name: 'check_availability', status: 'called', result: 'Декабрь: 2 слота' },
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

const VoiceMessage = () => (
    <div className="flex items-center gap-2 px-1">
        <div className="w-7 h-7 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
            <Mic className="w-3.5 h-3.5 text-[#8B5CF6]" />
        </div>
        <div className="flex-1 flex items-center gap-0.5">
            {Array.from({ length: 24 }).map((_, i) => (
                <div
                    key={i}
                    className="w-[3px] rounded-full bg-[#8B5CF6]/50"
                    style={{
                        height: `${6 + Math.sin(i * 0.8) * 8 + Math.random() * 6}px`,
                        animation: `typingBounce 2s ease-in-out ${i * 0.08}s infinite`,
                    }}
                />
            ))}
        </div>
        <span className="text-[10px] text-white/40 flex-shrink-0">0:12</span>
    </div>
);

const SidePanelContent = ({ type }: { type: string }) => {
    switch (type) {
        case 'context':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">29 сигналов контекста</div>
                    {[
                        { label: 'Определение языка', value: 'RU', done: true },
                        { label: 'Детекция воронки', value: 'Awareness', done: true },
                        { label: 'BANT-квалификация', value: 'N: ресторан', done: true },
                        { label: 'Зеркало клиента', value: 'Разговорный', done: true },
                        { label: 'Роутинг модели', value: 'Flash → 0.3', done: true },
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-2.5" style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 0.12}s both` }}>
                            <div className="w-5 h-5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-3 h-3 text-[#22c55e]" />
                            </div>
                            <span className="text-[12px] text-white/60 flex-1">{step.label}</span>
                            <span className="text-[10px] text-[#8B5CF6]">{step.value}</span>
                        </div>
                    ))}
                    <div className="mt-4 p-3 rounded-lg bg-[#8B5CF6]/5 border border-[#8B5CF6]/10" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.6s both' }}>
                        <div className="text-[10px] text-[#8B5CF6]/60 uppercase tracking-wider mb-2">Контекст-билдер</div>
                        <div className="text-[11px] text-white/50 leading-relaxed font-mono">
                            funnel: <span className="text-[#f59e0b]">awareness</span><br />
                            niche: <span className="text-[#8B5CF6]">restaurant</span><br />
                            city: <span className="text-[#22c55e]">moscow</span><br />
                            propensity: <span className="text-[#f59e0b]">32</span><br />
                            model: <span className="text-[#3b82f6]">flash_preview</span>
                        </div>
                    </div>
                </div>
            );
        case 'spin':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">SPIN Selling</div>
                    {[
                        { stage: 'S', name: 'Situation', desc: 'Ресторан, Москва, агрегаторы', active: true, done: true },
                        { stage: 'P', name: 'Problem', desc: 'Комиссия 35%, потеря маржи', active: true, done: true },
                        { stage: 'I', name: 'Implication', desc: '175к/мес потерь → 1М за полгода', active: true, done: false },
                        { stage: 'N', name: 'Need-Payoff', desc: 'Ожидание...', active: false, done: false },
                    ].map((s, i) => (
                        <div
                            key={i}
                            className={`p-2.5 rounded-lg border ${s.active
                                ? s.done ? 'bg-[#22c55e]/5 border-[#22c55e]/15' : 'bg-[#8B5CF6]/5 border-[#8B5CF6]/20'
                                : 'bg-white/[0.01] border-white/[0.04]'}`}
                            style={{ animation: `fadeSlideIn 0.3s ease-out ${i * 0.1}s both` }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${s.done
                                    ? 'bg-[#22c55e]/20 text-[#22c55e]'
                                    : s.active ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]' : 'bg-white/[0.05] text-white/20'}`}>
                                    {s.stage}
                                </span>
                                <span className={`text-[12px] font-medium ${s.active ? 'text-white/80' : 'text-white/30'}`}>{s.name}</span>
                            </div>
                            <div className={`text-[10px] ml-7 ${s.active ? 'text-white/50' : 'text-white/20'}`}>{s.desc}</div>
                        </div>
                    ))}
                    <div className="p-2.5 rounded-lg bg-[#f59e0b]/5 border border-[#f59e0b]/15 mt-2" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.5s both' }}>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Zap className="w-3 h-3 text-[#f59e0b]" />
                            <span className="text-[10px] text-[#f59e0b]">Канеман: Язык потерь</span>
                        </div>
                        <div className="text-[10px] text-white/40">«Вы теряете 175к/мес» вместо «вы заработаете 175к/мес» — реакция в 2.5× сильнее</div>
                    </div>
                </div>
            );
        case 'objection':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">Работа с возражениями</div>
                    <div className="p-3 rounded-lg bg-[#ef4444]/5 border border-[#ef4444]/15" style={{ animation: 'fadeSlideIn 0.3s ease-out both' }}>
                        <div className="text-[10px] text-[#ef4444] uppercase tracking-wider mb-1.5">Возражение</div>
                        <div className="text-[12px] text-white/70">«Дорого и долго, фрилансер делал сайт полгода»</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#22c55e]/5 border border-[#22c55e]/15" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.15s both' }}>
                        <div className="text-[10px] text-[#22c55e] uppercase tracking-wider mb-1.5">Стратегия</div>
                        <div className="space-y-1.5">
                            {[
                                'Challenger: разрушить заблуждение',
                                'Сравнение: Mini App ≠ мобильное приложение',
                                'Кейс: DeluxeDine, +40% заказов',
                                'Чалдини #3: социальное доказательство',
                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <ArrowUpRight className="w-3 h-3 text-[#22c55e] flex-shrink-0" />
                                    <span className="text-[11px] text-white/60">{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.3s both' }}>
                        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Function Call</div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                            <span className="text-[11px] text-white/50 font-mono">get_case_study(</span>
                            <span className="text-[11px] text-[#8B5CF6] font-mono">"restaurant"</span>
                            <span className="text-[11px] text-white/50 font-mono">)</span>
                        </div>
                    </div>
                </div>
            );
        case 'funnel':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">17 инструментов</div>
                    <div className="space-y-1.5">
                        {functionTools.map((tool, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-2 p-2 rounded-lg ${tool.status === 'pending' ? 'bg-[#f59e0b]/5 border border-[#f59e0b]/15' : 'bg-white/[0.02] border border-white/[0.04]'}`}
                                style={{ animation: `fadeSlideIn 0.3s ease-out ${i * 0.08}s both` }}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tool.status === 'pending' ? 'bg-[#f59e0b] animate-pulse' : 'bg-[#22c55e]'}`} />
                                <span className="text-[10px] text-white/50 font-mono flex-1 truncate">{tool.name}</span>
                                <span className={`text-[9px] truncate max-w-[80px] ${tool.status === 'pending' ? 'text-[#f59e0b]' : 'text-white/30'}`}>{tool.result}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 rounded-lg bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 mt-2" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.5s both' }}>
                        <div className="text-[10px] text-[#8B5CF6]/60 uppercase tracking-wider mb-2">BANT-квалификация</div>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { letter: 'B', name: 'Budget', value: '~180к ✓', done: true },
                                { letter: 'A', name: 'Authority', value: '+партнёр', done: true },
                                { letter: 'N', name: 'Need', value: 'Комиссии ✓', done: true },
                                { letter: 'T', name: 'Timeline', value: 'До НГ', done: true },
                            ].map((b, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <span className={`text-[10px] font-bold ${b.done ? 'text-[#22c55e]' : 'text-white/20'}`}>{b.letter}</span>
                                    <span className="text-[10px] text-white/40">{b.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        case 'voice':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">Голосовая система</div>
                    <div className="p-3 rounded-lg bg-[#8B5CF6]/5 border border-[#8B5CF6]/20" style={{ animation: 'fadeSlideIn 0.3s ease-out both' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <Volume2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                            <span className="text-[12px] text-white/80 font-medium">ElevenLabs v3</span>
                        </div>
                        {[
                            { name: 'Триггер', value: 'Closing (100)', color: '#ef4444' },
                            { name: 'Профиль', value: 'whisper', color: '#8B5CF6' },
                            { name: 'Режим', value: 'bridge (>500 симв)', color: '#f59e0b' },
                            { name: 'Формат', value: 'mp3_44100_128', color: '#3b82f6' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between mb-2" style={{ animation: `fadeSlideIn 0.3s ease-out ${0.1 + i * 0.1}s both` }}>
                                <span className="text-[11px] text-white/40">{item.name}</span>
                                <span className="text-[10px] font-medium" style={{ color: item.color }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.4s both' }}>
                        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">7 голосовых профилей</div>
                        <div className="flex flex-wrap gap-1">
                            {['greeting', 'empathy', 'factual', 'excited', 'whisper', 'playful', 'default'].map((p, i) => (
                                <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded ${p === 'whisper' ? 'bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/20' : 'bg-white/[0.04] text-white/30'}`}>
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#22c55e]/5 border border-[#22c55e]/15" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.5s both' }}>
                        <div className="text-[10px] text-[#22c55e] text-center">Голос повышает конверсию закрытия на +23%</div>
                    </div>
                </div>
            );
        case 'closing':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">Результат</div>
                    <div className="p-4 rounded-lg bg-[#22c55e]/5 border border-[#22c55e]/15 text-center" style={{ animation: 'fadeSlideIn 0.4s ease-out both' }}>
                        <CheckCircle className="w-8 h-8 text-[#22c55e] mx-auto mb-2" />
                        <div className="text-[14px] text-white/90 font-medium mb-1">КП отправлено</div>
                        <div className="text-[11px] text-white/50">13 сообщений — 3 минуты</div>
                    </div>
                    <div className="space-y-2 mt-3">
                        {[
                            { label: 'Без участия менеджера', icon: Bot },
                            { label: 'Propensity 32 → 95', icon: TrendingUp },
                            { label: '6 инструментов вызвано', icon: Zap },
                            { label: 'Диалог → RAG-база', icon: Brain },
                            { label: 'Следующий шаг назначен', icon: ArrowUpRight },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]"
                                style={{ animation: `fadeSlideIn 0.3s ease-out ${0.15 + i * 0.08}s both` }}
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
            if (msg.sender === 'alex') {
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

    const renderMessage = (msg: ChatMessage, animated: boolean, animIndex?: number) => (
        <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            style={animated ? { animation: `messageAppear 0.35s ease-out ${(animIndex || 0) * 0.05}s both` } : undefined}
        >
            <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed font-sans whitespace-pre-line ${msg.sender === 'user'
                    ? 'bg-[#8B5CF6] text-white rounded-br-md'
                    : 'bg-white/[0.06] text-white/80 rounded-bl-md'
                    }`}
            >
                {msg.isVoice ? <VoiceMessage /> : msg.text}
            </div>
        </div>
    );

    return (
        <section ref={sectionRef} id="ai-agent" className="relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8 overflow-hidden">
            <div className="absolute w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/[0.03] blur-[100px] top-[20%] right-[-10%] pointer-events-none" />
            <div className="absolute w-[400px] h-[400px] rounded-full bg-[#7C3AED]/[0.02] blur-[80px] bottom-[10%] left-[-5%] pointer-events-none" />

            <div ref={revealRef} className="max-w-7xl mx-auto relative">
                <div data-reveal className="text-center mb-12 sm:mb-16">
                    <span className="section-label justify-center">
                        <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
                        AI-Агент «Алекс»
                        <span className="w-8 h-px bg-[#8B5CF6]/40 ml-3" />
                    </span>
                    <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Не чат-бот —
                        <br />
                        <span className="italic gradient-text">живой эксперт</span>
                    </h2>
                    <p className="text-[clamp(0.875rem,1.5vw,1.05rem)] text-white/70 mt-4 sm:mt-5 font-sans font-light leading-relaxed max-w-2xl mx-auto">
                        Алекс ведёт клиента от первого сообщения до оплаты. SPIN-продажи, 7 принципов Чалдини, голосовые сообщения, 17 инструментов — и клиент даже не понимает, что говорит с AI.
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
                                <span className="text-[12px] text-white/60 font-sans">Мозг Алекса</span>
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
                        <div className="max-w-[390px] mx-auto">
                            <div className="relative iphone-frame">
                                <div className="absolute -inset-[3px] rounded-[3.2rem] bg-gradient-to-b from-[#3a3a3c] via-[#2c2c2e] to-[#1c1c1e] z-0" />

                                <div className="relative rounded-[3rem] border border-[#48484a]/60 bg-[#000000] shadow-[0_0_80px_-20px_rgba(139,92,246,0.2),0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-[1]">
                                    <div className="absolute top-[1px] left-1/2 -translate-x-1/2 w-[calc(100%-8px)] h-[3px] rounded-b-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent z-20 pointer-events-none" />

                                    <div className="absolute right-[-3px] top-[120px] w-[3px] h-[44px] rounded-r-sm bg-gradient-to-b from-[#3a3a3c] to-[#2c2c2e] z-20" />
                                    <div className="absolute left-[-3px] top-[100px] w-[3px] h-[28px] rounded-l-sm bg-gradient-to-b from-[#3a3a3c] to-[#2c2c2e] z-20" />
                                    <div className="absolute left-[-3px] top-[145px] w-[3px] h-[44px] rounded-l-sm bg-gradient-to-b from-[#3a3a3c] to-[#2c2c2e] z-20" />
                                    <div className="absolute left-[-3px] top-[200px] w-[3px] h-[44px] rounded-l-sm bg-gradient-to-b from-[#3a3a3c] to-[#2c2c2e] z-20" />

                                    <div className="relative px-5 pt-3 pb-0 z-10">
                                        <div className="flex items-center justify-between text-[10px] text-white/50 font-sans font-medium mb-1">
                                            <span>9:41</span>
                                            <div className="absolute left-1/2 -translate-x-1/2 top-2.5">
                                                <div className="relative w-[100px] h-[28px] bg-black rounded-full flex items-center justify-center border border-white/[0.04]">
                                                    <div className="absolute left-[22px] w-[7px] h-[7px] rounded-full bg-[#1a1a1e] border border-white/[0.03] shadow-[inset_0_0_2px_rgba(255,255,255,0.05)]" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="opacity-50">
                                                    <rect x="0" y="6" width="2.5" height="4" rx="0.5" fill="white"/>
                                                    <rect x="3.5" y="4" width="2.5" height="6" rx="0.5" fill="white"/>
                                                    <rect x="7" y="2" width="2.5" height="8" rx="0.5" fill="white"/>
                                                    <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="white"/>
                                                </svg>
                                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="opacity-50">
                                                    <path d="M7 1C4.5 1 2.3 2 0.8 3.7L2 5C3.2 3.5 5 2.5 7 2.5C9 2.5 10.8 3.5 12 5L13.2 3.7C11.7 2 9.5 1 7 1Z" fill="white"/>
                                                    <path d="M7 4C5.5 4 4.2 4.7 3.3 5.8L4.5 7C5.1 6.2 6 5.5 7 5.5C8 5.5 8.9 6.2 9.5 7L10.7 5.8C9.8 4.7 8.5 4 7 4Z" fill="white"/>
                                                    <circle cx="7" cy="9" r="1.2" fill="white"/>
                                                </svg>
                                                <div className="flex items-center">
                                                    <div className="w-[18px] h-[9px] rounded-[2px] border border-white/40 flex items-center p-[1px]">
                                                        <div className="w-[10px] h-[5px] rounded-[1px] bg-white/50" />
                                                    </div>
                                                    <div className="w-[1.5px] h-[4px] rounded-r-sm bg-white/30 ml-[0.5px]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-4 pt-1 pb-2 bg-gradient-to-b from-[#0c0a14]/90 to-transparent">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20">
                                                <Bot className="w-4.5 h-4.5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[13px] text-white/90 font-medium font-sans">Алекс</div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                                                    <span className="text-[10px] text-[#22c55e]/80">онлайн</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mx-3">
                                        <div className="h-px bg-white/[0.06]" />
                                    </div>

                                    <div ref={chatRef} className="h-[420px] sm:h-[460px] overflow-y-auto px-3 py-3 space-y-2 scroll-smooth ai-agent-chat-scroll" role="log" aria-label="Демонстрация чата с Алексом" aria-live="polite">
                                        {allPreviousMessages.map(msg => renderMessage(msg, false))}
                                        {visibleMessages.map((msg, i) => renderMessage(msg, true, i))}
                                        {isTyping && (
                                            <div className="flex justify-start">
                                                <div className="bg-white/[0.06] rounded-2xl rounded-bl-md">
                                                    <TypingIndicator />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-3 pb-3 pt-2">
                                        <div className="flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.08] px-4 py-2.5">
                                            <MessageSquare className="w-4 h-4 text-white/20 flex-shrink-0" />
                                            <span className="text-[12px] text-white/20 font-sans">Написать сообщение...</span>
                                            <ArrowRight className="w-4 h-4 text-[#8B5CF6]/40 ml-auto flex-shrink-0" />
                                        </div>
                                    </div>

                                    <div className="flex justify-center pb-2">
                                        <div className="w-[120px] h-[4px] rounded-full bg-white/15" />
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
                            <SidePanelContent key={sidePanelKey} type={stage.sidePanel} />
                        </div>
                    </div>
                </div>

                <div data-reveal className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
                    {[
                        { value: '29', label: 'Сигналов контекста', icon: Brain },
                        { value: '17', label: 'Инструментов AI', icon: Zap },
                        { value: '150+', label: 'Языков поддержки', icon: Globe },
                        { value: '24/7', label: 'Без выходных', icon: Clock },
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
