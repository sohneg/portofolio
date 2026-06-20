import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

// Best-effort in-memory rate limit (per container instance).
const RATE_LIMIT = 5 // max submissions
const RATE_WINDOW_MS = 10 * 60 * 1000 // per 10 minutes
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_LIMIT
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  let body: { name?: string; email?: string; message?: string; website?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const name = (body.name ?? '').trim()
  const email = (body.email ?? '').trim()
  const message = (body.message ?? '').trim()
  const honeypot = (body.website ?? '').trim()

  // Honeypot: pretend success so bots don't learn anything.
  if (honeypot) {
    return NextResponse.json({ ok: true })
  }

  if (!name || !email || !message || !isValidEmail(email) || message.length > 5000) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, CONTACT_RECIPIENT } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.error('Contact form: missing SMTP configuration')
    return NextResponse.json({ error: 'server' }, { status: 500 })
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: false, // STARTTLS on port 587
    requireTLS: true,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  })

  try {
    await transporter.sendMail({
      from: SMTP_FROM || `Sohneg.ch <${SMTP_USER}>`,
      to: CONTACT_RECIPIENT || SMTP_USER,
      replyTo: `${name} <${email}>`,
      subject: `New contact message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      `,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form: failed to send', err)
    return NextResponse.json({ error: 'server' }, { status: 500 })
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
