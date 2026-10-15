interface PlaygroundPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function PlaygroundPage({ searchParams }: PlaygroundPageProps) {
  const { q } = await searchParams

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="min-h-[100vh] flex-1 border border-border bg-card p-6 text-card-foreground">
        <h1 className="font-heading text-xl font-semibold">Playground</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Interactive workspace for testing and configuring AI assistants.
        </p>

        {q && (
          <div className="mt-6 border border-primary/30 bg-primary/5 p-4 rounded-none max-w-xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold block mb-1">
              Active Test Prompt (From Knowledge Base)
            </span>
            <p className="text-sm font-medium text-foreground">{q}</p>
          </div>
        )}
      </div>
    </div>
  )
}

