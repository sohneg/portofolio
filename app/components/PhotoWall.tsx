'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

// caption is optional — animals get their name, the rest stay caption-less.
const PHOTOS: { src: string; caption?: string }[] = [
  { src: '/photography/ari.jpg', caption: 'Ari' },
  { src: '/photography/luci.jpg', caption: 'Luci' },
  { src: '/photography/mia.jpg', caption: 'Mia' },
  { src: '/photography/nala.jpg', caption: 'Nala' },
  { src: '/photography/grassshoe.jpg' },
  { src: '/photography/palme.jpg' },
  { src: '/photography/skullwall.jpg' },
  { src: '/photography/streetphoto.jpg' },
  { src: '/photography/windowreflection.jpg' },
]

// Desktop: scattered around the section like pinned to a wall (kept clear of the centre text).
const DESKTOP_POS = [
  'top-[9%] left-[11%] -rotate-6', // ari — top-left
  'top-[9%] right-[11%] rotate-3', // luci — top-right
  'bottom-[12%] left-[12%] rotate-6', // mia — bottom-left
  'bottom-[12%] right-[12%] -rotate-3', // nala — bottom-right
  'top-[2%] left-[44%] -rotate-2', // grassshoe — top-center
  'top-[38%] left-[12%] rotate-6', // palme — mid-left
  'top-[38%] right-[7%] -rotate-6', // skullwall — mid-right
  'bottom-[4%] left-[30%] rotate-3', // streetphoto — bottom-centre, left of the button
  'bottom-[4%] right-[30%] -rotate-2', // windowreflection — bottom-centre, right of the button
]

// Mobile: only Ari & Luci.
const MOBILE_INDICES = [0, 1]
const MOBILE_ROT = ['-rotate-3', 'rotate-3']

export default function PhotoWall() {
  const [open, setOpen] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const polaroid = (i: number, imgClass: string) => {
    const photo = PHOTOS[i]
    return (
      <>
        {/* washi tape */}
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-14 h-5 rotate-[-6deg] bg-gradient-to-b from-white/40 to-white/15 border border-white/20 shadow-sm" />
        {/* polaroid frame */}
        <div className="bg-white p-2 pb-6 shadow-xl">
          <img src={photo.src} alt={photo.caption ?? 'Photo'} className={`${imgClass} object-cover`} />
          {photo.caption && <div className="text-center text-xs text-neutral-700 mt-2">{photo.caption}</div>}
        </div>
      </>
    )
  }

  return (
    <>
      {/* Desktop: scattered on the wall */}
      <div className="hidden md:block absolute inset-0 pointer-events-none z-[5]">
        {PHOTOS.map((photo, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Open photo: ${photo.caption}`}
            className={`pointer-events-auto absolute cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-0 hover:z-20 ${DESKTOP_POS[i]}`}
          >
            {polaroid(i, 'w-32 h-32')}
          </button>
        ))}
      </div>

      {/* Mobile: just Ari & Luci near the bottom */}
      <div className="md:hidden absolute bottom-[7vh] left-0 right-0 flex justify-center gap-5 px-4 z-[5]">
        {MOBILE_INDICES.map((i, idx) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Open photo: ${PHOTOS[i].caption}`}
            className={`relative cursor-pointer transition-transform duration-300 active:scale-95 ${MOBILE_ROT[idx]}`}
          >
            {polaroid(i, 'w-24 h-24')}
          </button>
        ))}
      </div>

      {/* Lightbox (portaled to body to escape the section's transform) */}
      {mounted &&
        open !== null &&
        createPortal(
          <div
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[200] bg-black/75 flex items-center justify-center p-6 animate-lightbox-fade"
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="absolute top-5 right-5 text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-3 pb-10 shadow-2xl animate-lightbox-zoom max-w-[90vw]"
            >
              <img
                src={PHOTOS[open].src}
                alt={PHOTOS[open].caption ?? 'Photo'}
                className="max-w-full max-h-[70vh] object-contain"
              />
              {PHOTOS[open].caption && (
                <div className="text-center text-neutral-700 mt-3">{PHOTOS[open].caption}</div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
