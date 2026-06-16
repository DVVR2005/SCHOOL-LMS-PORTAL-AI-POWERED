"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { submitExamAnswersAction } from "@/app/actions/exams"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Award, 
  Clock, 
  HelpCircle, 
  Loader2, 
  CheckCircle, 
  AlertTriangle 
} from "lucide-react"
import Link from "next/link"

export default function StudentExamSessionPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.id as string

  const [student, setStudent] = useState<any>(null)
  const [exam, setExam] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  
  // Timer & UI State
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ score: number; grade: string } | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

  const supabase = createClient()

  useEffect(() => {
    async function loadSession() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from("students")
          .select("*, classes(*)")
          .eq("user_id", user.id)
          .single()
        setStudent(profile)

        // Fetch exam questions
        const { data: examData } = await supabase
          .from("exams")
          .select("*")
          .eq("id", examId)
          .single()
        
        if (examData) {
          setExam(examData)
          setTimeLeft(examData.duration_minutes * 60)
        } else {
          setErrorMsg("Exam scheduled session not found.")
        }
      } catch (err) {
        console.error("Error loading exam session:", err)
      } finally {
        setLoading(false)
      }
    }
    loadSession()
  }, [examId])

  // Timer Countdown and Auto-Submission Trigger
  useEffect(() => {
    if (timeLeft === null || result) return

    if (timeLeft <= 0) {
      // Auto submission when timer hits 0
      handleAutoSubmit()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, result])

  const handleOptionChange = (questionId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }))
  }

  const handleAutoSubmit = async () => {
    setSubmitting(true)
    setErrorMsg("⏰ Time expired! Auto-submitting answers...")

    const res = await submitExamAnswersAction({
      examId,
      studentId: student?.id || "s1",
      answers,
    })

    setSubmitting(false)
    if (res.error) {
      setErrorMsg(res.error)
    } else {
      setResult({ score: res.score || 0, grade: res.grade || "F" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!window.confirm("Are you sure you want to finish and submit your answers?")) return

    setSubmitting(true)
    const res = await submitExamAnswersAction({
      examId,
      studentId: student?.id || "s1",
      answers,
    })

    setSubmitting(false)
    if (res.error) {
      setErrorMsg(res.error)
    } else {
      setResult({ score: res.score || 0, grade: res.grade || "F" })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (errorMsg && !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <Card className="max-w-md w-full shadow border-0">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto" />
            <span className="block font-bold text-gray-800 text-lg">{errorMsg}</span>
            <Link href="/student/exams">
              <Button>Return to Lobby</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const questions = (exam?.questions as any[]) || []

  // Renders the scorecard results screen upon submission
  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <Card className="max-w-md w-full shadow-2xl border-0 bg-white text-center">
          <CardHeader className="bg-slate-900 text-white rounded-t-2xl py-8">
            <Award className="h-16 w-16 text-amber-500 mx-auto mb-4 animate-bounce" />
            <CardTitle className="text-2xl font-bold">Exam Results Summary</CardTitle>
            <CardDescription className="text-slate-400">Scorecard details generated instantly</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-1">
              <span className="block text-gray-400 text-xs uppercase font-bold tracking-wider">Final Marks Received</span>
              <span className="block text-5xl font-extrabold text-gray-900">{result.score}%</span>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="block text-gray-500 text-sm">Grading Code</span>
              <span className={`block font-extrabold text-3xl mt-1 ${result.grade === "F" ? "text-red-600" : "text-green-600"}`}>
                Grade {result.grade}
              </span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Your test response has been permanently saved inside your ERP student locker. Report cards can be downloaded at any time.
            </p>

            <Link href="/student/exams" className="block w-full pt-4">
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 font-bold">
                Finish & Exit Session
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Floating Timer Header Bar */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center space-x-4">
          <h2 className="font-extrabold text-lg text-amber-500">{exam.title}</h2>
          <span className="hidden sm:inline text-xs text-slate-400">|</span>
          <span className="hidden sm:inline text-xs text-slate-300 font-semibold">{questions.length} Questions</span>
        </div>

        {timeLeft !== null && (
          <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20 font-mono text-sm font-bold">
            <Clock className={`h-4 w-4 ${timeLeft < 60 ? "text-red-500 animate-pulse" : "text-amber-500"}`} />
            <span className={timeLeft < 60 ? "text-red-400" : "text-white"}>{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      <main className="flex-1 p-6 max-w-3xl w-full mx-auto space-y-6">
        {errorMsg && (
          <Alert variant="destructive">
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          {questions.map((q, qIdx) => (
            <Card key={q.id} className="shadow border-0 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-800 text-base font-bold flex gap-2">
                  <span className="text-amber-600 font-mono">Q{qIdx + 1}.</span>
                  {q.questionText}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={answers[q.id] || ""} 
                  onValueChange={(val) => handleOptionChange(q.id, val)}
                  className="space-y-3"
                >
                  {["A", "B", "C", "D"].map((optLetter, optIdx) => (
                    <div key={optLetter} className="flex items-center space-x-3 p-3 border rounded-xl hover:bg-gray-50/50 cursor-pointer">
                      <RadioGroupItem value={optLetter} id={`${q.id}-${optLetter}`} className="text-amber-600" />
                      <Label htmlFor={`${q.id}-${optLetter}`} className="w-full text-sm font-semibold text-gray-700 cursor-pointer flex gap-1">
                        <span className="font-bold font-mono">{optLetter}.</span>
                        {q.options[optIdx]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          {/* Submit Action footer */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={submitting} 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 rounded-xl text-lg font-bold"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CheckCircle className="h-5 w-5 mr-2" />}
              Submit Exam Response
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
