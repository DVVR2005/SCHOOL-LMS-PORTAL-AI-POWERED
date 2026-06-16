import { NextResponse } from "next/server"
import { getGeminiModel } from "@/lib/ai"

export async function POST(req: Request) {
  try {
    const { marks, interests, skills } = await req.json()

    // Local standby fallback pathways
    let pathways = [
      { path: "Computer Scientist / Software Developer", reason: "Aligned with interests in computers, programming, and strong logical thinking skills." },
      { path: "Data Science Analyst", reason: "Matches analytical capabilities, data interpretation skills, and problem-solving interests." },
      { path: "Creative UI/UX Designer", reason: "Ideal for creative arts interest coupled with visual design and digital modeling skills." }
    ]

    const model = getGeminiModel()
    if (model) {
      const prompt = `
      Analyze this student profile and suggest three suitable career paths:
      - Subject Marks: ${JSON.stringify(marks)}
      - Interests: ${interests}
      - Core Skills: ${skills}
      
      Generate a response strictly formatted in JSON containing:
      {
        "pathways": [
          { "path": "Career Title", "reason": "Reason for recommendation" }
        ]
      }
      `
      try {
        const result = await model.generateContent(prompt)
        const text = result.response.text()
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          return NextResponse.json(parsed)
        }
      } catch (aiErr) {
        console.warn("Gemini career call failed, using fallback pathways:", aiErr)
      }
    }

    return NextResponse.json({ pathways })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
