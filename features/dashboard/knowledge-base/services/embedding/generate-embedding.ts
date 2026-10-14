
export const EMBEDDING_MODEL=process.env.CF_EMBEDDING_MODEL!;

const CF_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/baai/bge-m3`;
const EXPECTED_DIMS = 1024;

export async function generateEmbedding(
  text: string[],
  batchSize: number = 16
): Promise<number[][]> {
  if (text.length === 0) return [];

  const allEmbeddings: number[][] = [];

  for (let i = 0; i < text.length; i += batchSize) {
    const batch = text.slice(i, i + batchSize);

    const res = await fetch(CF_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: batch }),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.success || !Array.isArray(json.result?.data)) {
      throw new Error(
        `Workers AI embedding failed (${res.status}): ${JSON.stringify(json?.errors ?? json)}`
      );
    }

    const vectors: number[][] = json.result.data;

    if (vectors.length !== batch.length) {
      throw new Error(`Expected ${batch.length} embeddings, got ${vectors.length}`);
    }
    if (vectors[0].length !== EXPECTED_DIMS) {
      throw new Error(`Expected ${EXPECTED_DIMS} dims, got ${vectors[0].length}`);
    }

    allEmbeddings.push(...vectors);
  }

  return allEmbeddings;
}