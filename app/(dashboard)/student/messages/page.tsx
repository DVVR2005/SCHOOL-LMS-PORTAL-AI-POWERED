"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import ChatWindow from "@/components/chat/ChatWindow"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function StudentMessagesPage() {
  const [student, setStudent] = useState<any>(null)
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function loadMessagingContext() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from("students")
          .select("*, classes(*)")
          .eq("user_id", user.id)
          .single()
        setStudent(profile)

        // Fetch teachers teaching this student's class
        const classId = profile?.class_id
        let list: any[] = []

        if (classId) {
          // Get homeroom teacher
          const { data: classTeacher } = await supabase
            .from("classes")
            .select("*, teachers(*, users(*))")
            .eq("id", classId)
            .single()

          if (classTeacher?.teachers) {
            const t = classTeacher.teachers
            list.push({
              id: t.users?.id,
              name: t.users?.name || "Homeroom Teacher",
              role: `Homeroom (${classTeacher.name})`,
              email: t.users?.email || ""
            })
          }

          // Get subject teachers
          const { data: subjectsList } = await supabase
            .from("subjects")
            .select("*, teachers(*, users(*))")
            .eq("class_id", classId)

          subjectsList?.forEach((sub: any) => {
            if (sub.teachers && !list.some((item) => item.id === sub.teachers.users?.id)) {
              list.push({
                id: sub.teachers.users?.id,
                name: sub.teachers.users?.name || "Subject Teacher",
                role: `${sub.name} Course`,
                email: sub.teachers.users?.email || ""
              })
            }
          })
        }

        setContacts(list.length > 0 ? list : [
          { id: "u-t1", name: "Mr. Richard Vance", role: "Physics Teacher", email: "richard@school.com" },
          { id: "u-t2", name: "Dr. Evelyn Miller", role: "Math Teacher", email: "evelyn@school.com" }
        ])

      } catch (error) {
        console.error("Error loading student chat contacts:", error)
      } finally {
        setLoading(false)
      }
    }
    loadMessagingContext()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center space-x-2">
          <Link href="/student">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-sm font-semibold text-gray-500">Back to Locker</span>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-amber-600" />
            Teacher Chat Portal
          </h1>
          <p className="text-gray-500 text-sm">Send queries directly to course leaders and homework advisors</p>
        </div>

        {student && (
          <ChatWindow 
            currentUserId={student.user_id} 
            currentUserRole="student" 
            contacts={contacts} 
          />
        )}
      </div>
    </div>
  )
}
