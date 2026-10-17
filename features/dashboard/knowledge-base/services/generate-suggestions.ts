import { groq, GROQ_MODEL } from "@/lib/groq";

export async function generateSuggestions(chunk: string): Promise<string[]> {
  if (!chunk || !chunk.trim()) {
    return [];
  }
  const systemPrompt = `You are an AI customer support analyst. 
Analyze the provided document excerpt and generate 3 to 5 realistic questions that customers are most likely to ask, which can be answered by this content.
Rules:
- Respond in the SAME LANGUAGE as the document (if the document is in Arabic, questions MUST be in natural Arabic; if English, in English).
- Questions must be concise and sound like real customer inquiries.
- Output MUST be a valid JSON object matching this schema:
{
  "questions": ["Question 1", "Question 2", "Question 3"]
}`;
  const userPrompt = `Document Excerpt:
---
${chunk}
---
Generate 3 to 5 suggested questions in valid JSON format.`;

  try {
    const res = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        }
      ],
    });
    console.log(res.usage?.total_tokens)
    const raw = res.choices[0]?.message?.content;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.questions) ? parsed.questions : [];
  } catch (err) {
    console.error("Failed to generate suggested questions", err);
    return [];
  }
}
