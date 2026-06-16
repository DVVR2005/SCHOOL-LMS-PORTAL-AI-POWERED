"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  ArrowLeft, 
  DollarSign, 
  Loader2, 
  Printer, 
  CheckCircle, 
  CreditCard,
  History
} from "lucide-react"
import Link from "next/link"

export default function StudentFeesPage() {
  const searchParams = useSearchParams()
  const paymentSuccess = searchParams.get("payment_success")
  const paidInvoiceId = searchParams.get("invoice_id")

  const [student, setStudent] = useState<any>(null)
  const [fees, setFees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [payingId, setPayingId] = useState<string | null>(null)
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error" | null; message: string | null }>({ type: null, message: null })

  const supabase = createClient()

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("students")
        .select("*, users(*)")
        .eq("user_id", user.id)
        .single()
      setStudent(profile)

      const studentId = profile?.id || "s1"

      // Fetch fees
      const { data: feeList } = await supabase
        .from("fees")
        .select("*")
        .eq("student_id", studentId)
        .order("due_date", { ascending: true })

      const list = feeList || []

      // If empty, mock data for dashboard presentation
      setFees(list.length > 0 ? list : [
        { id: "inv-201", amount: 12500, due_date: "2026-07-01", status: "pending", created_at: "2026-06-01T00:00:00Z", description: "Term 2 Tuition Fee" },
        { id: "inv-101", amount: 2500, due_date: "2026-02-12", status: "paid", created_at: "2026-02-01T00:00:00Z", description: "Annual Registration & Lab Fees", tx_ref: "NAVS_FEE_inv-101_mock", paid_at: "2026-02-12T09:30:00Z" }
      ])
    } catch (error) {
      console.error("Error loading fees:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    if (paymentSuccess === "true" && paidInvoiceId) {
      setAlertMsg({
        type: "success",
        message: "Payment successfully verified! Your receipt is ready to download."
      })
    }
  }, [searchParams])

  const handlePay = async (invoice: any) => {
    setPayingId(invoice.id)
    setAlertMsg({ type: null, message: null })

    try {
      const payload = {
        invoiceId: invoice.id,
        amount: invoice.amount,
        email: student?.users?.email || "student@school.com",
        name: student?.users?.name || "Student Name",
        phone: student?.phone || "+2519000000",
        student_name: student?.users?.name,
        role: "student"
      }

      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const result = await res.json()
      if (result.success && result.url) {
        window.location.href = result.url
      } else {
        setAlertMsg({ type: "error", message: result.message || "Failed to initiate payment." })
        setPayingId(null)
      }
    } catch (err: any) {
      setAlertMsg({ type: "error", message: err.message || "Network error. Please try again." })
      setPayingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  // Calculate Balances
  const totalBilled = fees.reduce((acc, curr) => acc + Number(curr.amount), 0)
  const totalPaid = fees.filter(f => f.status === "paid").reduce((acc, curr) => acc + Number(curr.amount), 0)
  const outstanding = totalBilled - totalPaid

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Link href="/student">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-sm font-semibold text-gray-500">Back to Locker</span>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-amber-600" />
            Fees & Billing Ledger
          </h1>
          <p className="text-gray-500 text-sm">Review fee balance reports and clear pending invoices online</p>
        </div>

        {alertMsg.message && (
          <Alert variant={alertMsg.type === "error" ? "destructive" : "default"} className={alertMsg.type === "success" ? "border-green-500 bg-green-50 text-green-800" : ""}>
            <AlertDescription className="flex items-center gap-2">
              {alertMsg.type === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
              {alertMsg.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Balance cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow border-0">
            <CardContent className="pt-6">
              <span className="text-gray-500 text-sm block">Total Invoiced</span>
              <span className="text-3xl font-extrabold block text-gray-900 mt-1">{totalBilled.toLocaleString()} INR</span>
            </CardContent>
          </Card>
          <Card className="shadow border-0 bg-emerald-50/50 border-l-4 border-emerald-500">
            <CardContent className="pt-6">
              <span className="text-emerald-700 text-sm block font-bold">Total Settled</span>
              <span className="text-3xl font-extrabold block text-emerald-800 mt-1">{totalPaid.toLocaleString()} INR</span>
            </CardContent>
          </Card>
          <Card className="shadow border-0 bg-rose-50/50 border-l-4 border-rose-500">
            <CardContent className="pt-6">
              <span className="text-rose-700 text-sm block font-bold">Outstanding Balance</span>
              <span className="text-3xl font-extrabold block text-rose-800 mt-1">{outstanding.toLocaleString()} INR</span>
            </CardContent>
          </Card>
        </div>

        {/* Fee Statement Table */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-amber-500" />
              Invoicing & Statements
            </CardTitle>
            <CardDescription>Fee breakdowns, terms and receipt download lockers</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.map((fee) => (
                    <TableRow key={fee.id} className="hover:bg-gray-50/20">
                      <TableCell className="font-bold text-gray-800">
                        {fee.description || "School Tuition Bills"}
                        <span className="block text-[10px] text-gray-400 font-mono mt-0.5">Inv ID: #{fee.id}</span>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-700">{Number(fee.amount).toLocaleString()} INR</TableCell>
                      <TableCell className="text-gray-600 font-mono text-xs">{new Date(fee.due_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={fee.status === "paid" ? "bg-green-50 text-green-700 border-green-500" : "bg-red-50 text-red-700 border-red-500"}>
                          {fee.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {fee.status === "paid" ? (
                          <a href={`/receipt/${fee.id}`} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="text-xs flex items-center gap-1.5 border-gray-200">
                              <Printer className="h-3.5 w-3.5" />
                              Receipt
                            </Button>
                          </a>
                        ) : (
                          <Button 
                            size="sm" 
                            disabled={payingId !== null}
                            onClick={() => handlePay(fee)}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs flex items-center gap-1.5"
                          >
                            {payingId === fee.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
                            Pay Online
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
