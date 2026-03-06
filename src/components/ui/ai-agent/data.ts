import {
    Bot, TrendingUp,
    Brain, Sparkles, Clock,
    Zap, Shield, Globe, Mic,
    Target, Activity,
    ShoppingBag, UtensilsCrossed, Scissors, Dumbbell,
    Package, Search, Users, Heart, Star,
    Timer, BarChart3, CheckCircle
} from 'lucide-react';

export interface ChatMessage {
    id: number;
    sender: 'user' | 'agent';
    text: string;
    isVoice?: boolean;
}

export interface AgentInfo {
    name: string;
    role: string;
}

export interface NicheScenario {
    id: string;
    icon: typeof Bot;
    name: string;
    shortName: string;
    agentName: string;
    agentRole: string;
    agentTeam: AgentInfo[];
    color: string;
    gradient: string;
    stages: StageData[];
    heroMetric: { value: string; label: string; sub: string };
    beforeAfter: { before: string; after: string; afterMetric: string };
}

export interface StageData {
    title: string;
    subtitle: string;
    messages: ChatMessage[];
    resultCards: ResultCard[];
    propensity: number;
    sidePanelType: string;
}

export interface ResultCard {
    icon: typeof Bot;
    label: string;
    value: string;
    color: string;
    detail?: string;
}

export const VOICE_BAR_HEIGHTS = Array.from({ length: 28 }, (_, i) =>
    6 + Math.sin(i * 0.7) * 8 + (Math.sin(i * 2.1) * 4 + 4)
);

export const AUTOPLAY_STAGE_DURATION = 8000;

export const niches: NicheScenario[] = [
    {
        id: 'shop',
        icon: ShoppingBag,
        name: 'Интернет-магазин',
        shortName: 'Магазин',
        agentName: 'Лина',
        agentRole: 'Sales-агент',
        agentTeam: [
            { name: 'Лина', role: 'Sales-агент' },
            { name: 'Макс', role: 'Склад и логистика' },
            { name: 'Софи', role: 'Аналитик поведения' },
            { name: 'Алекс', role: 'Cross-sell агент' },
            { name: 'Нора', role: 'Support и возвраты' },
            { name: 'Виктор', role: 'CRM-синхронизация' },
        ],
        color: '#8B5CF6',
        gradient: 'from-[#8B5CF6] to-[#6D28D9]',
        heroMetric: { value: '96.8%', label: 'конверсия в оплату', sub: '6 агентов работают вместе' },
        beforeAfter: { before: 'Один менеджер не успевает — склад, подбор, оплата', after: '6 AI-агентов: подбор, склад, оплата, допродажа — параллельно за 3 мин', afterMetric: '+185% конверсия' },
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
        agentTeam: [
            { name: 'Марк', role: 'Консьерж-агент' },
            { name: 'Алиса', role: 'Меню и рекомендации' },
            { name: 'Кирилл', role: 'Логистика доставки' },
            { name: 'Ева', role: 'Лояльность и бонусы' },
            { name: 'Тимур', role: 'Аналитика заказов' },
        ],
        color: '#f59e0b',
        gradient: 'from-[#f59e0b] to-[#d97706]',
        heroMetric: { value: '+27%', label: 'средний чек', sub: '5 агентов координируют заказ' },
        beforeAfter: { before: 'Ночью и в выходные заказы теряются', after: '5 AI-агентов: меню, оплата, доставка, бонусы — работают 24/7', afterMetric: '+27% чек' },
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
        agentTeam: [
            { name: 'Софи', role: 'Администратор-агент' },
            { name: 'Лера', role: 'Подбор мастера' },
            { name: 'Дина', role: 'Голосовой агент' },
            { name: 'Игорь', role: 'CRM и расписание' },
            { name: 'Мила', role: 'Допродажи и уход' },
            { name: 'Артём', role: 'Напоминания и лояльность' },
        ],
        color: '#ec4899',
        gradient: 'from-[#ec4899] to-[#be185d]',
        heroMetric: { value: '89%', label: 'записей без менеджера', sub: '6 агентов ведут клиента' },
        beforeAfter: { before: 'Администратор не берёт трубку — клиент уходит к конкуренту', after: '6 AI-агентов: запись, подбор мастера, напоминания, допродажа — мгновенно', afterMetric: '89% без менеджера' },
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
        agentTeam: [
            { name: 'Макс', role: 'Консультант-агент' },
            { name: 'Яна', role: 'Подбор тренера' },
            { name: 'Денис', role: 'Расписание и слоты' },
            { name: 'Оля', role: 'Мотивация и retention' },
            { name: 'Руслан', role: 'Аналитик прогресса' },
        ],
        color: '#22c55e',
        gradient: 'from-[#22c55e] to-[#16a34a]',
        heroMetric: { value: '73%', label: 'триалов → абонемент', sub: '5 агентов ведут клиента к цели' },
        beforeAfter: { before: 'Звонят узнать цену — слышат прайс-лист и кладут трубку', after: '5 AI-агентов: подбор, запись, мотивация, прогресс — полный цикл', afterMetric: '73% → абонемент' },
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
