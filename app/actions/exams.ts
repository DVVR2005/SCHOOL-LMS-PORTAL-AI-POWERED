"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createExamAction(data: {
  title: string
  classId: string
  examDate: string
  durationMinutes: number
  questions: {
    id: string
    questionText: string
    options: string[]
    correctOption: string // e.g. "A", "B", "C", "D"
  }[]
}) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("exams")
      .insert([
        {
          title: data.title,
          class_id: data.classId,
          exam_date: data.examDate,
          duration_minutes: data.durationMinutes,
          questions: data.questions,
        },
      ])

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/teacher/exams")
    revalidatePath("/student/exams")
    return { success: "Online exam scheduled successfully." }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function submitExamAnswersAction(data: {
  examId: string
  studentId: string
  answers: Record<string, string> // e.g. { "q1": "A", "q2": "C" }
}) {
  try {
    const supabase = await createClient()

    // 1. Fetch exam questions
    const { data: exam, error: examError } = await supabase
      .from("exams")
      .select("*")
      .eq("id", data.examId)
      .single()

    if (examError || !exam) {
      return { error: "Exam details not found." }
    }

    const questions = exam.questions as any[]
    let correctCount = 0

    // 2. Grade MCQ answers
    questions.forEach((q) => {
      const studentAnswer = data.answers[q.id]
      if (studentAnswer === q.correctOption) {
        correctCount++
      }
    })

    const totalQuestions = questions.length || 1
    const scorePercentage = (correctCount / totalQuestions) * 100
    
    // Assign grade
    let grade = "F"
    if (scorePercentage >= 90) grade = "A"
    else if (scorePercentage >= 80) grade = "B"
    else if (scorePercentage >= 70) grade = "C"
    else if (scorePercentage >= 60) grade = "D"

    // 3. Log results in database
    const { error: resultError } = await supabase
      .from("results")
      .upsert(
        {
          exam_id: data.examId,
          student_id: data.studentId,
          marks: scorePercentage,
          grade,
        },
        { onConflict: "exam_id,student_id" }
      )

    if (resultError) {
      return { error: `Auto-grading complete but result log failed: ${resultError.message}` }
    }

    revalidatePath("/student/exams")
    revalidatePath("/student/grades")
    return { 
      success: "Exam answers submitted successfully.", 
      score: scorePercentage, 
      grade 
    }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}
