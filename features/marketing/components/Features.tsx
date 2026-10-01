'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'motion/react'
import {
  FileCode,
  Copy,
  Check,
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Terminal,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

interface UploadFileSample {
  name: string
  type: string
  size: string
  extractedFacts: number
  latency: string
}

const fileSamples: UploadFileSample[] = [
  {
    name: 'Dokki_Dental_Prices_2025.pdf',
    type: 'PDF',
    size: '1.4 MB',
    extractedFacts: 48,
    latency: '0.4s',
  },
  {
    name: 'Zamalek_Menu_Combos.xlsx',
    type: 'Spreadsheet',
    size: '420 KB',
    extractedFacts: 26,
    latency: '0.2s',
  },
  {
    name: 'Clinic_Doctor_Rosters.docx',
    type: 'Document',
    size: '890 KB',
    extractedFacts: 34,
    latency: '0.3s',
  },
]

export default function Features() {
  const [copied, setCopied] = useState(false)
  const [selectedFile, setSelectedFile] = useState<UploadFileSample>(fileSamples[0])
  const [loopState, setLoopState] = useState<'unanswered' | 'answered'>('unanswered')

  const scriptSnippet = '<script src="https://cdn.sanad.ai/v2/embed.js" data-site="sanad_cairo"></script>'

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      id="features"
      className="relative scroll-mt-24 w-full bg-card/60 dark:bg-[#0c1817] border-y border-border/80 py-16 sm:py-24 overflow-hidden"
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25] dark:opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient Gradient Highlights */}
      <div className="pointer-events-none absolute -top-40 start-1/4 size-96 bg-primary/5 rounded-none blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 end-1/4 size-96 bg-highlight/5 rounded-none blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-start text-left gap-3 mb-12 sm:mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider border border-primary/20 shadow-2xs">
            <Cpu className="size-3.5 text-primary" />
            <span>Operational Architecture &bull; Retrieval-Augmented Generation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            Deploy a verified AI assistant in three straightforward steps.
          </h2>

          <p className="text-sm sm:text-base text-foreground/75 leading-relaxed">
            Sanad ingests enterprise documentation, indexes structured facts into vector memory, and deploys asynchronously to your web interface.
          </p>
        </div>

        {/* 3-Card Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Step 1: Upload & Vector Grounding */}
          <motion.div variants={cardVariants} className="h-full">
            <Card className="h-full rounded-none bg-background dark:bg-[#132322] border border-border/80 hover:border-primary/50 shadow-xs transition-all flex flex-col justify-between group">
              <CardHeader className="gap-3 p-6 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="size-8 rounded-none bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center font-mono">
                    01
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                    Ingestion &bull; Vector Parsing
                  </span>
                </div>

                <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
                  Knowledge Document Ingestion
                </CardTitle>

                <CardDescription className="text-sm text-foreground/75 leading-relaxed font-normal">
                  Upload PDF manuals, Excel price sheets, or doctor rosters. Sanad semantically parses tables and conditions into private vector memory.
                </CardDescription>

                {/* Interactive File Preview Widget */}
                <div className="mt-3 p-3 bg-muted/50 dark:bg-muted/30 border border-border/70 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>Sample Ingestion Source:</span>
                    <span className="text-primary font-semibold">Semantic Parser</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {fileSamples.map((file) => {
                      const isSelected = selectedFile.name === file.name
                      return (
                        <button
                          key={file.name}
                          type="button"
                          onClick={() => setSelectedFile(file)}
                          className={`flex items-center justify-between p-2 text-start transition-colors cursor-pointer text-xs font-mono border ${
                            isSelected
                              ? 'bg-card border-primary/40 text-foreground font-semibold shadow-2xs'
                              : 'bg-transparent border-transparent text-muted-foreground hover:bg-card/50 hover:text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {file.type === 'Spreadsheet' ? (
                              <FileSpreadsheet className="size-3.5 text-primary shrink-0" />
                            ) : (
                              <FileText className="size-3.5 text-primary shrink-0" />
                            )}
                            <span className="truncate">{file.name}</span>
                          </div>
                          <span className="text-[10px] text-primary shrink-0">{file.size}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Extraction Result Badge */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground">Extracted Vectors:</span>
                    <span className="text-success font-bold">
                      {selectedFile.extractedFacts} entities ({selectedFile.latency})
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardFooter className="p-6 pt-0">
                <div className="w-full flex items-center gap-2 p-2.5 rounded-none bg-muted/60 border border-border/50 text-xs text-foreground/80 font-mono">
                  <UploadCloud className="size-4 text-primary shrink-0" />
                  <span className="truncate font-medium">Formats: PDF, XLSX, DOCX, CSV &amp; REST Endpoints</span>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Step 2: One-Line Script Embed */}
          <motion.div variants={cardVariants} className="h-full">
            <Card className="h-full rounded-none bg-background dark:bg-[#132322] border border-border/80 hover:border-primary/50 shadow-xs transition-all flex flex-col justify-between group">
              <CardHeader className="gap-3 p-6 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="size-8 rounded-none bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center font-mono">
                    02
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                    Deployment
                  </span>
                </div>

                <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
                  One-Line Script Integration
                </CardTitle>

                <CardDescription className="text-sm text-foreground/75 leading-relaxed font-normal">
                  Embed a single asynchronous script tag into your web application header. Executes in &lt;40ms without altering Core Web Vitals.
                </CardDescription>

                {/* Single Script Code Box */}
                <div className="mt-3 p-3 bg-muted/50 dark:bg-muted/30 border border-border/70 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pb-1 border-b border-border/60">
                    <span className="font-semibold text-foreground">HTML Embed Tag</span>
                    <span className="text-primary">Asynchronous Loading</span>
                  </div>

                  <div className="relative bg-card/90 dark:bg-black/40 border border-border/70 p-2.5 font-mono text-[11px] text-foreground/90 overflow-x-auto min-h-[64px] flex items-center">
                    <pre className="w-full whitespace-pre-wrap break-all leading-relaxed">
                      {scriptSnippet}
                    </pre>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="size-2 bg-success animate-pulse shrink-0" />
                      Latency: 38ms
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-primary hover:text-primary/80 font-bold transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="size-3 text-success" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardFooter className="p-6 pt-0">
                <div className="w-full flex items-center justify-between p-2.5 rounded-none bg-muted/60 border border-border/50 text-xs font-mono text-foreground/85">
                  <span className="truncate font-medium">Compatible with all web platforms &amp; CMS</span>
                  <Terminal className="size-4 text-primary shrink-0" />
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Step 3: Knowledge Gap Resolution */}
          <motion.div variants={cardVariants} className="h-full">
            <Card className="h-full rounded-none bg-background dark:bg-[#132322] border border-border/80 hover:border-primary/50 shadow-xs transition-all flex flex-col justify-between group">
              <CardHeader className="gap-3 p-6 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="size-8 rounded-none bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center font-mono">
                    03
                  </span>
                  <span className="px-2 py-0.5 rounded-none bg-highlight/15 text-highlight-foreground font-bold text-[10px] tracking-wider uppercase border border-highlight/25 font-mono">
                    Continuous Resolution
                  </span>
                </div>

                <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
                  Continuous Knowledge Queue
                </CardTitle>

                <CardDescription className="text-sm text-foreground/75 leading-relaxed font-normal">
                  When an inquiry exceeds indexed documentation, Sanad halts speculation. Unresolved questions route to an administrative queue for single-entry resolution.
                </CardDescription>

                {/* Interactive Loop Simulation */}
                <div className="mt-3 p-3 bg-muted/50 dark:bg-muted/30 border border-border/70 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground">Queue Simulator:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setLoopState((prev) => (prev === 'unanswered' ? 'answered' : 'unanswered'))
                      }
                      className="flex items-center gap-1 text-[11px] text-primary hover:underline font-bold cursor-pointer"
                    >
                      <RefreshCw className="size-3" />
                      {loopState === 'unanswered' ? 'Resolve Query' : 'Reset Simulator'}
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {loopState === 'unanswered' ? (
                      <motion.div
                        key="unanswered"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="p-2.5 bg-card border border-border/80 flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-highlight-foreground bg-highlight/10 px-1.5 py-0.5 border border-highlight/20 w-fit">
                          <span>Pending Resolution</span>
                        </div>
                        <p className="text-xs text-foreground font-medium text-right font-sans">
                          &ldquo;متاح ركن سيارات (Valet) قدام العيادة؟&rdquo;
                        </p>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Action: Awaiting administrator verification
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="answered"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="p-2.5 bg-secondary/30 dark:bg-secondary/15 border border-primary/40 flex flex-col gap-1.5"
                      >
                        <div className="flex items-center gap-1 text-[10px] font-mono text-success font-semibold">
                          <CheckCircle2 className="size-3 text-success" />
                          <span>Vector Indexed Permanently</span>
                        </div>
                        <p className="text-xs text-foreground font-medium text-right font-sans">
                          &ldquo;نعم، متاح خدمة ركن سيارات مجاناً لمرضى العيادة.&rdquo;
                        </p>
                        <span className="text-[10px] text-primary font-mono">
                          Status: Automated response enabled for future queries
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardHeader>

              <CardFooter className="p-6 pt-0">
                <div className="w-full flex items-center gap-2 p-2.5 rounded-none bg-muted/60 border border-border/50 text-xs text-foreground/85 font-mono">
                  <span className="size-1.5 bg-primary shrink-0" />
                  <span className="font-medium">Active Vector Memory Loop</span>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}