import { useState, useRef, useEffect } from 'react'
import { TranslationKey } from '../i18n'

interface TerminalProps {
  t: (key: TranslationKey) => string
}

const FASTFETCH_OUTPUT = `            ..............                  kali@kali
                ..,;:ccc,.                  --------------------
              ......''';lxO.                OS: Kali GNU/Linux Rolling x86_64
.....''''..........,:ld;                    Host: qqwozz portfolio v2.0
           .';;;:::;,,.x,                   Kernel: React 18.3 + Vite 5.4
      ..'''.            0Xxoc:,.  ...       Uptime: since 2023
  ....                ,ONkc;,;cokOdc',.     Packages: 5 (python, go, c++, docker, grpc)
 .                   OMo           ':ddo.   Shell: typescript 5.6
                    dMc               :OO;  Terminal: qqwozz-term
                    0M.                 .:o. CPU: backend developer @ 100%
                    ;Wd                     Memory: ∞ / ∞
                     ;XO,
                       ,d0Odlc;,..
                           ..',;:cdOOd::,.
                                    .:d;.':;.
                                       'd,  .'
                                         ;l   ..
                                          .o
                                            c
                                            .'`

const COMMANDS: Record<string, () => string[]> = {
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
  whoami: () => [' qqwozz'],
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
  ls: () => [' about.md  projects/  stack/  contact/  README.md'],
  sudo: () => [
    ' [sudo] password for qqwozz: ********',
    ' qqwozz is not in the sudoers file. This incident will be reported.',
  ],
  fastfetch: () => FASTFETCH_OUTPUT.split('\n'),
  clear: () => [],
}

type Line = { type: 'prompt'; cmd: string } | { type: 'output'; text: string }

export function TerminalSection({ t }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([])
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
    const promptLine: Line = { type: 'prompt', cmd }

    if (!trimmed) {
      setLines(prev => [...prev, promptLine])
      return
    }

    if (trimmed === 'clear') {
      setLines([])
      return
    }

    const handler = COMMANDS[trimmed]
    if (handler) {
      const output = handler()
      const outputLines: Line[] = output.map(text => ({ type: 'output', text }))
      setLines(prev => [...prev, promptLine, ...outputLines, { type: 'output', text: '' }])
    } else {
      setLines(prev => [...prev, promptLine, { type: 'output', text: `zsh: command not found: ${trimmed}` }, { type: 'output', text: '' }])
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
                {line.type === 'prompt' ? (
                  <><span className="terminal-prompt">➜  comp </span><span className="terminal-cmd">{line.cmd}</span></>
                ) : (
                  <span className="terminal-output">{line.text}</span>
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
              />
            </div>
            <div ref={endRef} />
          </div>
        </div>
      </div>
    </section>
  )
}
