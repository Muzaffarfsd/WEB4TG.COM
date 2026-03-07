export interface PricingPackage {
  name: string;
  badge: string;
  price: string;
  period: string;
  description: string;
  popular: boolean;
  features: string[];
  support: string;
  cta: string;
}

export const pricingPackages: PricingPackage[] = [
  {
    name: 'Старт',
    badge: 'Для запуска',
    price: '150 000',
    period: '₽',
    description: 'Базовое приложение за 7 дней. Идеально для тестирования канала продаж в Telegram.',
    popular: false,
    features: [
      'Каталог до 100 товаров/услуг',
      'Корзина и оформление заказа',
      'Оплата: ЮKassa, СБП',
      'Push-уведомления',
      'Адаптивный дизайн',
      'Хостинг и бэкапы (раз в месяц)',
    ],
    support: 'Поддержка по email · 9 900 ₽/мес',
    cta: 'Начать проект',
  },
  {
    name: 'Бизнес',
    badge: 'Популярный',
    price: '300 000',
    period: '₽',
    description: 'Полнофункциональное приложение за 14 дней. Для бизнеса, готового масштабироваться.',
    popular: true,
    features: [
      'Безлимитный каталог + фильтры и поиск',
      'Stripe, ЮKassa, Apple Pay, Google Pay, СБП',
      'CRM: заказы, клиенты, аналитика',
      'Программа лояльности и промокоды',
      'Интеграция с 1С, AmoCRM, Bitrix24',
      'Приоритетная поддержка (ответ за 2ч)',
    ],
    support: 'Обновления + бэкапы раз в неделю · 14 900 ₽/мес',
    cta: 'Выбрать Бизнес',
  },
  {
    name: 'Премиум',
    badge: 'Максимум',
    price: '500 000',
    period: '₽',
    description: 'Приложение + мультиагентная AI-система за 15 дней. Полная автоматизация продаж.',
    popular: false,
    features: [
      'Всё из пакета «Бизнес»',
      'До 20 AI-агентов: продажи, поддержка, аналитика',
      'Голосовой ассистент (ElevenLabs)',
      'Автоквалификация лидов и propensity score',
      'Персональный менеджер проекта',
      'Ежедневные бэкапы + мониторинг 24/7',
    ],
    support: 'Бизнес-консалтинг + AI-подписка · 24 900 ₽/мес',
    cta: 'Обсудить Премиум',
  },
];
