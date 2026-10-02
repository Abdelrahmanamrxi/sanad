'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Activity, ShieldCheck } from 'lucide-react'
import { footerLinks } from '@/lib/navigation'
import logo from '../../public/sanad_logo.png'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative mt-auto w-full bg-secondary/80 text-secondary-foreground border-t border-border/70 py-12 sm:py-16 px-6 sm:px-10 lg:px-12 transition-colors overflow-hidden"
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25] dark:opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-16">
        {/* Left Column: Brand & Tagline */}
        <div className="flex flex-col justify-between gap-6 max-w-sm">
          <div className="flex flex-col gap-3.5">
            <Link href="/" className="inline-block w-fit">
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
                />
              </motion.div>
            </Link>
            <p className="text-sm leading-relaxed text-foreground/75">
              Structured, dependable AI conversational support built specifically for Egyptian &amp; MENA enterprises.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="size-2 bg-success animate-pulse shrink-0" />
              <span>Cairo &amp; Riyadh Nodes: 100% Operational</span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              &copy; 2026 Sanad Platform LLC. All rights reserved across Egypt and MENA.
            </p>
          </div>
        </div>

        {/* Right Columns: Grouped Product & Legal Links */}
        <div className="flex gap-14 sm:gap-20">
          {/* Product Links */}
          <div className="flex flex-col gap-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/90 font-mono">
              Product
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/75 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/90 font-mono">
              Legal
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/75 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile-only copyright */}
        <p className="text-xs text-muted-foreground block sm:hidden pt-4 border-t border-border/40">
          &copy; 2026 Sanad Platform LLC. All rights reserved across Egypt and MENA.
        </p>
      </div>
    </motion.footer>
  )
}