import type { Metadata } from 'next';
import '@/index.css';

export const metadata: Metadata = {
  title: 'Разработка Telegram Mini Apps под ключ — от 150 000₽ | WEB4TG Studio',
  description:
    'Запускаем Telegram Mini Apps за 7–14 дней: интернет-магазины, доставка, бронирование, мультиагентные AI-системы до 20 агентов. Прямые платежи без комиссий маркетплейсов. 99.9% uptime, 150+ языков, поддержка 24/7. Первая демо через 3 дня.',
  authors: [{ name: 'WEB4TG Studio' }],
  metadataBase: new URL('https://web4tg.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'WEB4TG Studio',
    title: 'Telegram Mini Apps под ключ за 7–14 дней — WEB4TG Studio',
    description:
      'Интернет-магазины, доставка, бронирование, мультиагентный AI (до 20 агентов) в Telegram. Прямые платежи без комиссий. Первая демо через 3 дня. От 150 000₽.',
    url: 'https://web4tg.com/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WEB4TG Studio — разработка Telegram Mini Apps для бизнеса',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Telegram Mini Apps под ключ за 7–14 дней — WEB4TG Studio',
    description:
      'Интернет-магазины, доставка, мультиагентный AI (до 20 агентов) в Telegram. Без комиссий. Первая демо через 3 дня.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: { url: '/favicon.svg', type: 'image/svg+xml' },
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  other: {
    'color-scheme': 'dark',
    'theme-color': '#050505',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['ProfessionalService', 'Organization'],
      '@id': 'https://web4tg.com/#organization',
      name: 'WEB4TG Studio',
      url: 'https://web4tg.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://web4tg.com/og-image.png',
        width: 1200,
        height: 630,
      },
      image: 'https://web4tg.com/og-image.png',
      description:
        'Студия разработки премиальных Telegram Mini Apps для бизнеса: e-commerce, доставка, бронирование, мультиагентные AI-системы до 20 агентов',
      foundingDate: '2024',
      priceRange: 'от 150 000₽',
      areaServed: { '@type': 'Country', name: 'Россия' },
      knowsLanguage: ['ru', 'en'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        url: 'https://t.me/w4tg_bot',
        availableLanguage: ['Russian', 'English'],
      },
      sameAs: ['https://t.me/w4tg_bot', 'https://t.me/web4tg'],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '3',
        reviewCount: '3',
      },
      review: [
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Алексей К.' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody:
            'Запустили магазин цветов в Telegram за 10 дней. Конверсия выросла на 40% по сравнению с сайтом.',
          datePublished: '2024-12-01',
        },
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Мария С.' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody:
            'Приложение для фитнес-студии работает идеально. Клиенты записываются прямо из Telegram.',
          datePublished: '2025-01-15',
        },
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Дмитрий Р.' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody:
            'Интеграция с ЮKassa и Stripe заняла один день. Техподдержка отвечает моментально.',
          datePublished: '2025-02-10',
        },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Услуги WEB4TG Studio',
        itemListElement: [
          {
            '@type': 'OfferCatalog',
            name: 'Разработка',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Разработка Telegram Mini App под ключ',
                  description:
                    'Полный цикл: дизайн, разработка, интеграция платежей (Stripe, ЮKassa, Apple Pay, СБП), каталог, корзина, заказы, CRM, push-уведомления, PWA',
                },
                priceCurrency: 'RUB',
                price: '150000',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  priceCurrency: 'RUB',
                  price: '150000',
                  unitText: 'проект',
                  description: 'от 150 000₽, срок 7–14 дней, предоплата 35%',
                },
              },
            ],
          },
          {
            '@type': 'OfferCatalog',
            name: 'Подписки на поддержку',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Подписка «Минимальная»',
                  description:
                    'Хостинг 99.9% uptime, мелкие правки, email-поддержка, ежемесячные бэкапы',
                },
                priceCurrency: 'RUB',
                price: '9900',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  priceCurrency: 'RUB',
                  price: '9900',
                  unitText: 'месяц',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Подписка «Стандарт»',
                  description:
                    'Ответ за 2 часа, бесплатные обновления, еженедельные бэкапы, аналитика и мониторинг',
                },
                priceCurrency: 'RUB',
                price: '14900',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  priceCurrency: 'RUB',
                  price: '14900',
                  unitText: 'месяц',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Подписка «Премиум»',
                  description:
                    'Персональный менеджер, бизнес-консалтинг, ежедневные бэкапы + мониторинг, приоритет в очереди разработки',
                },
                priceCurrency: 'RUB',
                price: '24900',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  priceCurrency: 'RUB',
                  price: '24900',
                  unitText: 'месяц',
                },
              },
            ],
          },
          {
            '@type': 'OfferCatalog',
            name: 'Мультиагентные AI-системы',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Мультиагентная AI-система для бизнеса',
                  description:
                    'До 20 специализированных AI-агентов: продажи, поддержка, аналитика, логистика, CRM, голосовой агент. Оркестратор координирует команду 24/7 на 150+ языках. Gemini 2.5 Pro + ElevenLabs v3',
                },
                priceCurrency: 'RUB',
                price: '200000',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  priceCurrency: 'RUB',
                  price: '200000',
                  unitText: 'проект',
                  description: 'от 200 000₽ разработка + от 19 900₽/мес подписка',
                },
              },
            ],
          },
        ],
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://web4tg.com/#service-ecommerce',
      name: 'Интернет-магазины в Telegram',
      description:
        'Каталог, корзина, оплата, доставка — полноценный e-commerce внутри Telegram',
      provider: { '@id': 'https://web4tg.com/#organization' },
      serviceType: 'Telegram Mini App Development',
      areaServed: { '@type': 'Country', name: 'Россия' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: '150000',
        description: 'от 150 000₽',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://web4tg.com/#service-restaurants',
      name: 'Telegram Mini App для ресторанов',
      description: 'Меню, заказы, отслеживание курьера — всё в Telegram',
      provider: { '@id': 'https://web4tg.com/#organization' },
      serviceType: 'Telegram Mini App Development',
      areaServed: { '@type': 'Country', name: 'Россия' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: '150000',
        description: 'от 150 000₽',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://web4tg.com/#service-beauty',
      name: 'Telegram Mini App для бьюти-индустрии',
      description: 'Онлайн-запись, каталог мастеров в Telegram',
      provider: { '@id': 'https://web4tg.com/#organization' },
      serviceType: 'Telegram Mini App Development',
      areaServed: { '@type': 'Country', name: 'Россия' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: '150000',
        description: 'от 150 000₽',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://web4tg.com/#service-medical',
      name: 'Telegram Mini App для медицины',
      description: 'Запись к врачу, телемедицина в Telegram',
      provider: { '@id': 'https://web4tg.com/#organization' },
      serviceType: 'Telegram Mini App Development',
      areaServed: { '@type': 'Country', name: 'Россия' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: '150000',
        description: 'от 150 000₽',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://web4tg.com/#service-fitness',
      name: 'Telegram Mini App для фитнеса',
      description: 'Абонементы, расписание, трекинг в Telegram',
      provider: { '@id': 'https://web4tg.com/#organization' },
      serviceType: 'Telegram Mini App Development',
      areaServed: { '@type': 'Country', name: 'Россия' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: '150000',
        description: 'от 150 000₽',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://web4tg.com/#service-education',
      name: 'Telegram Mini App для образования',
      description: 'Курсы, прогресс, сертификаты в Telegram',
      provider: { '@id': 'https://web4tg.com/#organization' },
      serviceType: 'Telegram Mini App Development',
      areaServed: { '@type': 'Country', name: 'Россия' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: '150000',
        description: 'от 150 000₽',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://web4tg.com/#service-services',
      name: 'Telegram Mini App для сервисов',
      description: 'Аренда, бронирование, такси в Telegram',
      provider: { '@id': 'https://web4tg.com/#organization' },
      serviceType: 'Telegram Mini App Development',
      areaServed: { '@type': 'Country', name: 'Россия' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: '150000',
        description: 'от 150 000₽',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://web4tg.com/#service-ai-agent',
      name: 'Мультиагентная AI-система для бизнеса',
      description:
        'До 20 специализированных AI-агентов: продажи, поддержка, аналитика, логистика — команда работает 24/7 на 150+ языках',
      provider: { '@id': 'https://web4tg.com/#organization' },
      serviceType: 'AI Agent Development',
      areaServed: { '@type': 'Country', name: 'Россия' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: '200000',
        description: 'от 200 000₽ разработка + от 19 900₽/мес подписка',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://web4tg.com/#website',
      url: 'https://web4tg.com',
      name: 'WEB4TG Studio',
      publisher: { '@id': 'https://web4tg.com/#organization' },
      inLanguage: 'ru',
    },
    {
      '@type': 'WebPage',
      '@id': 'https://web4tg.com/#webpage',
      url: 'https://web4tg.com',
      name: 'Разработка Telegram Mini Apps под ключ — WEB4TG Studio',
      description:
        'Запускаем Telegram Mini Apps за 7–14 дней: интернет-магазины, доставка, бронирование, мультиагентные AI-системы до 20 агентов. Без комиссий маркетплейсов.',
      isPartOf: { '@id': 'https://web4tg.com/#website' },
      about: { '@id': 'https://web4tg.com/#organization' },
      inLanguage: 'ru',
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', "meta[name='description']"],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://web4tg.com/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Сколько стоит разработка Telegram Mini App?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Стоимость зависит от сложности проекта. Простое приложение — от 150 000 ₽, средний проект — от 300 000 ₽, сложный кастомный продукт — от 500 000 ₽. Точную стоимость рассчитаем после обсуждения задачи.',
          },
        },
        {
          '@type': 'Question',
          name: 'Какие сроки разработки?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Средний срок — 14 дней от заявки до запуска. Простые проекты делаем за 7 дней, сложные — до 30 дней. Первую демо-версию показываем через 3 дня.',
          },
        },
        {
          '@type': 'Question',
          name: 'Что входит в подписку после запуска?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Хостинг с 99.9% uptime, техническая поддержка, обновления, бэкапы и мониторинг. Три тарифа на выбор — от 9 900 ₽/мес.',
          },
        },
        {
          '@type': 'Question',
          name: 'Можно ли интегрировать оплату?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Да, мы подключаем Stripe, ЮKassa, Apple Pay, Google Pay и СБП. Все платежи проходят напрямую на ваш счёт — без комиссий с нашей стороны.',
          },
        },
        {
          '@type': 'Question',
          name: 'Как устроена поддержка после запуска?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Персональный менеджер на связи в Telegram. Время ответа — от 2 часов (стандарт) до 30 минут (премиум). Мониторим работу приложения 24/7.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" prefix="og: https://ogp.me/ns#">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=5" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
