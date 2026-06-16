"use server"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { studentSchema } from "@/lib/validations"

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

export async function createStudentAction(data: {
  name: string
  email: string
  admissionNumber: string
  classId: string
  parentName: string
  phone: string
  address: string
}) {
  try {
    // Validate inputs with Zod
    const validated = studentSchema.parse(data)
    const adminSupabase = await getAdminClient()
    
    // 1. Create Auth User
    const password = "StudentTemp123!" // temporary password
    const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
      email: data.email,
      password,
      email_confirm: true,
      user_metadata: {
        name: data.name,
        role: "student",
      },
    })

    if (authError) {
      // If user already exists in auth, check if they are in public.users
      if (authError.message.includes("already registered")) {
        return { error: "A user with this email address already exists." }
      }
      return { error: authError.message }
    }

    const userId = authUser.user?.id
    if (!userId) {
      return { error: "Failed to provision authentication account." }
    }

    // 2. Insert Student record (the public.users record is created by trigger handle_new_user)
    // Wait a brief moment for trigger to run
    await new Promise((resolve) => setTimeout(resolve, 500))

    const { error: studentError } = await adminSupabase
      .from("students")
      .insert([
        {
          user_id: userId,
          admission_number: data.admissionNumber,
          class_id: data.classId || null,
          parent_name: data.parentName,
          phone: data.phone,
          address: data.address,
        },
      ])

    if (studentError) {
      // Clean up the auth user if profile insertion failed
      await adminSupabase.auth.admin.deleteUser(userId)
      return { error: studentError.message }
    }

    revalidatePath("/admin/students")
    return { success: "Student account created successfully with temp password: StudentTemp123!" }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function updateStudentAction(id: string, data: {
  name: string
  email: string
  admissionNumber: string
  classId: string
  parentName: string
  phone: string
  address: string
  userId: string
}) {
  try {
    const validated = studentSchema.parse(data)
    const supabase = await createClient()

    // Update public.users name
    const { error: userError } = await supabase
      .from("users")
      .update({ name: data.name })
      .eq("id", data.userId)

    if (userError) return { error: userError.message }

    // Update student details
    const { error: studentError } = await supabase
      .from("students")
      .update({
        admission_number: data.admissionNumber,
        class_id: data.classId || null,
        parent_name: data.parentName,
        phone: data.phone,
        address: data.address,
      })
      .eq("id", id)

    if (studentError) return { error: studentError.message }

    revalidatePath("/admin/students")
    return { success: "Student details updated successfully." }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function deleteStudentAction(id: string, userId: string) {
  try {
    const adminSupabase = await getAdminClient()
    
    // Deleting the auth user deletes the profile and student cascade-wise due to fk cascades
    const { error } = await adminSupabase.auth.admin.deleteUser(userId)
    if (error) {
      // Fallback: delete directly from table
      const { error: tableError } = await adminSupabase
        .from("students")
        .delete()
        .eq("id", id)
      if (tableError) return { error: tableError.message }
    }

    revalidatePath("/admin/students")
    return { success: "Student deleted successfully." }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}
