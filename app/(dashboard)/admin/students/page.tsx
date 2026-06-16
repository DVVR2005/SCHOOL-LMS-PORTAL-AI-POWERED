"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  createStudentAction, 
  updateStudentAction, 
  deleteStudentAction 
} from "@/app/actions/students"
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
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Plus, 
  Download, 
  Edit2, 
  Trash2, 
  ArrowLeft, 
  GraduationCap, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from "lucide-react"
import Link from "next/link"

export default function StudentsAdminPage() {
  const [students, setStudents] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filterClass, setFilterClass] = useState("all")
  const [loading, setLoading] = useState(true)
  
  // Pagination
  const [page, setPage] = useState(1)
  const itemsPerPage = 6

  // Form Modals
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Status message
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error" | null; message: string | null }>({ type: null, message: null })
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    userId: "",
    name: "",
    email: "",
    admissionNumber: "",
    classId: "",
    parentName: "",
    phone: "",
    address: ""
  })

  const supabase = createClient()

  // Fetch data
  const loadData = async () => {
    setLoading(true)
    try {
      // Fetch students with profiles and classes
      const { data: studentList } = await supabase
        .from("students")
        .select("*, users(*), classes(*)")
        .order("created_at", { ascending: false })

      setStudents(studentList || [])

      // Fetch classes
      const { data: classList } = await supabase
        .from("classes")
        .select("*")
        .order("name", { ascending: true })

      setClasses(classList || [])
    } catch (error) {
      console.error("Error loading student directory:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Search & Filter
  const filteredStudents = students.filter((item) => {
    const nameMatch = item.users?.name?.toLowerCase().includes(search.toLowerCase()) || 
                      item.admission_number?.toLowerCase().includes(search.toLowerCase()) ||
                      item.users?.email?.toLowerCase().includes(search.toLowerCase())
    const classMatch = filterClass === "all" || item.class_id === filterClass
    return nameMatch && classMatch
  })

  // Pagination bounds
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const paginatedStudents = filteredStudents.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      id: "",
      userId: "",
      name: "",
      email: "",
      admissionNumber: "",
      classId: "",
      parentName: "",
      phone: "",
      address: ""
    })
    setFormStatus({ type: null, message: null })
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormStatus({ type: null, message: null })

    const res = await createStudentAction(formData)
    setSubmitting(false)

    if (res.error) {
      setFormStatus({ type: "error", message: res.error })
    } else {
      setFormStatus({ type: "success", message: res.success || "Student created." })
      loadData()
      setTimeout(() => {
        setIsAddOpen(false)
        resetForm()
      }, 2000)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormStatus({ type: null, message: null })

    const res = await updateStudentAction(formData.id, formData)
    setSubmitting(false)

    if (res.error) {
      setFormStatus({ type: "error", message: res.error })
    } else {
      setFormStatus({ type: "success", message: res.success || "Student updated." })
      loadData()
      setTimeout(() => {
        setIsEditOpen(false)
        resetForm()
      }, 2000)
    }
  }

  const handleDeleteSubmit = async () => {
    setSubmitting(true)
    setFormStatus({ type: null, message: null })

    const res = await deleteStudentAction(formData.id, formData.userId)
    setSubmitting(false)

    if (res.error) {
      setFormStatus({ type: "error", message: res.error })
    } else {
      setFormStatus({ type: "success", message: res.success || "Student deleted." })
      loadData()
      setTimeout(() => {
        setIsDeleteOpen(false)
        resetForm()
      }, 1500)
    }
  }

  const openEdit = (student: any) => {
    setFormData({
      id: student.id,
      userId: student.user_id,
      name: student.users?.name || "",
      email: student.users?.email || "",
      admissionNumber: student.admission_number || "",
      classId: student.class_id || "",
      parentName: student.parent_name || "",
      phone: student.phone || "",
      address: student.address || ""
    })
    setIsEditOpen(true)
  }

  const openDelete = (student: any) => {
    setFormData({
      id: student.id,
      userId: student.user_id,
      name: student.users?.name || "",
      email: "",
      admissionNumber: "",
      classId: "",
      parentName: "",
      phone: "",
      address: ""
    })
    setIsDeleteOpen(true)
  }

  // Export CSV
  const exportCSV = () => {
    const headers = ["Name,Email,Admission Number,Class,Parent Name,Phone,Address\n"]
    const rows = filteredStudents.map((s) => {
      return `"${s.users?.name || ""}","${s.users?.email || ""}","${s.admission_number || ""}","${s.classes?.name || ""} Section ${s.classes?.section || ""}","${s.parent_name || ""}","${s.phone || ""}","${s.address || ""}"`
    })
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `student_directory_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-amber-600" />
                Student Management
              </h1>
              <p className="text-gray-500 text-sm">Add, configure and export students in the ERP portal</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={exportCSV} className="flex items-center gap-2 border-gray-200">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Dialog open={isAddOpen} onOpenChange={(val) => { setIsAddOpen(val); if (!val) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg bg-white">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>Create authentication credentials and student file profile.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
                  {formStatus.type && (
                    <Alert variant={formStatus.type === "error" ? "destructive" : "default"}>
                      <AlertDescription>{formStatus.message}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" required placeholder="Alex Mercer" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" required placeholder="alex@school.com" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="admission">Admission Number *</Label>
                      <Input id="admission" required placeholder="ADM-2026-0001" value={formData.admissionNumber} onChange={(e) => handleInputChange("admissionNumber", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class">Assign Class</Label>
                      <Select value={formData.classId} onValueChange={(val) => handleInputChange("classId", val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>{cls.name} Section {cls.section}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="parent">Parent/Guardian Name *</Label>
                      <Input id="parent" required placeholder="James Mercer" value={formData.parentName} onChange={(e) => handleInputChange("parentName", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Guardian Phone *</Label>
                      <Input id="phone" required placeholder="+251 91234567" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input id="address" required placeholder="Addis Ababa, Ethiopia" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={submitting} className="bg-amber-600 hover:bg-amber-700 text-white">
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Save Student
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filter controls */}
        <Card className="shadow-sm border-0 bg-white">
          <CardContent className="py-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by name, admission no or email..." 
                className="pl-10 rounded-xl"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={filterClass} onValueChange={(val) => { setFilterClass(val); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-[200px] rounded-xl">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.name} Section {cls.section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="shadow-lg border-0 bg-white overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-20 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-amber-600 mx-auto" />
                <span className="text-gray-500 text-sm mt-4 block">Loading student directory...</span>
              </div>
            ) : paginatedStudents.length === 0 ? (
              <div className="p-20 text-center">
                <span className="text-gray-400 text-lg block">No students found</span>
                <span className="text-gray-500 text-sm mt-1">Try resetting your search query or class filter</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Admission No</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Parent Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-gray-50/50">
                        <TableCell>
                          <div>
                            <span className="block font-bold text-gray-900">{student.users?.name}</span>
                            <span className="block text-xs text-gray-500 font-mono">{student.users?.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-gray-700">{student.admission_number}</TableCell>
                        <TableCell>
                          {student.classes ? (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                              {student.classes.name} - Section {student.classes.section}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-xs italic">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-700">{student.parent_name}</TableCell>
                        <TableCell className="text-gray-600 font-mono">{student.phone}</TableCell>
                        <TableCell className="text-gray-600 max-w-[150px] truncate">{student.address}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" onClick={() => openEdit(student)} className="text-indigo-600 hover:text-indigo-900">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => openDelete(student)} className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-gray-600">
              Showing page {page} of {totalPages} ({filteredStudents.length} students total)
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Student Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(val) => { setIsEditOpen(val); if (!val) resetForm(); }}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>Edit Student Details</DialogTitle>
            <DialogDescription>Modify record profiles and class details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
            {formStatus.type && (
              <Alert variant={formStatus.type === "error" ? "destructive" : "default"}>
                <AlertDescription>{formStatus.message}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input id="edit-name" required value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email (View Only)</Label>
                <Input id="edit-email" disabled value={formData.email} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-admission">Admission Number *</Label>
                <Input id="edit-admission" required value={formData.admissionNumber} onChange={(e) => handleInputChange("admissionNumber", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-class">Assign Class</Label>
                <Select value={formData.classId} onValueChange={(val) => handleInputChange("classId", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name} Section {cls.section}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-parent">Parent/Guardian Name *</Label>
                <Input id="edit-parent" required value={formData.parentName} onChange={(e) => handleInputChange("parentName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Guardian Phone *</Label>
                <Input id="edit-phone" required value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address *</Label>
              <Input id="edit-address" required value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-amber-600 hover:bg-amber-700 text-white">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Student Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={(val) => { setIsDeleteOpen(val); if (!val) resetForm(); }}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Student Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete student <strong>{formData.name}</strong>? 
              This will erase their academic folder, grade reports, and login credentials.
            </DialogDescription>
          </DialogHeader>
          {formStatus.type && (
            <Alert variant={formStatus.type === "error" ? "destructive" : "default"} className="mt-4">
              <AlertDescription>{formStatus.message}</AlertDescription>
            </Alert>
          )}
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button type="button" disabled={submitting} onClick={handleDeleteSubmit} className="bg-red-600 hover:bg-red-700 text-white">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
