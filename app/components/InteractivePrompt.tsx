'use client'

import { useState, useRef, useEffect } from 'react'
import { projects, projectTitles } from '@/data/projects'

interface HistoryLine {
  type: 'command' | 'output' | 'error'
  text: string
}

const PROMPT = 'root@sohneg.ch:~#  '

const projectDirs = projects.map(p => p.key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '') + '/')

const FS: Record<string, string[]> = {
  '~': ['der_neuanfang.txt', 'projects/', 'skills.txt', 'contact.txt', 'secret.txt', '.bashrc'],
  '~/projects': projectDirs,
}

const FILES: Record<string, string> = {
  'skills.txt': `Languages: TypeScript, Golang, C#, C++, Python
Frameworks: React, Next.js, Angular, ASP.NET Core, Entity Framework
Tools: Docker, Portainer, Harbor, Nginx Proxy Manager, Git
AI: Claude Code, MCP Servers, Custom Skills, AI Agents
Game Dev: Unity (VR/AR), Godot
Other: Scrum, TDD, Jira, Linux, Windows Server`,

  'contact.txt': `Email: info@sohneg.ch
Web: sohneg.ch
GitHub: github.com/sohneg`,

  'secret.txt': `🍪 Du hast das Easter Egg gefunden!
Ich mache immer noch Cookies, sie haben nur eine andere Bedeutung bekommen.`,

  '.bashrc': `# ~/.bashrc
export PS1="root@sohneg.ch:~# "
alias yolo="git push --force"
# TODO: delete this before someone finds it`,
}

function runCommand(input: string, storyText?: string): string[] {
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
      if (arg === '-a' || arg === '-la' || arg === '-al') {
        if (parts[2] === 'projects' || parts[2] === 'projects/') {
          return projects.map(p => `  ${projectTitles[p.key] || p.key}  [${p.tech.join(', ')}]`)
        }
        return ['.  ..  .bashrc  der_neuanfang.txt  projects/  skills.txt  contact.txt  secret.txt']
      }
      if (arg === 'projects' || arg === 'projects/' || arg === '~/projects') {
        return [projects.map(p => {
          const name = p.key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
          return name + '/'
        }).join('  ')]
      }
      // ls projects/<name>/ → show tech stack
      const projectMatch = arg?.match(/^(?:projects\/|~\/projects\/)(.+?)\/?$/)
      if (projectMatch) {
        const dirName = projectMatch[1]
        const proj = projects.find(p => {
          const name = p.key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
          return name === dirName
        })
        if (proj) {
          return [proj.tech.map(t => t.toLowerCase().replace(/\s+/g, '-')).join('  ')]
        }
        return [`ls: cannot access '${arg}': No such file or directory`]
      }
      if (!arg || arg === '~') {
        return ['projects/  skills.txt  contact.txt  secret.txt']
      }
      return [`ls: cannot access '${arg}': No such file or directory`]

    case 'cat':
      if (!arg) return ['cat: missing file operand']
      if (arg === 'der_neuanfang.txt' && storyText) return [storyText]
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

export default function InteractivePrompt({ onClear, storyText }: { onClear?: () => void; storyText?: string }) {
  const [history, setHistory] = useState<HistoryLine[]>([])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Don't auto-focus on mobile - let users discover the terminal
  useEffect(() => {
    if (window.innerWidth > 768) {
      inputRef.current?.focus()
    }
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

    const result = runCommand(input, storyText)

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
    if (e.key === 'Tab') {
      e.preventDefault()
      const parts = input.split(/\s+/)
      const COMMANDS = ['ls', 'cat', 'whoami', 'pwd', 'cd', 'clear', 'neofetch', 'help', 'exit', 'sudo', 'rm']
      const ALL_FILES = [...(FS['~'] || []), ...(FS['~/projects'] || [])]

      if (parts.length <= 1) {
        // Complete command
        const partial = parts[0] || ''
        const matches = COMMANDS.filter(c => c.startsWith(partial))
        if (matches.length === 1) {
          setInput(matches[0] + ' ')
        } else if (matches.length > 1) {
          setHistory(prev => [...prev, { type: 'command', text: input }, { type: 'output', text: matches.join('  ') }])
        }
      } else {
        // Complete file/path argument
        const partial = parts[parts.length - 1]

        // Determine which completions to offer based on path
        let completions: string[] = []
        if (partial.startsWith('projects/') || partial.startsWith('~/projects/')) {
          const prefix = partial.startsWith('~/') ? '~/projects/' : 'projects/'
          const sub = partial.slice(prefix.length)
          const projectNames = projects.map(p =>
            prefix + p.key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '') + '/'
          )
          completions = projectNames.filter(p => p.startsWith(partial))
          if (completions.length === 0) completions = projectNames.filter(p => p.startsWith(prefix + sub))
        } else {
          completions = ALL_FILES.filter(f => f.startsWith(partial))
        }

        if (completions.length === 1) {
          parts[parts.length - 1] = completions[0]
          setInput(parts.join(' '))
        } else if (completions.length > 1) {
          // Find common prefix
          let common = completions[0]
          for (const m of completions) {
            while (!m.startsWith(common)) common = common.slice(0, -1)
          }
          if (common.length > partial.length) {
            parts[parts.length - 1] = common
            setInput(parts.join(' '))
          } else {
            setHistory(prev => [...prev, { type: 'command', text: input }, { type: 'output', text: completions.join('  ') }])
          }
        }
      }
    } else if (e.key === 'ArrowUp') {
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
