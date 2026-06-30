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
    'about.text': 'я <strong>Дима Киселев</strong> (qqwozz) — backend-разработчик, работаю с <strong>Python</strong>, <strong>Go</strong> и <strong>C++</strong>.\n\nсоздаю микросервисы, API и high-load системы. мой подход — <strong>чистая архитектура</strong>, производительность и надёжность.\n\nMTUCI — Moscow Technical University of Communications and Informatics. Москва.',
    'stats.repos': 'репозиториев',
    'stats.leetcode': 'leetcode решено',
    'stats.followers': 'фолловеров',
    'stats.languages': 'языков',
    'experience.title': 'опыт работы',
    'experience.role': 'backend-разработчик (стажёр)',
    'experience.yandex.desc': 'разработка и поддержка backend-сервисов в рамках поисковой инфраструктуры. участие в проектировании API, написание модульных и интеграционных тестов. оптимизация производительности серверных компонентов, работа с распределёнными системами и очередями сообщений. code review, документирование, взаимодействие с командой.',
    'experience.vtb.desc': 'разработка микросервисов для внутренних банковских систем. проектирование и реализация REST API для обработки платёжных операций. интеграция с существующей инфраструктурой, работа с реляционными базами данных, написание высоконагруженных компонентов с учётом требований безопасности и отказоустойчивости.',
    'projects.title': 'избранные проекты',
    'projects.p1.desc': 'крипто-биржа с C++ matching engine',
    'projects.p2.desc': 'микросервис платежей',
    'projects.p3.desc': 'интернет-магазин одежды',
    'projects.p4.desc': 'NLP чат-бот на ИИ',
    'projects.p5.desc': 'API + Telegram-бот для записей',
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
    'about.text': 'I\'m <strong>Dima Kiselev</strong> (qqwozz) — backend developer, working with <strong>Python</strong>, <strong>Go</strong> and <strong>C++</strong>.\n\nI build microservices, APIs and high-load systems. My approach is <strong>clean architecture</strong>, performance and reliability.\n\nMTUCI — Moscow Technical University of Communications and Informatics. Moscow.',
    'stats.repos': 'repositories',
    'stats.leetcode': 'leetcode solved',
    'stats.followers': 'followers',
    'stats.languages': 'languages',
    'experience.title': 'work experience',
    'experience.role': 'backend developer (intern)',
    'experience.yandex.desc': 'development and maintenance of backend services within the search infrastructure. participated in API design, wrote unit and integration tests. optimized server components, worked with distributed systems and message queues. code review, documentation, team collaboration.',
    'experience.vtb.desc': 'development of microservices for internal banking systems. designed and implemented REST API for payment processing. integrated with existing infrastructure, worked with relational databases, built high-load components considering security and fault tolerance requirements.',
    'projects.title': 'featured projects',
    'projects.p1.desc': 'crypto exchange with C++ matching engine',
    'projects.p2.desc': 'payment microservice',
    'projects.p3.desc': 'clothing online store',
    'projects.p4.desc': 'NLP AI chatbot',
    'projects.p5.desc': 'API + Telegram bot for bookings',
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
