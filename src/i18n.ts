import { useState, useEffect, useCallback } from 'react'

const translations = {
  ru: {
    'nav.about': 'обо мне',
    'nav.experience': 'опыт',
    'nav.projects': 'проекты',
    'nav.stack': 'стек',
    'nav.contact': 'связаться',
    'hero.subtitle': 'back-end developer',
    'about.label': 'обо мне',
    'about.text': 'я <strong>Дима Киселев</strong> (qqwozz) — backend-разработчик, работаю с <strong>Python</strong>, <strong>Go</strong> и <strong>C++</strong>.\n\nсоздаю микросервисы, API и high-load системы. мой подход — <strong>чистая архитектура</strong>, производительность и надёжность.\n\nсреди моих проектов — <strong>крипто-биржа</strong> с C++ matching engine, <strong>микросервис платежей</strong> на Go и <strong>NLP чат-бот</strong> на Python.\n\nMTUCI — Moscow Technical University of Communications and Informatics. Москва.',
    'stats.repos': 'репозиториев',
    'stats.leetcode': 'leetcode решено',
    'stats.followers': 'фолловеров',
    'stats.languages': 'языков',
    'experience.title': 'опыт работы',
    'experience.role': 'backend-разработчик (стажёр)',
    'experience.yandex.type': 'стажировка',
    'experience.yandex.task1': 'разработка и сопровождение микросервисов для поисковой инфраструктуры Яндекса',
    'experience.yandex.task2': 'проектирование и реализация gRPC API для обработки запросов в распределённой системе',
    'experience.yandex.task3': 'написание модульных и интеграционных тестов, покрытие кода >80%',
    'experience.yandex.task4': 'оптимизация производительности серверных компонентов, снижение latency на 15%',
    'experience.vtb.type': 'стажировка',
    'experience.vtb.task1': 'разработка микросервисов для обработки платёжных операций в банковской системе',
    'experience.vtb.task2': 'реализация REST API для интеграции с внутренними системами банка',
    'experience.vtb.task3': 'работа с PostgreSQL, проектирование схем хранения финансовых данных',
    'experience.vtb.task4': 'контейнеризация сервисов с Docker, настройка CI/CD пайплайнов',
    'projects.title': 'избранные проекты',
    'projects.p1.desc': 'крипто-биржа с C++ matching engine',
    'projects.p1.about': 'высокопроизводительная крипто-биржа с торговым ядром на C++. архитектура из 6 микросервисов: API Gateway, User, Account, Order, Portfolio и Matching Engine. обрабатывает 1000+ ордеров/сек с латентностью <100мс.',
    'projects.p1.feat1': 'matching engine на C++ с Price-Time Priority',
    'projects.p1.feat2': 'limit и market ордера',
    'projects.p1.feat3': 'JWT аутентификация',
    'projects.p1.feat4': 'React фронтенд',
    'projects.p2.desc': 'микросервис платежей',
    'projects.p2.about': 'платёжная система с мультивалютными счетами, конвертацией по реальным курсам (200+ валют) и гибридной антифрод-системой. C++ движок проверяет velocity <1мс, Python скоринг блокирует подозрительные транзакции.',
    'projects.p2.feat1': 'ACID-транзакции с идемпотентностью',
    'projects.p2.feat2': 'C++ антифрод-движок + Python скоринг',
    'projects.p2.feat3': 'JWT + OTP аутентификация',
    'projects.p2.feat4': 'реальные курсы валют (Frankfurter API)',
    'projects.p3.desc': 'интернет-магазин одежды',
    'projects.p3.about': 'полнофункциональный e-commerce с каталогом, фильтрацией, умной корзиной и приёмом платежей через Stripe. построен на Django с HTMX для динамичного UI без перезагрузок.',
    'projects.p3.feat1': 'фильтрация по категориям, размерам, цене',
    'projects.p3.feat2': 'корзина без перезагрузки (HTMX)',
    'projects.p3.feat3': 'Stripe интеграция (тестовый режим)',
    'projects.p3.feat4': 'production-ready Docker (Nginx + Gunicorn)',
    'projects.p4.desc': 'NLP чат-бот на ИИ',
    'projects.p4.about': 'веб-чат для общения с AI-моделью GigaChat от Сбербанка. поддерживает контекст диалога, анимацию набора текста и работает на русском языке.',
    'projects.p4.feat1': 'GigaChat API (NLP от Сбербанка)',
    'projects.p4.feat2': 'контекст диалога в течение сессии',
    'projects.p4.feat3': 'анимация набора текста',
    'projects.p4.feat4': 'OAuth 2.0 аутентификация',
    'projects.p5.desc': 'API + Telegram-бот для записей',
    'projects.p5.about': 'backend API + Telegram-бот для управления записями к мастерам (салоны красоты и т.д.). 13 таблиц в БД, расписание, тарифы, блэклисты, система no-show.',
    'projects.p5.feat1': 'REST API + Telegram бот',
    'projects.p5.feat2': 'расписание и свободные слоты',
    'projects.p5.feat3': 'блэклисты и реферальные коды',
    'projects.p5.feat4': 'Clean Architecture (Go)',
    'stack.title': 'стек технологий',
    'stack.backend': 'бэкенд',
    'stack.databases': 'базы данных',
    'stack.infra': 'инфраструктура',
    'stack.tools': 'инструменты',
    'skill.expert': 'эксперт',
    'skill.advanced': 'продвинутый',
    'skill.intermediate': 'средний',
    'contact.title': 'связаться<br />со мной',
    'footer.contact': 'связаться',
    'aria.menu': 'Меню',
    'aria.top': 'Наверх',
  },
  en: {
    'nav.about': 'about',
    'nav.experience': 'experience',
    'nav.projects': 'projects',
    'nav.stack': 'stack',
    'nav.contact': 'contact',
    'hero.subtitle': 'back-end developer',
    'about.label': 'about me',
    'about.text': 'I\'m <strong>Dima Kiselev</strong> (qqwozz) — backend developer, working with <strong>Python</strong>, <strong>Go</strong> and <strong>C++</strong>.\n\nI build microservices, APIs and high-load systems. My approach is <strong>clean architecture</strong>, performance and reliability.\n\nAmong my projects — a <strong>crypto exchange</strong> with C++ matching engine, a <strong>payment microservice</strong> in Go and an <strong>NLP chatbot</strong> in Python.\n\nMTUCI — Moscow Technical University of Communications and Informatics. Moscow.',
    'stats.repos': 'repositories',
    'stats.leetcode': 'leetcode solved',
    'stats.followers': 'followers',
    'stats.languages': 'languages',
    'experience.title': 'work experience',
    'experience.role': 'backend developer (intern)',
    'experience.yandex.type': 'internship',
    'experience.yandex.task1': 'developed and maintained microservices for Yandex search infrastructure',
    'experience.yandex.task2': 'designed and implemented gRPC API for distributed system request processing',
    'experience.yandex.task3': 'wrote unit and integration tests, achieved >80% code coverage',
    'experience.yandex.task4': 'optimized server component performance, reduced latency by 15%',
    'experience.vtb.type': 'internship',
    'experience.vtb.task1': 'developed microservices for payment processing in banking systems',
    'experience.vtb.task2': 'implemented REST API for integration with internal bank systems',
    'experience.vtb.task3': 'worked with PostgreSQL, designed data storage schemas for financial data',
    'experience.vtb.task4': 'containerized services with Docker, configured CI/CD pipelines',
    'projects.title': 'featured projects',
    'projects.p1.desc': 'crypto exchange with C++ matching engine',
    'projects.p1.about': 'high-performance crypto exchange with a C++ trading engine. architecture of 6 microservices: API Gateway, User, Account, Order, Portfolio and Matching Engine. handles 1000+ orders/sec with <100ms latency.',
    'projects.p1.feat1': 'C++ matching engine with Price-Time Priority',
    'projects.p1.feat2': 'limit and market orders',
    'projects.p1.feat3': 'JWT authentication',
    'projects.p1.feat4': 'React frontend',
    'projects.p2.desc': 'payment microservice',
    'projects.p2.about': 'payment system with multi-currency accounts, real-time conversion (200+ currencies) and hybrid anti-fraud. C++ engine checks velocity <1ms, Python scoring blocks suspicious transactions.',
    'projects.p2.feat1': 'ACID transactions with idempotency',
    'projects.p2.feat2': 'C++ anti-fraud engine + Python scoring',
    'projects.p2.feat3': 'JWT + OTP authentication',
    'projects.p2.feat4': 'real exchange rates (Frankfurter API)',
    'projects.p3.desc': 'clothing online store',
    'projects.p3.about': 'full-featured e-commerce with catalog, filtering, smart cart and Stripe payments. built on Django with HTMX for dynamic UI without page reloads.',
    'projects.p3.feat1': 'filtering by category, size, price',
    'projects.p3.feat2': 'cart without reload (HTMX)',
    'projects.p3.feat3': 'Stripe integration (test mode)',
    'projects.p3.feat4': 'production-ready Docker (Nginx + Gunicorn)',
    'projects.p4.desc': 'NLP AI chatbot',
    'projects.p4.about': 'web chat for interacting with GigaChat AI model from Sberbank. supports dialog context, typing animation and works in Russian.',
    'projects.p4.feat1': 'GigaChat API (Sberbank NLP)',
    'projects.p4.feat2': 'dialog context within session',
    'projects.p4.feat3': 'typing animation',
    'projects.p4.feat4': 'OAuth 2.0 authentication',
    'projects.p5.desc': 'API + Telegram bot for bookings',
    'projects.p5.about': 'backend API + Telegram bot for managing service appointments (beauty salons, etc.). 13 DB tables, scheduling, tariffs, blacklists, no-show system.',
    'projects.p5.feat1': 'REST API + Telegram bot',
    'projects.p5.feat2': 'schedule and available slots',
    'projects.p5.feat3': 'blacklists and referral codes',
    'projects.p5.feat4': 'Clean Architecture (Go)',
    'stack.title': 'tech stack',
    'stack.backend': 'backend',
    'stack.databases': 'databases',
    'stack.infra': 'infrastructure',
    'stack.tools': 'tools',
    'skill.expert': 'expert',
    'skill.advanced': 'advanced',
    'skill.intermediate': 'intermediate',
    'contact.title': 'get in<br />touch',
    'footer.contact': 'contact',
    'aria.menu': 'Menu',
    'aria.top': 'Back to top',
  },
} as const

type Lang = keyof typeof translations
export type TranslationKey = keyof typeof translations['ru']

function detectLang(): Lang {
  const nav = (navigator.language || '').toLowerCase()
  if (nav.startsWith('ru')) return 'ru'
  return 'en'
}

const ipApis = [
  'https://ipapi.co/json/',
  'https://ipwho.io/',
  'https://freeipapi.com/api/json',
]

export function useLanguage() {
  const [lang, setLang] = useState<Lang>(detectLang)

  useEffect(() => {
    const detect = async () => {
      for (const url of ipApis) {
        try {
          const res = await fetch(url)
          const data = await res.json()
          const code = data.country_code || data.countryCode
          if (code) {
            setLang(code === 'RU' ? 'ru' : 'en')
            return
          }
        } catch {
          // try next API
        }
      }
    }
    detect()
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (key: TranslationKey): string => translations[lang][key] ?? translations['ru'][key],
    [lang]
  )

  return { lang, t }
}
