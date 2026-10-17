import Groq from 'groq-sdk'

export const groq=new Groq({
    apiKey:process.env.GROQ_API_KEY,
    maxRetries:1,
    timeout:30_000
})

export const GROQ_MODEL = process.env.GROQ_MODEL!;