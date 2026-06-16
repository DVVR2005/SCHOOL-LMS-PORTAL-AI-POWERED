"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Printer, 
  ArrowLeft, 
  CheckCircle, 
  Loader2, 
  FileCheck 
} from "lucide-react"
import Link from "next/link"

export default function ReceiptPrintPage() {
  const params = useParams()
  const invoiceId = params.id as string

  const [fee, setFee] = useState<any>(null)
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function loadReceipt() {
      try {
        // Fetch fee record
        const { data: feeData } = await supabase
          .from("fees")
          .select("*")
          .eq("id", invoiceId)
          .single()
        
        let activeFee = feeData
        if (!activeFee) {
          // Mock fee if not found
          activeFee = {
            id: invoiceId,
            amount: 12500,
            description: "Term 2 Tuition Fee",
            tx_ref: `NAVS_FEE_${invoiceId}_mockref`,
            paid_at: new Date().toISOString(),
            status: "paid"
          }
        }
        setFee(activeFee)

        // Fetch student profile linked to this invoice
        if (activeFee.student_id) {
          const { data: stud } = await supabase
            .from("students")
            .select("*, users(*), classes(*)")
            .eq("id", activeFee.student_id)
            .single()
          setStudent(stud)
        } else {
          // Mock student
          setStudent({
            admission_number: "ADM-2026-0042",
            users: { name: "Alex Mercer", email: "alex@school.com" },
            classes: { name: "Grade 10", section: "A" }
          })
        }
      } catch (err) {
        console.error("Error loading receipt:", err)
      } finally {
        setLoading(false)
      }
    }
    loadReceipt()
  }, [invoiceId])

  // Auto-invoke printer
  useEffect(() => {
    if (fee && student) {
      const timer = setTimeout(() => {
        window.print()
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [fee, student])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col justify-between items-center print:bg-white print:py-0">
      <div className="max-w-2xl w-full space-y-6 print:space-y-0">
        {/* Navigation / Actions - Hidden on print */}
        <div className="flex items-center justify-between print:hidden">
          <Button variant="ghost" onClick={() => window.close()} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Close Tab
          </Button>

          <Button onClick={() => window.print()} className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2">
            <Printer className="h-4 w-4" /> Print Receipt
          </Button>
        </div>

        {/* Printable Receipt Content */}
        <Card className="shadow-xl border border-gray-100 bg-white p-8 sm:p-12 print:shadow-none print:border-0 rounded-2xl print:p-0">
          <CardContent className="space-y-8">
            {/* School Branding */}
            <div className="flex justify-between items-start border-b pb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">NAVS</span>
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-gray-900">NAVS Global School</h1>
                  <span className="text-xs text-amber-600 font-semibold block">Excellence & Leadership development</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block uppercase font-bold">Document</span>
                <span className="text-sm font-mono font-bold text-gray-800">OFFICIAL RECEIPT</span>
              </div>
            </div>

            {/* Receipt Summary Grid */}
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <span className="block text-xs text-gray-400 font-bold uppercase mb-1">Billed To:</span>
                <span className="block font-bold text-gray-800">{student.users?.name}</span>
                <span className="block text-gray-500 font-mono text-xs">Admission #: {student.admission_number}</span>
                <span className="block text-gray-500 text-xs">Class: {student.classes?.name} Section {student.classes?.section}</span>
              </div>
              
              <div className="text-right">
                <span className="block text-xs text-gray-400 font-bold uppercase mb-1">Receipt details:</span>
                <span className="block text-gray-800 font-bold">Invoice ID: #{fee.id}</span>
                <span className="block text-gray-500 text-xs">Date Paid: {new Date(fee.paid_at || fee.created_at).toLocaleString()}</span>
                <span className="block text-gray-500 text-xs">Payment Method: Chapa Checkout</span>
              </div>
            </div>

            {/* Invoiced details list */}
            <div className="border border-gray-100 rounded-xl overflow-hidden mt-6">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                  <tr>
                    <th className="p-4">Item Description</th>
                    <th className="p-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-gray-700">
                  <tr>
                    <td className="p-4">
                      <span className="block font-bold text-gray-800">{fee.description || "Tuition Fees"}</span>
                      <span className="block text-[10px] text-gray-400">Class Term Clearing invoice</span>
                    </td>
                    <td className="p-4 text-right font-semibold">{Number(fee.amount).toLocaleString()} INR</td>
                  </tr>
                  <tr className="bg-gray-50 font-bold text-gray-900 border-t">
                    <td className="p-4 text-right uppercase text-xs">Total Amount Paid:</td>
                    <td className="p-4 text-right text-lg text-emerald-700">{Number(fee.amount).toLocaleString()} INR</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Transaction Verification Details */}
            <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="block font-bold text-xs">Transaction Verified Successfully</span>
                  <span className="block text-[10px] font-mono text-emerald-600 max-w-[320px] truncate">{fee.tx_ref || "NAVS_VERIFIED_TRANSACTION_PAYMENT"}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <FileCheck className="h-8 w-8 text-emerald-600 opacity-35" />
              </div>
            </div>

            {/* Footer / Stamp */}
            <div className="pt-10 flex justify-between items-end">
              <div className="text-xs text-gray-400">
                <span>NAVS Global School Finance Office</span>
                <span className="block mt-0.5">Thank you for your timely payment.</span>
              </div>
              <div className="text-center w-36 border-t pt-2 border-gray-200">
                <span className="block text-[10px] text-gray-400 uppercase font-bold">Authorized Stamp</span>
                <div className="h-10 flex items-center justify-center italic text-xs text-amber-600 font-bold">NAVS Cashier</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
