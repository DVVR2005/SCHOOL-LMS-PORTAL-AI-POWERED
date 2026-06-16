"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { createExamAction } from "@/app/actions/exams"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Award, 
  Plus, 
  Loader2, 
  PlusCircle, 
  Trash2, 
  Calendar,
  CheckCircle,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react"
import Link from "next/link"

export default function TeacherGradesPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [exams, setExams] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [selectedExam, setSelectedExam] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])

  // State
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string | null }>({ type: null, message: null })
  
  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isManualOpen, setIsManualOpen] = useState(false)

  // Exam Form
  const [title, setTitle] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [examDate, setExamDate] = useState("")
  const [duration, setDuration] = useState(60)
  const [questions, setQuestions] = useState<any[]>([
    { id: "q1", questionText: "", options: ["", "", "", ""], correctOption: "A" }
  ])

  // Manual Grade Form
  const [manualStudent, setManualStudent] = useState("")
  const [manualMarks, setManualMarks] = useState(0)
  const [manualGrade, setManualGrade] = useState("A")

  const supabase = createClient()

  // Fetch data
  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: prof } = await supabase
        .from("teachers")
        .select("id")
        .eq("user_id", user.id)
        .single()
      
      const teacherId = prof?.id || "t1"

      // Fetch classes
      const { data: classList } = await supabase
        .from("classes")
        .select("*")
        .eq("teacher_id", teacherId)
      setClasses(classList || [])
      if (classList && classList.length > 0) {
        setSelectedClass(classList[0].id)
      }

      // Fetch exams
      const { data: examList } = await supabase
        .from("exams")
        .select("*, classes(*)")
        .order("created_at", { ascending: false })
      setExams(examList || [])
    } catch (error) {
      console.error("Error loading exams & grades:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Load results and students when exam selected
  useEffect(() => {
    if (!selectedExam) return

    async function loadExamDetails() {
      try {
        // Fetch exam results
        const { data: scoreList } = await supabase
          .from("results")
          .select("*, students(*, users(*))")
          .eq("exam_id", selectedExam.id)
        setResults(scoreList || [])

        // Fetch class students
        const { data: studentList } = await supabase
          .from("students")
          .select("*, users(*)")
          .eq("class_id", selectedExam.class_id)
        setStudents(studentList || [])
      } catch (error) {
        console.error("Error loading exam scores:", error)
      }
    }
    loadExamDetails()
  }, [selectedExam])

  const handleAddQuestion = () => {
    const nextId = `q${questions.length + 1}`
    setQuestions([...questions, { id: nextId, questionText: "", options: ["", "", "", ""], correctOption: "A" }])
  }

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx))
  }

  const handleQuestionChange = (idx: number, field: string, val: string) => {
    const updated = [...questions]
    updated[idx].questionText = val
    setQuestions(updated)
  }

  const handleOptionChange = (qIdx: number, oIdx: number, val: string) => {
    const updated = [...questions]
    updated[qIdx].options[oIdx] = val
    setQuestions(updated)
  }

  const handleCorrectOptionChange = (qIdx: number, val: string) => {
    const updated = [...questions]
    updated[qIdx].correctOption = val
    setQuestions(updated)
  }

  const resetForm = () => {
    setTitle("")
    setExamDate("")
    setDuration(60)
    setQuestions([{ id: "q1", questionText: "", options: ["", "", "", ""], correctOption: "A" }])
    setStatus({ type: null, message: null })
  }

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus({ type: null, message: null })

    const res = await createExamAction({
      title,
      classId: selectedClass,
      examDate,
      durationMinutes: Number(duration),
      questions,
    })

    setSubmitting(false)
    if (res.error) {
      setStatus({ type: "error", message: res.error })
    } else {
      setStatus({ type: "success", message: res.success || "Exam created." })
      loadData()
      setTimeout(() => {
        setIsCreateOpen(false)
        setTitle("")
        setExamDate("")
        setQuestions([{ id: "q1", questionText: "", options: ["", "", "", ""], correctOption: "A" }])
        setStatus({ type: null, message: null })
      }, 2000)
    }
  }

  const handleManualGradeUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedExam || !manualStudent) return
    setSubmitting(true)

    const { error } = await supabase
      .from("results")
      .upsert(
        {
          exam_id: selectedExam.id,
          student_id: manualStudent,
          marks: Number(manualMarks),
          grade: manualGrade,
        },
        { onConflict: "exam_id,student_id" }
      )

    setSubmitting(false)
    if (error) {
      alert(error.message)
    } else {
      // Refresh results list
      const { data: scoreList } = await supabase
        .from("results")
        .select("*, students(*, users(*))")
        .eq("exam_id", selectedExam.id)
      setResults(scoreList || [])
      setIsManualOpen(false)
      setManualStudent("")
      setManualMarks(0)
      setManualGrade("A")
    }
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/teacher">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                <Award className="h-8 w-8 text-amber-600" />
                Exams & Grading Hub
              </h1>
              <p className="text-gray-500 text-sm">Design online MCQ papers or log offline term marks</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Dialog open={isCreateOpen} onOpenChange={(val: boolean) => { setIsCreateOpen(val); if(!val) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Schedule MCQ Exam
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>MCQ Exam Builder</DialogTitle>
                  <DialogDescription>Input title, timer, and create multiple choice questions.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateExam} className="space-y-4 pt-4">
                  {status.type && (
                    <Alert variant={status.type === "error" ? "destructive" : "default"}>
                      <AlertDescription>{status.message}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Exam Title *</Label>
                      <Input id="title" required placeholder="Chemistry Quiz 1" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Target Class *</Label>
                      <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name} Section {c.section}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Exam Date *</Label>
                      <Input id="date" type="date" required value={examDate} onChange={(e) => setExamDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (Minutes) *</Label>
                      <Input id="duration" type="number" required min="5" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                    </div>
                  </div>

                  {/* Question list */}
                  <div className="space-y-6 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-extrabold text-gray-800">Questions Block ({questions.length})</span>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion} className="text-xs">
                        <PlusCircle className="h-4 w-4 mr-1" /> Add Question
                      </Button>
                    </div>

                    {questions.map((q, qIdx) => (
                      <div key={q.id} className="p-4 border rounded-xl bg-gray-50 space-y-4 relative">
                        {questions.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-red-600" onClick={() => handleRemoveQuestion(qIdx)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <div className="space-y-2">
                          <Label>Question {qIdx + 1} *</Label>
                          <Input required placeholder="What is the chemical formula of ozone?" value={q.questionText} onChange={(e) => handleQuestionChange(qIdx, "questionText", e.target.value)} />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {["A", "B", "C", "D"].map((opt, oIdx) => (
                            <div key={opt} className="space-y-1">
                              <Label className="text-xs">Option {opt} *</Label>
                              <Input required placeholder={`Option ${opt}`} value={q.options[oIdx]} onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)} />
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <Label>Correct Option</Label>
                          <Select value={q.correctOption} onValueChange={(val) => handleCorrectOptionChange(qIdx, val)}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Correct option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">Option A</SelectItem>
                              <SelectItem value="B">Option B</SelectItem>
                              <SelectItem value="C">Option C</SelectItem>
                              <SelectItem value="D">Option D</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <DialogFooter className="pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={submitting} className="bg-amber-600 hover:bg-amber-700 text-white">
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Schedule Exam
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active exams list */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-500" />
                  Scheduled Exams
                </CardTitle>
                <CardDescription>Select an exam to grade/view results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {exams.length === 0 ? (
                  <div className="py-20 text-center text-gray-400">No scheduled exams.</div>
                ) : (
                  exams.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedExam(item)}
                      className={`p-4 border rounded-xl hover:border-amber-500 cursor-pointer transition-all duration-200 bg-white shadow-sm ${selectedExam?.id === item.id ? "border-amber-500 ring-2 ring-amber-500/20" : ""}`}
                    >
                      <span className="block font-bold text-gray-800">{item.title}</span>
                      <span className="block text-xs text-gray-500 mt-1">Class: {item.classes?.name}</span>
                      <span className="block text-xs text-gray-400 mt-2 font-mono">Date: {new Date(item.exam_date).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Sheet panel */}
          <div className="lg:col-span-2">
            {selectedExam ? (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-indigo-500" />
                      Results Sheet: {selectedExam.title}
                    </CardTitle>
                    <CardDescription>Student scores for Class {selectedExam.classes?.name}</CardDescription>
                  </div>
                  <Dialog open={isManualOpen} onOpenChange={setIsManualOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                        Upload Marks
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Log Exam Results</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleManualGradeUpload} className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Select Student *</Label>
                          <Select value={manualStudent} onValueChange={setManualStudent}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose student" />
                            </SelectTrigger>
                            <SelectContent>
                              {students.map((stud) => (
                                <SelectItem key={stud.id} value={stud.id}>{stud.users?.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="marks">Marks Received (0-100) *</Label>
                            <Input id="marks" type="number" required min="0" max="100" value={manualMarks} onChange={(e) => setManualMarks(Number(e.target.value))} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="grade-select">Grade *</Label>
                            <Select value={manualGrade} onValueChange={setManualGrade}>
                              <SelectTrigger id="grade-select">
                                <SelectValue placeholder="Select Grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                                <SelectItem value="D">D</SelectItem>
                                <SelectItem value="F">F</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter className="pt-4">
                          <Button type="button" variant="ghost" onClick={() => setIsManualOpen(false)}>Cancel</Button>
                          <Button type="submit" disabled={submitting} className="bg-amber-600 hover:bg-amber-700 text-white">Upload</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {results.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">No grades uploaded for this exam yet.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Admission No</TableHead>
                          <TableHead>Marks / % Score</TableHead>
                          <TableHead className="text-right">Grade Assigned</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((score) => (
                          <TableRow key={score.id}>
                            <TableCell className="font-bold text-gray-800">{score.students?.users?.name}</TableCell>
                            <TableCell className="text-gray-500 font-mono text-xs">{score.students?.admission_number}</TableCell>
                            <TableCell className="font-semibold text-gray-700">{score.marks}%</TableCell>
                            <TableCell className="text-right">
                              <Badge className={score.grade === "F" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                                Grade {score.grade}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow border-0 bg-white p-20 text-center flex flex-col justify-center items-center">
                <Award className="h-12 w-12 text-slate-300 mb-4" />
                <span className="text-gray-500 block text-lg font-bold">Select a scheduled exam from the roster list</span>
                <span className="text-gray-400 text-sm">To upload grades or evaluate MCQ test attempts.</span>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
