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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  Calendar, 
  Award,
  CheckCircle,
  GraduationCap,
  ClipboardList,
  Eye,
  FileCheck
} from "lucide-react"
import Link from "next/link"

interface ClassItem {
  id: string
  name: string
  section: string
  subject: string
  studentCount: number
  avgGrade: string
  attendanceRate: string
  students: Array<{
    id: string
    name: string
    email: string
    parent_name: string
    phone: string
    attendance: "present" | "absent" | "late"
  }>
}

export default function TeacherClassesPage() {
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null)
  const [isRosterOpen, setIsRosterOpen] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      try {
        // Query teachers and classes
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from("teachers")
          .select("*, users(*)")
          .eq("user_id", user.id)
          .single()

        const teacherId = profile?.id

        let dbClasses = []
        if (teacherId) {
          const { data } = await supabase
            .from("classes")
            .select("*")
            .eq("teacher_id", teacherId)
          dbClasses = data || []
        }

        // Formulate complete details with mock rosters for local demonstration
        const classDataList: ClassItem[] = [
          {
            id: "c1",
            name: "Grade 10",
            section: "A",
            subject: "Science",
            studentCount: 28,
            avgGrade: "82.5%",
            attendanceRate: "96.2%",
            students: [
              { id: "s1", name: "Abigail Johnson", email: "abigail@school.com", parent_name: "Robert Johnson", phone: "+91 98765 43210", attendance: "present" },
              { id: "s2", name: "Benjamin Carter", email: "benjamin@school.com", parent_name: "Lisa Carter", phone: "+91 98765 43211", attendance: "absent" },
              { id: "s3", name: "Chloe Williams", email: "chloe@school.com", parent_name: "Daniel Williams", phone: "+91 98765 43212", attendance: "present" },
              { id: "s4", name: "David Miller", email: "david@school.com", parent_name: "Patricia Miller", phone: "+91 98765 43213", attendance: "present" },
              { id: "s5", name: "Emily Davis", email: "emily@school.com", parent_name: "Charles Davis", phone: "+91 98765 43214", attendance: "late" }
            ]
          },
          {
            id: "c2",
            name: "Grade 9",
            section: "B",
            subject: "Mathematics",
            studentCount: 24,
            avgGrade: "76.8%",
            attendanceRate: "94.8%",
            students: [
              { id: "s6", name: "Frank Miller", email: "frank@school.com", parent_name: "Susan Miller", phone: "+91 87654 32100", attendance: "present" },
              { id: "s7", name: "Grace Wilson", email: "grace@school.com", parent_name: "Matthew Wilson", phone: "+91 87654 32101", attendance: "present" },
              { id: "s8", name: "Henry Taylor", email: "henry@school.com", parent_name: "Nancy Taylor", phone: "+91 87654 32102", attendance: "present" },
              { id: "s9", name: "Ivy Thomas", email: "ivy@school.com", parent_name: "James Thomas", phone: "+91 87654 32103", attendance: "late" }
            ]
          }
        ]

        setClasses(dbClasses.length > 0 ? dbClasses.map((c: any, index: number) => ({
          id: c.id,
          name: c.name,
          section: c.section,
          subject: index === 0 ? "Science" : "Mathematics",
          studentCount: index === 0 ? 28 : 24,
          avgGrade: index === 0 ? "82.5%" : "76.8%",
          attendanceRate: index === 0 ? "96.2%" : "94.8%",
          students: index === 0 ? classDataList[0].students : classDataList[1].students
        })) : classDataList)

      } catch (err) {
        console.error("Error loading teacher classes:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleOpenRoster = (cls: ClassItem) => {
    setSelectedClass(cls)
    setIsRosterOpen(true)
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
          <Link href="/teacher">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-sm font-semibold text-gray-500">Back to Dashboard</span>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-amber-600" />
            Assigned Homerooms & Course Classes
          </h1>
          <p className="text-gray-500 text-sm">Review class metrics, check active roster counts and launch marking utilities</p>
        </div>

        {/* Classes grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {classes.map((cls) => (
            <Card key={cls.id} className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardHeader className="bg-slate-900 text-white pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-amber-500 font-mono tracking-widest block uppercase font-bold">Homeroom</span>
                    <CardTitle className="text-2xl mt-1">{cls.name} - Section {cls.section}</CardTitle>
                  </div>
                  <Badge className="bg-amber-600 text-white font-semibold">{cls.subject}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 border-b pb-6 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Students</span>
                    <span className="text-lg font-extrabold text-gray-800 flex justify-center items-center gap-1 mt-1">
                      <GraduationCap className="h-4 w-4 text-slate-500" />
                      {cls.studentCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Class Avg</span>
                    <span className="text-lg font-extrabold text-indigo-700 flex justify-center items-center gap-1 mt-1">
                      <Award className="h-4 w-4 text-indigo-500" />
                      {cls.avgGrade}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Attendance</span>
                    <span className="text-lg font-extrabold text-emerald-700 flex justify-center items-center gap-1 mt-1">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      {cls.attendanceRate}
                    </span>
                  </div>
                </div>

                {/* Operations links */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleOpenRoster(cls)}
                    className="flex-1 rounded-xl text-slate-700 flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Roster
                  </Button>
                  <Link href={`/teacher/attendance?class=${cls.id}`} className="flex-1">
                    <Button 
                      variant="outline"
                      className="w-full rounded-xl text-slate-700 flex items-center justify-center gap-2"
                    >
                      <ClipboardList className="h-4 w-4 text-amber-500" />
                      Attendance
                    </Button>
                  </Link>
                  <Link href={`/teacher/grades?class=${cls.id}`} className="flex-1">
                    <Button 
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center gap-2"
                    >
                      <FileCheck className="h-4 w-4" />
                      Grade Marks
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Student Roster Modal */}
        <Dialog open={isRosterOpen} onOpenChange={setIsRosterOpen}>
          <DialogContent className="bg-white rounded-2xl shadow-xl max-w-2xl">
            {selectedClass && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-gray-900 text-xl flex items-center gap-2">
                    <Users className="h-5 w-5 text-amber-600" />
                    Roster: {selectedClass.name} - Section {selectedClass.section}
                  </DialogTitle>
                  <DialogDescription>
                    Student enrollment ledger and check-in summary for {selectedClass.subject}
                  </DialogDescription>
                </DialogHeader>
                <div className="pt-4 overflow-x-auto max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Email address</TableHead>
                        <TableHead>Parent Contacts</TableHead>
                        <TableHead className="text-right">Today's Check-in</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedClass.students.map((student) => (
                        <TableRow key={student.id} className="hover:bg-gray-50/20">
                          <TableCell className="font-bold text-gray-800">
                            {student.name}
                          </TableCell>
                          <TableCell className="text-gray-500 text-xs font-mono">{student.email}</TableCell>
                          <TableCell className="text-xs text-gray-600">
                            <span className="block font-semibold">{student.parent_name}</span>
                            <span className="block text-gray-400">{student.phone}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className={
                              student.attendance === "present"
                                ? "bg-green-50 text-green-700 border-green-500"
                                : student.attendance === "late"
                                ? "bg-amber-50 text-amber-700 border-amber-500"
                                : "bg-red-50 text-red-700 border-red-500"
                            }>
                              {student.attendance.toUpperCase()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
