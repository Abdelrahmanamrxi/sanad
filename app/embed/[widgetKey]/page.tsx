export default async function EmbedPage({
  params,
}: {
  params: Promise<{ widgetKey: string }>;
}) {
  const { widgetKey } = await params;

  return (
    <main className="w-full h-full" data-widget-key={widgetKey}>
      {/* Widget UI will mount here */}
    </main>
  );
}
