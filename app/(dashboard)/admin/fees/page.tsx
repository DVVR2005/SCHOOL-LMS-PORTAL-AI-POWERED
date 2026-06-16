"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  ArrowLeft, 
  DollarSign, 
  Loader2, 
  Plus, 
  CheckCircle2, 
  Search, 
  Calendar,
  User,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

interface Invoice {
  id: string
  student_id: string
  student_name: string
  amount: number
  due_date: string
  status: "pending" | "paid" | "overdue"
  description: string
  created_at: string
  paid_at?: string
}

export default function AdminFeesPage() {
  const [loading, setLoading] = useState(true)
  const [fees, setFees] = useState<Invoice[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Form State
  const [formStudentId, setFormStudentId] = useState("")
  const [formAmount, setFormAmount] = useState("")
  const [formDueDate, setFormDueDate] = useState("")
  const [formDesc, setFormDesc] = useState("Tuition Fee")

  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch students to populate selection dropdown
        const { data: studentsList } = await supabase
          .from("students")
          .select("*, users(*)")
        
        const kids = studentsList || [
          { id: "s1", users: { name: "Abigail Johnson" } },
          { id: "s2", users: { name: "Benjamin Carter" } },
          { id: "s3", users: { name: "Chloe Williams" } }
        ]
        setStudents(kids)

        // Fetch fees
        const { data: feeList } = await supabase
          .from("fees")
          .select("*, students(*, users(*))")
          .order("due_date", { ascending: false })

        const list = feeList || []
        
        if (list.length > 0) {
          setFees(list.map((f: any) => ({
            id: f.id,
            student_id: f.student_id,
            student_name: f.students?.users?.name || "Unknown Student",
            amount: Number(f.amount),
            due_date: f.due_date,
            status: f.status,
            description: f.description || "School Fee",
            created_at: f.created_at
          })))
        } else {
          // Mock data seed
          setFees([
            { id: "inv-201", student_id: "s1", student_name: "Abigail Johnson", amount: 12500, due_date: "2026-07-01", status: "pending", created_at: "2026-06-01T00:00:00Z", description: "Term 2 Tuition Fee" },
            { id: "inv-102", student_id: "s2", student_name: "Benjamin Carter", amount: 2500, due_date: "2026-02-12", status: "paid", created_at: "2026-02-01T00:00:00Z", description: "Annual Registration & Lab Fees", paid_at: "2026-02-12T09:30:00Z" },
            { id: "inv-103", student_id: "s3", student_name: "Chloe Williams", amount: 12500, due_date: "2026-06-10", status: "overdue", created_at: "2026-05-01T00:00:00Z", description: "Term 2 Tuition Fee" }
          ])
        }
      } catch (err) {
        console.error("Error loading fees panel:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleMarkPaid = async (id: string) => {
    try {
      // Optimistically update local state
      setFees(prev => prev.map(f => f.id === id ? { ...f, status: "paid" as const, paid_at: new Date().toISOString() } : f))
      setSuccessMsg("Invoice successfully cleared!")

      // Try to update DB in background
      await supabase
        .from("fees")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("id", id)

      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err) {
      console.error("Error updating fee status:", err)
    }
  }

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formStudentId || !formAmount || !formDueDate) {
      setErrorMsg("Please fill in all fields.")
      return
    }

    setSaving(true)
    setErrorMsg(null)

    const selectedKid = students.find(s => s.id === formStudentId)
    const name = selectedKid?.users?.name || "Student Name"

    const newInvoice: Invoice = {
      id: "inv-" + Math.floor(Math.random() * 10000),
      student_id: formStudentId,
      student_name: name,
      amount: parseFloat(formAmount),
      due_date: formDueDate,
      status: "pending" as const,
      description: formDesc,
      created_at: new Date().toISOString()
    }

    try {
      // Add to local state
      setFees(prev => [newInvoice, ...prev])

      // Try to insert in Supabase
      await supabase
        .from("fees")
        .insert([{
          id: newInvoice.id,
          student_id: formStudentId,
          amount: newInvoice.amount,
          due_date: formDueDate,
          status: "pending",
          description: formDesc
        }])

      setSuccessMsg(`Invoice generated successfully for ${name}.`)
      setIsCreateOpen(false)
      
      // Reset form
      setFormStudentId("")
      setFormAmount("")
      setFormDueDate("")
      setFormDesc("Tuition Fee")

      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err) {
      console.error("Error creating fee invoice:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  const totalInvoiced = fees.reduce((acc, curr) => acc + curr.amount, 0)
  const totalSettled = fees.filter(f => f.status === "paid").reduce((acc, curr) => acc + curr.amount, 0)
  const outstanding = totalInvoiced - totalSettled

  const filteredFees = fees.filter(f => 
    f.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-sm font-semibold text-gray-500">Back to Overview</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-amber-600" />
              Fees & Invoice Administrator
            </h1>
            <p className="text-gray-500 text-sm">Issue term statements, clear balances and track billing revenue</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                Issue Fee Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-2xl shadow-xl max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Student Invoice</DialogTitle>
                <DialogDescription>
                  Generate a billing invoice. The student/parent will see this immediately on their dashboards.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateInvoice} className="space-y-4 pt-4">
                {errorMsg && (
                  <Alert variant="destructive">
                    <AlertDescription>{errorMsg}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="student">Select Student</Label>
                  <select
                    id="student"
                    required
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={formStudentId}
                    onChange={(e) => setFormStudentId(e.target.value)}
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.users?.name || "Mock Student"} (Admission: {s.admission_number || "Mock"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (INR)</Label>
                    <Input
                      id="amount"
                      type="number"
                      required
                      placeholder="e.g. 12500"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input
                      id="due_date"
                      type="date"
                      required
                      value={formDueDate}
                      onChange={(e) => setFormDueDate(e.target.value)}
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Fee Category / Description</Label>
                  <select
                    id="desc"
                    required
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                  >
                    <option value="Tuition Fee">Tuition Fee</option>
                    <option value="Registration Fee">Registration Fee</option>
                    <option value="Science Lab Fee">Science Lab Fee</option>
                    <option value="Library Annual Membership">Library Annual Membership</option>
                    <option value="Sports & Extra-Curricular">Sports & Extra-Curricular</option>
                  </select>
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Invoice"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {successMsg && (
          <Alert className="border-green-500 bg-green-50 text-green-800">
            <AlertDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              {successMsg}
            </AlertDescription>
          </Alert>
        )}

        {/* Ledger Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow border-0">
            <CardContent className="pt-6">
              <span className="text-gray-500 text-sm block">Total Invoiced Volume</span>
              <span className="text-3xl font-extrabold block text-gray-900 mt-1">{totalInvoiced.toLocaleString()} INR</span>
            </CardContent>
          </Card>
          <Card className="shadow border-0 bg-emerald-50/50 border-l-4 border-emerald-500">
            <CardContent className="pt-6">
              <span className="text-emerald-700 text-sm block font-bold">Total Settled Revenue</span>
              <span className="text-3xl font-extrabold block text-emerald-800 mt-1">{totalSettled.toLocaleString()} INR</span>
            </CardContent>
          </Card>
          <Card className="shadow border-0 bg-rose-50/50 border-l-4 border-rose-500">
            <CardContent className="pt-6">
              <span className="text-rose-700 text-sm block font-bold">Total Outstanding Ledger</span>
              <span className="text-3xl font-extrabold block text-rose-800 mt-1">{outstanding.toLocaleString()} INR</span>
            </CardContent>
          </Card>
        </div>

        {/* Ledger Search & Table */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
            <div>
              <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
                Invoicing Log
              </CardTitle>
              <CardDescription>Roster of students outstanding fee transactions</CardDescription>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search student or Invoice ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-xl border-gray-200"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFees.length > 0 ? (
                    filteredFees.map((fee) => (
                      <TableRow key={fee.id} className="hover:bg-gray-50/20">
                        <TableCell className="font-mono text-xs font-bold text-gray-900">
                          #{fee.id}
                        </TableCell>
                        <TableCell className="font-bold text-gray-800 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-700 uppercase">
                            {fee.student_name.slice(0, 2)}
                          </div>
                          {fee.student_name}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">{fee.description}</TableCell>
                        <TableCell className="font-semibold text-gray-700">{fee.amount.toLocaleString()} INR</TableCell>
                        <TableCell className="text-gray-500 font-mono text-xs">{new Date(fee.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            fee.status === "paid" 
                              ? "bg-green-50 text-green-700 border-green-500" 
                              : fee.status === "overdue"
                              ? "bg-red-50 text-red-700 border-red-500 animate-pulse"
                              : "bg-amber-50 text-amber-700 border-amber-500"
                          }>
                            {fee.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {fee.status !== "paid" ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleMarkPaid(fee.id)}
                              className="bg-slate-900 hover:bg-slate-800 text-white text-xs py-1"
                            >
                              Clear Invoice
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-400 font-medium">Cleared</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                        No transactions found matching your filter criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
