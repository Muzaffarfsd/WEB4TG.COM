import { ShoppingBag, UtensilsCrossed, Scissors, Stethoscope, Dumbbell, GraduationCap, Car, Bot } from "lucide-react";

const services = [
    { icon: ShoppingBag, title: "Интернет-магазины", desc: "Одежда, электроника, часы, парфюмерия, цветы" },
    { icon: UtensilsCrossed, title: "Рестораны и доставка", desc: "Меню, заказы, отслеживание доставки" },
    { icon: Scissors, title: "Салоны красоты", desc: "Онлайн-запись, каталог услуг, отзывы" },
    { icon: Stethoscope, title: "Медицинские центры", desc: "Запись к врачу, история приёмов" },
    { icon: Dumbbell, title: "Фитнес-клубы", desc: "Абонементы, трекинг, бронирование" },
    { icon: GraduationCap, title: "Онлайн-образование", desc: "Курсы, коучинг, вебинары" },
    { icon: Car, title: "Сервисные бизнесы", desc: "Аренда, такси, автомойки, ремонт" },
    { icon: Bot, title: "AI-агент 24/7", desc: "Автоматическая поддержка на 150+ языках" },
];

export const ServicesSection = () => {
    return (
        <section id="services" className="w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-[#09090b] relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03),transparent_70%)]" />
            <div className="max-w-6xl mx-auto relative">
                <div className="text-center mb-10 sm:mb-16">
                    <span className="inline-flex items-center text-xs font-medium text-[#10B981] bg-[#10B981]/10 rounded-full py-1 px-3 font-sans mb-4 ring-1 ring-[#10B981]/20">
                        Услуги
                    </span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal font-instrument-serif text-white tracking-tight">
                        Что мы создаём
                    </h2>
                    <p className="text-sm sm:text-base text-white/60 mt-3 sm:mt-4 max-w-xl mx-auto font-sans">
                        Полнофункциональные Telegram Mini Apps премиум-качества для любой отрасли
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group p-5 sm:p-6 rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.06] hover:ring-[#10B981]/20 hover:bg-[#10B981]/[0.03] transition-all duration-300"
                        >
                            <service.icon className="w-8 h-8 text-[#10B981] mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-base sm:text-lg font-medium text-white font-sans mb-1.5">
                                {service.title}
                            </h3>
                            <p className="text-sm text-white/50 font-sans">
                                {service.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
