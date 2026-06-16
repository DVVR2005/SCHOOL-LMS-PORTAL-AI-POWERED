"use server"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

export async function createTeacherAction(data: {
  name: string
  email: string
  department: string
  qualification: string
  joiningDate: string
}) {
  try {
    const adminSupabase = await getAdminClient()
    
    // 1. Create Auth User
    const password = "TeacherTemp123!" // temporary password
    const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
      email: data.email,
      password,
      email_confirm: true,
      user_metadata: {
        name: data.name,
        role: "teacher",
      },
    })

    if (authError) {
      if (authError.message.includes("already registered")) {
        return { error: "A user with this email address already exists." }
      }
      return { error: authError.message }
    }

    const userId = authUser.user?.id
    if (!userId) {
      return { error: "Failed to provision authentication account." }
    }

    // 2. Insert Teacher record
    await new Promise((resolve) => setTimeout(resolve, 500))

    const { error: teacherError } = await adminSupabase
      .from("teachers")
      .insert([
        {
          user_id: userId,
          department: data.department,
          qualification: data.qualification,
          joining_date: data.joiningDate || new Date().toISOString().slice(0, 10),
        },
      ])

    if (teacherError) {
      await adminSupabase.auth.admin.deleteUser(userId)
      return { error: teacherError.message }
    }

    revalidatePath("/admin/teachers")
    return { success: "Teacher profile created successfully. Temp password: TeacherTemp123!" }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function updateTeacherAction(id: string, data: {
  name: string
  department: string
  qualification: string
  joiningDate: string
  userId: string
}) {
  try {
    const supabase = await createClient()

    // Update name
    const { error: userError } = await supabase
      .from("users")
      .update({ name: data.name })
      .eq("id", data.userId)

    if (userError) return { error: userError.message }

    // Update teacher details
    const { error: teacherError } = await supabase
      .from("teachers")
      .update({
        department: data.department,
        qualification: data.qualification,
        joining_date: data.joiningDate,
      })
      .eq("id", id)

    if (teacherError) return { error: teacherError.message }

    revalidatePath("/admin/teachers")
    return { success: "Teacher profile updated." }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function deleteTeacherAction(id: string, userId: string) {
  try {
    const adminSupabase = await getAdminClient()
    const { error } = await adminSupabase.auth.admin.deleteUser(userId)
    if (error) {
      const { error: tableError } = await adminSupabase
        .from("teachers")
        .delete()
        .eq("id", id)
      if (tableError) return { error: tableError.message }
    }

    revalidatePath("/admin/teachers")
    return { success: "Teacher account deleted." }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function assignTeacherToClassAndSubjectAction(
  teacherId: string,
  classId?: string,
  subjectId?: string
) {
  try {
    const supabase = await createClient()

    if (classId) {
      // Update class teacher
      const { error: classError } = await supabase
        .from("classes")
        .update({ teacher_id: teacherId })
        .eq("id", classId)
      if (classError) return { error: classError.message }
    }

    if (subjectId) {
      // Update subject teacher
      const { error: subjectError } = await supabase
        .from("subjects")
        .update({ teacher_id: teacherId })
        .eq("id", subjectId)
      if (subjectError) return { error: subjectError.message }
    }

    revalidatePath("/admin/teachers")
    return { success: "Class and subject mappings successfully updated." }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}
