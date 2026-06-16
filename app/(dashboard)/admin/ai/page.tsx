"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Bot, 
  ShieldAlert, 
  Send, 
  Loader2, 
  TrendingDown, 
  CheckCircle,
  HelpCircle
} from "lucide-react"
import Link from "next/link"

export default function AdminAiHubPage() {
  const [students, setStudents] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState("")
  
  // Predictor stats
  const [attendance, setAttendance] = useState(95)
  const [homework, setHomework] = useState(80)
  const [exam, setExam] = useState(78)
  const [predicting, setPredicting] = useState(false)
  const [predictResult, setPredictResult] = useState<any>(null)

  // Chatbot state
  const [chatInput, setChatInput] = useState("")
  const [chatLogs, setChatLogs] = useState<any[]>([
    { role: "bot", text: "Hello! I am your NAVS AI School Assistant. Ask me anything about registrations, tuition fees, or schedules." }
  ])
  const [chatting, setChatting] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function loadStudentsList() {
      try {
        const { data } = await supabase
          .from("students")
          .select("*, users(*)")
          .order("created_at", { ascending: false })
        
        const list = data || []
        setStudents(list)
        if (list.length > 0) {
          setSelectedStudent(list[0].id)
          // Default mock values
          setAttendance(92)
          setHomework(84)
          setExam(78)
        }
      } catch (err) {
        console.error("Error loading students list:", err)
      }
    }
    loadStudentsList()
  }, [])

  // Auto fill mock student stats when selected
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId)
    // Generate deterministic mock performance stats based on name length so it varies realistically
    const stud = students.find(s => s.id === studentId)
    if (stud) {
      const seed = stud.users?.name?.length || 10
      setAttendance(70 + (seed % 3) * 12 + (seed % 2) * 5)
      setHomework(60 + (seed % 4) * 10)
      setExam(50 + (seed % 5) * 10)
      setPredictResult(null)
    }
  }

  const handlePredict = async () => {
    setPredicting(true)
    setPredictResult(null)
    try {
      const res = await fetch("/api/ai/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendanceRate: attendance,
          homeworkGradeAvg: homework,
          examGradeAvg: exam
        })
      })
      const result = await res.json()
      setPredictResult(result)
    } catch (err) {
      console.error(err)
    } finally {
      setPredicting(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || chatting) return

    const userText = chatInput
    setChatInput("")
    setChatLogs(prev => [...prev, { role: "user", text: userText }])
    setChatting(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      })
      const data = await res.json()
      setChatLogs(prev => [...prev, { role: "bot", text: data.reply }])
    } catch (err) {
      setChatLogs(prev => [...prev, { role: "bot", text: "Connection error. Failed to load AI response." }])
    } finally {
      setChatting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Bot className="h-8 w-8 text-amber-600 animate-pulse" />
              AI Core Hub
            </h1>
            <p className="text-gray-500 text-sm">Predict student failure risks and query institutional bot channels</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Performance Predictor */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-amber-500" />
                  Student Performance Risk Predictor
                </CardTitle>
                <CardDescription>Input attendance, homework and quiz scoring averages to predict risk rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {students.length > 0 && (
                  <div className="space-y-1">
                    <Label>Select Student profile</Label>
                    <Select value={selectedStudent} onValueChange={handleStudentSelect}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Choose student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.users?.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="att">Attendance %</Label>
                    <Input id="att" type="number" min="0" max="100" value={attendance} onChange={(e) => { setAttendance(Number(e.target.value)); setPredictResult(null); }} className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="hw">Homework Avg %</Label>
                    <Input id="hw" type="number" min="0" max="100" value={homework} onChange={(e) => { setHomework(Number(e.target.value)); setPredictResult(null); }} className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ex">Exam Score %</Label>
                    <Input id="ex" type="number" min="0" max="100" value={exam} onChange={(e) => { setExam(Number(e.target.value)); setPredictResult(null); }} className="rounded-xl" />
                  </div>
                </div>

                <Button onClick={handlePredict} disabled={predicting} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-xl mt-4">
                  {predicting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Calculate Risk Prediction
                </Button>

                {predictResult && (
                  <div className="mt-6 p-6 rounded-2xl border bg-slate-50 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-semibold font-mono">Academic Risk Level:</span>
                      <Badge className={
                        predictResult.riskLevel === "High Risk" 
                          ? "bg-red-100 text-red-800 hover:bg-red-100" 
                          : predictResult.riskLevel === "Medium Risk"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                      }>
                        {predictResult.riskLevel}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <span className="block text-xs font-bold text-gray-400 uppercase">Analysis Reasoning</span>
                      <p className="text-gray-700 text-sm leading-relaxed">"{predictResult.reason}"</p>
                    </div>

                    <div className="space-y-2">
                      <span className="block text-xs font-bold text-gray-400 uppercase">Remedial Action Recommendations</span>
                      <p className="text-gray-700 text-sm leading-relaxed">"{predictResult.recommendations}"</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI assistant chatbot */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white flex flex-col h-[520px]">
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
                  <Bot className="h-5 w-5 text-amber-500" />
                  AI School Assistant Chatbot
                </CardTitle>
                <CardDescription>Get instant replies about admissions, fees, and lecture schedules</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatLogs.map((log, idx) => {
                  const isBot = log.role === "bot"
                  return (
                    <div key={idx} className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
                      <div className="flex items-start space-x-2 max-w-[80%]">
                        {isBot && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className="bg-amber-100 text-amber-800 text-xs font-extrabold uppercase">AI</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`p-4 rounded-2xl text-sm ${isBot ? "bg-slate-100 text-gray-800 rounded-tl-none" : "bg-amber-600 text-white rounded-tr-none"}`}>
                          <p>{log.text}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {chatting && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-amber-100 text-amber-800 text-xs font-extrabold">AI</AvatarFallback>
                      </Avatar>
                      <div className="p-4 bg-slate-100 text-gray-500 rounded-2xl rounded-tl-none flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Thinking...
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <div className="p-4 border-t bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input 
                    required
                    placeholder="Ask about admissions or term schedules..." 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)}
                    className="rounded-xl border-gray-200"
                  />
                  <Button type="submit" disabled={chatting} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
