"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Award, 
  Calendar, 
  Clock, 
  HelpCircle, 
  Play 
} from "lucide-react"
import Link from "next/link"

export default function StudentExamsPage() {
  const [student, setStudent] = useState<any>(null)
  const [exams, setExams] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function loadExamRoster() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from("students")
          .select("*, classes(*)")
          .eq("user_id", user.id)
          .single()
        setStudent(profile)

        const classId = profile?.class_id || "c1"
        const studentId = profile?.id || "s1"

        // Fetch exams
        const { data: examList } = await supabase
          .from("exams")
          .select("*")
          .eq("class_id", classId)
        setExams(examList || [])

        // Fetch results to check if already completed
        const { data: resultList } = await supabase
          .from("results")
          .select("*")
          .eq("student_id", studentId)
        setResults(resultList || [])
      } catch (err) {
        console.error("Error loading exams:", err)
      } finally {
        setLoading(false)
      }
    }
    loadExamRoster()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  const examRoster = exams.map((exam) => {
    const res = results.find((r) => r.exam_id === exam.id)
    return {
      ...exam,
      completed: !!res,
      score: res?.marks ?? null,
      grade: res?.grade ?? null
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
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
            <Award className="h-8 w-8 text-amber-600" />
            Online Examination Room
          </h1>
          <p className="text-gray-500 text-sm">Attempt timed MCQ quizzes and check score reports instantly</p>
        </div>

        {/* Exam list */}
        <div className="space-y-4">
          {examRoster.length === 0 ? (
            <Card className="shadow border-0 bg-white p-20 text-center">
              <HelpCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <span className="text-gray-500 block text-lg font-bold">No online exams scheduled for your class</span>
            </Card>
          ) : (
            examRoster.map((exam) => (
              <Card key={exam.id} className="shadow-lg border-0 bg-white overflow-hidden">
                <CardHeader className="py-5 bg-slate-50 border-b flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-800 text-lg">{exam.title}</CardTitle>
                    <CardDescription className="text-xs">Timed MCQ Exam Session</CardDescription>
                  </div>
                  {exam.completed ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-bold px-3 py-1">
                      Score: {exam.score}% (Grade {exam.grade})
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-600 text-amber-700 bg-amber-50">
                      Pending Action
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-6 text-sm text-gray-500 font-semibold font-mono">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-amber-600" />
                      <span>Date: {new Date(exam.exam_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span>Timer: {exam.duration_minutes} Mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HelpCircle className="h-4 w-4 text-amber-600" />
                      <span>{exam.questions?.length || 0} Questions</span>
                    </div>
                  </div>

                  {!exam.completed && (
                    <Link href={`/student/exams/${exam.id}`}>
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 font-bold">
                        <Play className="h-4 w-4" />
                        Start Test
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
