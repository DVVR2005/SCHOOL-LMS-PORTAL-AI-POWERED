import { NextResponse } from "next/server"
import { getGeminiModel } from "@/lib/ai"

export async function POST(req: Request) {
  try {
    const { attendanceRate, homeworkGradeAvg, examGradeAvg } = await req.json()

    // Analytical fallback logic
    let riskLevel = "Low Risk"
    let reason = "The student maintains excellent attendance and stable test scores, representing minimal academic risk."
    let recommendations = "Continue with current study plan. Engage in advanced extension materials to stay challenged."

    const att = Number(attendanceRate)
    const hw = Number(homeworkGradeAvg)
    const ex = Number(examGradeAvg)

    if (att < 75 || ex < 55) {
      riskLevel = "High Risk"
      reason = `Critical concern due to low attendance (${att}%) and failing average grades (${ex}%). Immediate intervention is highly recommended.`
      recommendations = "Schedule a teacher-parent meeting. Assign dedicated remedial sessions. Limit extracurricular activities until grades improve."
    } else if (att < 85 || hw < 70 || ex < 65) {
      riskLevel = "Medium Risk"
      reason = `Mild risk identified. The student's attendance (${att}%) or homework submissions (${hw}%) require monitoring to prevent further grade drops.`
      recommendations = "Encourage homework completion. Assign student peer mentoring. Set up weekly check-ins with class teacher."
    }

    const model = getGeminiModel()
    if (model) {
      const prompt = `
      Analyze this student's performance data and predict their academic risk level:
      - Attendance Rate: ${att}%
      - Homework Grades: ${hw}%
      - Exam Scores: ${ex}%
      
      Generate a response strictly formatted in JSON containing:
      {
        "riskLevel": "High Risk" | "Medium Risk" | "Low Risk",
        "reason": "explanation text",
        "recommendations": "remedial recommendations"
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
        console.warn("Gemini prediction call failed, using local risk engine:", aiErr)
      }
    }

    return NextResponse.json({ riskLevel, reason, recommendations })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
