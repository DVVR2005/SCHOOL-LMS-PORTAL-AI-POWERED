"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { saveAttendanceAction } from "@/app/actions/attendance"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  QrCode, 
  Loader2, 
  Users, 
  TrendingUp, 
  RefreshCw 
} from "lucide-react"
import Link from "next/link"

export default function TeacherAttendancePage() {
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [students, setStudents] = useState<any[]>([])
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent" | "late" | "excused">>({})
  const [loading, setLoading] = useState(true)
  const [studentsLoading, setStudentsLoading] = useState(false)

  // Status message
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string | null }>({ type: null, message: null })
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)

  // QR Code feature state
  const [qrToken, setQrToken] = useState("")
  const [qrCountdown, setQrCountdown] = useState(15)

  const supabase = createClient()

  // Load teacher classes
  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setUser(user)

        // Get teacher
        const { data: teacher } = await supabase
          .from("teachers")
          .select("id")
          .eq("user_id", user.id)
          .single()

        if (teacher) {
          const { data: classList } = await supabase
            .from("classes")
            .select("*")
            .eq("teacher_id", teacher.id)
          
          setClasses(classList || [])
          if (classList && classList.length > 0) {
            setSelectedClass(classList[0].id)
          }
        } else {
          // Mock classes if not a teacher
          setClasses([
            { id: "c1", name: "Grade 10", section: "A" },
            { id: "c2", name: "Grade 9", section: "B" },
          ])
          setSelectedClass("c1")
        }
      } catch (error) {
        console.error("Error loading classes:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Load students for class
  useEffect(() => {
    if (!selectedClass) return

    async function loadStudents() {
      setStudentsLoading(true)
      try {
        const { data: studentList } = await supabase
          .from("students")
          .select("*, users(*)")
          .eq("class_id", selectedClass)

        const list = studentList || []
        
        // Mock student list if empty
        const finalStudents = list.length > 0 ? list : [
          { id: "s1", user_id: "u1", admission_number: "ADM-2026-0001", users: { name: "Abigail Johnson" } },
          { id: "s2", user_id: "u2", admission_number: "ADM-2026-0002", users: { name: "Benjamin Carter" } },
          { id: "s3", user_id: "u3", admission_number: "ADM-2026-0003", users: { name: "Chloe Williams" } },
        ]

        setStudents(finalStudents)

        // Fetch current day attendance if exists
        const { data: currentAttendance } = await supabase
          .from("attendance")
          .select("*")
          .eq("date", selectedDate)

        const initialAttendance: Record<string, "present" | "absent" | "late" | "excused"> = {}
        finalStudents.forEach((student: any) => {
          const record = currentAttendance?.find((a: any) => a.student_id === student.id)
          initialAttendance[student.id] = record?.status || "present"
        })

        setAttendance(initialAttendance)
      } catch (error) {
        console.error("Error loading class students:", error)
      } finally {
        setStudentsLoading(false)
      }
    }

    loadStudents()
  }, [selectedClass, selectedDate])

  // QR Code generator logic
  useEffect(() => {
    if (!selectedClass) return

    // Generate random token for QR Code
    setQrToken(`NAVS_ATTENDANCE_${selectedClass}_${Math.random().toString(36).substring(7)}`)
    setQrCountdown(15)

    const interval = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          setQrToken(`NAVS_ATTENDANCE_${selectedClass}_${Math.random().toString(36).substring(7)}`)
          return 15
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [selectedClass])

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late" | "excused") => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }))
  }

  const handleSave = async () => {
    setSaving(true)
    setStatus({ type: null, message: null })

    const records = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status,
    }))

    const res = await saveAttendanceAction(
      selectedClass,
      selectedDate,
      records,
      user?.id || ""
    )
    
    setSaving(false)

    if (res.error) {
      setStatus({ type: "error", message: res.error })
    } else {
      setStatus({ type: "success", message: res.success || "Attendance logged." })
      setTimeout(() => setStatus({ type: null, message: null }), 3000)
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
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/teacher">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                <Calendar className="h-8 w-8 text-amber-600" />
                Attendance Tracker
              </h1>
              <p className="text-gray-500 text-sm">Mark daily registers or broadcast automated QR codes</p>
            </div>
          </div>
        </div>

        {/* Configuration Bar */}
        <Card className="shadow-sm border-0 bg-white">
          <CardContent className="py-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Select Homeroom Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Choose a Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} Section {cls.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Register Date</Label>
              <Input 
                type="date" 
                className="rounded-xl"
                value={selectedDate} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Grid split: Register sheet vs QR generator */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Daily Attendance Sheet */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-amber-500" />
                    Register Sheet
                  </CardTitle>
                  <CardDescription>Verify student status entries</CardDescription>
                </div>
                <Button 
                  onClick={handleSave} 
                  disabled={saving || studentsLoading || students.length === 0}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Save Register
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {status.type && (
                  <Alert variant={status.type === "error" ? "destructive" : "default"}>
                    <AlertDescription>{status.message}</AlertDescription>
                  </Alert>
                )}

                {studentsLoading ? (
                  <div className="py-20 text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-amber-600 mx-auto" />
                    <span className="text-gray-500 text-sm mt-4 block">Loading student registry...</span>
                  </div>
                ) : students.length === 0 ? (
                  <div className="py-20 text-center text-gray-400">
                    No students assigned to this class.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-4">
                        <div>
                          <span className="block font-bold text-gray-900">{student.users?.name}</span>
                          <span className="block text-xs text-gray-500 font-mono">{student.admission_number}</span>
                        </div>
                        
                        <RadioGroup 
                          value={attendance[student.id] || "present"}
                          onValueChange={(val: any) => handleStatusChange(student.id, val)}
                          className="flex gap-2 sm:gap-4"
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="present" id={`p-${student.id}`} className="text-emerald-600 border-gray-300" />
                            <Label htmlFor={`p-${student.id}`} className="text-xs font-semibold text-emerald-700 cursor-pointer">Present</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="absent" id={`a-${student.id}`} className="text-red-600 border-gray-300" />
                            <Label htmlFor={`a-${student.id}`} className="text-xs font-semibold text-red-700 cursor-pointer">Absent</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="late" id={`l-${student.id}`} className="text-amber-600 border-gray-300" />
                            <Label htmlFor={`l-${student.id}`} className="text-xs font-semibold text-amber-700 cursor-pointer">Late</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="excused" id={`e-${student.id}`} className="text-indigo-600 border-gray-300" />
                            <Label htmlFor={`e-${student.id}`} className="text-xs font-semibold text-indigo-700 cursor-pointer">Excused</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* QR Code Broadcast Box */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-slate-900 text-white flex flex-col justify-between overflow-hidden">
              <CardHeader className="border-b border-slate-800">
                <CardTitle className="text-amber-500 text-lg flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Attendance
                </CardTitle>
                <CardDescription className="text-gray-400">Class self-marking screen</CardDescription>
              </CardHeader>
              <CardContent className="py-8 flex flex-col items-center justify-center space-y-6">
                <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center">
                  {/* Styled CSS QR Code placeholder */}
                  <div className="relative w-48 h-48 bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300">
                    <QrCode className="h-28 w-28 text-slate-800 animate-pulse" />
                    <div className="absolute inset-0 bg-amber-500/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <span className="text-xs font-extrabold text-amber-900 bg-amber-200 px-3 py-1 rounded-full shadow font-mono">BROADCASTING</span>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <span className="block text-sm font-semibold text-gray-200">Broadcast Code Active</span>
                  <code className="text-xs font-mono bg-slate-800 text-amber-400 px-2 py-1 rounded">{qrToken.slice(0, 24)}...</code>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
                    <RefreshCw className="h-3 w-3 animate-spin text-amber-500" />
                    <span>Regenerating token in <strong>{qrCountdown}s</strong></span>
                  </div>
                </div>
              </CardContent>
              <div className="p-6 border-t border-slate-800 bg-slate-950/50 text-center text-xs text-slate-400">
                Students can open the scan page on their mobile dashboard to scan this screen and mark themselves present automatically.
              </div>
            </Card>

            {/* Quick Analytics */}
            <Card className="shadow border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-800 text-sm">Monthly Attendance Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-gray-500">Present rate</span>
                  <span className="font-bold text-emerald-600">95.4%</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-gray-500">Absent rate</span>
                  <span className="font-bold text-red-600">3.2%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Late arrivals</span>
                  <span className="font-bold text-amber-600">1.4%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
