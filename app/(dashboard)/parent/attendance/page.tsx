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
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Users,
  Info
} from "lucide-react"
import Link from "next/link"

interface AttendanceLog {
  id: string
  date: string
  status: "present" | "absent" | "late" | "excused"
  markedBy: string
  sessionTime: string
}

interface ChildAttendance {
  id: string
  name: string
  class: string
  section: string
  attendanceRate: number
  presentCount: number
  absentCount: number
  lateCount: number
  excusedCount: number
  logs: AttendanceLog[]
}

export default function ParentAttendancePage() {
  const [loading, setLoading] = useState(true)
  const [children, setChildren] = useState<ChildAttendance[]>([])
  const [selectedChild, setSelectedChild] = useState<ChildAttendance | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch children
        const { data: kids } = await supabase
          .from("students")
          .select("*, users(*), classes(*)")
          .eq("parent_id", user.id)

        const childList = kids || []

        // Mock complete attendance data for local preview
        const mockData: ChildAttendance[] = [
          {
            id: "s1",
            name: "Sarah Mercer",
            class: "Grade 9",
            section: "B",
            attendanceRate: 96.2,
            presentCount: 76,
            absentCount: 2,
            lateCount: 1,
            excusedCount: 0,
            logs: [
              { id: "l1", date: "2026-06-16", status: "present", markedBy: "Marcus Brody", sessionTime: "08:28 AM" },
              { id: "l2", date: "2026-06-15", status: "present", markedBy: "Marcus Brody", sessionTime: "08:24 AM" },
              { id: "l3", date: "2026-06-14", status: "late", markedBy: "Marcus Brody", sessionTime: "08:48 AM" },
              { id: "l4", date: "2026-06-11", status: "present", markedBy: "Marcus Brody", sessionTime: "08:29 AM" },
              { id: "l5", date: "2026-06-10", status: "absent", markedBy: "Marcus Brody", sessionTime: "Unchecked" },
              { id: "l6", date: "2026-06-09", status: "present", markedBy: "Marcus Brody", sessionTime: "08:20 AM" }
            ]
          },
          {
            id: "s2",
            name: "Alex Mercer",
            class: "Grade 10",
            section: "A",
            attendanceRate: 95.4,
            presentCount: 75,
            absentCount: 3,
            lateCount: 2,
            excusedCount: 1,
            logs: [
              { id: "l7", date: "2026-06-16", status: "present", markedBy: "Dr. Evelyn Vance", sessionTime: "08:15 AM" },
              { id: "l8", date: "2026-06-15", status: "present", markedBy: "Dr. Evelyn Vance", sessionTime: "08:18 AM" },
              { id: "l9", date: "2026-06-14", status: "excused", markedBy: "Admin Office", sessionTime: "Authorized Leave" },
              { id: "l10", date: "2026-06-11", status: "present", markedBy: "Dr. Evelyn Vance", sessionTime: "08:20 AM" },
              { id: "l11", date: "2026-06-10", status: "present", markedBy: "Dr. Evelyn Vance", sessionTime: "08:22 AM" }
            ]
          }
        ]

        const finalChildren = childList.length > 0 ? childList.map((k: any, index: number) => ({
          id: k.id,
          name: k.users?.name || "Student Name",
          class: k.classes?.name || (index === 0 ? "Grade 9" : "Grade 10"),
          section: k.classes?.section || (index === 0 ? "B" : "A"),
          attendanceRate: index === 0 ? 96.2 : 95.4,
          presentCount: index === 0 ? 76 : 75,
          absentCount: index === 0 ? 2 : 3,
          lateCount: index === 0 ? 1 : 2,
          excusedCount: index === 0 ? 0 : 1,
          logs: index === 0 ? mockData[0].logs : mockData[1].logs
        })) : mockData

        setChildren(finalChildren)
        setSelectedChild(finalChildren[0])

      } catch (err) {
        console.error("Error loading parent attendance tracker:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

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
              <Calendar className="h-8 w-8 text-amber-600" />
              Child Attendance Tracker
            </h1>
            <p className="text-gray-500 text-sm">Observe daily check-ins, monthly compliance and homeroom logs</p>
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
            {/* Attendance Metrics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="shadow border-0 bg-gradient-to-br from-indigo-950 to-slate-900 text-white col-span-2">
                <CardContent className="pt-6">
                  <span className="text-slate-400 text-sm block">Attendance Rate</span>
                  <span className="text-4xl font-extrabold text-white mt-2 block">{selectedChild.attendanceRate.toFixed(1)}%</span>
                  <span className="text-xs text-amber-500 block font-semibold mt-1">Excellent check-in standing</span>
                </CardContent>
              </Card>

              <Card className="shadow border-0 bg-white">
                <CardContent className="pt-6">
                  <span className="text-gray-500 text-sm block">Days Present</span>
                  <span className="text-3xl font-extrabold text-emerald-600 mt-2 block flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    {selectedChild.presentCount}
                  </span>
                </CardContent>
              </Card>

              <Card className="shadow border-0 bg-white">
                <CardContent className="pt-6">
                  <span className="text-gray-500 text-sm block">Days Absent</span>
                  <span className="text-3xl font-extrabold text-red-600 mt-2 block flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    {selectedChild.absentCount}
                  </span>
                </CardContent>
              </Card>

              <Card className="shadow border-0 bg-white">
                <CardContent className="pt-6">
                  <span className="text-gray-500 text-sm block">Late / Excused</span>
                  <span className="text-3xl font-extrabold text-amber-600 mt-2 block flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {selectedChild.lateCount + selectedChild.excusedCount}
                  </span>
                </CardContent>
              </Card>
            </div>

            {/* Daily History logs */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-500" />
                  Chronological Check-in Logs: {selectedChild.name}
                </CardTitle>
                <CardDescription>Daily check-ins logged by faculty homeroom and registrar office</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Check-in Date</TableHead>
                        <TableHead>Recorded Session Time</TableHead>
                        <TableHead>Admitted Status</TableHead>
                        <TableHead className="text-right">Logged By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedChild.logs.map((log) => (
                        <TableRow key={log.id} className="hover:bg-gray-50/20">
                          <TableCell className="font-bold text-gray-800 font-mono text-xs">
                            {new Date(log.date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm font-semibold">{log.sessionTime}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              log.status === "present"
                                ? "bg-green-50 text-green-700 border-green-500"
                                : log.status === "late"
                                ? "bg-amber-50 text-amber-700 border-amber-500"
                                : log.status === "excused"
                                ? "bg-slate-50 text-slate-700 border-slate-500"
                                : "bg-red-50 text-red-700 border-red-500"
                            }>
                              {log.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs text-gray-500 font-semibold">
                            {log.markedBy}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Note Info */}
            <div className="flex gap-2 items-center bg-slate-100 p-4 rounded-xl border text-xs text-slate-600">
              <Info className="h-4 w-4 text-slate-500" />
              <span>Parents can submit excused leave letters to the administrator office to mark expected absence days as excused in real time.</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
