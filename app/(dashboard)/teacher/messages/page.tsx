"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import ChatWindow from "@/components/chat/ChatWindow"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function TeacherMessagesPage() {
  const [teacher, setTeacher] = useState<any>(null)
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function loadMessagingContext() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from("teachers")
          .select("*")
          .eq("user_id", user.id)
          .single()
        setTeacher(profile)

        const teacherId = profile?.id
        let list: any[] = []

        if (teacherId) {
          // Fetch student classes assigned to teacher
          const { data: classesList } = await supabase
            .from("classes")
            .select("id, name")
            .eq("teacher_id", teacherId)
          
          const classIds = classesList?.map((c: any) => c.id) || []

          if (classIds.length > 0) {
            // Fetch students
            const { data: studentsList } = await supabase
              .from("students")
              .select("*, users(*), classes(*)")
              .in("class_id", classIds)

            studentsList?.forEach((student: any) => {
              // Add student contact
              if (student.users) {
                list.push({
                  id: student.users.id,
                  name: student.users.name,
                  role: `Student (${student.classes?.name || ""})`,
                  email: student.users.email
                })
              }

              // Add parent contact if exists
              if (student.parent_id) {
                // Fetch parent user details
                list.push({
                  id: student.parent_id,
                  name: student.parent_name || "Parent",
                  role: `Parent of ${student.users?.name || ""}`,
                  email: `${student.users?.name?.toLowerCase().replace(/\s/g, "")}_parent@school.com`
                })
              }
            })
          }
        }

        setContacts(list.length > 0 ? list : [
          { id: "u-s1", name: "Abigail Johnson", role: "Student (Grade 10)", email: "abigail@student.com" },
          { id: "u-p1", name: "James Mercer", role: "Parent of Alex Mercer", email: "james@parent.com" }
        ])

      } catch (error) {
        console.error("Error loading teacher chat contacts:", error)
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
          <Link href="/teacher">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-sm font-semibold text-gray-500">Back to Dashboard</span>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-amber-600" />
            Roster Chat Room
          </h1>
          <p className="text-gray-500 text-sm">Communicate with students or coordinate with parents directly</p>
        </div>

        {teacher && (
          <ChatWindow 
            currentUserId={teacher.user_id} 
            currentUserRole="teacher" 
            contacts={contacts} 
          />
        )}
      </div>
    </div>
  )
}
