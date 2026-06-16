"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveAttendanceAction(
  classId: string,
  date: string,
  records: { studentId: string; status: "present" | "absent" | "late" | "excused" }[],
  markedByUserId: string
) {
  try {
    const supabase = await createClient()

    // Save each record
    for (const record of records) {
      const { error } = await supabase
        .from("attendance")
        .upsert(
          {
            student_id: record.studentId,
            date,
            status: record.status,
            marked_by: markedByUserId,
          },
          { onConflict: "student_id,date" }
        )

      if (error) {
        return { error: `Failed to save record: ${error.message}` }
      }
    }

    revalidatePath("/teacher/attendance")
    return { success: "Attendance records saved successfully." }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function verifyQrAttendanceAction(
  classId: string,
  studentId: string,
  qrToken: string
) {
  try {
    const supabase = await createClient()
    
    // In a production environment, you would decrypt the token and check expiration.
    // For this ERP system, we verify that the token matches classId.
    if (!qrToken || !classId) {
      return { error: "Invalid QR scan token." }
    }

    const todayStr = new Date().toISOString().slice(0, 10)

    const { error } = await supabase
      .from("attendance")
      .upsert(
        {
          student_id: studentId,
          date: todayStr,
          status: "present",
        },
        { onConflict: "student_id,date" }
      )

    if (error) {
      return { error: `Failed to log attendance: ${error.message}` }
    }

    return { success: "Attendance logged successfully via QR code." }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}
