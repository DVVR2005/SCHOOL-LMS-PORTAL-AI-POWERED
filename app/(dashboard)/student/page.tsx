"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Calendar, 
  Award, 
  DollarSign, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  FileCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  Compass,
  QrCode
} from "lucide-react"
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts"

const performanceTrend = [
  { term: "Term 1", Math: 70, Science: 75, English: 80 },
  { term: "Term 2", Math: 75, Science: 82, English: 82 },
  { term: "Term 3", Math: 80, Science: 85, English: 88 },
  { term: "Term 4", Math: 85, Science: 88, English: 90 },
]

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [student, setStudent] = useState<any>(null)
  const [assignments, setAssignments] = useState<any[]>([])
  const [fees, setFees] = useState<any[]>([])

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadStudentData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }
        setUser(user)

        // Get Student Profile
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

        // Fetch student assignments
        let classId = profile?.class_id
        if (classId) {
          const { data } = await supabase
            .from("assignments")
            .select("*")
            .eq("class_id", classId)
            .order("due_date", { ascending: true })
          setAssignments(data || [])
        }

        // Fetch student fee records
        const studentId = profile?.id
        if (studentId) {
          const { data } = await supabase
            .from("fees")
            .select("*")
            .eq("student_id", studentId)
          setFees(data || [])
        }
      } catch (err) {
        console.error("Error loading student stats:", err)
      } finally {
        setLoading(false)
      }
    }

    loadStudentData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className={`bg-slate-900 text-white w-64 fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-200 ease-in-out z-30`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">NAVS</span>
            </div>
            <div>
              <span className="font-bold text-lg block">NAVS Portal</span>
              <span className="text-xs text-amber-500 block">Student Locker</span>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-gray-800" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="p-6 space-y-2">
          <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase block mb-4 font-mono font-bold">Locker Room</span>
          <Link href="/student" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-amber-600 text-white font-medium">
            <Calendar className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/student/assignments" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
            <BookOpen className="h-5 w-5" />
            <span>Assignments</span>
          </Link>
          <Link href="/student/grades" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
            <Award className="h-5 w-5" />
            <span>Grades & Report</span>
          </Link>
          <Link href="/student/career-guidance" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
            <Compass className="h-5 w-5 text-amber-500" />
            <span>AI Career Guide</span>
          </Link>
          <Link href="/student/fees" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
            <DollarSign className="h-5 w-5" />
            <span>My Invoices</span>
          </Link>
          <Link href="/student/messages" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
            <MessageSquare className="h-5 w-5" />
            <span>Teacher Chat</span>
          </Link>
          <Link href="/student/scan-attendance" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
            <QrCode className="h-5 w-5" />
            <span>Scan Attendance</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back, {student.users?.name || "Student"}</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
            </Button>
            <div className="flex items-center space-x-3 border-l pl-6">
              <div className="text-right">
                <span className="block text-sm font-semibold text-gray-700">{user?.email}</span>
                <span className="block text-xs text-amber-600 font-semibold">{student.classes?.name || "Grade 10"} - Section {student.classes?.section || "A"}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-500 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Link href="/student/scan-attendance" className="block hover:opacity-90 transition-opacity">
              <Card className="shadow border-0">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-500 text-sm block">Attendance Rate</span>
                      <span className="text-3xl font-bold mt-1 block">96%</span>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="shadow border-0">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-sm block">Current Grade Avg</span>
                    <span className="text-3xl font-bold mt-1 block">81.2%</span>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Award className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow border-0">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-sm block">Pending Homeworks</span>
                    <span className="text-3xl font-bold mt-1 block">
                      {assignments.filter(a => new Date(a.due_date) > new Date()).length || 3}
                    </span>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow border-0">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-sm block">Term Fee Status</span>
                    <span className="text-3xl font-bold mt-1 block">
                      {fees.some(f => f.status === "pending") ? "Pending" : "Paid"}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Chart */}
              <Card className="shadow border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-lg">My Performance Trend</CardTitle>
                  <CardDescription>Term-wise course score updates</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="term" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Math" stroke="#d97706" strokeWidth={2} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="Science" stroke="#4f46e5" strokeWidth={2} />
                      <Line type="monotone" dataKey="English" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Assignment list */}
              <Card className="shadow border-0">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-lg">Homework & Assignments</CardTitle>
                  <CardDescription>Upload deadlines and homework guidelines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assignments.length > 0 ? (
                    assignments.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <span className="block font-semibold text-gray-800">{item.title}</span>
                          <span className="block text-xs text-gray-500">Due: {new Date(item.due_date).toLocaleString()}</span>
                        </div>
                        <Link href="/student/assignments">
                          <Button size="sm" variant="outline">View Detail</Button>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <span className="block font-semibold text-gray-800">Physics Lab Worksheet: Electromagnetism</span>
                          <span className="block text-xs text-gray-500">Due: June 20, 2026 - 11:59 PM</span>
                        </div>
                        <Badge variant="outline" className="border-amber-600 text-amber-700 bg-amber-50">Pending</Badge>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <span className="block font-semibold text-gray-800">Math Homework: Quadratic Equations</span>
                          <span className="block text-xs text-gray-500">Due: June 22, 2026 - 11:59 PM</span>
                        </div>
                        <Badge variant="outline" className="border-amber-600 text-amber-700 bg-amber-50">Pending</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="block font-semibold text-gray-800">English Literature Essay</span>
                          <span className="block text-xs text-gray-500">Due: June 15, 2026 - Completed</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Submitted</Badge>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Timetable Panel */}
            <div className="space-y-6">
              <Card className="shadow border-0">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-lg">Daily Schedule</CardTitle>
                  <CardDescription>Today's timetable lectures</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-xl border-l-4 border-amber-600">
                    <span className="block font-bold text-gray-800">Mathematics</span>
                    <span className="block text-xs text-gray-500">08:30 AM - 09:30 AM (Room 201)</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border-l-4 border-indigo-600">
                    <span className="block font-bold text-gray-800">Physics Lecture</span>
                    <span className="block text-xs text-gray-500">09:45 AM - 10:45 AM (Physics Lab)</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border-l-4 border-emerald-600">
                    <span className="block font-bold text-gray-800">English Literature</span>
                    <span className="block text-xs text-gray-500">11:00 AM - 12:00 PM (Room 205)</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border-l-4 border-slate-600">
                    <span className="block font-bold text-gray-800">Lunch Break</span>
                    <span className="block text-xs text-gray-500">12:00 PM - 01:00 PM (Cafeteria)</span>
                  </div>
                </CardContent>
              </Card>

              {/* Fee Pay Card */}
              <Card className="shadow border-0 bg-gradient-to-br from-indigo-950 to-slate-900 text-white">
                <CardHeader>
                  <CardTitle className="text-amber-500 text-lg">Payment Centre</CardTitle>
                  <CardDescription className="text-gray-400">View and clear school fee balance</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-xs text-gray-400 block uppercase">Outstanding Amount</span>
                  <span className="text-3xl font-extrabold block text-white mt-1">12,500 INR</span>
                  <p className="text-xs text-slate-300 mt-2">Term 2 Tuition fees due by July 1, 2026</p>
                </CardContent>
                <div className="p-6 border-t border-slate-800">
                  <Link href="/student/fees" className="block w-full">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-5">
                      Pay Online (Chapa)
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
