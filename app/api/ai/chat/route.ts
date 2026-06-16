import { NextResponse } from "next/server"
import { getGeminiModel } from "@/lib/ai"

const SYSTEM_PROMPT = `
You are the AI Assistant for NAVS Global School (NAVS).
Information about NAVS Global School:
- Mission: Exceptional education rooted in Christian values, fostering academic excellence and character.
- Values: Discipline, Integrity, Excellence, Leadership, Wisdom, Compassion.
- Admissions: Registration fee is 15000 Rupees. Our team will contact parents within 24-48 hours after application to schedule a campus visit.
- Tuition Fees: Outstanding balances can be viewed and cleared on the student or parent fees statement portal using Chapa Payment Gateway.
- Academic Programs: High-quality curriculum with grades from Kindergarten up to Grade 12.
- Contact: Phone +91-98-XXX-XXXX, email: admissions@NAVSglobalschool.edu.et

Answer questions politely, clearly, and concisely. Keep answers under 3 sentences if possible.
`

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 })
    }

    const model = getGeminiModel()
    if (model) {
      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "model", parts: [{ text: "Understood. I will act as the NAVS AI Assistant." }] }
        ]
      })

      const response = await chat.sendMessage(message)
      const text = response.response.text()
      return NextResponse.json({ reply: text })
    } else {
      // Mock / Rules-based fallback response engine
      const msg = message.toLowerCase()
      let reply = "Welcome to NAVS Global School! How can I help you today?"

      if (msg.includes("admission") || msg.includes("apply") || msg.includes("register")) {
        reply = "Admissions at NAVS are open! You can fill out our Registration Form online. The registration fee is 15,000 Rupees, payable via Chapa. Once paid, our admissions office will contact you within 24-48 hours to schedule a tour."
      } else if (msg.includes("fee") || msg.includes("cost") || msg.includes("tuition") || msg.includes("pay")) {
        reply = "Tuition invoices and statements can be cleared securely using our online Chapa Payment Gateway under your Student or Parent dashboard. Simply navigate to the Fees portal to view details."
      } else if (msg.includes("timetable") || msg.includes("schedule") || msg.includes("class")) {
        reply = "Class timetables can be accessed directly from the Student dashboard. Live daily lectures are scheduled starting at 08:30 AM with core courses like Mathematics and Physics."
      } else if (msg.includes("contact") || msg.includes("phone") || msg.includes("email")) {
        reply = "You can contact our admissions desk at +91-98-XXX-XXXX or by emailing admissions@NAVSglobalschool.edu.et. We look forward to hearing from you!"
      }

      return NextResponse.json({ reply })
    }
  } catch (error: any) {
    console.error("AI chat error:", error)
    return NextResponse.json({ reply: "I'm sorry, I am experiencing temporary connection issues. How can I assist you with school information?" })
  }
}
