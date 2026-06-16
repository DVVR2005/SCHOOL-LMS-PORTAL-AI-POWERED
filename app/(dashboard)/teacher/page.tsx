"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  BookOpen, 
  Calendar, 
  FileEdit, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  ClipboardList,
  CheckSquare,
  PlusCircle,
  TrendingUp,
  MessageSquare
} from "lucide-react"
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts"

const testDistribution = [
  { grade: "A", students: 12 },
  { grade: "B", students: 24 },
  { grade: "C", students: 18 },
  { grade: "D", students: 8 },
  { grade: "F", students: 2 },
]

export default function TeacherDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [teacherProfile, setTeacherProfile] = useState<any>(null)
  const [classes, setClasses] = useState<any[]>([])

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadTeacherData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }
        setUser(user)

        // Get teacher profile
        const { data: profile } = await supabase
          .from("teachers")
          .select("*, users(*)")
          .eq("user_id", user.id)
          .single()

        setTeacherProfile(profile || { department: "Science", qualification: "M.Sc. Physics" })

        // Get classes
        const teacherId = profile?.id
        let fetchedClasses = []
        if (teacherId) {
          const { data } = await supabase
            .from("classes")
            .select("*")
            .eq("teacher_id", teacherId)
          fetchedClasses = data || []
        }

        setClasses(fetchedClasses.length > 0 ? fetchedClasses : [
          { id: "c1", name: "Grade 10", section: "A" },
          { id: "c2", name: "Grade 9", section: "B" },
        ])
      } catch (err) {
        console.error("Error loading teacher stats:", err)
      } finally {
        setLoading(false)
      }
    }

    loadTeacherData()
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
              <span className="font-bold text-lg block">NAVS LMS</span>
              <span className="text-xs text-amber-500 block">Teacher Portal</span>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-gray-800" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="p-6 space-y-2">
          <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase block mb-4 font-mono">Workspace</span>
          <Link href="/teacher" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-amber-600 text-white font-medium">
            <TrendingUp className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/teacher/classes" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
            <Users className="h-5 w-5" />
            <span>My Classes</span>
          </Link>
          <Link href="/teacher/attendance" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
            <ClipboardList className="h-5 w-5" />
            <span>Attendance</span>
          </Link>
          <Link href="/teacher/assignments" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
            <BookOpen className="h-5 w-5" />
            <span>Assignments</span>
          </Link>
          <Link href="/teacher/grades" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
            <CheckSquare className="h-5 w-5" />
            <span>Exam Results</span>
          </Link>
          <Link href="/teacher/messages" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
            <MessageSquare className="h-5 w-5" />
            <span>Messages</span>
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
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {teacherProfile.users?.name || "Teacher"}</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
            </Button>
            <div className="flex items-center space-x-3 border-l pl-6">
              <div className="text-right">
                <span className="block text-sm font-semibold text-gray-700">{user?.email}</span>
                <span className="block text-xs text-amber-600 font-semibold">{teacherProfile.department} Dept</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-500 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="p-6 space-y-6">
          {/* Quick Metrics */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="shadow border-0">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-sm block">My Classes</span>
                    <span className="text-3xl font-bold mt-1 block">{classes.length}</span>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow border-0">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-sm block">Active Homeworks</span>
                    <span className="text-3xl font-bold mt-1 block">4</span>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <BookOpen className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow border-0">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-sm block">Pending Grading</span>
                    <span className="text-3xl font-bold mt-1 block">18</span>
                  </div>
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                    <FileEdit className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow border-0">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-sm block">Class Attendance Rate</span>
                    <span className="text-3xl font-bold mt-1 block">95.4%</span>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Class Cards */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-gray-800 text-lg">Class Schedules</CardTitle>
                    <CardDescription>Courses and homeroom groups assigned to you</CardDescription>
                  </div>
                  <Link href="/teacher/classes">
                    <Button variant="outline" size="sm">Manage Classes</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {classes.map((cls) => (
                      <div key={cls.id} className="p-4 border rounded-xl hover:border-amber-500 hover:shadow-md transition-all duration-200 bg-white">
                        <span className="block font-bold text-lg text-gray-800">{cls.name}</span>
                        <span className="block text-sm text-gray-500">Section {cls.section}</span>
                        <div className="mt-4 flex gap-2">
                          <Link href={`/teacher/attendance?class=${cls.id}`} className="flex-1">
                            <Button size="sm" variant="outline" className="w-full text-xs">
                              Attendance
                            </Button>
                          </Link>
                          <Link href={`/teacher/assignments?class=${cls.id}`} className="flex-1">
                            <Button size="sm" className="w-full text-xs bg-amber-600 hover:bg-amber-700 text-white">
                              Assignments
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Analytics */}
              <Card className="shadow border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-lg">Grade Distribution</CardTitle>
                  <CardDescription>Performance range of students in recent science exams</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={testDistribution}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="students" fill="#d97706" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-6">
              <Card className="shadow border-0">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-lg">Quick Actions</CardTitle>
                  <CardDescription>Shortcut workflows</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/teacher/assignments" className="block w-full">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 py-6 rounded-xl">
                      <PlusCircle className="h-5 w-5" />
                      Create Assignment
                    </Button>
                  </Link>
                  <Link href="/teacher/grades" className="block w-full">
                    <Button variant="outline" className="w-full border-amber-600 text-amber-700 hover:bg-amber-50 flex items-center justify-center gap-2 py-6 rounded-xl">
                      <FileEdit className="h-5 w-5" />
                      Upload Exam Grades
                    </Button>
                  </Link>
                  <Link href="/teacher/attendance" className="block w-full">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-6 rounded-xl">
                      <Calendar className="h-5 w-5" />
                      Mark Daily Attendance
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Upcoming events notifications */}
              <Card className="shadow border-0">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-lg">Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-3 items-start border-b pb-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="block text-sm font-semibold text-gray-800">Final Exams set for July 12</span>
                      <span className="block text-xs text-gray-500 font-mono">June 16, 2026</span>
                    </div>
                  </div>
                  <div className="flex space-x-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="block text-sm font-semibold text-gray-800">Parent Teacher meeting on Sat</span>
                      <span className="block text-xs text-gray-500 font-mono">June 14, 2026</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
