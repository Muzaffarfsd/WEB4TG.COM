import { ShoppingBag, UtensilsCrossed, Scissors, Stethoscope, Dumbbell, GraduationCap, Car, Bot } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Service {
  icon: LucideIcon;
  title: string;
  desc: string;
  large?: boolean;
  href: string;
}

export const services: Service[] = [
  { icon: ShoppingBag, title: "Интернет-магазины", desc: "Каталог, корзина, оплата, доставка — полноценный e-commerce внутри Telegram", large: true, href: "#case-studies" },
  { icon: UtensilsCrossed, title: "Рестораны", desc: "Меню, заказы, отслеживание курьера", href: "#pricing" },
  { icon: Scissors, title: "Бьюти", desc: "Онлайн-запись, каталог мастеров", href: "#pricing" },
  { icon: Stethoscope, title: "Медицина", desc: "Запись к врачу, телемедицина", href: "#pricing" },
  { icon: Dumbbell, title: "Фитнес", desc: "Абонементы, расписание, трекинг", href: "#pricing" },
  { icon: GraduationCap, title: "Образование", desc: "Курсы, прогресс, сертификаты", href: "#pricing" },
  { icon: Car, title: "Сервисы", desc: "Аренда, бронирование, такси", href: "#pricing" },
  { icon: Bot, title: "Мультиагентный AI", desc: "До 20 специализированных AI-агентов: продажи, поддержка, аналитика, логистика — команда работает 24/7", large: true, href: "#ai-agent" },
];
