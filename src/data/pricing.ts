import { MessageSquare, Brain, Zap, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const appDevelopmentFeatures = [
  "Дизайн интерфейса премиум-класса",
  "Полная интеграция с Telegram Bot API",
  "Платежи: Stripe, ЮKassa, Apple Pay, СБП",
  "Каталог, корзина, заказы, CRM",
  "Push-уведомления (95% открытие)",
  "PWA — работает офлайн",
];

export interface SubscriptionPlan {
  name: string;
  price: string;
  popular: boolean;
  features: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    name: "Минимальный",
    price: "9 900",
    popular: false,
    features: [
      "Хостинг (99.9% uptime)",
      "Мелкие правки и фиксы",
      "Поддержка по email",
      "Бэкапы — раз в месяц",
    ],
  },
  {
    name: "Стандартный",
    price: "14 900",
    popular: true,
    features: [
      "Ответ за 2 часа в рабочее время",
      "Бесплатные обновления и доработки",
      "Бэкапы — раз в неделю",
      "Аналитика, отчёты, мониторинг",
    ],
  },
  {
    name: "Премиум",
    price: "24 900",
    popular: false,
    features: [
      "Персональный менеджер проекта",
      "Бизнес-консалтинг и стратегия",
      "Ежедневные бэкапы + мониторинг",
      "Приоритет в очереди разработки",
    ],
  },
];

export interface AiFeature {
  icon: LucideIcon;
  text: string;
}

export const aiAgentFeatures: AiFeature[] = [
  { icon: MessageSquare, text: "До 20 агентов: продажи, поддержка, аналитика, логистика — параллельно 24/7" },
  { icon: Brain, text: "Оркестратор координирует команду агентов, каждый специализирован под свою задачу" },
  { icon: Zap, text: "17 AI-инструментов: корзина, оплата, CRM, бронирование, голос" },
  { icon: BarChart3, text: "Аналитика: конверсия, LTV, propensity score в реальном времени" },
];

export const aiAgentStats = [
  { value: '73%', label: 'диалогов → продажа' },
  { value: '0.3с', label: 'время ответа' },
  { value: '96.8%', label: 'конверсия оплаты' },
];
