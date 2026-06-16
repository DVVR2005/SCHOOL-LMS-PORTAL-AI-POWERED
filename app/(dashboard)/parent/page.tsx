"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Calendar, 
  Award, 
  DollarSign, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  FileCheck,
  UserCheck,
  TrendingUp,
  MessageSquare,
  AlertCircle
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

const examResults = [
  { subject: "Math", Marks: 82, ClassAvg: 75 },
  { subject: "Physics", Marks: 78, ClassAvg: 72 },
  { subject: "Chemistry", Marks: 85, ClassAvg: 78 },
  { subject: "English", Marks: 92, ClassAvg: 83 },
]

export default function ParentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [children, setChildren] = useState<any[]>([])
  const [selectedChild, setSelectedChild] = useState<any>(null)
  const [childFees, setChildFees] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadParentData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }
        setUser(user)

        // Get children (students linked to this parent)
        const { data: kids } = await supabase
          .from("students")
          .select("*, users(*), classes(*)")
          .eq("parent_id", user.id)

        const childList = kids || []
        setChildren(childList)

        const activeChild = childList[0] || {
          id: "c1",
          users: { name: "Sarah Mercer" },
          admission_number: "ADM-2026-0043",
          classes: { name: "Grade 9", section: "B" }
        }
        setSelectedChild(activeChild)

        // Fetch child fees
        if (activeChild.id) {
          const { data: fees } = await supabase
            .from("fees")
            .select("*")
            .eq("student_id", activeChild.id)
          setChildFees(fees || [])
        }

        // Fetch parent notifications
        const { data: alertList } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)
        setNotifications(alertList || [])

      } catch (err) {
        console.error("Error loading parent stats:", err)
      } finally {
        setLoading(false)
      }
    }

    loadParentData()
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
              <span className="text-xs text-amber-500 block">Parent Lounge</span>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-gray-800" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="p-6 space-y-2">
          <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase block mb-4 font-mono font-bold">Observer Portal</span>
          <Link href="/parent" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-amber-600 text-white font-medium">
            <UserCheck className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/parent/grades" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
            <Award className="h-5 w-5" />
            <span>Child Results</span>
          </Link>
          <Link href="/parent/attendance" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
            <Calendar className="h-5 w-5" />
            <span>Child Attendance</span>
          </Link>
          <Link href="/parent/fees" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
            <DollarSign className="h-5 w-5" />
            <span>Fee Tracking</span>
          </Link>
          <Link href="/parent/messages" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
            <MessageSquare className="h-5 w-5" />
            <span>Teacher Contacts</span>
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
            <h1 className="text-2xl font-bold text-gray-800">Parent Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-6 w-6 text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
              )}
            </Button>
            <div className="flex items-center space-x-3 border-l pl-6">
              <div className="text-right">
                <span className="block text-sm font-semibold text-gray-700">{user?.email}</span>
                <span className="block text-xs text-amber-600 font-semibold uppercase">Parent account</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-500 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="p-6 space-y-6">
          {/* Child Profile Banner */}
          {selectedChild && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center font-extrabold text-2xl border border-white/20">
                    {selectedChild.users?.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <span className="text-xs text-amber-400 block font-bold uppercase tracking-wider">Student Profile</span>
                    <span className="text-2xl font-extrabold block text-white mt-0.5">{selectedChild.users?.name}</span>
                    <span className="text-sm text-gray-300 block">{selectedChild.classes?.name || "Grade 9"} - Section {selectedChild.classes?.section || "B"} | Adm: {selectedChild.admission_number}</span>
                  </div>
                </div>
                {children.length > 1 && (
                  <div className="mt-4 sm:mt-0 flex gap-2">
                    <span className="text-sm text-gray-300 self-center">Switch Student:</span>
                    <select 
                      className="bg-white/10 border border-white/20 text-white rounded-lg p-2 text-sm focus:outline-none" 
                      onChange={(e) => setSelectedChild(children.find(c => c.id === e.target.value))}
                      value={selectedChild.id}
                    >
                      {children.map(c => (
                        <option key={c.id} value={c.id} className="text-gray-900">{c.users?.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Child stats summary */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/parent/attendance" className="block hover:opacity-90 transition-opacity">
              <Card className="shadow border-0">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-500 text-sm block">Term Attendance</span>
                      <span className="text-3xl font-bold mt-1 block">94.8%</span>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/parent/grades" className="block hover:opacity-90 transition-opacity">
              <Card className="shadow border-0">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-500 text-sm block">Class Average Rank</span>
                      <span className="text-3xl font-bold mt-1 block">85.8%</span>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Award className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/parent/fees" className="block hover:opacity-90 transition-opacity">
              <Card className="shadow border-0">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-500 text-sm block">Outstanding Fees</span>
                      <span className="text-3xl font-bold mt-1 block">15,000 INR</span>
                    </div>
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Academic chart */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-lg">Academic Performance Graph</CardTitle>
                  <CardDescription>Child's test scores versus class averages</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={examResults}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Marks" fill="#d97706" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="ClassAvg" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Child Fee payments */}
              <Card className="shadow border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-gray-800 text-lg">Fee Invoices & Payments</CardTitle>
                    <CardDescription>Statements of tuition fees</CardDescription>
                  </div>
                  <Link href="/parent/fees">
                    <Button variant="outline" size="sm">Pay Center</Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {childFees.length > 0 ? (
                    childFees.map((fee) => (
                      <div key={fee.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <span className="block font-semibold text-gray-800">{fee.amount.toLocaleString()} INR</span>
                          <span className="block text-xs text-gray-500">Due: {new Date(fee.due_date).toLocaleDateString()}</span>
                        </div>
                        <Badge variant="outline" className={fee.status === "paid" ? "bg-green-50 text-green-700 border-green-500" : "bg-red-50 text-red-700 border-red-500"}>
                          {fee.status.toUpperCase()}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <span className="block font-semibold text-gray-800">Term 2 School Tuition Fees</span>
                          <span className="block text-xs text-gray-500">Due: July 1, 2026</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-500">Pending</Badge>
                          <Link href="/parent/fees">
                            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs">Pay Now</Button>
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="block font-semibold text-gray-800">Annual Laboratory & Library Fee</span>
                          <span className="block text-xs text-gray-500">Paid on: Feb 12, 2026</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Notifications panel */}
            <div className="space-y-6">
              <Card className="shadow border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    School Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className="p-3 bg-gray-50 rounded-xl border-l-4 border-amber-600">
                        <span className="block font-bold text-gray-800 text-sm">{n.title}</span>
                        <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                        <span className="block text-[10px] text-gray-400 mt-2">{new Date(n.created_at).toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="p-3 bg-gray-50 rounded-xl border-l-4 border-amber-600">
                        <span className="block font-bold text-gray-800 text-sm">Attendance Alert</span>
                        <p className="text-xs text-gray-600 mt-1">Your child Sarah Mercer was marked ABSENT for English Literature today.</p>
                        <span className="block text-[10px] text-gray-400 mt-2">Today, 11:15 AM</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl border-l-4 border-indigo-600">
                        <span className="block font-bold text-gray-800 text-sm">New Assignment Scheduled</span>
                        <p className="text-xs text-gray-600 mt-1">Physics Lab Worksheet was published by Mr. Richard. Due on June 20.</p>
                        <span className="block text-[10px] text-gray-400 mt-2">Yesterday, 04:30 PM</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl border-l-4 border-emerald-600">
                        <span className="block font-bold text-gray-800 text-sm">Exam Grades Uploaded</span>
                        <p className="text-xs text-gray-600 mt-1">Grades for Chemistry Mid-term are now available in your results locker.</p>
                        <span className="block text-[10px] text-gray-400 mt-2">June 14, 2026</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
