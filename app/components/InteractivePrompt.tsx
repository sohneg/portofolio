'use client'

import { useState, useRef, useEffect } from 'react'

interface HistoryLine {
  type: 'command' | 'output' | 'error'
  text: string
}

const PROMPT = 'root@sohneg.ch:~#  '

const FS: Record<string, string[]> = {
  '~': ['projects/', 'skills.txt', 'contact.txt', 'secret.txt', '.bashrc'],
  '~/projects': ['tuning-schweiz/', 'dice-of-fate/', 'portfolio/', 'alpineers/'],
}

const FILES: Record<string, string> = {
  'skills.txt': `Languages: TypeScript, Golang, C#, C++, Python
Frameworks: React, Next.js, Angular, ASP.NET Core, Entity Framework
Tools: Docker, Portainer, Harbor, Nginx Proxy Manager, Git
AI: Claude Code, MCP Servers, Custom Skills, AI Agents
Game Dev: Unity (VR/AR), Godot
Other: Scrum, TDD, Jira, Linux, Windows Server`,

  'contact.txt': `Email: hello@sohneg.ch
Web: sohneg.ch
GitHub: github.com/sohne`,

  'secret.txt': `🍪 Du hast das Easter Egg gefunden!
Ich mache immer noch Cookies, sie haben nur eine andere Bedeutung bekommen.`,

  '.bashrc': `# ~/.bashrc
export PS1="root@sohneg.ch:~# "
alias yolo="git push --force"
# TODO: delete this before someone finds it`,
}

function runCommand(input: string): string[] {
  const parts = input.trim().split(/\s+/)
  const cmd = parts[0]?.toLowerCase()
  const arg = parts.slice(1).join(' ')

  switch (cmd) {
    case '':
      return []

    case 'help':
      return [
        'Available commands:',
        '  ls          - list files',
        '  cat <file>  - read a file',
        '  whoami      - who are you?',
        '  pwd         - current directory',
        '  clear       - clear terminal',
        '  neofetch    - system info',
        '  help        - show this help',
        '',
        'Try: cat secret.txt',
      ]

    case 'ls':
      const dir = arg === 'projects' || arg === '~/projects' ? '~/projects' : '~'
      const files = FS[dir]
      return files ? [files.join('  ')] : [`ls: cannot access '${arg}': No such file or directory`]

    case 'cat':
      if (!arg) return ['cat: missing file operand']
      const content = FILES[arg]
      if (content) return content.split('\n')
      return [`cat: ${arg}: No such file or directory`]

    case 'whoami':
      return ['Simon Sohneg - Fullstack Developer, Ex-Baker, Creator']

    case 'pwd':
      return ['/home/simon']

    case 'cd':
      return [`bash: cd: too lazy, just use the navigation on the left ;)`]

    case 'neofetch':
      return [
        '        .--.        root@sohneg.ch',
        '       |o_o |       OS: Next.js 16 x86_64',
        '       |:_/ |       Host: Hetzner Cloud',
        '      //   \\ \\      Kernel: React 19',
        '     (|     | )     Shell: TypeScript 5.x',
        '    /\'\\_   _/`\\     Theme: Dark [GTK3]',
        '    \\___)=(___/     Terminal: This one!',
        '',
        '    Uptime: Since September 2025',
        '    Packages: Too many node_modules',
      ]

    case 'sudo':
      return ['Nice try. 🙃']

    case 'rm':
      return ['rm: permission denied (and also no)']

    case 'exit':
      return ['Logout... just kidding, scroll down to continue!']

    case 'clear':
      return ['__CLEAR__']

    default:
      return [`bash: ${cmd}: command not found. Type 'help' for available commands.`]
  }
}

export default function InteractivePrompt({ onClear }: { onClear?: () => void }) {
  const [history, setHistory] = useState<HistoryLine[]>([])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Scroll the terminal overlay container to bottom
  useEffect(() => {
    const el = containerRef.current?.closest('[data-terminal-scroll]') as HTMLElement
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [history])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = runCommand(input)

    if (result.length === 1 && result[0] === '__CLEAR__') {
      setHistory([])
      setInput('')
      onClear?.()
      if (input.trim()) {
        setCmdHistory(prev => [...prev, input])
        setHistoryIdx(-1)
      }
      return
    }

    const newLines: HistoryLine[] = [
      { type: 'command', text: input },
      ...result.map(line => ({
        type: 'output' as const,
        text: line,
      })),
    ]

    setHistory(prev => [...prev, ...newLines])
    if (input.trim()) {
      setCmdHistory(prev => [...prev, input])
      setHistoryIdx(-1)
    }
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      const newIdx = historyIdx < 0 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1)
      setHistoryIdx(newIdx)
      setInput(cmdHistory[newIdx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx < 0) return
      const newIdx = historyIdx + 1
      if (newIdx >= cmdHistory.length) {
        setHistoryIdx(-1)
        setInput('')
      } else {
        setHistoryIdx(newIdx)
        setInput(cmdHistory[newIdx])
      }
    }
  }

  return (
    <div ref={containerRef}>
      {/* History */}
      {history.map((line, i) => (
        <div key={i} className={line.type === 'command' ? 'text-green-400' : 'text-green-400/80'}>
          {line.type === 'command' && (
            <span className="text-green-600" style={{ whiteSpace: 'pre' }}>{PROMPT}</span>
          )}
          {line.text}
        </div>
      ))}

      {/* Active input line */}
      <form onSubmit={handleSubmit} className="flex text-green-400">
        <span className="text-green-600 shrink-0" style={{ whiteSpace: 'pre' }}>{PROMPT}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none border-none text-green-400 caret-green-400"
          style={{ font: 'inherit', fontSize: 'inherit' }}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
      </form>
    </div>
  )
}
