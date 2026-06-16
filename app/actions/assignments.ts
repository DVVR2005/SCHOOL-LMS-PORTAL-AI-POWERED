"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createAssignmentAction(data: {
  title: string
  description: string
  classId: string
  teacherId: string
  dueDate: string
  fileUrl: string
}) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("assignments")
      .insert([
        {
          title: data.title,
          description: data.description,
          class_id: data.classId,
          teacher_id: data.teacherId || null,
          due_date: data.dueDate,
          file_url: data.fileUrl || null,
        },
      ])

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/teacher/assignments")
    revalidatePath("/student/assignments")
    return { success: "Assignment uploaded successfully." }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function submitAssignmentAction(data: {
  assignmentId: string
  studentId: string
  fileUrl: string
}) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("submissions")
      .upsert(
        {
          assignment_id: data.assignmentId,
          student_id: data.studentId,
          file_url: data.fileUrl,
          submitted_at: new Date().toISOString(),
        },
        { onConflict: "assignment_id,student_id" }
      )

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/student/assignments")
    revalidatePath("/teacher/assignments")
    return { success: "Homework submitted successfully!" }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function gradeSubmissionAction(
  submissionId: string,
  grade: string,
  feedback: string,
  teacherId: string
) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("submissions")
      .update({
        grade,
        feedback,
        graded_by: teacherId,
      })
      .eq("id", submissionId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/teacher/assignments")
    revalidatePath("/student/assignments")
    return { success: "Submission graded successfully." }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}
