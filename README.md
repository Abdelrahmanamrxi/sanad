# Sanad (سند)

Sanad is a modern, bilingual (Arabic & English) AI customer support and enterprise knowledge agent platform. It enables businesses to transform their proprietary documentation, guides, and website content into grounded, intelligent conversational agents, and deploy them across any website via an embeddable, customizable chat widget.

---

## Overview

Modern customer support requires immediate, accurate, and culturally fluent communication. Sanad is engineered specifically for businesses requiring native Arabic (RTL) and English (LTR) fluency, grounded answers backed by proprietary company knowledge, and an uncompromising, high-performance web experience.

---

## What Sanad Does

### Grounded AI Knowledge Engine (RAG)
- **High-Fidelity Document Extraction**: Integrates **LlamaIndex (LlamaCloud)** for advanced parsing of complex documents, multi-column layouts, tabular data, and Arabic scripts into structured markdown, with local fallback via `unpdf` and `mammoth`.
- **Semantic Chunking Pipeline**: Utilizes **LangChain** (`@langchain/textsplitters`, `@langchain/core`) for context-aware recursive text splitting tuned to preserve semantic boundaries across languages.
- **Vector Search & Grounding**: Generates and indexes vector embeddings in Supabase PostgreSQL with `pgvector`, guaranteeing that customer inquiries are answered strictly using verified business data with zero hallucinations.

### Embeddable Chat Widget
- Delivers a lightweight, standalone chat interface embeddable on any website with a single script tag.
- Provides a real-time visual customizer in the merchant dashboard to adjust brand colors, launcher styles (floating button or text badge), position, and localized greeting messages.
- Features token-by-token streaming with a dynamic multi-stage thinking indicator (query analysis, knowledge search, and answer grounding) designed to keep visitors engaged.
- Built with dynamic viewport handling (`100dvh`) to guarantee usability across mobile screens and virtual keyboards.
- Automatically respects business subscription tiers, granting white-labeling or branded "Powered by Sanad" attribution.

### Merchant Playground
- Offers an interactive sandbox where businesses can test system prompts, refine voice and tone, and verify knowledge retrieval before deploying changes to live customers.
- Surfaces retrieved reference sources side-by-side with generated responses for inspection.

### Conversation Tracking & Analytics
- Captures visitor conversation histories, customer sentiment, and interaction trends in real time.
- Allows team members to review customer inquiries and monitor automated resolution quality.

### Multi-Tier Usage & Quota Guardrails
- Implements flexible subscription tiers (Free Trial, Starter, and Growth) governing document storage, monthly message quotas, and token caps.
- Employs concurrency-safe database incrementing to protect businesses against lost updates and unexpected AI compute costs.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Styling & Design** | Tailwind CSS v4, `@theme` inline CSS design tokens |
| **UI Components** | `@base-ui/react` (shadcn `base-sera` style), `class-variance-authority` |
| **Vector Icons** | `lucide-react` (clean vector iconography, zero emojis) |
| **Animations** | `motion/react` (Motion 13+) |
| **AI & LLM Orchestration** | Vercel AI SDK (`ai`), OpenAI, Groq SDK, OpenRouter |
| **RAG & Knowledge Processing** | **LlamaIndex** (`@llamaindex/llama-cloud`), **LangChain** (`@langchain/textsplitters`, `@langchain/core`) |
| **Document Parsers** | `unpdf` (PDFs), `mammoth` (Word/DOCX), `cheerio` / `node-html-parser` (Web) |
| **Data & Storage** | Supabase PostgreSQL, `pgvector`, Row Level Security (RLS) |
| **Background Processing**| Inngest workflow orchestration |
| **Observability** | Sentry, Pino logging |
| **Typography** | `IBM Plex Sans Arabic` (UI & Headings), `IBM Plex Mono` (Code) |

---

## Design System & Principles

Sanad adheres to a distinct, architectural design language:

- **Strictly Sharp Edges**: All cards, inputs, dialogs, buttons, badges, and widget surfaces use sharp 90-degree corners (`rounded-none`, `--radius: 0px`).
- **Strictly Vector-Driven**: Zero emojis throughout all interfaces, mock data, documentation, and assistant communications. Clean vector icons and geometric indicators are used exclusively.
- **Bilingual & RTL-First**: Built from the ground up for Arabic (RTL) and English (LTR) using logical CSS layout properties (`start-`, `end-`, `ps-`, `pe-`).
- **Curated Palette**: A harmonious color system based on deep forest green (`#0F5C55`), warm sand (`#E9E3D6`), dark jade (`#0C1615`), and amber highlights (`#E8A33D`).

---

## Widget Integration

The assistant can be mounted on external sites by adding a single asynchronous script tag to the client website:

```html
<script
  src="https://your-domain.com/widget.js"
  data-widget-key="YOUR_WIDGET_KEY"
  defer
></script>
```

---

## License

Proprietary. All rights reserved.
