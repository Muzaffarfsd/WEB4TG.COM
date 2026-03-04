import { useState, useEffect, useCallback, useRef } from 'react';
import { useScrollReveal } from '../../hooks/use-animations';
import {
    Bot, CheckCircle, TrendingUp,
    Brain, Sparkles, MessageSquare, Clock, ArrowRight,
    Zap, Eye, Shield, Globe, Mic, Volume2,
    Target, Gauge, Activity, ArrowUpRight,
    ShoppingBag, UtensilsCrossed, Scissors, Dumbbell,
    Package, Search, Users, Heart
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
    agentName: string;
    color: string;
    stages: StageData[];
}

interface StageData {
    title: string;
    subtitle: string;
    messages: ChatMessage[];
    insights: InsightData[];
    technique: string;
    techniqueDesc: string;
    sidePanelType: string;
}

interface InsightData {
    icon: typeof Bot;
    label: string;
    value: string;
    color: string;
}

const niches: NicheScenario[] = [
    {
        id: 'shop',
        icon: ShoppingBag,
        name: 'Интернет-магазин',
        agentName: 'Лина',
        color: '#8B5CF6',
        stages: [
            {
                title: "Квалификация клиента",
                subtitle: "Анализ намерения за 0.3 сек",
                messages: [
                    { id: 1, sender: 'user', text: 'Привет! Ищу кроссовки для бега, бюджет до 15 тысяч' },
                    { id: 2, sender: 'agent', text: 'Смотрите, у нас как раз есть топовые модели для бега в этом диапазоне) По какому покрытию бегаете — асфальт или трейл? Это сильно влияет на выбор подошвы' },
                ],
                insights: [
                    { icon: Brain, label: 'Модель', value: 'Gemini Flash • 0.3', color: '#3b82f6' },
                    { icon: Target, label: 'Намерение', value: 'Покупка • 94%', color: '#22c55e' },
                    { icon: Gauge, label: 'Propensity', value: '62 / 100', color: '#8B5CF6' },
                    { icon: Activity, label: 'Настроение', value: '→ Нейтральное', color: '#f59e0b' },
                ],
                technique: 'SPIN: Situation',
                techniqueDesc: 'Агент не спрашивает «чем помочь?» — сразу даёт ценность и уточняет потребность вопросом о покрытии. Классический S-вопрос в SPIN Selling',
                sidePanelType: 'context_shop',
            },
            {
                title: "Поиск и рекомендация",
                subtitle: "Каталог + AI-ранжирование",
                messages: [
                    { id: 3, sender: 'user', text: 'Асфальт, бегаю 3-4 раза в неделю' },
                    { id: 4, sender: 'agent', text: 'Вот что скажу — для вашего объёма тренировок нужна хорошая амортизация. Подобрала 3 варианта:\n\n1. Nike Pegasus 41 — 12 990₽ ⭐\n   Рейтинг 4.8, идеально для 3-4 раз/нед\n\n2. Asics Gel-Nimbus — 14 500₽\n\n3. New Balance 1080 — 13 900₽\n\n87% клиентов с вашим профилем выбирают Pegasus. Показать подробнее?' },
                ],
                insights: [
                    { icon: Search, label: 'Поиск', value: '47 → 3 модели', color: '#8B5CF6' },
                    { icon: Package, label: 'Наличие', value: 'Все в наличии', color: '#22c55e' },
                    { icon: TrendingUp, label: 'Конверсия', value: '+34% с AI', color: '#f59e0b' },
                    { icon: Gauge, label: 'Propensity', value: '62 → 78', color: '#8B5CF6' },
                ],
                technique: 'Якорь + соц. доказательство',
                techniqueDesc: 'Лучший вариант первый (якорный эффект). «87% клиентов выбирают» — Чалдини #3, социальное доказательство. Ограничение до 3 вариантов снижает паралич выбора',
                sidePanelType: 'catalog',
            },
            {
                title: "Допродажа + оплата",
                subtitle: "Cross-sell и бесшовный чекаут",
                messages: [
                    { id: 5, sender: 'user', text: 'Да, давайте Pegasus, размер 43' },
                    { id: 6, sender: 'agent', text: 'Размер 43 в наличии, 4 пары на складе) Добавила в корзину.\n\nК Pegasus отлично подходят носки Stance Run (590₽) — 87% покупателей берут вместе. Добавить?\n\n🧾 Nike Pegasus 41 — 12 990₽\n💳 Apple Pay / Карта / СБП' },
                ],
                insights: [
                    { icon: Package, label: 'Корзина', value: '12 990₽', color: '#8B5CF6' },
                    { icon: Zap, label: 'Cross-sell', value: '+590₽ носки', color: '#f59e0b' },
                    { icon: Shield, label: 'Оплата', value: '6 способов', color: '#22c55e' },
                    { icon: Gauge, label: 'Propensity', value: '78 → 94', color: '#8B5CF6' },
                ],
                technique: 'Cross-sell + бесшовный чекаут',
                techniqueDesc: 'Агент предлагает сопутствующий товар на основе паттернов покупок (cross-sell). Оплата прямо в чате — конверсия 96.8% vs 34% в обычных магазинах',
                sidePanelType: 'checkout',
            },
        ],
    },
    {
        id: 'restaurant',
        icon: UtensilsCrossed,
        name: 'Ресторан',
        agentName: 'Марк',
        color: '#f59e0b',
        stages: [
            {
                title: "Приём заказа",
                subtitle: "Меню + персонализация",
                messages: [
                    { id: 1, sender: 'user', text: 'Хочу заказать ужин на двоих с доставкой' },
                    { id: 2, sender: 'agent', text: 'Отличный план на вечер) У нас сегодня шеф рекомендует сет «Романтический» — 2 стейка рибай, салат Цезарь, тирамису и бутылка вина. 4 890₽ вместо 6 200₽ при отдельном заказе.\n\nИли собрать что-то своё? Скину меню)' },
                ],
                insights: [
                    { icon: Brain, label: 'Модель', value: 'Gemini Flash • 0.3', color: '#3b82f6' },
                    { icon: Target, label: 'Намерение', value: 'Заказ еды • 98%', color: '#22c55e' },
                    { icon: Heart, label: 'Контекст', value: 'Ужин на двоих', color: '#ef4444' },
                    { icon: Gauge, label: 'Propensity', value: '71 / 100', color: '#8B5CF6' },
                ],
                technique: 'Якорь + Value First',
                techniqueDesc: 'Агент сразу предлагает выгодный сет (якорный эффект), показывает экономию (6 200 → 4 890₽). Бесплатная ценность вперёд — принцип взаимности Чалдини',
                sidePanelType: 'context_rest',
            },
            {
                title: "Адрес и оплата",
                subtitle: "Бесшовное оформление",
                messages: [
                    { id: 3, sender: 'user', text: 'Давайте романтический сет! Но без вина, лучше лимонад' },
                    { id: 4, sender: 'agent', text: 'Готово) Заменила вино на домашний лимонад (бесплатно для сета).\n\n🧾 Сет «Романтический»:\n• 2× Стейк рибай\n• Салат Цезарь\n• Тирамису\n• Домашний лимонад 1л\nИтого: 4 290₽\n\nКуда доставить? Оплата картой или при получении' },
                ],
                insights: [
                    { icon: Package, label: 'Заказ', value: '4 290₽', color: '#f59e0b' },
                    { icon: Clock, label: 'Доставка', value: '~45 мин', color: '#3b82f6' },
                    { icon: Shield, label: 'Оплата', value: 'Карта / Нал', color: '#22c55e' },
                    { icon: Gauge, label: 'Propensity', value: '71 → 92', color: '#8B5CF6' },
                ],
                technique: 'Гибкость + тихое закрытие',
                techniqueDesc: 'Агент не спорит — мгновенно адаптирует заказ. «Бесплатно для сета» усиливает ценность. Тихое закрытие: сразу спрашивает адрес, подразумевая согласие',
                sidePanelType: 'order',
            },
            {
                title: "Трекинг и лояльность",
                subtitle: "Пост-продажный сервис",
                messages: [
                    { id: 5, sender: 'user', text: 'Пушкина 15, кв 42. Картой оплачу' },
                    { id: 6, sender: 'agent', text: '✅ Заказ #R-7291 оформлен!\n\n🚚 Курьер Дмитрий — 18:45–19:15\n📍 Трекинг в реальном времени появится через 5 минут прямо здесь\n\nКстати, с этого заказа у вас 430 бонусов — хватит на бесплатный десерт в следующий раз)' },
                ],
                insights: [
                    { icon: CheckCircle, label: 'Статус', value: 'Оформлен', color: '#22c55e' },
                    { icon: Users, label: 'Курьер', value: 'Дмитрий • 4.9★', color: '#3b82f6' },
                    { icon: Heart, label: 'Бонусы', value: '+430 баллов', color: '#ef4444' },
                    { icon: Gauge, label: 'Propensity', value: '92 → 97', color: '#8B5CF6' },
                ],
                technique: 'Программа лояльности',
                techniqueDesc: 'Автоматическое начисление бонусов формирует привычку повторных заказов. Агент отправит push через Telegram напомнить о бонусах через 5 дней',
                sidePanelType: 'loyalty',
            },
        ],
    },
    {
        id: 'beauty',
        icon: Scissors,
        name: 'Салон красоты',
        agentName: 'Софи',
        color: '#ec4899',
        stages: [
            {
                title: "Онлайн-запись",
                subtitle: "Подбор мастера и времени",
                messages: [
                    { id: 1, sender: 'user', text: 'Хочу записаться на окрашивание волос' },
                    { id: 2, sender: 'agent', text: 'Слушайте, у нас как раз сейчас два топовых колориста свободны на этой неделе)\n\nАнна — специализация: блонд и сложные техники (балаяж, airtouch). Рейтинг 4.9\n\nМария — натуральные оттенки, тонирование. Рейтинг 4.8\n\nКакой результат хотите — кардинальную смену или освежить цвет?' },
                ],
                insights: [
                    { icon: Brain, label: 'Модель', value: 'Gemini Flash • 0.3', color: '#3b82f6' },
                    { icon: Target, label: 'Услуга', value: 'Окрашивание', color: '#ec4899' },
                    { icon: Users, label: 'Мастера', value: '2 свободны', color: '#22c55e' },
                    { icon: Gauge, label: 'Propensity', value: '68 / 100', color: '#8B5CF6' },
                ],
                technique: 'Альтернативное закрытие',
                techniqueDesc: 'Вместо «когда хотите?» агент предлагает двух конкретных мастеров — клиент выбирает не «записаться или нет», а «к Анне или Марии». Техника альтернативного закрытия',
                sidePanelType: 'booking',
            },
            {
                title: "Бронирование",
                subtitle: "Выбор даты и подтверждение",
                messages: [
                    { id: 3, sender: 'user', text: 'Хочу балаяж, к Анне' },
                    { id: 4, sender: 'agent', text: 'У Анны свободно:\n\n📅 Среда, 18 дек — 14:00\n📅 Пятница, 20 дек — 11:00, 16:00\n📅 Суббота, 21 дек — 10:00\n\nБалаяж: 8 500₽ (3-4 часа)\nВключено: консультация + уход Olaplex\n\nКакое время удобнее?' },
                ],
                insights: [
                    { icon: Clock, label: 'Слоты', value: '4 свободных', color: '#f59e0b' },
                    { icon: Package, label: 'Услуга', value: '8 500₽ • 3-4ч', color: '#ec4899' },
                    { icon: Sparkles, label: 'Включено', value: 'Olaplex уход', color: '#8B5CF6' },
                    { icon: Gauge, label: 'Propensity', value: '68 → 85', color: '#8B5CF6' },
                ],
                technique: 'Дефицит + Value Stacking',
                techniqueDesc: 'Ограниченное количество слотов создаёт дефицит (Чалдини #5). «Включено: консультация + Olaplex» — наращивание ценности (value stacking) без доп. стоимости',
                sidePanelType: 'schedule',
            },
            {
                title: "Подтверждение + голосовое",
                subtitle: "Напоминание и допродажа",
                messages: [
                    { id: 5, sender: 'user', text: 'Пятница в 16:00 идеально' },
                    { id: 6, sender: 'agent', text: '✅ Записала!\n\n📅 Пт, 20 декабря, 16:00\n👩‍🎨 Мастер: Анна\n💇 Балаяж + Olaplex\n💰 8 500₽\n\nНапомню за день и за 2 часа. А ещё — с балаяжем часто делают стрижку горячими ножницами (1 200₽). Добавить?' },
                    { id: 7, sender: 'agent', text: '🎤 Голосовое — 0:08', isVoice: true },
                ],
                insights: [
                    { icon: CheckCircle, label: 'Запись', value: 'Подтверждена', color: '#22c55e' },
                    { icon: Mic, label: 'Голос', value: 'greeting профиль', color: '#f59e0b' },
                    { icon: Zap, label: 'Cross-sell', value: '+1 200₽ стрижка', color: '#ec4899' },
                    { icon: Gauge, label: 'Propensity', value: '85 → 94', color: '#8B5CF6' },
                ],
                technique: 'Cross-sell + голосовое',
                techniqueDesc: 'Допродажа сопутствующей услуги увеличивает средний чек на 14%. Голосовое в greeting-профиле создаёт ощущение личного контакта и повышает конверсию на 23%',
                sidePanelType: 'voice_confirm',
            },
        ],
    },
    {
        id: 'fitness',
        icon: Dumbbell,
        name: 'Фитнес-клуб',
        agentName: 'Макс',
        color: '#22c55e',
        stages: [
            {
                title: "Подбор абонемента",
                subtitle: "Квалификация и персонализация",
                messages: [
                    { id: 1, sender: 'user', text: 'Сколько стоит абонемент? Хочу начать тренироваться' },
                    { id: 2, sender: 'agent', text: 'Вот что скажу — цена зависит от целей. Кому-то хватает зала, а кому-то нужен тренер и бассейн)\n\nДавайте так: вы хотите сбросить вес, набрать массу или просто быть в форме? От этого зависит какой формат подойдёт лучше всего' },
                ],
                insights: [
                    { icon: Brain, label: 'Модель', value: 'Gemini Pro • 0.45', color: '#ef4444' },
                    { icon: Target, label: 'Намерение', value: 'Покупка абонемента', color: '#22c55e' },
                    { icon: Activity, label: 'Клиент', value: 'Новичок', color: '#f59e0b' },
                    { icon: Gauge, label: 'Propensity', value: '45 / 100', color: '#8B5CF6' },
                ],
                technique: 'SPIN: Situation + Need',
                techniqueDesc: 'Вместо прайс-листа агент сначала квалифицирует потребность. Вопрос о целях (SPIN: Need-Payoff) позволяет предложить оптимальный вариант и увеличить средний чек на 40%',
                sidePanelType: 'fitness_qualify',
            },
            {
                title: "Предложение + триал",
                subtitle: "Снятие барьера входа",
                messages: [
                    { id: 3, sender: 'user', text: 'Хочу похудеть, килограмм 10 сбросить' },
                    { id: 4, sender: 'agent', text: 'Ага, понял задачу. Для минус 10 кг лучший формат — зал + кардио-зона + 4 вводных тренировки с тренером.\n\nСтандарт: 4 900₽/мес\nС тренером: 7 900₽/мес (первые 4 занятия)\n\nНо знаете что? Приходите на бесплатную пробную тренировку — тренер составит вам программу, и вы решите на месте. Без обязательств)\n\nКогда удобно — будни или выходные?' },
                ],
                insights: [
                    { icon: Package, label: 'Рекомендация', value: 'Стандарт + тренер', color: '#22c55e' },
                    { icon: TrendingUp, label: 'Средний чек', value: '+61% с тренером', color: '#f59e0b' },
                    { icon: Shield, label: 'Барьер', value: 'Триал бесплатно', color: '#3b82f6' },
                    { icon: Gauge, label: 'Propensity', value: '45 → 72', color: '#8B5CF6' },
                ],
                technique: 'Снятие риска + обязательство',
                techniqueDesc: '«Бесплатная тренировка» снимает барьер входа. По Чалдини #2 (обязательство) — после бесплатного визита конверсия в абонемент 73%. Вопрос «когда» предполагает согласие',
                sidePanelType: 'fitness_trial',
            },
            {
                title: "Запись на триал",
                subtitle: "Закрытие + автоматизация",
                messages: [
                    { id: 5, sender: 'user', text: 'Можно в субботу утром?' },
                    { id: 6, sender: 'agent', text: '✅ Записал!\n\n📅 Суббота, 21 дек, 10:00\n🏋️ Тренер: Алексей (стаж 8 лет, спец. по снижению веса)\n📍 ул. Тверская, 25\n\nВозьмите кроссовки и полотенце. Напомню за день)\n\nКстати, если после триала решите взять абонемент — в декабре скидка 20% на первый месяц с тренером' },
                ],
                insights: [
                    { icon: CheckCircle, label: 'Триал', value: 'Записан', color: '#22c55e' },
                    { icon: Users, label: 'Тренер', value: 'Алексей • 4.9★', color: '#3b82f6' },
                    { icon: Zap, label: 'Стимул', value: '-20% в декабре', color: '#f59e0b' },
                    { icon: Gauge, label: 'Propensity', value: '72 → 88', color: '#8B5CF6' },
                ],
                technique: 'Дефицит + следующий шаг',
                techniqueDesc: 'Скидка с дедлайном (декабрь) создаёт дефицит. Агент уже назначил тренера и дал инструкции — клиент чувствует, что процесс запущен. Push-напоминание обеспечит явку в 92%',
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
        <span className="text-[10px] text-white/40 flex-shrink-0">0:08</span>
    </div>
);

const SidePanelContent = ({ type, niche }: { type: string; niche: NicheScenario }) => {
    switch (type) {
        case 'context_shop':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">29 сигналов контекста</div>
                    {[
                        { label: 'Определение языка', value: 'RU' },
                        { label: 'Детекция намерения', value: 'Покупка' },
                        { label: 'Категория', value: 'Кроссовки / бег' },
                        { label: 'Зеркало клиента', value: 'Разговорный' },
                        { label: 'Роутинг модели', value: 'Flash → 0.3' },
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
                        <div className="text-[10px] text-[#8B5CF6]/60 uppercase tracking-wider mb-2">Профиль клиента</div>
                        <div className="text-[11px] text-white/50 leading-relaxed font-mono">
                            intent: <span className="text-[#22c55e]">purchase</span><br />
                            category: <span className="text-[#8B5CF6]">running_shoes</span><br />
                            budget_max: <span className="text-[#f59e0b]">15000</span><br />
                            propensity: <span className="text-[#22c55e]">0.62</span>
                        </div>
                    </div>
                </div>
            );
        case 'catalog':
            return (
                <div className="space-y-2.5">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">AI-ранжирование каталога</div>
                    {[
                        { name: 'Nike Pegasus 41', price: '12 990₽', match: 97, stock: 4 },
                        { name: 'Asics Gel-Nimbus', price: '14 500₽', match: 89, stock: 2 },
                        { name: 'New Balance 1080', price: '13 900₽', match: 85, stock: 6 },
                    ].map((item, i) => (
                        <div key={i} className={`p-3 rounded-lg border transition-all duration-300 ${i === 0 ? 'bg-[#8B5CF6]/8 border-[#8B5CF6]/20' : 'bg-white/[0.02] border-white/[0.05]'}`} style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 0.12}s both` }}>
                            <div className="flex justify-between items-start mb-1.5">
                                <span className="text-[12px] text-white/90 font-medium">{item.name}</span>
                                <span className="text-[11px] text-[#8B5CF6]">{item.price}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-white/40">Склад: {item.stock} шт</span>
                                <div className="flex items-center gap-1">
                                    <div className="h-1 w-12 rounded-full bg-white/[0.05] overflow-hidden">
                                        <div className="h-full rounded-full bg-[#22c55e]" style={{ width: `${item.match}%`, animation: `barGrow 0.6s ease-out ${0.3 + i * 0.1}s both` }} />
                                    </div>
                                    <span className="text-[10px] text-[#22c55e]">{item.match}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] mt-2" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.5s both' }}>
                        <div className="text-[10px] text-white/40">Чалдини #3: «87% клиентов выбирают» — социальное доказательство увеличивает конверсию на 34%</div>
                    </div>
                </div>
            );
        case 'checkout':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">Бесшовная оплата</div>
                    <div className="grid grid-cols-3 gap-1.5">
                        {['🍏 Apple Pay', '💳 Карта', '⚡ СБП', '🟢 Google Pay', '🟣 ЮKassa', '₿ Crypto'].map((m, i) => (
                            <div key={i} className={`p-2 rounded-lg border text-center text-[9px] ${i === 0 ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/25' : 'bg-white/[0.02] border-white/[0.06]'} text-white/50`} style={{ animation: `fadeSlideIn 0.3s ease-out ${i * 0.06}s both` }}>
                                {m}
                            </div>
                        ))}
                    </div>
                    <div className="p-3 rounded-lg bg-[#22c55e]/5 border border-[#22c55e]/15" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.4s both' }}>
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-3.5 h-3.5 text-[#22c55e]" />
                            <span className="text-[11px] text-white/70">Конверсия в оплату</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-center">
                                <div className="text-[18px] font-medium text-[#22c55e]">96.8%</div>
                                <div className="text-[9px] text-white/30">В чате</div>
                            </div>
                            <div className="text-[11px] text-white/20">vs</div>
                            <div className="text-center">
                                <div className="text-[18px] font-medium text-white/20">34%</div>
                                <div className="text-[9px] text-white/30">Сайт</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#f59e0b]/5 border border-[#f59e0b]/15" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.5s both' }}>
                        <div className="flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-[#f59e0b]" />
                            <span className="text-[10px] text-[#f59e0b]">Cross-sell увеличивает средний чек на +18%</span>
                        </div>
                    </div>
                </div>
            );
        case 'context_rest':
        case 'booking':
        case 'fitness_qualify':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">Контекст-билдер</div>
                    {[
                        { label: 'Ниша', value: niche.name },
                        { label: 'Агент', value: niche.agentName },
                        { label: 'Зеркало', value: 'Авто-адаптация' },
                        { label: 'Модель', value: 'Gemini Flash' },
                        { label: '150+ языков', value: 'Мгновенно' },
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-2.5" style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 0.12}s both` }}>
                            <div className="w-5 h-5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-3 h-3 text-[#22c55e]" />
                            </div>
                            <span className="text-[12px] text-white/60 flex-1">{s.label}</span>
                            <span className="text-[10px] text-[#8B5CF6]">{s.value}</span>
                        </div>
                    ))}
                    <div className="mt-3 p-3 rounded-lg bg-[#8B5CF6]/5 border border-[#8B5CF6]/10" style={{ animation: 'fadeSlideIn 0.4s ease-out 0.6s both' }}>
                        <div className="text-[10px] text-[#8B5CF6]/60 uppercase tracking-wider mb-2">Техники продаж</div>
                        <div className="flex flex-wrap gap-1">
                            {['SPIN Selling', 'Чалдини ×7', 'Challenger', 'BANT', 'Канеман'].map((t, i) => (
                                <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/40">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            );
        case 'order':
        case 'schedule':
        case 'fitness_trial':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">17 инструментов</div>
                    {[
                        { name: 'search_catalog', status: 'done' },
                        { name: 'check_availability', status: 'done' },
                        { name: 'calculate_price', status: 'done' },
                        { name: 'save_client_info', status: 'done' },
                        { name: 'apply_promo', status: 'pending' },
                        { name: 'process_payment', status: 'waiting' },
                    ].map((tool, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]" style={{ animation: `fadeSlideIn 0.3s ease-out ${i * 0.08}s both` }}>
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tool.status === 'done' ? 'bg-[#22c55e]' : tool.status === 'pending' ? 'bg-[#f59e0b] animate-pulse' : 'bg-white/20'}`} />
                            <span className="text-[10px] text-white/50 font-mono">{tool.name}</span>
                        </div>
                    ))}
                    <div className="p-2.5 rounded-lg bg-[#22c55e]/5 border border-[#22c55e]/15 mt-2" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.5s both' }}>
                        <div className="text-[10px] text-[#22c55e] text-center">Инструменты вызываются автоматически в контексте диалога</div>
                    </div>
                </div>
            );
        case 'loyalty':
        case 'fitness_booked':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">Пост-продажная автоматизация</div>
                    <div className="p-4 rounded-lg bg-[#22c55e]/5 border border-[#22c55e]/15 text-center" style={{ animation: 'fadeSlideIn 0.4s ease-out both' }}>
                        <CheckCircle className="w-8 h-8 text-[#22c55e] mx-auto mb-2" />
                        <div className="text-[14px] text-white/90 font-medium mb-1">Сделка закрыта</div>
                        <div className="text-[11px] text-white/50">Без участия менеджера</div>
                    </div>
                    {[
                        { label: 'Push-напоминания', icon: MessageSquare },
                        { label: 'Программа лояльности', icon: Heart },
                        { label: 'Реактивация через 5 дней', icon: Activity },
                        { label: 'Сбор отзывов', icon: TrendingUp },
                        { label: 'Самообучение (RAG)', icon: Brain },
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]" style={{ animation: `fadeSlideIn 0.3s ease-out ${0.15 + i * 0.08}s both` }}>
                            <s.icon className="w-3.5 h-3.5 text-[#8B5CF6] flex-shrink-0" />
                            <span className="text-[11px] text-white/60">{s.label}</span>
                        </div>
                    ))}
                </div>
            );
        case 'voice_confirm':
            return (
                <div className="space-y-3">
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3">Голосовая система</div>
                    <div className="p-3 rounded-lg bg-[#8B5CF6]/5 border border-[#8B5CF6]/20" style={{ animation: 'fadeSlideIn 0.3s ease-out both' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <Volume2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                            <span className="text-[12px] text-white/80 font-medium">ElevenLabs v3 TTS</span>
                        </div>
                        {[
                            { name: 'Триггер', value: 'Бронирование (85)', color: '#ef4444' },
                            { name: 'Профиль', value: 'greeting', color: '#8B5CF6' },
                            { name: 'Режим', value: 'full (<500 симв)', color: '#f59e0b' },
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
                                <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded ${p === 'greeting' ? 'bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/20' : 'bg-white/[0.04] text-white/30'}`}>{p}</span>
                            ))}
                        </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#22c55e]/5 border border-[#22c55e]/15" style={{ animation: 'fadeSlideIn 0.3s ease-out 0.5s both' }}>
                        <div className="text-[10px] text-[#22c55e] text-center">Голос повышает конверсию закрытия на +23%</div>
                    </div>
                </div>
            );
        default:
            return null;
    }
};

export const AiAgentSection = () => {
    const revealRef = useScrollReveal({ stagger: 0.06 });
    const [activeNiche, setActiveNiche] = useState(0);
    const [currentStage, setCurrentStage] = useState(0);
    const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [sidePanelKey, setSidePanelKey] = useState(0);
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
        setSidePanelKey(prev => prev + 1);
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
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            style={animated ? { animation: `messageAppear 0.35s ease-out ${(animIndex || 0) * 0.05}s both` } : undefined}
        >
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed font-sans whitespace-pre-line ${msg.sender === 'user' ? 'bg-[#8B5CF6] text-white rounded-br-md' : 'bg-white/[0.06] text-white/80 rounded-bl-md'}`}>
                {msg.isVoice ? <VoiceMessage /> : msg.text}
            </div>
        </div>
    );

    return (
        <section ref={sectionRef} id="ai-agent" className="relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8 overflow-hidden">
            <div className="absolute w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/[0.03] blur-[100px] top-[20%] right-[-10%] pointer-events-none" />
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
                    <p className="text-[clamp(0.875rem,1.5vw,1.05rem)] text-white/70 mt-4 sm:mt-5 font-sans font-light leading-relaxed max-w-2xl mx-auto">
                        Разрабатываем AI-агента под ваш бизнес. Он общается как живой человек, использует SPIN-продажи и 7 принципов Чалдини, отправляет голосовые и закрывает сделки — пока вы спите.
                    </p>
                </div>

                <div data-reveal className="flex gap-2 sm:gap-3 justify-center flex-wrap mb-6 sm:mb-8">
                    {niches.map((n, i) => (
                        <button
                            key={n.id}
                            onClick={() => handleNicheClick(i)}
                            aria-label={n.name}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] sm:text-[13px] font-sans font-medium transition-all duration-300 border cursor-pointer ${i === activeNiche
                                ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/30 text-white/90 shadow-lg shadow-[#8B5CF6]/10'
                                : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.12]'
                                }`}
                        >
                            <n.icon className="w-4 h-4" style={{ color: i === activeNiche ? n.color : undefined }} />
                            <span>{n.name}</span>
                        </button>
                    ))}
                </div>

                <div data-reveal className="flex gap-1.5 justify-center mb-8 sm:mb-10">
                    {stagesData.map((s, i) => (
                        <button
                            key={`${activeNiche}-${i}`}
                            onClick={() => handleStageClick(i)}
                            aria-label={`Этап ${i + 1}: ${s.title}`}
                            aria-current={i === currentStage ? 'step' : undefined}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-sans transition-all duration-300 border cursor-pointer ${i === currentStage
                                ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/25 text-white/80'
                                : i < currentStage
                                    ? 'bg-white/[0.02] border-white/[0.06] text-white/40'
                                    : 'bg-white/[0.01] border-white/[0.04] text-white/25 hover:text-white/40'
                                }`}
                        >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-medium ${i === currentStage ? 'bg-[#8B5CF6] text-white' : i < currentStage ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-white/[0.05] text-white/25'}`}>
                                {i < currentStage ? '✓' : i + 1}
                            </span>
                            <span className="hidden sm:inline">{s.title}</span>
                        </button>
                    ))}
                    <button
                        onClick={() => setIsPaused(prev => !prev)}
                        aria-label={isPaused ? 'Запустить' : 'Пауза'}
                        className="ml-1 px-2.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-sans border bg-white/[0.01] border-white/[0.04] text-white/30 hover:text-white/50 transition-all duration-300 cursor-pointer"
                    >
                        {isPaused ? '▶' : '⏸'}
                    </button>
                </div>

                <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
                    <div className="lg:col-span-3 order-2 lg:order-1">
                        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.06] h-full">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${niche.color}15` }}>
                                    <Brain className="w-3.5 h-3.5" style={{ color: niche.color }} />
                                </div>
                                <span className="text-[12px] text-white/60 font-sans">Мозг агента</span>
                            </div>
                            <div className="space-y-3">
                                {stage.insights.map((insight, i) => (
                                    <div key={`${activeNiche}-${currentStage}-${i}`} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]" style={{ animation: `fadeSlideIn 0.35s ease-out ${i * 0.08}s both` }}>
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${insight.color}10` }}>
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
                                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="opacity-50"><rect x="0" y="6" width="2.5" height="4" rx="0.5" fill="white"/><rect x="3.5" y="4" width="2.5" height="6" rx="0.5" fill="white"/><rect x="7" y="2" width="2.5" height="8" rx="0.5" fill="white"/><rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="white"/></svg>
                                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="opacity-50"><path d="M7 1C4.5 1 2.3 2 0.8 3.7L2 5C3.2 3.5 5 2.5 7 2.5C9 2.5 10.8 3.5 12 5L13.2 3.7C11.7 2 9.5 1 7 1Z" fill="white"/><path d="M7 4C5.5 4 4.2 4.7 3.3 5.8L4.5 7C5.1 6.2 6 5.5 7 5.5C8 5.5 8.9 6.2 9.5 7L10.7 5.8C9.8 4.7 8.5 4 7 4Z" fill="white"/><circle cx="7" cy="9" r="1.2" fill="white"/></svg>
                                                <div className="flex items-center"><div className="w-[18px] h-[9px] rounded-[2px] border border-white/40 flex items-center p-[1px]"><div className="w-[10px] h-[5px] rounded-[1px] bg-white/50" /></div><div className="w-[1.5px] h-[4px] rounded-r-sm bg-white/30 ml-[0.5px]" /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 pt-1 pb-2 bg-gradient-to-b from-[#0c0a14]/90 to-transparent">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${niche.color}, ${niche.color}cc)`, boxShadow: `0 4px 15px ${niche.color}33` }}>
                                                <niche.icon className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[13px] text-white/90 font-medium font-sans">{niche.agentName}</div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                                                    <span className="text-[10px] text-[#22c55e]/80">онлайн</span>
                                                </div>
                                            </div>
                                            <div className="px-2 py-0.5 rounded-full text-[9px] font-sans border border-white/[0.08] text-white/30">AI</div>
                                        </div>
                                    </div>
                                    <div className="mx-3"><div className="h-px bg-white/[0.06]" /></div>
                                    <div ref={chatRef} className="h-[420px] sm:h-[460px] overflow-y-auto px-3 py-3 space-y-2 scroll-smooth ai-agent-chat-scroll" role="log" aria-label={`Демонстрация AI-агента ${niche.agentName}`} aria-live="polite">
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
                                            <MessageSquare className="w-4 h-4 text-white/20 flex-shrink-0" />
                                            <span className="text-[12px] text-white/20 font-sans">Написать сообщение...</span>
                                            <ArrowRight className="w-4 h-4 text-[#8B5CF6]/40 ml-auto flex-shrink-0" />
                                        </div>
                                    </div>
                                    <div className="flex justify-center pb-2"><div className="w-[120px] h-[4px] rounded-full bg-white/15" /></div>
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
                            <SidePanelContent key={sidePanelKey} type={stage.sidePanelType} niche={niche} />
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
                        <div key={i} className="glow-card rounded-xl p-4 sm:p-5 text-center">
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
