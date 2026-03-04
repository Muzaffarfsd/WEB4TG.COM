import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useScrollReveal } from '../../hooks/use-animations';
import {
    Bot, CheckCircle, TrendingUp,
    Brain, Sparkles, MessageSquare, Clock, ArrowRight,
    Zap, Eye, Shield, Globe, Mic, Volume2,
    Target, Gauge, Activity, ArrowUpRight,
    ShoppingBag, UtensilsCrossed, Scissors, Dumbbell,
    Package, Search, Users, Heart, Star,
    Send, Phone, XCircle, Timer, BarChart3
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
    heroMetric: { value: string; label: string; sub: string };
    beforeAfter: { before: string; after: string };
}

interface StageData {
    title: string;
    subtitle: string;
    messages: ChatMessage[];
    resultCards: ResultCard[];
    propensity: number;
    sidePanelType: string;
}

interface ResultCard {
    icon: typeof Bot;
    label: string;
    value: string;
    color: string;
    detail?: string;
}

const VOICE_BAR_HEIGHTS = Array.from({ length: 28 }, (_, i) =>
    6 + Math.sin(i * 0.7) * 8 + (Math.sin(i * 2.1) * 4 + 4)
);

const AUTOPLAY_STAGE_DURATION = 8000;

const niches: NicheScenario[] = [
    {
        id: 'shop',
        icon: ShoppingBag,
        name: 'Интернет-магазин',
        shortName: 'Магазин',
        agentName: 'Лина',
        agentRole: 'Sales-агент',
        color: '#8B5CF6',
        gradient: 'from-[#8B5CF6] to-[#6D28D9]',
        heroMetric: { value: '96.8%', label: 'конверсия в оплату', sub: 'vs 34% на обычном сайте' },
        beforeAfter: { before: 'Клиент уходит с сайта — нет консультации', after: 'AI подбирает товар, отвечает на вопросы, закрывает в оплату за 3 минуты' },
        stages: [
            {
                title: "Квалификация",
                subtitle: "0.3 сек — и агент знает что нужно клиенту",
                propensity: 62,
                messages: [
                    { id: 1, sender: 'user', text: 'Привет! Ищу кроссовки для бега, бюджет до 15 тысяч' },
                    { id: 2, sender: 'agent', text: 'Смотрите, у нас как раз есть топовые модели для бега в этом диапазоне) По какому покрытию бегаете — асфальт или трейл? Это сильно влияет на выбор подошвы' },
                ],
                resultCards: [
                    { icon: Target, label: 'Намерение', value: 'Покупка • 94%', color: '#22c55e' },
                    { icon: Timer, label: 'Время ответа', value: '0.3 сек', color: '#3b82f6', detail: 'Менеджер: ~8 мин' },
                    { icon: Globe, label: 'Адаптация', value: 'Тёплый тон, RU', color: '#8B5CF6' },
                    { icon: Brain, label: 'Стратегия', value: 'Уточняющий вопрос', color: '#f59e0b', detail: 'Не «чем помочь?», а конкретика' },
                ],
                sidePanelType: 'shop_qualify',
            },
            {
                title: "AI-подбор",
                subtitle: "Из 47 товаров — 3 идеальных за 1 сек",
                propensity: 78,
                messages: [
                    { id: 3, sender: 'user', text: 'Асфальт, бегаю 3-4 раза в неделю' },
                    { id: 4, sender: 'agent', text: 'Для вашего объёма тренировок нужна хорошая амортизация. Подобрала 3 варианта:\n\n1. Nike Pegasus 41 — 12 990₽ ⭐\n   Рейтинг 4.8, идеально для 3-4 раз/нед\n\n2. Asics Gel-Nimbus — 14 500₽\n\n3. New Balance 1080 — 13 900₽\n\n87% клиентов с вашим профилем выбирают Pegasus. Показать подробнее?' },
                ],
                resultCards: [
                    { icon: Search, label: 'Фильтрация', value: '47 → 3 товара', color: '#8B5CF6', detail: 'AI-ранжирование по релевантности' },
                    { icon: TrendingUp, label: 'Конверсия', value: '+34%', color: '#22c55e', detail: 'С персональной рекомендацией' },
                    { icon: Star, label: 'Соц. доказательство', value: '87% выбирают', color: '#f59e0b', detail: 'Принцип Чалдини #3' },
                    { icon: Package, label: 'Наличие', value: 'Проверено', color: '#22c55e', detail: 'Размер, склад, доставка' },
                ],
                sidePanelType: 'shop_recommend',
            },
            {
                title: "Оплата в чате",
                subtitle: "Cross-sell +18% к чеку, оплата без перехода",
                propensity: 94,
                messages: [
                    { id: 5, sender: 'user', text: 'Да, давайте Pegasus, размер 43' },
                    { id: 6, sender: 'agent', text: 'Размер 43 в наличии, 4 пары на складе) Добавила в корзину.\n\nК Pegasus отлично подходят носки Stance Run (590₽) — 87% покупателей берут вместе. Добавить?\n\n🧾 Nike Pegasus 41 — 12 990₽\n💳 Apple Pay / Карта / СБП' },
                ],
                resultCards: [
                    { icon: Zap, label: 'Cross-sell', value: '+590₽ к чеку', color: '#f59e0b', detail: 'Средний чек растёт на 18%' },
                    { icon: Shield, label: 'Оплата в чате', value: '6 способов', color: '#22c55e', detail: 'Apple Pay, карта, СБП, крипто' },
                    { icon: BarChart3, label: 'Конверсия', value: '96.8%', color: '#22c55e', detail: 'vs 34% на обычных сайтах' },
                    { icon: CheckCircle, label: 'Закрытие', value: 'Без менеджера', color: '#8B5CF6', detail: 'Полностью автоматически' },
                ],
                sidePanelType: 'shop_pay',
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
        heroMetric: { value: '+27%', label: 'средний чек', sub: 'с AI-рекомендациями сетов' },
        beforeAfter: { before: 'Ночью и в выходные заказы теряются', after: 'AI принимает заказы 24/7, предлагает сеты и допродаёт' },
        stages: [
            {
                title: "Умное меню",
                subtitle: "Персональный сет за 2 секунды",
                propensity: 71,
                messages: [
                    { id: 1, sender: 'user', text: 'Хочу заказать ужин на двоих с доставкой' },
                    { id: 2, sender: 'agent', text: 'Отличный план на вечер) Шеф сегодня рекомендует сет «Романтический» — 2 стейка рибай, салат Цезарь, тирамису и бутылка вина.\n\n4 890₽ вместо 6 200₽ при заказе по отдельности.\n\nИли собрать что-то своё? Скину меню)' },
                ],
                resultCards: [
                    { icon: Heart, label: 'Контекст', value: 'Ужин на двоих', color: '#ef4444', detail: 'Понял романтический повод' },
                    { icon: TrendingUp, label: 'Апсейл', value: '-21% на сет', color: '#f59e0b', detail: 'Экономия = мотивация купить' },
                    { icon: Timer, label: 'Скорость', value: '2 сек', color: '#3b82f6', detail: 'Менеджер: 3-5 мин в чате' },
                    { icon: Brain, label: 'Тактика', value: 'Value First', color: '#8B5CF6', detail: 'Сначала ценность — потом продажа' },
                ],
                sidePanelType: 'rest_menu',
            },
            {
                title: "Гибкий заказ",
                subtitle: "Мгновенная адаптация без споров",
                propensity: 88,
                messages: [
                    { id: 3, sender: 'user', text: 'Давайте романтический сет! Но без вина, лучше лимонад' },
                    { id: 4, sender: 'agent', text: 'Готово) Заменил вино на домашний лимонад (бесплатно для сета).\n\n🧾 Сет «Романтический»:\n• 2× Стейк рибай\n• Салат Цезарь\n• Тирамису\n• Домашний лимонад 1л\nИтого: 4 290₽\n\nКуда доставить? Оплата картой или при получении' },
                ],
                resultCards: [
                    { icon: Zap, label: 'Адаптация', value: '< 1 сек', color: '#f59e0b', detail: 'Без уточнений и задержек' },
                    { icon: Package, label: 'Итого', value: '4 290₽', color: '#22c55e', detail: 'Пересчёт автоматически' },
                    { icon: Shield, label: 'Оплата', value: 'Карта / Нал', color: '#22c55e', detail: 'Встроенный эквайринг' },
                    { icon: Target, label: 'Закрытие', value: 'Тихий close', color: '#8B5CF6', detail: '«Куда доставить?» — согласие подразумевается' },
                ],
                sidePanelType: 'rest_order',
            },
            {
                title: "Трекинг + бонусы",
                subtitle: "Пост-продажа → повторные заказы",
                propensity: 97,
                messages: [
                    { id: 5, sender: 'user', text: 'Пушкина 15, кв 42. Картой оплачу' },
                    { id: 6, sender: 'agent', text: '✅ Заказ #R-7291 оформлен!\n\n🚚 Курьер Дмитрий — 18:45–19:15\n📍 Трекинг в реальном времени прямо здесь\n\nС этого заказа у вас 430 бонусов — хватит на бесплатный десерт в следующий раз)' },
                ],
                resultCards: [
                    { icon: CheckCircle, label: 'Статус', value: 'Оформлен', color: '#22c55e', detail: 'Без участия менеджера' },
                    { icon: Users, label: 'Курьер', value: 'Дмитрий • 4.9★', color: '#3b82f6', detail: 'Автоматический подбор' },
                    { icon: Heart, label: 'Лояльность', value: '+430 бонусов', color: '#ef4444', detail: 'Push-напоминание через 5 дней' },
                    { icon: Activity, label: 'LTV', value: '×3.2', color: '#8B5CF6', detail: 'Повторные заказы через бонусы' },
                ],
                sidePanelType: 'rest_post',
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
        heroMetric: { value: '89%', label: 'записей без менеджера', sub: 'онлайн 24/7, даже ночью' },
        beforeAfter: { before: 'Администратор не берёт трубку — клиент уходит к конкуренту', after: 'AI записывает мгновенно, подбирает мастера и допродаёт' },
        stages: [
            {
                title: "Подбор мастера",
                subtitle: "Клиент выбирает «к кому», а не «идти или нет»",
                propensity: 68,
                messages: [
                    { id: 1, sender: 'user', text: 'Хочу записаться на окрашивание волос' },
                    { id: 2, sender: 'agent', text: 'У нас как раз сейчас два топовых колориста свободны)\n\nАнна — блонд и сложные техники (балаяж, airtouch). ⭐ 4.9\n\nМария — натуральные оттенки, тонирование. ⭐ 4.8\n\nКакой результат хотите — кардинальную смену или освежить цвет?' },
                ],
                resultCards: [
                    { icon: Users, label: 'Мастера', value: '2 свободны', color: '#ec4899', detail: 'С рейтингом и специализацией' },
                    { icon: Target, label: 'Тактика', value: 'Альтернативное закрытие', color: '#8B5CF6', detail: '«К кому?» вместо «записаться?»' },
                    { icon: Timer, label: 'Ответ', value: 'Мгновенно', color: '#3b82f6', detail: 'Ночью и в выходные' },
                    { icon: TrendingUp, label: 'Конверсия', value: '+41%', color: '#22c55e', detail: 'С альтернативным закрытием' },
                ],
                sidePanelType: 'beauty_masters',
            },
            {
                title: "Запись онлайн",
                subtitle: "Живые слоты + value stacking",
                propensity: 85,
                messages: [
                    { id: 3, sender: 'user', text: 'Хочу балаяж, к Анне' },
                    { id: 4, sender: 'agent', text: 'У Анны свободно:\n\n📅 Ср, 18 дек — 14:00\n📅 Пт, 20 дек — 11:00, 16:00\n📅 Сб, 21 дек — 10:00\n\nБалаяж: 8 500₽ (3-4 часа)\nВключено: консультация + уход Olaplex\n\nКакое время удобнее?' },
                ],
                resultCards: [
                    { icon: Clock, label: 'Слоты', value: '4 свободных', color: '#f59e0b', detail: 'Синхронизация с CRM в реальном времени' },
                    { icon: Sparkles, label: 'Value Stack', value: 'Olaplex включён', color: '#8B5CF6', detail: 'Ценность без доп. стоимости' },
                    { icon: Shield, label: 'Дефицит', value: '4 слота на неделю', color: '#ef4444', detail: 'Мотивация не откладывать' },
                    { icon: Package, label: 'Цена', value: '8 500₽', color: '#ec4899', detail: 'Прозрачная, без сюрпризов' },
                ],
                sidePanelType: 'beauty_book',
            },
            {
                title: "Голосовое + допродажа",
                subtitle: "ElevenLabs v3 — голос повышает конверсию на 23%",
                propensity: 94,
                messages: [
                    { id: 5, sender: 'user', text: 'Пятница в 16:00 идеально' },
                    { id: 6, sender: 'agent', text: '✅ Записала!\n\n📅 Пт, 20 декабря, 16:00\n👩‍🎨 Мастер: Анна\n💇 Балаяж + Olaplex\n💰 8 500₽\n\nНапомню за день и за 2 часа. С балаяжем часто делают стрижку горячими ножницами (1 200₽). Добавить?' },
                    { id: 7, sender: 'agent', text: '🎤 Голосовое — 0:08', isVoice: true },
                ],
                resultCards: [
                    { icon: Mic, label: 'Голосовое', value: 'ElevenLabs v3', color: '#ec4899', detail: '7 профилей голоса' },
                    { icon: Zap, label: 'Допродажа', value: '+1 200₽', color: '#f59e0b', detail: 'Средний чек +14%' },
                    { icon: CheckCircle, label: 'Запись', value: 'Подтверждена', color: '#22c55e', detail: '2 напоминания автоматически' },
                    { icon: TrendingUp, label: 'Голос → конверсия', value: '+23%', color: '#22c55e', detail: 'Ощущение живого контакта' },
                ],
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
        heroMetric: { value: '73%', label: 'триалов → абонемент', sub: 'бесплатный визит = продажа' },
        beforeAfter: { before: 'Звонят узнать цену — слышат прайс-лист и кладут трубку', after: 'AI квалифицирует цель, подбирает тариф, записывает на триал' },
        stages: [
            {
                title: "Цель клиента",
                subtitle: "Не прайс-лист, а персональный подбор",
                propensity: 45,
                messages: [
                    { id: 1, sender: 'user', text: 'Сколько стоит абонемент? Хочу начать тренироваться' },
                    { id: 2, sender: 'agent', text: 'Цена зависит от целей. Кому-то хватает зала, а кому-то нужен тренер и бассейн)\n\nВы хотите сбросить вес, набрать массу или просто быть в форме? От этого зависит какой формат подойдёт лучше всего' },
                ],
                resultCards: [
                    { icon: Target, label: 'Тактика', value: 'Не «цена», а «цель»', color: '#22c55e', detail: 'Квалификация вместо прайса' },
                    { icon: TrendingUp, label: 'Средний чек', value: '+40%', color: '#f59e0b', detail: 'С персональным подбором' },
                    { icon: Brain, label: 'Модель', value: 'Gemini Pro', color: '#ef4444', detail: 'Сложная квалификация → мощная модель' },
                    { icon: Activity, label: 'Профиль', value: 'Новичок', color: '#3b82f6', detail: 'Автоматическая сегментация' },
                ],
                sidePanelType: 'fit_goal',
            },
            {
                title: "Триал-оффер",
                subtitle: "Бесплатный визит снимает все барьеры",
                propensity: 72,
                messages: [
                    { id: 3, sender: 'user', text: 'Хочу похудеть, килограмм 10 сбросить' },
                    { id: 4, sender: 'agent', text: 'Для минус 10 кг лучший формат — зал + кардио + 4 вводных тренировки с тренером.\n\nСтандарт: 4 900₽/мес\nС тренером: 7 900₽/мес\n\nНо знаете что? Приходите на бесплатную пробную тренировку — тренер составит программу, и вы решите на месте. Без обязательств)\n\nКогда удобно — будни или выходные?' },
                ],
                resultCards: [
                    { icon: Shield, label: 'Барьер', value: 'Снят', color: '#3b82f6', detail: 'Бесплатный триал = 0 риска' },
                    { icon: Zap, label: 'Конверсия', value: '73%', color: '#22c55e', detail: 'Триал → абонемент' },
                    { icon: Package, label: 'Рекомендация', value: '7 900₽/мес', color: '#22c55e', detail: 'AI выбрал оптимальный тариф' },
                    { icon: Target, label: 'Закрытие', value: '«Когда удобно?»', color: '#8B5CF6', detail: 'Вопрос предполагает согласие' },
                ],
                sidePanelType: 'fit_trial',
            },
            {
                title: "Запись + стимул",
                subtitle: "Скидка с дедлайном → 92% явки",
                propensity: 88,
                messages: [
                    { id: 5, sender: 'user', text: 'Можно в субботу утром?' },
                    { id: 6, sender: 'agent', text: '✅ Записал!\n\n📅 Сб, 21 дек, 10:00\n🏋️ Тренер: Алексей (стаж 8 лет, снижение веса)\n📍 ул. Тверская, 25\n\nВозьмите кроссовки и полотенце. Напомню за день)\n\nЕсли после триала возьмёте абонемент — в декабре скидка 20% на первый месяц с тренером' },
                ],
                resultCards: [
                    { icon: CheckCircle, label: 'Записан', value: 'Сб, 10:00', color: '#22c55e', detail: 'Тренер подобран автоматически' },
                    { icon: Users, label: 'Тренер', value: 'Алексей • 4.9★', color: '#3b82f6', detail: 'Спец. по снижению веса' },
                    { icon: Zap, label: 'Стимул', value: '-20% декабрь', color: '#f59e0b', detail: 'Дедлайн создаёт срочность' },
                    { icon: Activity, label: 'Явка', value: '92%', color: '#22c55e', detail: 'С push-напоминанием' },
                ],
                sidePanelType: 'fit_done',
            },
        ],
    },
];

const TypingIndicator = () => (
    <div className="flex items-center gap-1 px-4 py-3">
        <div className="flex gap-1">
            {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]/60" style={{ animation: `typingBounce 1.4s ease-in-out ${i * 0.2}s infinite` }} />
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
                <div key={i} className="w-[2.5px] rounded-full bg-[#8B5CF6]/50" style={{ height: `${h}px`, animation: `typingBounce 2s ease-in-out ${i * 0.08}s infinite` }} />
            ))}
        </div>
        <span className="text-[10px] text-white/40 flex-shrink-0">0:08</span>
    </div>
);

const PropensityBar = ({ value, color, prevValue }: { value: number; color: string; prevValue?: number }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.2s both' }}>
        <div className="flex items-center gap-1.5 flex-shrink-0">
            <Gauge className="w-3.5 h-3.5" style={{ color }} />
            <span className="text-[10px] text-white/35 uppercase tracking-wider">Propensity</span>
        </div>
        <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}66, ${color})`, animation: 'propensityFill 1s ease-out 0.4s both', boxShadow: `0 0 12px ${color}40` }} />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
            {prevValue && <><span className="text-[11px] text-white/20">{prevValue}</span><ArrowRight className="w-2.5 h-2.5 text-white/15" /></>}
            <span className="text-[13px] font-bold" style={{ color }}>{value}</span>
        </div>
    </div>
);

const AnimatedStat = ({ value, label, icon: Icon, delay }: { value: string; label: string; icon: typeof Bot; delay: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} className="glow-card rounded-xl p-4 sm:p-5 text-center group hover:border-[#8B5CF6]/20 transition-all duration-500">
            <Icon className="w-4 h-4 text-[#8B5CF6]/40 mx-auto mb-2 group-hover:text-[#8B5CF6]/70 transition-colors" />
            <div className="text-[clamp(1.3rem,2.5vw,1.6rem)] font-instrument-serif gradient-text font-normal" style={visible ? { animation: `countUp 0.5s ease-out ${delay}s both` } : { opacity: 0 }}>{value}</div>
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
    const [progressKey, setProgressKey] = useState(0);
    const chatRef = useRef<HTMLDivElement>(null);
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

    useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [visibleMessages, isTyping]);

    const handleNicheClick = (i: number) => { clearTimer(); setActiveNiche(i); setCurrentStage(0); setIsPaused(false); };
    const handleStageClick = (i: number) => { clearTimer(); setIsPaused(false); setCurrentStage(i); };

    const renderMessage = (msg: ChatMessage, animated: boolean, idx?: number) => (
        <div key={`${activeNiche}-${msg.id}`} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`} style={animated ? { animation: `messageAppear 0.35s ease-out ${(idx || 0) * 0.05}s both` } : undefined}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed font-sans whitespace-pre-line ${msg.sender === 'user' ? 'text-white rounded-br-md' : 'bg-white/[0.06] text-white/80 rounded-bl-md'}`} style={msg.sender === 'user' ? { background: `linear-gradient(135deg, ${niche.color}, ${niche.color}cc)` } : undefined}>
                {msg.isVoice ? <VoiceMessage /> : msg.text}
            </div>
        </div>
    );

    return (
        <section ref={sectionRef} id="ai-agent" className="relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8 overflow-hidden" style={{ contain: 'layout style' }}>
            <div className="absolute w-[600px] h-[600px] rounded-full blur-[120px] top-[15%] right-[-10%] pointer-events-none transition-colors duration-1000" style={{ backgroundColor: `${niche.color}06` }} />
            <div className="absolute w-[400px] h-[400px] rounded-full bg-[#7C3AED]/[0.02] blur-[80px] bottom-[10%] left-[-5%] pointer-events-none" />

            <div ref={revealRef} className="max-w-7xl mx-auto relative">
                {/* HEADER — пункты 1, 2, 4: новый копирайтинг */}
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

                {/* NICHE TABS */}
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

                {/* STAGE PILLS + PROGRESS — пункт 9: прогресс-бар */}
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

                {/* BEFORE/AFTER — пункт 13 */}
                <div data-reveal className="max-w-3xl mx-auto mb-8 sm:mb-10">
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
                                <div className="text-[10px] text-[#22c55e]/50 uppercase tracking-wider font-semibold mb-1">С AI-агентом</div>
                                <div className="text-[12px] text-white/60 leading-relaxed">{niche.beforeAfter.after}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT — пункт 5: 2-колонки вместо 3 (телефон + результаты) */}
                <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">

                    {/* PHONE — пункт 8: усиленный glow */}
                    <div className="lg:col-span-5 order-1 flex justify-center">
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
                    </div>

                    {/* RIGHT PANEL — пункты 5,6,7,15: результаты + метрики для бизнеса */}
                    <div className="lg:col-span-7 order-2" key={`right-${animKey}`} style={{ animation: 'slideInRight 0.4s ease-out both' }}>
                        {/* HERO METRIC — пункт 3: анимированная метрика результата */}
                        <div className="mb-5" key={`metric-${activeNiche}`} style={{ animation: 'resultPop 0.5s ease-out both' }}>
                            <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/[0.06] relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${niche.color}, transparent)`, opacity: 0.4 }} />
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="text-[clamp(2rem,5vw,3rem)] font-instrument-serif font-normal leading-none" style={{ color: niche.color }}>{niche.heroMetric.value}</div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[14px] sm:text-[15px] text-white/80 font-sans font-medium">{niche.heroMetric.label}</div>
                                        <div className="text-[11px] sm:text-[12px] text-white/35 mt-0.5">{niche.heroMetric.sub}</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${niche.color}10` }}>
                                        <niche.icon className="w-5 h-5" style={{ color: niche.color }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RESULT CARDS — пункт 6: бизнес-язык вместо жаргона */}
                        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.06] mb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${niche.color}12` }}>
                                        <Eye className="w-3.5 h-3.5" style={{ color: niche.color }} />
                                    </div>
                                    <div>
                                        <span className="text-[12px] text-white/70 font-sans font-medium">{stage.title}</span>
                                        <span className="text-[10px] text-white/25 ml-2 hidden sm:inline">{stage.subtitle}</span>
                                    </div>
                                </div>
                                <div className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono" style={{ backgroundColor: `${niche.color}10`, color: `${niche.color}90`, border: `1px solid ${niche.color}20` }}>
                                    {currentStage + 1}/{stagesData.length}
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
                                                <div className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">{card.label}</div>
                                                <div className="text-[13px] text-white/85 font-medium">{card.value}</div>
                                                {card.detail && <div className="text-[10px] text-white/30 mt-0.5 leading-snug">{card.detail}</div>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PROPENSITY BAR */}
                        <PropensityBar key={`prop-${activeNiche}-${currentStage}`} value={stage.propensity} color={niche.color} prevValue={prevPropensity} />
                    </div>
                </div>

                {/* SOCIAL PROOF — пункт 14 */}
                <div data-reveal className="mt-10 sm:mt-14 flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
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

                {/* STATS */}
                <div data-reveal className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
                    {[
                        { value: '0.3с', label: 'Время ответа', icon: Timer },
                        { value: '17', label: 'AI-инструментов', icon: Zap },
                        { value: '150+', label: 'Языков', icon: Globe },
                        { value: '24/7', label: 'Без выходных', icon: Clock },
                    ].map((stat, i) => (
                        <AnimatedStat key={i} {...stat} delay={i * 0.1} />
                    ))}
                </div>

                {/* CTA — пункт 3: премиальный CTA */}
                <div data-reveal className="mt-8 sm:mt-10 text-center">
                    <a href="#pricing" className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl text-[14px] sm:text-[15px] font-sans font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] transition-all duration-300 shadow-xl shadow-[#8B5CF6]/20 hover:shadow-[#8B5CF6]/30 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]">
                        Запустить AI-агента за 14 дней
                        <ArrowUpRight className="w-4.5 h-4.5" />
                    </a>
                    <p className="text-[12px] text-white/30 mt-3 font-sans">Настроим под вашу нишу — от каталога до скриптов продаж</p>
                </div>
            </div>
        </section>
    );
};
