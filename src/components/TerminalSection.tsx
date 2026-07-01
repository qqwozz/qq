import { useState, useRef, useEffect } from 'react'
import { TranslationKey } from '../i18n'

interface TerminalProps {
  t: (key: TranslationKey) => string
}

const KALI_ART = [
  "            ..............",
  "                ..,;:ccc,.",
  "              ......''',;lxo.",
  "            ....''',..........,:ld;",
  "              .,;j;i;:;,...,x,",
  "            ..''.          0Xxoc:,.  ...",
  "          ....            ,ONkc,;,cokOd;'.",
  "        .                   OMo            ':ddo.",
  "                            dMc                :OO;",
  "                            0M.                  .:o.",
  "                            ;Wd",
  "                            ;XO,",
  "                              ,d00dlc;,...",
  "                                ..',;;cdO0d:,.",
  "                                      .:d;.':.",
  "                                      'd . '",
  "                                        ;l ..",
  "                                         .o",
  "                                          c",
  "                                          .'",
]

const KALI_INFO = [
  ['OS:', 'Kali GNU/Linux Rolling x86_64'],
  ['Host:', 'qqwozz portfolio v2.0'],
  ['Kernel:', 'React 18.3 + Vite 5.4'],
  ['Uptime:', 'since 2023'],
  ['Packages:', '5 (python, go, c++, docker, grpc)'],
  ['Shell:', 'typescript 5.6'],
  ['Terminal:', 'qqwozz-term'],
  ['CPU:', 'backend developer @ 100%'],
  ['Memory:', '∞ / ∞'],
]

const COMMANDS: Record<string, (t: (k: TranslationKey) => string) => string[]> = {
  help: () => [
    ' доступные команды:',
    '',
    '  help       — показать эту справку',
    '  whoami     — кто я',
    '  about      — обо мне',
    '  projects   — мои проекты',
    '  stack      — стек технологий',
    '  contact    — как связаться',
    '  fastfetch  — системная инфа',
    '  ls         — список файлов',
    '  sudo       — ???',
    '  clear      — очистить терминал',
  ],
  whoami: () => [
    ' qqwozz',
  ],
  about: () => [
    ' backend-разработчик, python · go · c++',
    ' создаю микросервисы, api и high-load системы',
    ' mtuci — moscow technical university',
  ],
  projects: () => [
    ' qw trading platform   c++, go, grpc',
    ' qw_pay                go, c++, python',
    ' enf-shop              django, htmx, docker',
    ' ai-chat-bot           python, nlp',
    ' autoadmin             go, sqlite, telegram',
  ],
  stack: () => [
    ' python  go  c++  fastapi  django  grpc',
    ' postgresql  mysql  redis  sqlite',
    ' docker  linux  nginx  gunicorn',
    ' git  github actions  postman  vs code',
  ],
  contact: () => [
    ' telegram  t.me/qqqwozz',
    ' github    github.com/qqwozz',
    ' email     offconix@gmail.com',
  ],
  ls: () => [
    ' about.md  projects/  stack/  contact/  README.md',
  ],
  sudo: () => [
    ' [sudo] password for qqwozz: ********',
    ' qqwozz is not in the sudoers file. This incident will be reported.',
  ],
  fastfetch: () => {
    const lines: string[] = []
    const maxLeft = Math.max(...KALI_ART.map(l => l.length))
    const totalLines = Math.max(KALI_ART.length, KALI_INFO.length)
    for (let i = 0; i < totalLines; i++) {
      const left = (KALI_ART[i] || '').padEnd(maxLeft + 2)
      const info = KALI_INFO[i]
      if (info) {
        lines.push(`\x1b[1m${info[0]}\x1b[0m ${info[1]}`)
      } else {
        lines.push(left)
      }
    }
    return lines
  },
  clear: () => [],
}

export function TerminalSection({ t }: TerminalProps) {
  const [lines, setLines] = useState<string[]>([''])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [lines])

  const exec = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()

    if (!trimmed) {
      setLines(prev => [...prev, `➜  comp ${cmd}`])
      return
    }

    if (trimmed === 'clear') {
      setLines([])
      return
    }

    const handler = COMMANDS[trimmed]
    const prompt = `➜  comp ${cmd}`

    if (trimmed === 'fastfetch') {
      const output = handler(t)
      setLines(prev => [...prev, prompt, ...output, ''])
    } else if (handler) {
      const output = handler(t)
      setLines(prev => [...prev, prompt, ...output, ''])
    } else {
      setLines(prev => [...prev, prompt, `zsh: command not found: ${trimmed}`, ''])
    }

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
    <section className="section" id="terminal">
      <div className="container">
        <div className="section-number">
          004
          <div className="section-number-progress" />
        </div>
        <h2 className="section-title anim">терминал</h2>
        <div className="terminal anim" onClick={() => inputRef.current?.focus()}>
          <div className="terminal-header">
            <span className="terminal-dot red" />
            <span className="terminal-dot yellow" />
            <span className="terminal-dot green" />
            <span className="terminal-title">qqwozz@portfolio</span>
          </div>
          <div className="terminal-body" ref={bodyRef}>
            {lines.map((line, i) => (
              <div key={i} className="terminal-line">
                {line.startsWith('➜  comp ') ? (
                  <><span className="terminal-prompt">➜  comp </span><span className="terminal-cmd">{line.slice(9)}</span></>
                ) : line.startsWith('OS:') || line.startsWith('Host:') || line.startsWith('Kernel:') || line.startsWith('Uptime:') || line.startsWith('Packages:') || line.startsWith('Shell:') || line.startsWith('Terminal:') || line.startsWith('CPU:') || line.startsWith('Memory:') ? (
                  <span className="terminal-info-line">
                    <span className="terminal-info-key">{line.split(' ')[0]}</span>
                    <span className="terminal-info-val">{line.slice(line.indexOf(' ') + 1)}</span>
                  </span>
                ) : (
                  <span className="terminal-output">{line}</span>
                )}
              </div>
            ))}
            <div className="terminal-input-line">
              <span className="terminal-prompt">➜  comp </span>
              <input
                ref={inputRef}
                className="terminal-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoFocus
                placeholder="введите команду..."
              />
            </div>
            <div ref={endRef} />
          </div>
        </div>
      </div>
    </section>
  )
}
