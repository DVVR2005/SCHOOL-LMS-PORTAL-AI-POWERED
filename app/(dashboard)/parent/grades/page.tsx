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
  Users,
  Sparkles,
  UserCheck
} from "lucide-react"
import Link from "next/link"

interface ChildGrade {
  id: string
  subject: string
  examName: string
  marks: number
  classAvg: number
  grade: string
  teacherName: string
  feedback: string
}

interface Child {
  id: string
  name: string
  class: string
  section: string
  admissionNo: string
  grades: ChildGrade[]
  overallAvg: number
  rank: string
  status: string
  advisorComment: string
  advisorName: string
}

export default function ParentGradesPage() {
  const [loading, setLoading] = useState(true)
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch children (students linked to this parent)
        const { data: kids } = await supabase
          .from("students")
          .select("*, users(*), classes(*)")
          .eq("parent_id", user.id)

        const childList = kids || []

        // Mock complete children details for demonstration
        const mockChildrenData: Child[] = [
          {
            id: "s1",
            name: "Sarah Mercer",
            class: "Grade 9",
            section: "B",
            admissionNo: "ADM-2026-0043",
            overallAvg: 84.3,
            rank: "5th / 24",
            status: "PASSED",
            advisorComment: "Sarah has shown outstanding performance in English and Chemistry. She continues to improve in Physics experiments.",
            advisorName: "Marcus Brody",
            grades: [
              { id: "g1", subject: "Math Quiz 1", examName: "Algebra Fundamentals", marks: 82, classAvg: 75, grade: "B", teacherName: "Marcus Brody", feedback: "Strong logic skills, good problem solver." },
              { id: "g2", subject: "Physics Midterm", examName: "Thermodynamics Lab", marks: 78, classAvg: 72, grade: "B", teacherName: "Dr. Evelyn Vance", feedback: "Needs improvement in lab calculations." },
              { id: "g3", subject: "Chemistry Midterm", examName: "Organic Compounds", marks: 85, classAvg: 78, grade: "A", teacherName: "Dr. Evelyn Vance", feedback: "Excellent grasp of molecular concepts." },
              { id: "g4", subject: "English Literature", examName: "Term 1 Composition", marks: 92, classAvg: 83, grade: "A", teacherName: "Marcus Brody", feedback: "Outstanding writing quality and critique." }
            ]
          },
          {
            id: "s2",
            name: "Alex Mercer",
            class: "Grade 10",
            section: "A",
            admissionNo: "ADM-2026-0042",
            overallAvg: 85.0,
            rank: "3rd / 28",
            status: "PASSED",
            advisorComment: "Alex is highly dedicated and exhibits strong technical skills in math. His science coursework is exemplary.",
            advisorName: "Dr. Evelyn Vance",
            grades: [
              { id: "g5", subject: "Science / Physics", examName: "Physics Midterm Lab", marks: 92, classAvg: 82, grade: "A", teacherName: "Dr. Evelyn Vance", feedback: "Outstanding physics worksheets and laboratory analysis." },
              { id: "g6", subject: "Mathematics / Algebra", examName: "Math Midterm 1", marks: 78, classAvg: 75, grade: "B", teacherName: "Marcus Brody", feedback: "Good effort, but needs practice in factoring quadratic equations." },
              { id: "g7", subject: "English Literature", examName: "Term 1 Essay", marks: 85, classAvg: 80, grade: "A", teacherName: "Marcus Brody", feedback: "Clear structure, excellent research." }
            ]
          }
        ]

        const finalChildren = childList.length > 0 ? childList.map((k: any, index: number) => ({
          id: k.id,
          name: k.users?.name || "Student Name",
          class: k.classes?.name || (index === 0 ? "Grade 9" : "Grade 10"),
          section: k.classes?.section || (index === 0 ? "B" : "A"),
          admissionNo: k.admission_number || `ADM-2026-000${index + 1}`,
          overallAvg: index === 0 ? 84.3 : 85.0,
          rank: index === 0 ? "5th / 24" : "3rd / 28",
          status: "PASSED",
          advisorComment: index === 0 ? mockChildrenData[0].advisorComment : mockChildrenData[1].advisorComment,
          advisorName: index === 0 ? "Marcus Brody" : "Dr. Evelyn Vance",
          grades: index === 0 ? mockChildrenData[0].grades : mockChildrenData[1].grades
        })) : mockChildrenData

        setChildren(finalChildren)
        setSelectedChild(finalChildren[0])

      } catch (err) {
        console.error("Error loading parent children grades:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleDownloadTranscript = () => {
    if (!selectedChild) return
    const name = selectedChild.name
    const adm = selectedChild.admissionNo
    const className = selectedChild.class
    const sec = selectedChild.section

    let textContent = `========================================================\n`
    textContent += `             NAVS GLOBAL SCHOOL REPORT CARD              \n`
    textContent += `========================================================\n`
    textContent += `Student Name : ${name}\n`
    textContent += `Admission No : ${adm}\n`
    textContent += `Homeroom     : ${className} - Section ${sec}\n`
    textContent += `Date Issued  : ${new Date().toLocaleDateString()}\n`
    textContent += `========================================================\n\n`
    textContent += `Subject & Exam Name          Score    Class Avg   Grade\n`
    textContent += `---------------------------  -----    ---------   -----\n`
    
    selectedChild.grades.forEach(g => {
      const subjectPadded = g.subject.padEnd(27, ' ')
      const scorePadded = `${g.marks}%`.padEnd(9, ' ')
      const classPadded = `${g.classAvg}%`.padEnd(12, ' ')
      textContent += `${subjectPadded}  ${scorePadded}  ${classPadded}  ${g.grade}\n`
    })

    textContent += `\n--------------------------------------------------------\n`
    textContent += `OVERALL GPA AVERAGE : ${selectedChild.overallAvg.toFixed(1)}%\n`
    textContent += `CLASS RANK          : ${selectedChild.rank}\n`
    textContent += `ACADEMIC STATUS     : ${selectedChild.status}\n`
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Link href="/parent">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-sm font-semibold text-gray-500">Back to Lounge</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Award className="h-8 w-8 text-amber-600" />
              Child Results & Reports
            </h1>
            <p className="text-gray-500 text-sm">Review child exam sheets, average parameters and download term summaries</p>
          </div>

          {children.length > 1 && selectedChild && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
              <Users className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-gray-600">Student Selector:</span>
              <select 
                className="bg-transparent border-0 text-sm font-bold text-gray-900 focus:outline-none cursor-pointer"
                value={selectedChild.id}
                onChange={(e) => setSelectedChild(children.find(c => c.id === e.target.value) || null)}
              >
                {children.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {selectedChild && (
          <>
            {/* GPA summary cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow border-0 bg-gradient-to-br from-indigo-950 to-slate-900 text-white">
                <CardContent className="pt-6">
                  <span className="text-slate-400 text-sm block">Cumulative Average</span>
                  <span className="text-4xl font-extrabold text-white mt-2 block">{selectedChild.overallAvg.toFixed(1)}%</span>
                  <span className="text-xs text-amber-500 block font-semibold mt-1">Status: {selectedChild.status}</span>
                </CardContent>
              </Card>
              <Card className="shadow border-0 bg-white">
                <CardContent className="pt-6">
                  <span className="text-gray-500 text-sm block">Roster Standing Rank</span>
                  <span className="text-4xl font-extrabold text-gray-900 mt-2 block">{selectedChild.rank}</span>
                  <span className="text-xs text-slate-400 block mt-1">{selectedChild.class} - Section {selectedChild.section}</span>
                </CardContent>
              </Card>
              <Card className="shadow border-0 bg-white">
                <CardContent className="pt-6 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-gray-500 text-sm block">Official Transcripts</span>
                    <span className="text-xs text-slate-400 block mt-1">Download and print validated transcript report cards</span>
                  </div>
                  <Button onClick={handleDownloadTranscript} variant="outline" size="sm" className="w-full mt-4 border-amber-600 text-amber-700 hover:bg-amber-50 flex items-center justify-center gap-1.5">
                    <Download className="h-3.5 w-3.5" />
                    Download Transcript
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Assessment results table */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-500" />
                  Subject Scorecard: {selectedChild.name}
                </CardTitle>
                <CardDescription>Academic transcript detailing class average comparisons</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course / Exam Title</TableHead>
                        <TableHead>Assessment Name</TableHead>
                        <TableHead>Child Score</TableHead>
                        <TableHead>Class Average</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Subject Assessor</TableHead>
                        <TableHead>Comments</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedChild.grades.map((g) => (
                        <TableRow key={g.id} className="hover:bg-gray-50/20">
                          <TableCell className="font-bold text-gray-800">
                            {g.subject}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">{g.examName}</TableCell>
                          <TableCell className="font-extrabold text-slate-800 font-mono text-sm">{g.marks}%</TableCell>
                          <TableCell className="text-gray-500 font-mono text-xs">{g.classAvg}%</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              g.grade === "A"
                                ? "bg-green-50 text-green-700 border-green-500"
                                : "bg-indigo-50 text-indigo-700 border-indigo-500"
                            }>
                              Grade {g.grade}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600 text-xs font-semibold">{g.teacherName}</TableCell>
                          <TableCell className="text-gray-500 text-xs italic">{g.feedback}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Advisor Feedback Card */}
            <Card className="shadow-lg border-0 bg-slate-900 text-white overflow-hidden relative">
              <CardHeader>
                <CardTitle className="text-lg text-amber-500 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Homeroom Review Comments
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <blockquote className="text-sm border-l-2 border-amber-500 pl-4 italic text-slate-300">
                  "{selectedChild.advisorComment}"
                </blockquote>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-semibold">
                  <UserCheck className="h-4 w-4 text-amber-500" />
                  <span>{selectedChild.advisorName}, Advisor | NAVS Academic Board</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
