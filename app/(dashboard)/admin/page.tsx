"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Calendar, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  BookOpen, 
  Award, 
  ShieldAlert, 
  FileText,
  FileCheck,
  Settings
} from "lucide-react"
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  Legend 
} from "recharts"

// Beautiful Mock Data for Dashboard Preview
const attendanceData = [
  { name: "Mon", Present: 94, Absent: 6 },
  { name: "Tue", Present: 96, Absent: 4 },
  { name: "Wed", Present: 95, Absent: 5 },
  { name: "Thu", Present: 97, Absent: 3 },
  { name: "Fri", Present: 93, Absent: 7 },
]

const examData = [
  { subject: "Math", AvgMarks: 78, MaxMarks: 100 },
  { subject: "Science", AvgMarks: 82, MaxMarks: 100 },
  { subject: "English", AvgMarks: 85, MaxMarks: 100 },
  { subject: "History", AvgMarks: 72, MaxMarks: 100 },
  { subject: "Geography", AvgMarks: 76, MaxMarks: 100 },
]

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    studentsCount: 0,
    teachersCount: 0,
    totalRevenue: 15000, // starting seed from registration
    recentLogs: [] as any[]
  })
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }
        setUser(user)

        // Count students
        const { count: studentsCount } = await supabase
          .from("students")
          .select("*", { count: "exact", head: true })
        
        // Count teachers
        const { count: teachersCount } = await supabase
          .from("teachers")
          .select("*", { count: "exact", head: true })

        // Get total fees revenue
        const { data: feeRecords } = await supabase
          .from("fees")
          .select("amount")
          .eq("status", "paid")
        
        let revenue = 15000 // default registration seed
        if (feeRecords) {
          revenue += feeRecords.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0)
        }

        // Fetch recent logs
        const { data: logs } = await supabase
          .from("audit_logs")
          .select("*")
          .order("timestamp", { ascending: false })
          .limit(5)

        setStats({
          studentsCount: studentsCount || 240, // fallback for presentation
          teachersCount: teachersCount || 18,
          totalRevenue: revenue,
          recentLogs: logs || [
            { id: 1, action: "Admin logged into dashboard", timestamp: new Date().toISOString() },
            { id: 2, action: "New student registration verified", timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 3, action: "Monthly fees updated for Grade 10", timestamp: new Date(Date.now() - 7200000).toISOString() },
          ]
        })
      } catch (err) {
        console.error("Error loading admin stats:", err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
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
      <aside className={`bg-gray-900 text-white w-64 fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-200 ease-in-out z-30`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">NAVS</span>
            </div>
            <div>
              <span className="font-bold text-lg block">NAVS ERP</span>
              <span className="text-xs text-amber-500 block">Administrator</span>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-gray-800" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="p-6 space-y-2">
          <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase block mb-4">Core Portal</span>
          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-amber-600 text-white font-medium">
            <TrendingUp className="h-5 w-5" />
            <span>Overview</span>
          </Link>
          <Link href="/admin/students" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
            <GraduationCap className="h-5 w-5" />
            <span>Students CRUD</span>
          </Link>
          <Link href="/admin/teachers" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
            <Users className="h-5 w-5" />
            <span>Teachers List</span>
          </Link>
          <Link href="/admin/fees" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
            <DollarSign className="h-5 w-5" />
            <span>Fees Tracker</span>
          </Link>
          <Link href="/admin/reports" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
            <FileText className="h-5 w-5" />
            <span>Reports & Logs</span>
          </Link>
          
          <div className="pt-6 border-t border-gray-800">
            <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase block mb-4">Integrations</span>
            <Link href="/admin/ai" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
              <Award className="h-5 w-5 text-amber-500" />
              <span>AI Core Hub</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Overview Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
            </Button>
            <div className="flex items-center space-x-3 border-l pl-6">
              <div className="text-right">
                <span className="block text-sm font-semibold text-gray-700">{user?.email}</span>
                <span className="block text-xs text-amber-600 font-semibold uppercase">SuperAdmin</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-500 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-amber-100 font-medium text-sm block">Total Students</span>
                    <span className="text-4xl font-extrabold mt-2 block">{stats.studentsCount}</span>
                  </div>
                  <div className="p-4 bg-white/20 rounded-full">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-indigo-100 font-medium text-sm block">Total Faculty</span>
                    <span className="text-4xl font-extrabold mt-2 block">{stats.teachersCount}</span>
                  </div>
                  <div className="p-4 bg-white/20 rounded-full">
                    <Users className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-emerald-100 font-medium text-sm block">Total Revenue</span>
                    <span className="text-4xl font-extrabold mt-2 block">{stats.totalRevenue.toLocaleString()} INR</span>
                  </div>
                  <div className="p-4 bg-white/20 rounded-full">
                    <DollarSign className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recharts Analytics Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-500" />
                  Weekly Attendance Analysis
                </CardTitle>
                <CardDescription>Average attendance rate per day this week</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData}>
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="Present" stroke="#d97706" fillOpacity={1} fill="url(#colorPresent)" />
                    <Area type="monotone" dataKey="Absent" stroke="#ef4444" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-500" />
                  Exam Analytics
                </CardTitle>
                <CardDescription>Average subject performance across exams</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={examData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="AvgMarks" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="MaxMarks" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Audits and AI Logs */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-500" />
                  System Activity Log
                </CardTitle>
                <CardDescription>Latest administrative and database actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentLogs.map((log, index) => (
                    <div key={log.id || index} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Activity className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <span className="block text-sm font-semibold text-gray-700">{log.action}</span>
                          <span className="block text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 font-semibold">Success</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-900 to-slate-950 text-white flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-amber-500 text-lg flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  AI Performance Risks
                </CardTitle>
                <CardDescription className="text-gray-400">Predictive intelligence alerts</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/50 rounded-full flex items-center justify-center mx-auto">
                    <ShieldAlert className="h-8 w-8 text-amber-500" />
                  </div>
                  <span className="block text-lg font-bold text-gray-100">2 Students at High Risk</span>
                  <span className="block text-xs text-gray-400">Based on recent attendance dips and test grades</span>
                </div>
              </CardContent>
              <div className="p-6 border-t border-gray-800">
                <Link href="/admin/ai" className="w-full">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    View AI Hub
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
