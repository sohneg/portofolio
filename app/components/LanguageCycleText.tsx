'use client'

import { useState, useRef } from 'react'

const greetings = [
  // Germanic
  'Hey', 'Hallo', 'Hej', 'Hei', 'Hai', 'Moin', 'Servus', 'Grüezi',
  // Romance
  'Salut', 'Ciao', 'Hola', 'Olá', 'Bună', 'Salve',
  // Slavic
  'Привет', 'Ahoj', 'Cześć', 'Здраво', 'Привіт', 'Здравей',
  // East Asian
  'やあ', 'おす', '嘿', '你好', '안녕', 'ハロー',
  // Southeast Asian
  'สวัสดี', 'Xin chào', 'Halo', 'Kumusta', 'ສະບາຍດີ', 'မင်္ဂလာပါ',
  // South Asian
  'नमस्ते', 'হ্যালো', 'ஹலோ', 'హలో', 'ಹಲೋ',
  // Middle Eastern
  'مرحبا', 'שלום', 'سلام', 'Салом',
  // African
  'Jambo', 'Sawubona', 'Moni', 'Dumela', 'Sannu', 'Bawo ni',
  // European
  'Γεια', 'Merhaba', 'Szia', 'Tere', 'Sveiki', 'Labas', 'Ahoj', 'Buna',
  // Pacific
  'Aloha', 'Kia ora', 'Bula', 'Talofa', 'Malo',
  // Other
  'Hei', 'Halló', 'Saluton', 'Bonjour', 'Guten Tag', 'Oi', 'Alô',
]

export default function LanguageCycleText() {
  const [text, setText] = useState('Hey')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    intervalRef.current = setInterval(() => {
      setText(greetings[Math.floor(Math.random() * greetings.length)])
    }, 50)
  }

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  return (
    <h1
      className="text-5xl font-bold mb-6 cursor-pointer select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}!
    </h1>
  )
}