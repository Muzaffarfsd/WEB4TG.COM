import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useScrollReveal } from '../../hooks/use-animations';
import {
    Bot, CheckCircle, TrendingUp,
    Brain, Sparkles, MessageSquare, Clock, ArrowRight,
    Zap, Eye, Shield, Globe, Mic, Volume2,
    Target, Gauge, Activity, ArrowUpRight,
    ShoppingBag, UtensilsCrossed, Scissors, Dumbbell,
    Package, Search, Users, Heart, Star,
    FileText, BarChart3, Send, Phone
} from 'lucide-react';

interface ChatMessage {
    id: number;
    sender: 'user' | 'agent';
    text: string;
    isVoice?: boolean;
}

interface NicheScenario {
    id: string;
    icon: typeof Bot;
    name: string;
    shortName: string;
    agentName: string;
    agentRole: string;
    color: string;
    gradient: string;
    stages: StageData[];
    resultMetric: { label: string; value: string };
}

interface StageData {
    title: string;
    subtitle: string;
    messages: ChatMessage[];
    insights: InsightData[];
    technique: string;
    techniqueDesc: string;
    propensity: number;
    sidePanelType: string;
}

interface InsightData {
    icon: typeof Bot;
    label: string;
    value: string;
    color: string;
}

const VOICE_BAR_HEIGHTS = Array.from({ length: 28 }, (_, i) =>
    6 + Math.sin(i * 0.7) * 8 + (Math.sin(i * 2.1) * 4 + 4)
);

const niches: NicheScenario[] = [
    {
        id: 'shop',
        icon: ShoppingBag,
        name: 'Интернет-магазин',
        shortName: 'Магазин',
        agentName: 'Лина',
        agentRole: 'Sales AI',
        color: '#8B5CF6',
        gradient: 'from-[#8B5CF6] to-[#6D28D9]',
        resultMetric: { label: 'Конверсия в покупку', value: '96.8%' },
        stages: [
            {
                title: "Квалификация клиента",
                subtitle: "Анализ намерения за 0.3 сек",
                propensity: 62,
                messages: [
                    { id: 1, sender: 'user', text: 'Привет! Ищу кроссовки для бега, бюджет до 15 тысяч' },
                    { id: 2, sender: 'agent', text: 'Смотрите, у нас как раз есть топовые модели для бега в этом диапазоне) По какому покрытию бегаете — асфальт или трейл? Это сильно влияет на выбор подошвы' },
                ],
                insights: [
                    { icon: Brain, label: 'Модель', value: 'Gemini Flash • 0.3с', color: '#3b82f6' },
                    { icon: Target, label: 'Намерение', value: 'Покупка • 94%', color: '#22c55e' },
                    { icon: Activity, label: 'Настроение', value: 'Нейтральное', color: '#f59e0b' },
                    { icon: Globe, label: 'Язык / тон', value: 'RU • Тёплый', color: '#8B5CF6' },
                ],
                technique: 'SPIN: Situation',
                techniqueDesc: 'Агент не спрашивает «чем помочь?» — сразу даёт ценность и уточняет потребность вопросом о покрытии. Классический S-вопрос в SPIN Selling',
                sidePanelType: 'shop_context',
            },
            {
                title: "AI-подбор товара",
                subtitle: "47 товаров → 3 рекомендации",
                propensity: 78,
                messages: [
                    { id: 3, sender: 'user', text: 'Асфальт, бегаю 3-4 раза в неделю' },
                    { id: 4, sender: 'agent', text: 'Для вашего объёма тренировок нужна хорошая амортизация. Подобрала 3 варианта:\n\n1. Nike Pegasus 41 — 12 990₽ ⭐\n   Рейтинг 4.8, идеально для 3-4 раз/нед\n\n2. Asics Gel-Nimbus — 14 500₽\n\n3. New Balance 1080 — 13 900₽\n\n87% клиентов с вашим профилем выбирают Pegasus. Показать подробнее?' },
                ],
                insights: [
                    { icon: Search, label: 'Поиск', value: '47 → 3 модели', color: '#8B5CF6' },
                    { icon: Package, label: 'Наличие', value: 'Все в наличии', color: '#22c55e' },
                    { icon: TrendingUp, label: 'Конверсия', value: '+34% с AI', color: '#f59e0b' },
                    { icon: Star, label: 'Рейтинг ТОП', value: '4.8 ★', color: '#f59e0b' },
                ],
                technique: 'Якорь + соц. доказательство',
                techniqueDesc: 'Лучший вариант первый (якорь). «87% клиентов выбирают» — Чалдини #3, социальное доказательство. 3 варианта — устраняют паралич выбора',
                sidePanelType: 'shop_catalog',
            },
            {
                title: "Cross-sell + чекаут",
                subtitle: "Средний чек +18%, оплата в 1 клик",
                propensity: 94,
                messages: [
                    { id: 5, sender: 'user', text: 'Да, давайте Pegasus, размер 43' },
                    { id: 6, sender: 'agent', text: 'Размер 43 в наличии, 4 пары на складе) Добавила в корзину.\n\nК Pegasus отлично подходят носки Stance Run (590₽) — 87% покупателей берут вместе. Добавить?\n\n🧾 Nike Pegasus 41 — 12 990₽\n💳 Apple Pay / Карта / СБП' },
                ],
                insights: [
                    { icon: Package, label: 'Корзина', value: '12 990₽', color: '#8B5CF6' },
                    { icon: Zap, label: 'Cross-sell', value: '+590₽ носки', color: '#f59e0b' },
                    { icon: Shield, label: 'Оплата', value: '6 способов', color: '#22c55e' },
                    { icon: TrendingUp, label: 'Средний чек', value: '+18%', color: '#22c55e' },
                ],
                technique: 'Cross-sell + бесшовный чекаут',
                techniqueDesc: 'Допродажа на основе паттернов покупок. Оплата прямо в чате — конверсия 96.8% vs 34% через сайт. Чекаут в 1 клик без перехода',
                sidePanelType: 'shop_checkout',
            },
        ],
    },
    {
        id: 'restaurant',
        icon: UtensilsCrossed,
        name: 'Ресторан',
        shortName: 'Ресторан',
        agentName: 'Марк',
        agentRole: 'Консьерж',
        color: '#f59e0b',
        gradient: 'from-[#f59e0b] to-[#d97706]',
        resultMetric: { label: 'Средний чек', value: '+27%' },
        stages: [
            {
                title: "Умное меню",
                subtitle: "Персональные рекомендации",
                propensity: 71,
                messages: [
                    { id: 1, sender: 'user', text: 'Хочу заказать ужин на двоих с доставкой' },
                    { id: 2, sender: 'agent', text: 'Отличный план на вечер) Шеф сегодня рекомендует сет «Романтический» — 2 стейка рибай, салат Цезарь, тирамису и бутылка вина.\n\n4 890₽ вместо 6 200₽ при заказе по отдельности.\n\nИли собрать что-то своё? Скину меню)' },
                ],
                insights: [
                    { icon: Brain, label: 'Модель', value: 'Gemini Flash • 0.3с', color: '#3b82f6' },
                    { icon: Target, label: 'Намерение', value: 'Заказ еды • 98%', color: '#22c55e' },
                    { icon: Heart, label: 'Контекст', value: 'Ужин на двоих', color: '#ef4444' },
                    { icon: Globe, label: 'Паттерн', value: 'Романтика', color: '#f59e0b' },
                ],
                technique: 'Якорь + Value First',
                techniqueDesc: 'Агент предлагает выгодный сет — экономия 21% (6 200 → 4 890₽). Бесплатная ценность вперёд — принцип взаимности Чалдини #1',
                sidePanelType: 'rest_menu',
            },
            {
                title: "Адаптация заказа",
                subtitle: "Мгновенная гибкость",
                propensity: 88,
                messages: [
                    { id: 3, sender: 'user', text: 'Давайте романтический сет! Но без вина, лучше лимонад' },
                    { id: 4, sender: 'agent', text: 'Готово) Заменил вино на домашний лимонад (бесплатно для сета).\n\n🧾 Сет «Романтический»:\n• 2× Стейк рибай\n• Салат Цезарь\n• Тирамису\n• Домашний лимонад 1л\nИтого: 4 290₽\n\nКуда доставить? Оплата картой или при получении' },
                ],
                insights: [
                    { icon: Package, label: 'Заказ', value: '4 290₽', color: '#f59e0b' },
                    { icon: Clock, label: 'Доставка', value: '~45 мин', color: '#3b82f6' },
                    { icon: Shield, label: 'Оплата', value: 'Карта / Нал', color: '#22c55e' },
                    { icon: Zap, label: 'Адаптация', value: '< 1 сек', color: '#f59e0b' },
                ],
                technique: 'Гибкость + тихое закрытие',
                techniqueDesc: '«Бесплатно для сета» — наращивание ценности. Тихое закрытие: сразу спрашивает адрес, подразумевая согласие. Агент НЕ спорит — мгновенно адаптирует',
                sidePanelType: 'rest_order',
            },
            {
                title: "Трекинг + лояльность",
                subtitle: "Пост-продажная автоматизация",
                propensity: 97,
                messages: [
                    { id: 5, sender: 'user', text: 'Пушкина 15, кв 42. Картой оплачу' },
                    { id: 6, sender: 'agent', text: '✅ Заказ #R-7291 оформлен!\n\n🚚 Курьер Дмитрий — 18:45–19:15\n📍 Трекинг в реальном времени прямо здесь\n\nС этого заказа у вас 430 бонусов — хватит на бесплатный десерт в следующий раз)' },
                ],
                insights: [
                    { icon: CheckCircle, label: 'Статус', value: 'Оформлен', color: '#22c55e' },
                    { icon: Users, label: 'Курьер', value: 'Дмитрий • 4.9★', color: '#3b82f6' },
                    { icon: Heart, label: 'Бонусы', value: '+430 баллов', color: '#ef4444' },
                    { icon: Activity, label: 'Ретеншн', value: 'Push 5 дней', color: '#f59e0b' },
                ],
                technique: 'Программа лояльности',
                techniqueDesc: 'Автоматические бонусы формируют привычку повторных заказов. Push-напоминание через 5 дней — retention-стратегия увеличивает LTV на 3.2x',
                sidePanelType: 'rest_tracking',
            },
        ],
    },
    {
        id: 'beauty',
        icon: Scissors,
        name: 'Салон красоты',
        shortName: 'Салон',
        agentName: 'Софи',
        agentRole: 'Администратор',
        color: '#ec4899',
        gradient: 'from-[#ec4899] to-[#be185d]',
        resultMetric: { label: 'Записи без менеджера', value: '89%' },
        stages: [
            {
                title: "Подбор мастера",
                subtitle: "Альтернативное закрытие",
                propensity: 68,
                messages: [
                    { id: 1, sender: 'user', text: 'Хочу записаться на окрашивание волос' },
                    { id: 2, sender: 'agent', text: 'У нас как раз сейчас два топовых колориста свободны)\n\nАнна — блонд и сложные техники (балаяж, airtouch). ⭐ 4.9\n\nМария — натуральные оттенки, тонирование. ⭐ 4.8\n\nКакой результат хотите — кардинальную смену или освежить цвет?' },
                ],
                insights: [
                    { icon: Brain, label: 'Модель', value: 'Gemini Flash • 0.3с', color: '#3b82f6' },
                    { icon: Target, label: 'Услуга', value: 'Окрашивание', color: '#ec4899' },
                    { icon: Users, label: 'Мастера', value: '2 свободны', color: '#22c55e' },
                    { icon: Star, label: 'Рейтинг', value: '4.9 ★ топ', color: '#f59e0b' },
                ],
                technique: 'Альтернативное закрытие',
                techniqueDesc: 'Клиент выбирает не «записаться или нет», а «к Анне или Марии». Техника альтернативного закрытия переводит из раздумий в действие',
                sidePanelType: 'beauty_masters',
            },
            {
                title: "Бронирование слотов",
                subtitle: "Дефицит + Value Stacking",
                propensity: 85,
                messages: [
                    { id: 3, sender: 'user', text: 'Хочу балаяж, к Анне' },
                    { id: 4, sender: 'agent', text: 'У Анны свободно:\n\n📅 Ср, 18 дек — 14:00\n📅 Пт, 20 дек — 11:00, 16:00\n📅 Сб, 21 дек — 10:00\n\nБалаяж: 8 500₽ (3-4 часа)\nВключено: консультация + уход Olaplex\n\nКакое время удобнее?' },
                ],
                insights: [
                    { icon: Clock, label: 'Слоты', value: '4 свободных', color: '#f59e0b' },
                    { icon: Package, label: 'Услуга', value: '8 500₽ • 3-4ч', color: '#ec4899' },
                    { icon: Sparkles, label: 'Включено', value: 'Olaplex уход', color: '#8B5CF6' },
                    { icon: Shield, label: 'Гарантия', value: '14 дней', color: '#22c55e' },
                ],
                technique: 'Дефицит + Value Stacking',
                techniqueDesc: '4 слота создают дефицит (Чалдини #5). «Включено: Olaplex» — value stacking без доп. стоимости. Гарантия снимает последний барьер',
                sidePanelType: 'beauty_slots',
            },
            {
                title: "Голосовое + допродажа",
                subtitle: "ElevenLabs v3 TTS",
                propensity: 94,
                messages: [
                    { id: 5, sender: 'user', text: 'Пятница в 16:00 идеально' },
                    { id: 6, sender: 'agent', text: '✅ Записала!\n\n📅 Пт, 20 декабря, 16:00\n👩‍🎨 Мастер: Анна\n💇 Балаяж + Olaplex\n💰 8 500₽\n\nНапомню за день и за 2 часа. С балаяжем часто делают стрижку горячими ножницами (1 200₽). Добавить?' },
                    { id: 7, sender: 'agent', text: '🎤 Голосовое — 0:08', isVoice: true },
                ],
                insights: [
                    { icon: CheckCircle, label: 'Запись', value: 'Подтверждена', color: '#22c55e' },
                    { icon: Mic, label: 'Голос', value: 'greeting', color: '#ec4899' },
                    { icon: Zap, label: 'Cross-sell', value: '+1 200₽', color: '#f59e0b' },
                    { icon: TrendingUp, label: 'Чек ↑', value: '+14%', color: '#22c55e' },
                ],
                technique: 'Cross-sell + голосовое',
                techniqueDesc: 'Допродажа сопутствующей услуги +14% к чеку. Голосовое в greeting-профиле — ощущение личного контакта, конверсия +23%',
                sidePanelType: 'beauty_voice',
            },
        ],
    },
    {
        id: 'fitness',
        icon: Dumbbell,
        name: 'Фитнес-клуб',
        shortName: 'Фитнес',
        agentName: 'Макс',
        agentRole: 'Консультант',
        color: '#22c55e',
        gradient: 'from-[#22c55e] to-[#16a34a]',
        resultMetric: { label: 'Конверсия триал→абонемент', value: '73%' },
        stages: [
            {
                title: "Квалификация цели",
                subtitle: "SPIN: Need-Payoff",
                propensity: 45,
                messages: [
                    { id: 1, sender: 'user', text: 'Сколько стоит абонемент? Хочу начать тренироваться' },
                    { id: 2, sender: 'agent', text: 'Цена зависит от целей. Кому-то хватает зала, а кому-то нужен тренер и бассейн)\n\nВы хотите сбросить вес, набрать массу или просто быть в форме? От этого зависит какой формат подойдёт лучше всего' },
                ],
                insights: [
                    { icon: Brain, label: 'Модель', value: 'Gemini Pro • 0.45с', color: '#ef4444' },
                    { icon: Target, label: 'Намерение', value: 'Покупка абон.', color: '#22c55e' },
                    { icon: Activity, label: 'Профиль', value: 'Новичок', color: '#f59e0b' },
                    { icon: Users, label: 'Сегмент', value: 'Снижение веса', color: '#3b82f6' },
                ],
                technique: 'SPIN: Need-Payoff',
                techniqueDesc: 'Вместо прайс-листа — квалификация цели. Need-Payoff вопрос позволяет рекомендовать оптимальный вариант и увеличить средний чек на 40%',
                sidePanelType: 'fitness_goals',
            },
            {
                title: "Триал-оффер",
                subtitle: "Снятие барьера входа",
                propensity: 72,
                messages: [
                    { id: 3, sender: 'user', text: 'Хочу похудеть, килограмм 10 сбросить' },
                    { id: 4, sender: 'agent', text: 'Для минус 10 кг лучший формат — зал + кардио + 4 вводных тренировки с тренером.\n\nСтандарт: 4 900₽/мес\nС тренером: 7 900₽/мес\n\nНо знаете что? Приходите на бесплатную пробную тренировку — тренер составит программу, и вы решите на месте. Без обязательств)\n\nКогда удобно — будни или выходные?' },
                ],
                insights: [
                    { icon: Package, label: 'Рекомендация', value: 'С тренером', color: '#22c55e' },
                    { icon: TrendingUp, label: 'Средний чек', value: '+61%', color: '#f59e0b' },
                    { icon: Shield, label: 'Триал', value: 'Бесплатно', color: '#3b82f6' },
                    { icon: Zap, label: 'Конверсия', value: '73% → абон.', color: '#22c55e' },
                ],
                technique: 'Снятие риска + обязательство',
                techniqueDesc: '«Бесплатная тренировка» снимает барьер. По Чалдини #2 (обязательство) — после визита конверсия 73%. Вопрос «когда» предполагает согласие',
                sidePanelType: 'fitness_offer',
            },
            {
                title: "Запись + стимул",
                subtitle: "Дефицит + автоматизация",
                propensity: 88,
                messages: [
                    { id: 5, sender: 'user', text: 'Можно в субботу утром?' },
                    { id: 6, sender: 'agent', text: '✅ Записал!\n\n📅 Сб, 21 дек, 10:00\n🏋️ Тренер: Алексей (стаж 8 лет, снижение веса)\n📍 ул. Тверская, 25\n\nВозьмите кроссовки и полотенце. Напомню за день)\n\nЕсли после триала возьмёте абонемент — в декабре скидка 20% на первый месяц с тренером' },
                ],
                insights: [
                    { icon: CheckCircle, label: 'Триал', value: 'Записан', color: '#22c55e' },
                    { icon: Users, label: 'Тренер', value: 'Алексей • 4.9★', color: '#3b82f6' },
                    { icon: Zap, label: 'Стимул', value: '-20% декабрь', color: '#f59e0b' },
                    { icon: Activity, label: 'Явка', value: '92% с push', color: '#22c55e' },
                ],
                technique: 'Дефицит + следующий шаг',
                techniqueDesc: 'Скидка с дедлайном (декабрь) — дефицит. Тренер назначен, инструкции даны — клиент чувствует процесс запущен. Push — 92% явки',
                sidePanelType: 'fitness_booked',
            },
        ],
    },
];

const TypingIndicator = () => (
    <div className="flex items-center gap-1 px-4 py-3">
        <div className="flex gap-1">
            {[0, 1, 2].map(i => (
                <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]/60"
                    style={{ animation: `typingBounce 1.4s ease-in-out ${i * 0.2}s infinite` }}
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
            {VOICE_BAR_HEIGHTS.map((h, i) => (
                <div
                    key={i}
                    className="w-[2.5px] rounded-full bg-[#8B5CF6]/50"
                    style={{
                        height: `${h}px`,
                        animation: `typingBounce 2s ease-in-out ${i * 0.08}s infinite`,
                    }}
                />
            ))}
        </div>
        <span className="text-[10px] text-white/40 flex-shrink-0">0:08</span>
    </div>
);

const PropensityGauge = ({ value, color, prevValue }: { value: number; color: string; prevValue?: number }) => (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.3s both' }}>
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
                <Gauge className="w-3 h-3" style={{ color }} />
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Propensity Score</span>
            </div>
            <div className="flex items-center gap-1">
                {prevValue && (
                    <>
                        <span className="text-[11px] text-white/25">{prevValue}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-white/20" />
                    </>
                )}
                <span className="text-[14px] font-semibold" style={{ color }}>{value}</span>
            </div>
        </div>
        <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                    width: `${value}%`,
                    background: `linear-gradient(90deg, ${color}66, ${color})`,
                    animation: 'propensityFill 0.8s ease-out 0.5s both',
                    boxShadow: `0 0 12px ${color}40`,
                }}
            />
        </div>
        <div className="flex justify-between mt-1">
            <span className="text-[8px] text-white/20">0</span>
            <span className="text-[8px] text-white/20">100</span>
        </div>
    </div>
);

const SidePanelContent = ({ type, niche, stage }: { type: string; niche: NicheScenario; stage: StageData }) => {
    const prevPropensity = useMemo(() => {
        const idx = niche.stages.indexOf(stage);
        return idx > 0 ? niche.stages[idx - 1].propensity : undefined;
    }, [niche, stage]);

    switch (type) {
        case 'shop_context':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-3">Контекст-билдер • 29 сигналов</div>
                    {[
                        { label: 'Определение языка', value: 'RU', time: '12ms' },
                        { label: 'Детекция намерения', value: 'Покупка', time: '45ms' },
                        { label: 'Категория товара', value: 'Кроссовки / бег', time: '89ms' },
                        { label: 'Зеркало стиля', value: 'Разговорный', time: '120ms' },
                        { label: 'Роутинг модели', value: 'Flash → 0.3с', time: '156ms' },
                        { label: 'Загрузка каталога', value: '47 товаров', time: '200ms' },
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-2" style={{ animation: `fadeSlideIn 0.35s ease-out ${i * 0.1}s both` }}>
                            <div className="w-5 h-5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-2.5 h-2.5 text-[#22c55e]" />
                            </div>
                            <span className="text-[11px] text-white/60 flex-1">{step.label}</span>
                            <span className="text-[9px] text-white/20 font-mono">{step.time}</span>
                            <span className="text-[10px] text-[#8B5CF6] font-medium">{step.value}</span>
                        </div>
                    ))}
                    <div className="mt-3 p-2.5 rounded-lg bg-[#8B5CF6]/5 border border-[#8B5CF6]/10" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.6s both' }}>
                        <div className="text-[10px] text-white/50 font-mono leading-relaxed">
                            <span className="text-white/25">{'{'}</span> intent: <span className="text-[#22c55e]">"purchase"</span>, category: <span className="text-[#8B5CF6]">"running_shoes"</span>, budget: <span className="text-[#f59e0b]">15000</span>, tone: <span className="text-[#ec4899]">"warm"</span> <span className="text-white/25">{'}'}</span>
                        </div>
                    </div>
                    <PropensityGauge value={stage.propensity} color={niche.color} prevValue={prevPropensity} />
                </div>
            );
        case 'shop_catalog':
            return (
                <div className="space-y-2.5">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-3">AI-ранжирование каталога</div>
                    {[
                        { name: 'Nike Pegasus 41', price: '12 990₽', match: 97, stock: 4, best: true },
                        { name: 'Asics Gel-Nimbus', price: '14 500₽', match: 89, stock: 2, best: false },
                        { name: 'New Balance 1080', price: '13 900₽', match: 85, stock: 6, best: false },
                    ].map((item, i) => (
                        <div key={i} className={`p-3 rounded-xl border transition-all ${item.best ? 'bg-[#8B5CF6]/8 border-[#8B5CF6]/20 shadow-lg shadow-[#8B5CF6]/5' : 'bg-white/[0.02] border-white/[0.05]'}`} style={{ animation: `fadeSlideIn 0.35s ease-out ${i * 0.1}s both` }}>
                            <div className="flex justify-between items-center mb-1.5">
                                <div className="flex items-center gap-1.5">
                                    {item.best && <Star className="w-3 h-3 text-[#f59e0b]" />}
                                    <span className="text-[12px] text-white/90 font-medium">{item.name}</span>
                                </div>
                                <span className="text-[11px] font-semibold" style={{ color: niche.color }}>{item.price}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-white/30">Склад: {item.stock} шт</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-1.5 w-14 rounded-full bg-white/[0.05] overflow-hidden">
                                        <div className="h-full rounded-full bg-[#22c55e]" style={{ width: `${item.match}%`, animation: `barGrow 0.6s ease-out ${0.3 + i * 0.1}s both` }} />
                                    </div>
                                    <span className="text-[10px] text-[#22c55e] font-medium">{item.match}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.4s both' }}>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Eye className="w-3 h-3 text-[#f59e0b]" />
                            <span className="text-[10px] text-white/50 font-medium">Чалдини #3: Социальное доказательство</span>
                        </div>
                        <div className="text-[9px] text-white/30">«87% клиентов выбирают» → конверсия +34%</div>
                    </div>
                    <PropensityGauge value={stage.propensity} color={niche.color} prevValue={prevPropensity} />
                </div>
            );
        case 'shop_checkout':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-3">Бесшовный чекаут в чате</div>
                    <div className="grid grid-cols-3 gap-1.5">
                        {['Apple Pay', 'Карта', 'СБП', 'Google Pay', 'ЮKassa', 'Crypto'].map((m, i) => (
                            <div key={i} className={`p-2 rounded-lg border text-center text-[9px] font-medium ${i === 0 ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/25 text-[#8B5CF6]' : 'bg-white/[0.02] border-white/[0.06] text-white/40'}`} style={{ animation: `fadeSlideIn 0.25s ease-out ${i * 0.05}s both` }}>
                                {m}
                            </div>
                        ))}
                    </div>
                    <div className="p-3 rounded-xl bg-[#22c55e]/5 border border-[#22c55e]/15" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.35s both' }}>
                        <div className="flex items-center gap-2 mb-2.5">
                            <Shield className="w-3.5 h-3.5 text-[#22c55e]" />
                            <span className="text-[11px] text-white/70 font-medium">Конверсия в оплату</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-center flex-1">
                                <div className="text-[22px] font-bold text-[#22c55e] leading-none">96.8%</div>
                                <div className="text-[9px] text-[#22c55e]/50 mt-1">В чате</div>
                            </div>
                            <div className="w-px h-8 bg-white/[0.06]" />
                            <div className="text-center flex-1">
                                <div className="text-[22px] font-bold text-white/15 leading-none">34%</div>
                                <div className="text-[9px] text-white/20 mt-1">Обычный сайт</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#f59e0b]/5 border border-[#f59e0b]/15" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.45s both' }}>
                        <div className="flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-[#f59e0b]" />
                            <span className="text-[10px] text-[#f59e0b]">Cross-sell: средний чек +18%</span>
                        </div>
                    </div>
                    <PropensityGauge value={stage.propensity} color={niche.color} prevValue={prevPropensity} />
                </div>
            );
        case 'rest_menu':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-3">Умное меню • персонализация</div>
                    <div className="p-3 rounded-xl bg-[#f59e0b]/5 border border-[#f59e0b]/15" style={{ animation: 'fadeSlideIn 0.3s ease-out both' }}>
                        <div className="flex items-center gap-2 mb-2">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-[#f59e0b]" />
                            <span className="text-[11px] text-white/70 font-medium">Сет «Романтический»</span>
                        </div>
                        {['2× Стейк рибай', 'Салат Цезарь', 'Тирамису', 'Бутылка вина'].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 mb-1" style={{ animation: `fadeSlideIn 0.25s ease-out ${0.1 + i * 0.06}s both` }}>
                                <div className="w-1 h-1 rounded-full bg-[#f59e0b]/40" />
                                <span className="text-[10px] text-white/50">{item}</span>
                            </div>
                        ))}
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.05]">
                            <span className="text-[11px] text-white/25 line-through">6 200₽</span>
                            <span className="text-[13px] text-[#f59e0b] font-bold">4 890₽</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#22c55e]/10 text-[#22c55e]">-21%</span>
                        </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.4s both' }}>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Eye className="w-3 h-3 text-[#f59e0b]" />
                            <span className="text-[10px] text-white/50 font-medium">Чалдини #1: Взаимность</span>
                        </div>
                        <div className="text-[9px] text-white/30">Выгодный сет = ценность вперёд → обязательство ответить</div>
                    </div>
                    <PropensityGauge value={stage.propensity} color={niche.color} prevValue={prevPropensity} />
                </div>
            );
        case 'rest_order':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-3">Function calling • живой</div>
                    {[
                        { name: 'parse_order_changes', status: 'done', result: 'Убрать вино' },
                        { name: 'search_alternatives', status: 'done', result: 'Лимонад найден' },
                        { name: 'recalculate_price', status: 'done', result: '4 290₽' },
                        { name: 'check_delivery_zone', status: 'done', result: 'В зоне' },
                        { name: 'save_order_draft', status: 'done', result: 'Сохранён' },
                        { name: 'init_payment', status: 'pending', result: 'Ожидание...' },
                    ].map((tool, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]" style={{ animation: `fadeSlideIn 0.25s ease-out ${i * 0.07}s both` }}>
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tool.status === 'done' ? 'bg-[#22c55e]' : 'bg-[#f59e0b] animate-pulse'}`} />
                            <span className="text-[10px] text-white/40 font-mono flex-1">{tool.name}</span>
                            <span className={`text-[9px] ${tool.status === 'done' ? 'text-[#22c55e]/60' : 'text-[#f59e0b]/60'}`}>{tool.result}</span>
                        </div>
                    ))}
                    <PropensityGauge value={stage.propensity} color={niche.color} prevValue={prevPropensity} />
                </div>
            );
        case 'rest_tracking':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-3">Пост-продажная автоматизация</div>
                    <div className="p-3 rounded-xl bg-[#22c55e]/5 border border-[#22c55e]/15 text-center" style={{ animation: 'fadeSlideIn 0.3s ease-out both' }}>
                        <CheckCircle className="w-7 h-7 text-[#22c55e] mx-auto mb-1.5" />
                        <div className="text-[13px] text-white/90 font-medium">Заказ оформлен</div>
                        <div className="text-[10px] text-white/40">Без участия менеджера</div>
                    </div>
                    {[
                        { label: 'Трекинг в реальном времени', icon: Target, color: '#3b82f6' },
                        { label: 'Push-напоминание о бонусах', icon: MessageSquare, color: '#f59e0b' },
                        { label: 'Программа лояльности', icon: Heart, color: '#ef4444' },
                        { label: 'Реактивация через 5 дней', icon: Activity, color: '#8B5CF6' },
                        { label: 'Сбор отзывов + NPS', icon: Star, color: '#f59e0b' },
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]" style={{ animation: `fadeSlideIn 0.25s ease-out ${0.12 + i * 0.06}s both` }}>
                            <s.icon className="w-3 h-3 flex-shrink-0" style={{ color: s.color }} />
                            <span className="text-[10px] text-white/50">{s.label}</span>
                        </div>
                    ))}
                    <PropensityGauge value={stage.propensity} color={niche.color} prevValue={prevPropensity} />
                </div>
            );
        case 'beauty_masters':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-3">Подбор мастера • AI</div>
                    {[
                        { name: 'Анна', spec: 'Блонд, балаяж, airtouch', rating: 4.9, free: 4, best: true },
                        { name: 'Мария', spec: 'Натуральные оттенки, тонирование', rating: 4.8, free: 6, best: false },
                    ].map((m, i) => (
                        <div key={i} className={`p-3 rounded-xl border ${m.best ? 'bg-[#ec4899]/5 border-[#ec4899]/15' : 'bg-white/[0.02] border-white/[0.05]'}`} style={{ animation: `fadeSlideIn 0.35s ease-out ${i * 0.12}s both` }}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white ${m.best ? 'bg-gradient-to-br from-[#ec4899] to-[#be185d]' : 'bg-white/[0.08]'}`}>
                                        {m.name[0]}
                                    </div>
                                    <span className="text-[12px] text-white/90 font-medium">{m.name}</span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <Star className="w-3 h-3 text-[#f59e0b]" />
                                    <span className="text-[11px] text-[#f59e0b] font-medium">{m.rating}</span>
                                </div>
                            </div>
                            <div className="text-[10px] text-white/40 mb-1">{m.spec}</div>
                            <div className="text-[9px] text-[#22c55e]">{m.free} свободных слотов</div>
                        </div>
                    ))}
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.3s both' }}>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Eye className="w-3 h-3 text-[#ec4899]" />
                            <span className="text-[10px] text-white/50 font-medium">Альтернативное закрытие</span>
                        </div>
                        <div className="text-[9px] text-white/30">Клиент выбирает не «записаться или нет», а «к кому» → конверсия +41%</div>
                    </div>
                    <PropensityGauge value={stage.propensity} color={niche.color} prevValue={prevPropensity} />
                </div>
            );
        case 'beauty_slots':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-3">Расписание мастера</div>
                    <div className="space-y-1.5">
                        {[
                            { day: 'Ср, 18 дек', slots: ['14:00'], free: 1 },
                            { day: 'Пт, 20 дек', slots: ['11:00', '16:00'], free: 2 },
                            { day: 'Сб, 21 дек', slots: ['10:00'], free: 1 },
                        ].map((d, i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]" style={{ animation: `fadeSlideIn 0.3s ease-out ${i * 0.1}s both` }}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[11px] text-white/70 font-medium">{d.day}</span>
                                    <span className="text-[9px] text-white/25">{d.free} слот{d.free > 1 ? 'а' : ''}</span>
                                </div>
                                <div className="flex gap-1">
                                    {d.slots.map((s, j) => (
                                        <span key={j} className="text-[10px] px-2 py-0.5 rounded bg-[#ec4899]/10 text-[#ec4899] border border-[#ec4899]/15">{s}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#8B5CF6]/5 border border-[#8B5CF6]/10" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.35s both' }}>
                        <div className="text-[10px] text-[#8B5CF6] font-medium mb-0.5">Value Stacking</div>
                        <div className="text-[9px] text-white/30">Консультация + Olaplex включены → ценность без доп. стоимости</div>
                    </div>
                    <PropensityGauge value={stage.propensity} color={niche.color} prevValue={prevPropensity} />
                </div>
            );
        case 'beauty_voice':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-3">ElevenLabs v3 • голос</div>
                    <div className="p-3 rounded-xl bg-[#ec4899]/5 border border-[#ec4899]/15" style={{ animation: 'fadeSlideIn 0.3s ease-out both' }}>
                        <div className="flex items-center gap-2 mb-2.5">
                            <div className="relative">
                                <Volume2 className="w-4 h-4 text-[#ec4899]" />
                                <div className="absolute -inset-1 rounded-full border border-[#ec4899]/30" style={{ animation: 'pulseRing 2s ease-out infinite' }} />
                            </div>
                            <span className="text-[12px] text-white/80 font-medium">ElevenLabs v3 TTS</span>
                        </div>
                        {[
                            { label: 'Триггер', value: 'Бронирование подтв.', color: '#ef4444' },
                            { label: 'Профиль', value: 'greeting', color: '#ec4899' },
                            { label: 'Режим', value: 'full (<500 симв)', color: '#f59e0b' },
                            { label: 'Задержка', value: '< 1 сек', color: '#22c55e' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between mb-1.5" style={{ animation: `fadeSlideIn 0.25s ease-out ${0.1 + i * 0.08}s both` }}>
                                <span className="text-[10px] text-white/35">{item.label}</span>
                                <span className="text-[10px] font-medium" style={{ color: item.color }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.4s both' }}>
                        <div className="text-[10px] text-white/40 mb-1.5">7 голосовых профилей</div>
                        <div className="flex flex-wrap gap-1">
                            {['greeting', 'empathy', 'factual', 'excited', 'whisper', 'playful', 'default'].map((p, i) => (
                                <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded ${p === 'greeting' ? 'bg-[#ec4899]/15 text-[#ec4899] border border-[#ec4899]/20' : 'bg-white/[0.03] text-white/25'}`}>{p}</span>
                            ))}
                        </div>
                    </div>
                    <PropensityGauge value={stage.propensity} color={niche.color} prevValue={prevPropensity} />
                </div>
            );
        case 'fitness_goals':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-3">Квалификация цели клиента</div>
                    {[
                        { goal: 'Снижение веса', match: 95, icon: TrendingUp, active: true },
                        { goal: 'Набор массы', match: 20, icon: Dumbbell, active: false },
                        { goal: 'Поддержание формы', match: 15, icon: Activity, active: false },
                    ].map((g, i) => (
                        <div key={i} className={`p-2.5 rounded-lg border ${g.active ? 'bg-[#22c55e]/5 border-[#22c55e]/15' : 'bg-white/[0.01] border-white/[0.04]'}`} style={{ animation: `fadeSlideIn 0.3s ease-out ${i * 0.1}s both` }}>
                            <div className="flex items-center gap-2 mb-1">
                                <g.icon className={`w-3 h-3 ${g.active ? 'text-[#22c55e]' : 'text-white/20'}`} />
                                <span className={`text-[11px] font-medium ${g.active ? 'text-white/80' : 'text-white/30'}`}>{g.goal}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                                <div className={`h-full rounded-full ${g.active ? 'bg-[#22c55e]' : 'bg-white/10'}`} style={{ width: `${g.match}%`, animation: `barGrow 0.5s ease-out ${0.2 + i * 0.1}s both` }} />
                            </div>
                        </div>
                    ))}
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.35s both' }}>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Eye className="w-3 h-3 text-[#22c55e]" />
                            <span className="text-[10px] text-white/50 font-medium">SPIN: Need-Payoff</span>
                        </div>
                        <div className="text-[9px] text-white/30">Квалификация цели → оптимальный вариант → средний чек +40%</div>
                    </div>
                    <PropensityGauge value={stage.propensity} color={niche.color} prevValue={prevPropensity} />
                </div>
            );
        case 'fitness_offer':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-3">Сравнение тарифов</div>
                    {[
                        { name: 'Стандарт', price: '4 900₽/мес', features: ['Зал', 'Кардио-зона'], recommended: false },
                        { name: 'С тренером', price: '7 900₽/мес', features: ['Зал', 'Кардио', '4 тренировки', 'Программа'], recommended: true },
                    ].map((plan, i) => (
                        <div key={i} className={`p-3 rounded-xl border ${plan.recommended ? 'bg-[#22c55e]/5 border-[#22c55e]/15 shadow-lg shadow-[#22c55e]/5' : 'bg-white/[0.02] border-white/[0.05]'}`} style={{ animation: `fadeSlideIn 0.3s ease-out ${i * 0.12}s both` }}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[12px] text-white/80 font-medium">{plan.name}</span>
                                <span className={`text-[12px] font-bold ${plan.recommended ? 'text-[#22c55e]' : 'text-white/50'}`}>{plan.price}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {plan.features.map((f, j) => (
                                    <span key={j} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.03] text-white/35">{f}</span>
                                ))}
                            </div>
                            {plan.recommended && <div className="text-[9px] text-[#22c55e] mt-1.5">AI рекомендует для вашей цели</div>}
                        </div>
                    ))}
                    <div className="p-2.5 rounded-lg bg-[#3b82f6]/5 border border-[#3b82f6]/15" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.3s both' }}>
                        <div className="flex items-center gap-1.5">
                            <Shield className="w-3 h-3 text-[#3b82f6]" />
                            <span className="text-[10px] text-[#3b82f6]">Бесплатный триал снимает риск → конверсия 73%</span>
                        </div>
                    </div>
                    <PropensityGauge value={stage.propensity} color={niche.color} prevValue={prevPropensity} />
                </div>
            );
        case 'fitness_booked':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-3">Автоматизация записи</div>
                    <div className="p-3 rounded-xl bg-[#22c55e]/5 border border-[#22c55e]/15 text-center" style={{ animation: 'fadeSlideIn 0.3s ease-out both' }}>
                        <CheckCircle className="w-7 h-7 text-[#22c55e] mx-auto mb-1.5" />
                        <div className="text-[13px] text-white/90 font-medium">Триал записан</div>
                        <div className="text-[10px] text-white/40">Автоматически подобран тренер</div>
                    </div>
                    {[
                        { name: 'find_trainer', status: 'done', result: 'Алексей (4.9★)' },
                        { name: 'book_slot', status: 'done', result: 'Сб, 10:00' },
                        { name: 'send_confirmation', status: 'done', result: 'Отправлено' },
                        { name: 'schedule_reminder', status: 'done', result: 'За 24ч' },
                        { name: 'apply_december_promo', status: 'pending', result: '-20%' },
                    ].map((tool, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]" style={{ animation: `fadeSlideIn 0.25s ease-out ${0.1 + i * 0.06}s both` }}>
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tool.status === 'done' ? 'bg-[#22c55e]' : 'bg-[#f59e0b] animate-pulse'}`} />
                            <span className="text-[10px] text-white/40 font-mono flex-1">{tool.name}</span>
                            <span className={`text-[9px] ${tool.status === 'done' ? 'text-[#22c55e]/60' : 'text-[#f59e0b]/60'}`}>{tool.result}</span>
                        </div>
                    ))}
                    <PropensityGauge value={stage.propensity} color={niche.color} prevValue={prevPropensity} />
                </div>
            );
        default:
            return null;
    }
};

const AnimatedStat = ({ value, label, icon: Icon, delay }: { value: string; label: string; icon: typeof Bot; delay: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="glow-card rounded-xl p-4 sm:p-5 text-center group hover:border-[#8B5CF6]/20 transition-all duration-500">
            <Icon className="w-4 h-4 text-[#8B5CF6]/40 mx-auto mb-2 group-hover:text-[#8B5CF6]/70 transition-colors" />
            <div
                className="text-[clamp(1.3rem,2.5vw,1.6rem)] font-instrument-serif gradient-text font-normal"
                style={visible ? { animation: `countUp 0.5s ease-out ${delay}s both` } : { opacity: 0 }}
            >
                {value}
            </div>
            <div className="text-[10px] sm:text-[11px] text-white/40 mt-1 font-sans">{label}</div>
        </div>
    );
};

export const AiAgentSection = () => {
    const revealRef = useScrollReveal({ stagger: 0.06 });
    const [activeNiche, setActiveNiche] = useState(0);
    const [currentStage, setCurrentStage] = useState(0);
    const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [animKey, setAnimKey] = useState(0);
    const chatRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInViewRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prefersReducedMotion = useRef(false);

    const niche = niches[activeNiche];
    const stagesData = niche.stages;
    const allPreviousMessages = stagesData.slice(0, currentStage).flatMap(s => s.messages);
    const currentMessages = stagesData[currentStage]?.messages || [];

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
            ([entry]) => { isInViewRef.current = entry.isIntersecting; },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isPaused || !isInViewRef.current) return;
        clearTimer();
        setVisibleMessages([]);
        setAnimKey(prev => prev + 1);
        let msgIndex = 0;

        const showNext = () => {
            if (msgIndex >= currentMessages.length) {
                timerRef.current = setTimeout(() => {
                    if (currentStage < stagesData.length - 1) {
                        setCurrentStage(prev => prev + 1);
                    } else {
                        timerRef.current = setTimeout(() => {
                            const nextNiche = (activeNiche + 1) % niches.length;
                            setActiveNiche(nextNiche);
                            setCurrentStage(0);
                        }, 4000);
                    }
                }, 3500);
                return;
            }

            const msg = currentMessages[msgIndex];
            const reduced = prefersReducedMotion.current;
            if (msg.sender === 'agent') {
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
    }, [currentStage, activeNiche, isPaused, clearTimer, currentMessages, stagesData.length]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [visibleMessages, isTyping]);

    const handleNicheClick = (index: number) => {
        clearTimer();
        setActiveNiche(index);
        setCurrentStage(0);
        setIsPaused(false);
    };

    const handleStageClick = (index: number) => {
        clearTimer();
        setIsPaused(false);
        setCurrentStage(index);
    };

    const stage = stagesData[currentStage];

    const renderMessage = (msg: ChatMessage, animated: boolean, animIndex?: number) => (
        <div
            key={`${activeNiche}-${msg.id}`}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            style={animated ? { animation: `messageAppear 0.35s ease-out ${(animIndex || 0) * 0.05}s both` } : undefined}
        >
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed font-sans whitespace-pre-line ${msg.sender === 'user'
                ? 'text-white rounded-br-md'
                : 'bg-white/[0.06] text-white/80 rounded-bl-md'
                }`}
                style={msg.sender === 'user' ? { background: `linear-gradient(135deg, ${niche.color}, ${niche.color}cc)` } : undefined}
            >
                {msg.isVoice ? <VoiceMessage /> : msg.text}
            </div>
        </div>
    );

    return (
        <section ref={sectionRef} id="ai-agent" className="relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8 overflow-hidden" style={{ contain: 'layout style' }}>
            <div className="absolute w-[600px] h-[600px] rounded-full blur-[120px] top-[15%] right-[-10%] pointer-events-none transition-colors duration-1000" style={{ backgroundColor: `${niche.color}08` }} />
            <div className="absolute w-[400px] h-[400px] rounded-full bg-[#7C3AED]/[0.02] blur-[80px] bottom-[10%] left-[-5%] pointer-events-none" />

            <div ref={revealRef} className="max-w-7xl mx-auto relative">
                <div data-reveal className="text-center mb-10 sm:mb-14">
                    <span className="section-label justify-center">
                        <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
                        AI-Агент для вашего бизнеса
                        <span className="w-8 h-px bg-[#8B5CF6]/40 ml-3" />
                    </span>
                    <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Ваш продавец, который
                        <br />
                        <span className="italic gradient-text">никогда не спит</span>
                    </h2>
                    <p className="text-[clamp(0.875rem,1.5vw,1.05rem)] text-white/50 mt-4 sm:mt-5 font-sans font-light leading-relaxed max-w-2xl mx-auto">
                        Разрабатываем AI-агента <span className="text-white/70 font-normal">под ваш бизнес</span>. Он общается как живой эксперт, использует SPIN-продажи и 7 принципов Чалдини, отправляет голосовые и закрывает сделки — 24/7.
                    </p>
                </div>

                <div data-reveal className="flex gap-2 sm:gap-3 justify-center flex-wrap mb-8 sm:mb-10">
                    {niches.map((n, i) => (
                        <button
                            key={n.id}
                            onClick={() => handleNicheClick(i)}
                            aria-label={n.name}
                            className={`group flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-[12px] sm:text-[13px] font-sans font-medium transition-all duration-300 border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${i === activeNiche
                                ? 'border-opacity-30 text-white/90 shadow-lg'
                                : 'bg-white/[0.02] border-white/[0.06] text-white/35 hover:text-white/55 hover:border-white/[0.12] hover:bg-white/[0.03]'
                                }`}
                            style={i === activeNiche ? {
                                backgroundColor: `${n.color}15`,
                                borderColor: `${n.color}30`,
                                boxShadow: `0 4px 20px ${n.color}15`,
                            } : undefined}
                        >
                            <n.icon className="w-4 h-4 transition-colors" style={{ color: i === activeNiche ? n.color : undefined }} />
                            <span className="hidden sm:inline">{n.name}</span>
                            <span className="sm:hidden">{n.shortName}</span>
                        </button>
                    ))}
                </div>

                <div data-reveal className="flex gap-1.5 sm:gap-2 justify-center mb-8 sm:mb-10 flex-wrap">
                    {stagesData.map((s, i) => (
                        <button
                            key={`${activeNiche}-${i}`}
                            onClick={() => handleStageClick(i)}
                            aria-label={`Этап ${i + 1}: ${s.title}`}
                            aria-current={i === currentStage ? 'step' : undefined}
                            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-sans font-medium transition-all duration-300 border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050505] ${i === currentStage
                                ? 'text-white/80'
                                : i < currentStage
                                    ? 'bg-white/[0.02] border-white/[0.06] text-white/40'
                                    : 'bg-white/[0.01] border-white/[0.04] text-white/20 hover:text-white/40'
                                }`}
                            style={i === currentStage ? {
                                backgroundColor: `${niche.color}10`,
                                borderColor: `${niche.color}25`,
                            } : undefined}
                        >
                            <span className={`w-4.5 h-4.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[8px] font-bold transition-all ${i === currentStage ? 'text-white' : i < currentStage ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-white/[0.05] text-white/20'}`}
                                style={i === currentStage ? { backgroundColor: niche.color } : undefined}
                            >
                                {i < currentStage ? '✓' : i + 1}
                            </span>
                            <span className="hidden sm:inline">{s.title}</span>
                        </button>
                    ))}
                    <button
                        onClick={() => setIsPaused(prev => !prev)}
                        aria-label={isPaused ? 'Продолжить' : 'Пауза'}
                        className="ml-1 px-3 py-1.5 sm:py-2 rounded-full text-[11px] font-sans border bg-white/[0.02] border-white/[0.06] text-white/30 hover:text-white/50 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/50"
                    >
                        {isPaused ? '▶' : '⏸'}
                    </button>
                </div>

                <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
                    <div className="lg:col-span-3 order-2 lg:order-1" key={`left-${animKey}`} style={{ animation: 'slideInLeft 0.4s ease-out both' }}>
                        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.06] h-full">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${niche.color}12` }}>
                                    <Brain className="w-3.5 h-3.5" style={{ color: niche.color }} />
                                </div>
                                <span className="text-[12px] text-white/60 font-sans font-medium">Мозг агента</span>
                            </div>
                            <div className="space-y-2.5">
                                {stage.insights.map((insight, i) => (
                                    <div key={`${activeNiche}-${currentStage}-${i}`} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors" style={{ animation: `fadeSlideIn 0.3s ease-out ${i * 0.07}s both` }}>
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${insight.color}10` }}>
                                            <insight.icon className="w-3.5 h-3.5" style={{ color: insight.color }} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[9px] text-white/30 leading-none mb-0.5 uppercase tracking-wider">{insight.label}</div>
                                            <div className="text-[12px] text-white/80 font-medium truncate">{insight.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 pt-4 border-t border-white/[0.05]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-3 h-3" style={{ color: niche.color }} />
                                    <span className="text-[11px] font-medium" style={{ color: `${niche.color}cc` }}>{stage.technique}</span>
                                </div>
                                <p className="text-[10px] text-white/35 leading-relaxed">{stage.techniqueDesc}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 order-1 lg:order-2">
                        <div className="max-w-[390px] mx-auto" key={`phone-${activeNiche}`} style={{ animation: 'nicheSwitch 0.4s ease-out both' }}>
                            <div className="relative iphone-frame">
                                <div className="absolute -inset-[3px] rounded-[3.2rem] bg-gradient-to-b from-[#3a3a3c] via-[#2c2c2e] to-[#1c1c1e] z-0" />
                                <div className="absolute -inset-[6px] rounded-[3.4rem] z-[-1] transition-all duration-1000" style={{ boxShadow: `0 0 80px -20px ${niche.color}30, 0 0 120px -40px ${niche.color}15`, animation: 'glowPulse 4s ease-in-out infinite' }} />
                                <div className="relative rounded-[3rem] border border-[#48484a]/60 bg-[#000000] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-[1]">
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
                                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="opacity-50"><rect x="0" y="6" width="2.5" height="4" rx="0.5" fill="white"/><rect x="3.5" y="4" width="2.5" height="6" rx="0.5" fill="white"/><rect x="7" y="2" width="2.5" height="8" rx="0.5" fill="white"/><rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="white"/></svg>
                                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="opacity-50"><path d="M7 1C4.5 1 2.3 2 0.8 3.7L2 5C3.2 3.5 5 2.5 7 2.5C9 2.5 10.8 3.5 12 5L13.2 3.7C11.7 2 9.5 1 7 1Z" fill="white"/><path d="M7 4C5.5 4 4.2 4.7 3.3 5.8L4.5 7C5.1 6.2 6 5.5 7 5.5C8 5.5 8.9 6.2 9.5 7L10.7 5.8C9.8 4.7 8.5 4 7 4Z" fill="white"/><circle cx="7" cy="9" r="1.2" fill="white"/></svg>
                                                <div className="flex items-center"><div className="w-[18px] h-[9px] rounded-[2px] border border-white/40 flex items-center p-[1px]"><div className="w-[10px] h-[5px] rounded-[1px] bg-white/50" /></div><div className="w-[1.5px] h-[4px] rounded-r-sm bg-white/30 ml-[0.5px]" /></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-4 pt-1 pb-2 bg-gradient-to-b from-[#0c0a14]/90 to-transparent">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br ${niche.gradient}`} style={{ boxShadow: `0 4px 15px ${niche.color}33` }}>
                                                    <niche.icon className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-black" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[13px] text-white/90 font-medium font-sans">{niche.agentName}</div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[10px] text-white/30">{niche.agentRole}</span>
                                                    <span className="text-[8px] text-white/15">•</span>
                                                    <span className="text-[10px] text-[#22c55e]/80">онлайн</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5 text-white/20" />
                                                <div className="px-2 py-0.5 rounded-full text-[8px] font-sans font-bold border text-white/25" style={{ borderColor: `${niche.color}25`, backgroundColor: `${niche.color}08` }}>AI</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mx-3"><div className="h-px bg-white/[0.06]" /></div>

                                    <div ref={chatRef} className="h-[400px] sm:h-[440px] overflow-y-auto px-3 py-3 space-y-2.5 scroll-smooth ai-agent-chat-scroll" role="log" aria-label={`Демонстрация AI-агента ${niche.agentName}`} aria-live="polite">
                                        {allPreviousMessages.map(msg => renderMessage(msg, false))}
                                        {visibleMessages.map((msg, i) => renderMessage(msg, true, i))}
                                        {isTyping && (
                                            <div className="flex justify-start">
                                                <div className="bg-white/[0.06] rounded-2xl rounded-bl-md"><TypingIndicator /></div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-3 pb-3 pt-2">
                                        <div className="flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.08] px-4 py-2.5">
                                            <MessageSquare className="w-4 h-4 text-white/15 flex-shrink-0" />
                                            <span className="text-[12px] text-white/15 font-sans flex-1">Написать сообщение...</span>
                                            <Send className="w-4 h-4 flex-shrink-0 transition-colors" style={{ color: `${niche.color}40` }} />
                                        </div>
                                    </div>
                                    <div className="flex justify-center pb-2"><div className="w-[120px] h-[4px] rounded-full bg-white/15" /></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 order-3" key={`right-${animKey}`} style={{ animation: 'slideInRight 0.4s ease-out both' }}>
                        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.06] h-full">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${niche.color}12` }}>
                                    <Eye className="w-3.5 h-3.5" style={{ color: niche.color }} />
                                </div>
                                <span className="text-[12px] text-white/60 font-sans font-medium">Под капотом</span>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-[13px] text-white/80 font-medium font-sans">{stage.title}</div>
                                    <div className="text-[10px] text-white/35 font-sans">{stage.subtitle}</div>
                                </div>
                                <div className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono" style={{ backgroundColor: `${niche.color}10`, color: `${niche.color}90`, border: `1px solid ${niche.color}20` }}>
                                    {currentStage + 1}/{stagesData.length}
                                </div>
                            </div>
                            <SidePanelContent key={`${activeNiche}-${currentStage}`} type={stage.sidePanelType} niche={niche} stage={stage} />
                        </div>
                    </div>
                </div>

                <div data-reveal className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
                    {[
                        { value: '29', label: 'Сигналов контекста', icon: Brain },
                        { value: '17', label: 'AI-инструментов', icon: Zap },
                        { value: '150+', label: 'Языков', icon: Globe },
                        { value: '24/7', label: 'Без выходных', icon: Clock },
                    ].map((stat, i) => (
                        <AnimatedStat key={i} {...stat} delay={i * 0.1} />
                    ))}
                </div>

                <div data-reveal className="mt-8 sm:mt-10 text-center">
                    <a href="#pricing" className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-[14px] font-sans font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] transition-all duration-300 shadow-lg shadow-[#8B5CF6]/20 hover:shadow-[#8B5CF6]/30 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]">
                        Хочу такого агента
                        <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <p className="text-[11px] text-white/25 mt-3 font-sans">Настроим под ваш бизнес за 2-3 недели</p>
                </div>
            </div>
        </section>
    );
};
