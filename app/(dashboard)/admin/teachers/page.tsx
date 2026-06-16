"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  createTeacherAction, 
  updateTeacherAction, 
  deleteTeacherAction,
  assignTeacherToClassAndSubjectAction 
} from "@/app/actions/teachers"
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
  Edit2, 
  Trash2, 
  ArrowLeft, 
  Users, 
  Loader2,
  BookOpen,
  MapPin
} from "lucide-react"
import Link from "next/link"

export default function TeachersAdminPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)

  // Status message
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error" | null; message: string | null }>({ type: null, message: null })
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    userId: "",
    name: "",
    email: "",
    department: "",
    qualification: "",
    joiningDate: "",
    classId: "",
    subjectId: ""
  })

  const supabase = createClient()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Fetch data
  const loadData = async () => {
    setLoading(true)
    try {
      // Fetch teachers with user profile details
      const { data: teacherList } = await supabase
        .from("teachers")
        .select("*, users(*)")
        .order("joining_date", { ascending: false })

      setTeachers(teacherList || [])

      // Fetch classes
      const { data: classList } = await supabase
        .from("classes")
        .select("*")
        .order("name", { ascending: true })
      setClasses(classList || [])

      // Fetch subjects
      const { data: subjectList } = await supabase
        .from("subjects")
        .select("*, classes(*)")
        .order("name", { ascending: true })
      setSubjects(subjectList || [])
    } catch (error) {
      console.error("Error loading teacher directory:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filtered teachers list
  const filteredTeachers = teachers.filter((item) => {
    return (
      item.users?.name?.toLowerCase().includes(search.toLowerCase()) || 
      item.department?.toLowerCase().includes(search.toLowerCase()) ||
      item.users?.email?.toLowerCase().includes(search.toLowerCase())
    )
  })

  const resetForm = () => {
    setFormData({
      id: "",
      userId: "",
      name: "",
      email: "",
      department: "",
      qualification: "",
      joiningDate: "",
      classId: "",
      subjectId: ""
    })
    setFormStatus({ type: null, message: null })
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormStatus({ type: null, message: null })

    const res = await createTeacherAction(formData)
    setSubmitting(false)

    if (res.error) {
      setFormStatus({ type: "error", message: res.error })
    } else {
      setFormStatus({ type: "success", message: res.success || "Teacher created." })
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

    const res = await updateTeacherAction(formData.id, formData)
    setSubmitting(false)

    if (res.error) {
      setFormStatus({ type: "error", message: res.error })
    } else {
      setFormStatus({ type: "success", message: res.success || "Teacher updated." })
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

    const res = await deleteTeacherAction(formData.id, formData.userId)
    setSubmitting(false)

    if (res.error) {
      setFormStatus({ type: "error", message: res.error })
    } else {
      setFormStatus({ type: "success", message: res.success || "Teacher deleted." })
      loadData()
      setTimeout(() => {
        setIsDeleteOpen(false)
        resetForm()
      }, 1500)
    }
  }

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormStatus({ type: null, message: null })

    const res = await assignTeacherToClassAndSubjectAction(formData.id, formData.classId, formData.subjectId)
    setSubmitting(false)

    if (res.error) {
      setFormStatus({ type: "error", message: res.error })
    } else {
      setFormStatus({ type: "success", message: res.success || "Mapping completed." })
      loadData()
      setTimeout(() => {
        setIsAssignOpen(false)
        resetForm()
      }, 2000)
    }
  }

  const openEdit = (teacher: any) => {
    setFormData({
      id: teacher.id,
      userId: teacher.user_id,
      name: teacher.users?.name || "",
      email: teacher.users?.email || "",
      department: teacher.department || "",
      qualification: teacher.qualification || "",
      joiningDate: teacher.joining_date || "",
      classId: "",
      subjectId: ""
    })
    setIsEditOpen(true)
  }

  const openDelete = (teacher: any) => {
    setFormData({
      id: teacher.id,
      userId: teacher.user_id,
      name: teacher.users?.name || "",
      email: "",
      department: "",
      qualification: "",
      joiningDate: "",
      classId: "",
      subjectId: ""
    })
    setIsDeleteOpen(true)
  }

  const openAssign = (teacher: any) => {
    // Find class teacher is currently assigned to (if any)
    const currentClass = classes.find((c) => c.teacher_id === teacher.id)
    const currentSubject = subjects.find((s) => s.teacher_id === teacher.id)

    setFormData({
      id: teacher.id,
      userId: teacher.user_id,
      name: teacher.users?.name || "",
      email: "",
      department: "",
      qualification: "",
      joiningDate: "",
      classId: currentClass?.id || "",
      subjectId: currentSubject?.id || ""
    })
    setIsAssignOpen(true)
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
                <Users className="h-8 w-8 text-amber-600" />
                Teacher Management
              </h1>
              <p className="text-gray-500 text-sm">Create profiles and map subject/class assignments</p>
            </div>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={(val) => { setIsAddOpen(val); if (!val) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white">
              <DialogHeader>
                <DialogTitle>Add New Faculty Profile</DialogTitle>
                <DialogDescription>Create login credentials and faculty listing.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
                {formStatus.type && (
                  <Alert variant={formStatus.type === "error" ? "destructive" : "default"}>
                    <AlertDescription>{formStatus.message}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" required placeholder="Dr. Evelyn Vance" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address *</Label>
                  <Input id="email" type="email" required placeholder="evelyn@school.com" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dept">Department *</Label>
                    <Input id="dept" required placeholder="Science" value={formData.department} onChange={(e) => handleInputChange("department", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qual">Qualification *</Label>
                    <Input id="qual" required placeholder="Ph.D. Physics" value={formData.qualification} onChange={(e) => handleInputChange("qualification", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joining">Joining Date</Label>
                  <Input id="joining" type="date" value={formData.joiningDate} onChange={(e) => handleInputChange("joiningDate", e.target.value)} />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={submitting} className="bg-amber-600 hover:bg-amber-700 text-white">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save Faculty
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter controls */}
        <Card className="shadow-sm border-0 bg-white">
          <CardContent className="py-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search teachers by name, email or department..." 
                className="pl-10 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Teachers Table */}
        <Card className="shadow-lg border-0 bg-white overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-20 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-amber-600 mx-auto" />
                <span className="text-gray-500 text-sm mt-4 block">Loading teacher roster...</span>
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="p-20 text-center">
                <span className="text-gray-400 text-lg block">No teachers found</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Faculty Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Qualification</TableHead>
                      <TableHead>Joining Date</TableHead>
                      <TableHead>Assigned Classes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => {
                      const teacherClass = classes.filter(c => c.teacher_id === teacher.id)
                      const teacherSubject = subjects.filter(s => s.teacher_id === teacher.id)
                      
                      return (
                        <TableRow key={teacher.id} className="hover:bg-gray-50/50">
                          <TableCell>
                            <div>
                              <span className="block font-bold text-gray-900">{teacher.users?.name}</span>
                              <span className="block text-xs text-gray-500 font-mono">{teacher.users?.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-gray-700">{teacher.department}</TableCell>
                          <TableCell className="text-gray-600">{teacher.qualification}</TableCell>
                          <TableCell className="text-gray-600 font-mono">{teacher.joining_date}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {teacherClass.map(tc => (
                                <Badge key={tc.id} className="bg-amber-100 text-amber-800 hover:bg-amber-100 mr-1">
                                  {tc.name} Section {tc.section}
                                </Badge>
                              ))}
                              {teacherSubject.map(ts => (
                                <Badge key={ts.id} className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                  {ts.name} ({ts.classes?.name})
                                </Badge>
                              ))}
                              {teacherClass.length === 0 && teacherSubject.length === 0 && (
                                <span className="text-gray-400 text-xs italic">No assignments</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => openAssign(teacher)} className="text-xs">
                                Assign Class
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => openEdit(teacher)} className="text-indigo-600 hover:text-indigo-900">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => openDelete(teacher)} className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Faculty Modal */}
      <Dialog open={isEditOpen} onOpenChange={(val) => { setIsEditOpen(val); if (!val) resetForm(); }}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Edit Faculty Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
            {formStatus.type && (
              <Alert variant={formStatus.type === "error" ? "destructive" : "default"}>
                <AlertDescription>{formStatus.message}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input id="edit-name" required value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-dept">Department *</Label>
                <Input id="edit-dept" required value={formData.department} onChange={(e) => handleInputChange("department", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-qual">Qualification *</Label>
                <Input id="edit-qual" required value={formData.qualification} onChange={(e) => handleInputChange("qualification", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-joining">Joining Date *</Label>
              <Input id="edit-joining" type="date" value={formData.joiningDate} onChange={(e) => handleInputChange("joiningDate", e.target.value)} />
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

      {/* Delete Faculty Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={(val) => { setIsDeleteOpen(val); if (!val) resetForm(); }}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Faculty Profile</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete faculty <strong>{formData.name}</strong>? 
              This will remove their profile, system roles, and login credentials.
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

      {/* Assign Class/Subject Modal */}
      <Dialog open={isAssignOpen} onOpenChange={(val) => { setIsAssignOpen(val); if (!val) resetForm(); }}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Assign Class & Course Mapping</DialogTitle>
            <DialogDescription>Link <strong>{formData.name}</strong> to specific class cohorts and courses.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignSubmit} className="space-y-4 pt-4">
            {formStatus.type && (
              <Alert variant={formStatus.type === "error" ? "destructive" : "default"}>
                <AlertDescription>{formStatus.message}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label>Assign Homeroom Class</Label>
              <Select value={formData.classId} onValueChange={(val) => handleInputChange("classId", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="No Homeroom Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Class Assignment</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.name} Section {cls.section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assign Course Subject</Label>
              <Select value={formData.subjectId} onValueChange={(val) => handleInputChange("subjectId", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="No Subject Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Subject Assignment</SelectItem>
                  {subjects.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>{sub.name} ({sub.classes?.name})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-amber-600 hover:bg-amber-700 text-white">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Mappings
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
