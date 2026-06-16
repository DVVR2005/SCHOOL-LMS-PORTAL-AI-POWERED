import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY || ""

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

export function getGeminiModel() {
  if (!genAI) return null
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
}
