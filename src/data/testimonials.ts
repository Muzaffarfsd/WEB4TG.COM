export interface Testimonial {
  name: string;
  role: string;
  company: string;
  companyUrl: string;
  rating: number;
  text: string;
  metric: string;
  gradientFrom: string;
  gradientTo: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Алексей К.",
    role: "CEO",
    company: "Flowershop.tg",
    companyUrl: "flowershop.tg",
    rating: 5,
    text: "Запустили магазин цветов в Telegram за 10 дней. Конверсия выросла на 40% по сравнению с сайтом.",
    metric: "+40% конверсия",
    gradientFrom: "#8B5CF6",
    gradientTo: "#6D28D9",
  },
  {
    name: "Мария С.",
    role: "основатель",
    company: "FitLife",
    companyUrl: "fitlife.app",
    rating: 5,
    text: "Приложение для фитнес-студии работает идеально. Клиенты записываются прямо из Telegram.",
    metric: "×3 записи",
    gradientFrom: "#7C3AED",
    gradientTo: "#5B21B6",
  },
  {
    name: "Дмитрий Р.",
    role: "CTO",
    company: "DeliveryBot",
    companyUrl: "deliverybot.ru",
    rating: 5,
    text: "Интеграция с ЮKassa и Stripe заняла один день. Техподдержка отвечает моментально.",
    metric: "NPS 92",
    gradientFrom: "#A78BFA",
    gradientTo: "#7C3AED",
  },
];
