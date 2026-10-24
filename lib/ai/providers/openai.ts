import {createOpenAI} from "@ai-sdk/openai"

export const sovereign=createOpenAI({
    baseURL:process.env.LLM_BASE_URL!,
    apiKey:process.env.LLM_API_KEY!
})