export default function PlaygroundPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="min-h-[100vh] flex-1 border border-border bg-card p-6 text-card-foreground">
        <h1 className="font-heading text-xl font-semibold">Playground</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Interactive workspace for testing and configuring AI assistants.
        </p>
      </div>
    </div>
  )
}
