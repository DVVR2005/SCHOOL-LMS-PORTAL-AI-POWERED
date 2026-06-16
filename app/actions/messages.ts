"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function sendMessageAction(
  senderId: string,
  receiverId: string,
  content: string
) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: senderId,
          receiver_id: receiverId,
          content,
        },
      ])

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/student/messages")
    revalidatePath("/teacher/messages")
    revalidatePath("/parent/messages")
    return { success: "Message sent successfully." }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}
