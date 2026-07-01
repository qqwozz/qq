import { useState, useRef, useEffect } from 'react'
import { TranslationKey } from '../i18n'

interface TerminalProps {
  t: (key: TranslationKey) => string
}

const COMMANDS: Record<string, (t: (k: TranslationKey) => string) => string[]> = {
  help: (t) => [
    'доступные команды:',
    '',
    '  help       — показать эту справку',
    '  whoami     — кто я',
    '  about      — обо мне',
    '  projects   — мои проекты',
    '  stack      — стек технологий',
    '  contact    — как связаться',
    '  neofetch   — системная инфа',
    '  clear      — очистить терминал',
  ],
  whoami: () => [
    'дима киселев (qqwozz)',
    'backend-разработчик',
    'python · go · c++',
  ],
  about: (t) => [
    'я backend-разработчик, работаю с python, go и c++.',
    'создаю микросервисы, api и high-load системы.',
    'мой подход — чистая архитектура, производительность и надёжность.',
    '',
    'mtuci — moscow technical university of communications and informatics.',
  ],
  projects: () => [
    '  01  qw trading platform  — крипто-биржа с c++ matching engine',
    '  02  qw_pay               — микросервис платежей',
    '  03  enf-shop             — интернет-магазин одежды',
    '  04  ai-chat-bot          — nlp чат-бот на ии',
    '  05  autoadmin            — api + telegram-бот для записей',
  ],
  stack: () => [
    '  backend:   python, go, c++, fastapi, django, grpc',
    '  databases: postgresql, mysql, redis, sqlite',
    '  infra:     docker, linux, nginx, gunicorn',
    '  tools:     git, github actions, postman, vs code',
  ],
  contact: () => [
    '  telegram:  t.me/qqqwozz',
    '  github:    github.com/qqwozz',
    '  email:     offconix@gmail.com',
    '  leetcode:  leetcode.com/u/oonixxxxx',
    '  instagram: instagram.com/qqqwozz',
  ],
  neofetch: () => [
    '       qqwozz@portfolio',
    '       ─────────────────',
    '  os:    ubuntu 24.04',
    '  host:  qqwozz portfolio v2.0',
    '  kernel: react 18.3 + vite 5.4',
    '  shell:  typescript 5.6',
    '  wm:     glass-morphism',
    '  theme:  black / white / dark blue',
    '  memory: 64mb / ∞',
    '',
    '  ████████████████████  100%',
  ],
  clear: () => [],
}

export function TerminalSection({ t }: TerminalProps) {
  const [lines, setLines] = useState<string[]>([
    'портфолио-терминал v2.0',
    'введите "help" для списка команд',
    '',
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const exec = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const prompt = `$ ${cmd}`

    if (!trimmed) {
      setLines(prev => [...prev, prompt])
      return
    }

    if (trimmed === 'clear') {
      setLines([])
      return
    }

    const handler = COMMANDS[trimmed]
    const output = handler ? handler(t) : [`команда не найдена: ${trimmed}`, 'введите "help" для списка команд']

    setLines(prev => [...prev, prompt, ...output, ''])
    setHistory(prev => [trimmed, ...prev])
    setHistoryIdx(-1)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      exec(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0) {
        const next = Math.min(historyIdx + 1, history.length - 1)
        setHistoryIdx(next)
        setInput(history[next])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx > 0) {
        const next = historyIdx - 1
        setHistoryIdx(next)
        setInput(history[next])
      } else {
        setHistoryIdx(-1)
        setInput('')
      }
    }
  }

  return (
    <section className="section" id="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="container">
        <div className="section-number">
          004
          <div className="section-number-progress" />
        </div>
        <h2 className="section-title anim">терминал</h2>
        <div className="terminal anim">
          <div className="terminal-header">
            <span className="terminal-dot red" />
            <span className="terminal-dot yellow" />
            <span className="terminal-dot green" />
            <span className="terminal-title">qqwozz@portfolio ~ $</span>
          </div>
          <div className="terminal-body">
            {lines.map((line, i) => (
              <div key={i} className="terminal-line">
                {line.startsWith('$ ') ? (
                  <><span className="terminal-prompt">$ </span>{line.slice(2)}</>
                ) : (
                  <span className="terminal-output">{line}</span>
                )}
              </div>
            ))}
            <div className="terminal-input-line">
              <span className="terminal-prompt">$ </span>
              <input
                ref={inputRef}
                className="terminal-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoFocus
              />
            </div>
            <div ref={endRef} />
          </div>
        </div>
      </div>
    </section>
  )
}
