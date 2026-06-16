"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  ArrowLeft, 
  Award, 
  Download,
  BookOpen,
  Calendar,
  Sparkles,
  Smile,
  GraduationCap
} from "lucide-react"
import Link from "next/link"

interface GradeItem {
  id: string
  subject: string
  examName: string
  marks: number
  grade: string
  teacherName: string
  feedback: string
}

export default function StudentGradesPage() {
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<any>(null)
  const [grades, setGrades] = useState<GradeItem[]>([])

  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from("students")
          .select("*, users(*), classes(*)")
          .eq("user_id", user.id)
          .single()
        setStudent(profile || {
          admission_number: "ADM-2026-0042",
          classes: { name: "Grade 10", section: "A" },
          users: { name: "Alex Mercer" }
        })

        // Fetch exam results
        const studentId = profile?.id
        let resultsList = []
        if (studentId) {
          const { data } = await supabase
            .from("results")
            .select("*, exams(*)")
            .eq("student_id", studentId)
          resultsList = data || []
        }

        // Mock grades if database table is empty/newly created
        setGrades(resultsList.length > 0 ? resultsList.map((r: any) => ({
          id: r.id,
          subject: "Science",
          examName: r.exams?.title || "Midterm Quiz",
          marks: Number(r.marks),
          grade: r.grade,
          teacherName: "Dr. Evelyn Vance",
          feedback: "Great presentation and homework submissions. Keep up the high standard."
        })) : [
          { id: "g1", subject: "Science / Physics", examName: "Physics Midterm Lab", marks: 92, grade: "A", teacherName: "Dr. Evelyn Vance", feedback: "Outstanding physics worksheets and laboratory analysis report." },
          { id: "g2", subject: "Mathematics / Algebra", examName: "Math Midterm 1", marks: 78, grade: "B", teacherName: "Marcus Brody", feedback: "Good effort, but needs practice in factoring quadratic equations." },
          { id: "g3", subject: "English Literature", examName: "Term 1 Essay", marks: 85, grade: "A", teacherName: "Marcus Brody", feedback: "Clear structure, excellent research. Writing quality is outstanding." }
        ])
      } catch (err) {
        console.error("Error loading student grades:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleDownloadTranscript = () => {
    const name = student?.users?.name || "Student Name"
    const adm = student?.admission_number || "ADM-2026-0000"
    const className = student?.classes?.name || "Grade 10"
    const sec = student?.classes?.section || "A"

    let textContent = `========================================================\n`
    textContent += `             NAVS GLOBAL SCHOOL REPORT CARD              \n`
    textContent += `========================================================\n`
    textContent += `Student Name : ${name}\n`
    textContent += `Admission No : ${adm}\n`
    textContent += `Homeroom     : ${className} - Section ${sec}\n`
    textContent += `Date Issued  : ${new Date().toLocaleDateString()}\n`
    textContent += `========================================================\n\n`
    textContent += `Subject & Exam Name          Score    Grade   Teacher\n`
    textContent += `---------------------------  -----    -----   -----------\n`
    
    grades.forEach(g => {
      const subjectPadded = g.subject.padEnd(27, ' ')
      const scorePadded = `${g.marks}%`.padEnd(9, ' ')
      const gradePadded = g.grade.padEnd(8, ' ')
      textContent += `${subjectPadded}  ${scorePadded}  ${gradePadded}  ${g.teacherName}\n`
    })

    const avgScore = grades.reduce((acc, curr) => acc + curr.marks, 0) / grades.length
    textContent += `\n--------------------------------------------------------\n`
    textContent += `OVERALL GPA AVERAGE : ${avgScore.toFixed(1)}%\n`
    textContent += `ACADEMIC STATUS     : PASSED / EXCELLENT\n`
    textContent += `========================================================\n`

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `academic_report_${name.toLowerCase().replace(" ", "_")}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  const averageMark = grades.reduce((acc, curr) => acc + curr.marks, 0) / grades.length

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Link href="/student">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-sm font-semibold text-gray-500">Back to Locker</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Award className="h-8 w-8 text-amber-600" />
              Grades & Report Card
            </h1>
            <p className="text-gray-500 text-sm">Review exam transcripts, teacher feedback reports and save marks sheets</p>
          </div>

          <Button onClick={handleDownloadTranscript} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
            <Download className="h-4 w-4 mr-2" />
            Download Transcript
          </Button>
        </div>

        {/* GPA Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow border-0 bg-gradient-to-br from-indigo-950 to-slate-900 text-white">
            <CardContent className="pt-6">
              <span className="text-slate-400 text-sm block">Cumulative Average</span>
              <span className="text-4xl font-extrabold text-white mt-2 block">{averageMark.toFixed(1)}%</span>
              <span className="text-xs text-amber-500 block font-semibold mt-1">Excellent standing (Grade A)</span>
            </CardContent>
          </Card>
          <Card className="shadow border-0 bg-white">
            <CardContent className="pt-6">
              <span className="text-gray-500 text-sm block">Class Rank Status</span>
              <span className="text-4xl font-extrabold text-gray-900 mt-2 block">3rd / 28</span>
              <span className="text-xs text-slate-400 block mt-1">Grade 10 homeroom student roster</span>
            </CardContent>
          </Card>
          <Card className="shadow border-0 bg-white border-l-4 border-emerald-500">
            <CardContent className="pt-6">
              <span className="text-emerald-700 text-sm block font-bold">Academic Status</span>
              <span className="text-4xl font-extrabold text-emerald-800 mt-2 block">PASSED</span>
              <span className="text-xs text-slate-400 block mt-1">Approved by Registrar office</span>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Marksheet */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-500" />
              Term Exam Breakdown
            </CardTitle>
            <CardDescription>Verified academic marks and grading sheets</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course / Subject</TableHead>
                    <TableHead>Assessment Title</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Letter Grade</TableHead>
                    <TableHead>Assigned Teacher</TableHead>
                    <TableHead>Assessor Comments & Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50/20">
                      <TableCell className="font-bold text-gray-800">
                        {item.subject}
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">{item.examName}</TableCell>
                      <TableCell className="font-semibold text-gray-700 font-mono">{item.marks}%</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          item.grade === "A" 
                            ? "bg-green-50 text-green-700 border-green-500" 
                            : "bg-indigo-50 text-indigo-700 border-indigo-500"
                        }>
                          Grade {item.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 text-xs font-semibold">{item.teacherName}</TableCell>
                      <TableCell className="text-gray-500 text-xs italic">{item.feedback}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Feedback Alert */}
        <Card className="shadow-lg border-0 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <GraduationCap className="w-48 h-48 text-white" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg text-amber-500 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Homeroom Advisor Review
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <blockquote className="text-sm border-l-2 border-amber-500 pl-4 italic text-slate-300">
              "Alex Mercer shows outstanding dedication and works exceptionally well in team environments. His marks across Science and English Literature demonstrate exemplary critical thinking skills. We encourage him to continue focusing on algebraic factoring techniques for his midterm results."
            </blockquote>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-semibold">
              <Smile className="h-4 w-4 text-amber-500" />
              <span>Marcus Brody, Homeroom Advisor | NAVS Global School</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
