'use client'

import React, { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { navLinks } from '@/lib/navigation'
import logo from '../../public/sanad_logo.png'

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributes: true, 
    attributeFilter: ['class'],
  })
  return () => observer.disconnect()
}

const getThemeSnapshot = () => document.documentElement.classList.contains('dark')
const getServerSnapshot = () => false

export default function MarketingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState<'EN' | 'AR'>('EN')
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const isDark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerSnapshot)

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
  }

  const toggleLang = (lang: 'EN' | 'AR') => {
    setCurrentLang(lang)
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('dir', lang === 'AR' ? 'rtl' : 'ltr')
      document.documentElement.setAttribute('lang', lang === 'AR' ? 'ar' : 'en')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full pt-3 sm:pt-4 px-3 sm:px-6 pointer-events-none transition-all">
      <div className="max-w-6xl mx-auto">
        {/* Floating Island Pill with Blur Bloom Expansion Animation */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            filter: 'blur(12px)',
            y: -14,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            y: 0,
          }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-auto bg-card/80 dark:bg-card/70 backdrop-blur-xl border border-border/80 dark:border-border/60 shadow-lg shadow-black/5 dark:shadow-black/20 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 transition-all"
        >
          
          {/* Left: Brand Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Image
                  src={logo}
                  alt="Sanad سند"
                  height={38}
                  className="h-8 sm:h-9 w-auto object-contain"
                  priority
                />
              </motion.div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links (Clean + Animated Sliding Underline) */}
          <nav
            className="hidden lg:flex items-center gap-7 xl:gap-8"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navLinks.map((link) => {
              const isHovered = hoveredLink === link.label
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  className="relative py-1 text-sm font-medium text-foreground/75 hover:text-foreground transition-colors duration-150"
                >
                  <span>{link.label}</span>
                  {isHovered && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute bottom-0 inset-x-0 h-[2px] bg-primary rounded-none"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right: Actions & Controls using shadcn Button */}
          <div className="hidden md:flex items-center gap-2.5">
            
            {/* Minimalist Language Switcher */}
            <div className="relative flex items-center bg-muted/60 p-0.5 border border-border/50 text-xs">
              {(['EN', 'AR'] as const).map((lang) => {
                const isActive = currentLang === lang
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLang(lang)}
                    className={`relative px-2.5 py-1 font-medium transition-colors z-10 ${
                      isActive
                        ? 'text-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-island-lang"
                        className="absolute inset-0 bg-card shadow-xs -z-10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                      />
                    )}
                    {lang === 'EN' ? 'EN' : 'العربية'}
                  </button>
                )
              })}
            </div>

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ y: -6, opacity: 0, rotate: -45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 6, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center justify-center"
                >
                  {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
                </motion.div>
              </AnimatePresence>
            </Button>

            {/* Log In Button */}
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>

            {/* Sign Up Primary CTA Button */}
            <Link href="/signup">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>

          </div>

          {/* Mobile Menu & Quick Controls */}
          <div className="flex md:hidden items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>

        </motion.div>

        {/* Mobile Menu Dropdown Attached to Island */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-auto mt-2 border border-border/80 dark:border-border/60 bg-card/95 dark:bg-card/90 backdrop-blur-xl shadow-xl p-4 space-y-4 md:hidden"
            >
              {/* Nav links */}
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-base font-medium text-foreground/85 hover:text-primary py-2 px-3 hover:bg-muted/50 transition-colors"
                  >
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              <div className="h-px bg-border/60" />

              {/* Language Switcher */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Language / اللغة
                </span>
                <div className="relative flex items-center bg-muted/60 p-0.5 border border-border/50 text-xs">
                  {(['EN', 'AR'] as const).map((lang) => {
                    const isActive = currentLang === lang
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLang(lang)}
                        className={`relative px-3 py-1 font-medium transition-colors z-10 ${
                          isActive
                            ? 'text-foreground font-semibold'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="active-island-mobile-lang"
                            className="absolute inset-0 bg-card shadow-xs -z-10"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                          />
                        )}
                        {lang === 'EN' ? 'EN' : 'العربية'}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Mobile CTA Buttons using shadcn Button */}
              <div className="pt-1 flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}