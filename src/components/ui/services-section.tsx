import { ShoppingBag, UtensilsCrossed, Scissors, Stethoscope, Dumbbell, GraduationCap, Car, Bot, ArrowUpRight } from "lucide-react";

const services = [
    { icon: ShoppingBag, title: "Интернет-магазины", desc: "Каталог, корзина, оплата, доставка — полноценный e-commerce внутри Telegram", accent: true },
    { icon: UtensilsCrossed, title: "Рестораны и доставка", desc: "Меню, онлайн-заказ, отслеживание курьера в реальном времени" },
    { icon: Scissors, title: "Салоны красоты", desc: "Онлайн-запись, каталог мастеров и услуг, уведомления" },
    { icon: Stethoscope, title: "Медицина", desc: "Запись к врачу, электронная карта, телемедицина" },
    { icon: Dumbbell, title: "Фитнес", desc: "Абонементы, расписание тренировок, бронирование залов" },
    { icon: GraduationCap, title: "Образование", desc: "Онлайн-курсы, прогресс обучения, сертификаты" },
    { icon: Car, title: "Сервисы", desc: "Аренда, бронирование, такси — любые сервисные бизнесы" },
    { icon: Bot, title: "AI-агент", desc: "Автоматическая поддержка 24/7, продажи и аналитика на 150+ языках", accent: true },
];

export const ServicesSection = () => {
    return (
        <section id="services" className="relative w-full py-24 sm:py-32 md:py-40 px-5 sm:px-8">
            <div className="hero-glow w-[400px] h-[400px] top-[20%] right-[10%] bg-[#10B981]/[0.03]" />

            <div className="max-w-6xl mx-auto relative">
                <div className="max-w-xl mb-14 sm:mb-20">
                    <span className="inline-flex items-center text-[11px] font-semibold text-[#10B981] uppercase tracking-[0.15em] font-sans mb-5">
                        <span className="w-8 h-px bg-[#10B981]/40 mr-3" />
                        Услуги
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-[3.5rem] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Telegram Mini Apps
                        <br />
                        <span className="italic gradient-text">для любого бизнеса</span>
                    </h2>
                    <p className="text-base sm:text-lg text-white/35 mt-5 sm:mt-6 font-sans font-light leading-relaxed">
                        Полнофункциональные приложения премиум-класса, которые выглядят и работают как нативные — но без скачивания из App Store.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`group glow-card rounded-2xl p-6 sm:p-7 cursor-default ${service.accent ? 'sm:row-span-1' : ''}`}
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#10B981]/5 flex items-center justify-center border border-[#10B981]/10">
                                    <service.icon className="w-5 h-5 text-[#10B981]" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-[#10B981]/50 transition-colors duration-500" />
                            </div>
                            <h3 className="text-[15px] font-medium text-white/90 font-sans mb-2 tracking-tight">
                                {service.title}
                            </h3>
                            <p className="text-[13px] text-white/30 font-sans leading-relaxed font-light">
                                {service.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
