'use client'

import { useState } from 'react'

const tabs = [
  {
    label: 'Tech Stack',
    chips: ['React', 'XAF', 'ASP.NET Core', 'Entity Framework', 'Docker', 'Nginx Proxy Manager'],
    color: 'bg-white/10 border-white/10',
  },
  {
    label: 'KI-Workflow',
    chips: ['Claude Code', 'MCP-Server', 'Skills', 'KI-Agenten'],
    color: 'bg-orange-500/15 border-orange-500/20 text-orange-300',
  },
]

export default function WorkTabs({ visible }: { visible: boolean }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="px-6 py-4 md:px-8 md:py-5">
      {/* Tab buttons */}
      <div className="flex gap-4 mb-3">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`text-xs md:text-sm cursor-pointer transition-all pb-1 border-b-2
              ${activeTab === i
                ? 'opacity-100 border-orange-500'
                : 'opacity-40 border-transparent hover:opacity-60'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {tabs[activeTab].chips.map((tech, i) => (
          <span
            key={tech}
            className={`px-3 py-1 rounded-full text-xs md:text-sm border
              transition-all duration-300 ${tabs[activeTab].color}
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
            style={{ transitionDelay: `${600 + i * 80}ms` }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
