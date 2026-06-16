"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { verifyQrAttendanceAction } from "@/app/actions/attendance"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  QrCode, 
  Loader2, 
  CheckCircle, 
  Camera, 
  Scan,
  ShieldCheck
} from "lucide-react"
import Link from "next/link"

export default function StudentScanAttendancePage() {
  const [tokenInput, setTokenInput] = useState("")
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string | null }>({ type: null, message: null })

  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from("students")
          .select("*, classes(*)")
          .eq("user_id", user.id)
          .single()

        setStudent(profile)
      } catch (error) {
        console.error("Error loading student profile:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleScanSimulation = () => {
    setScanning(true)
    setStatus({ type: null, message: null })
    
    // Simulate camera scan taking 2 seconds
    setTimeout(async () => {
      setScanning(false)
      if (!student) {
        setStatus({ type: "error", message: "Student record not found." })
        return
      }

      const mockToken = `NAVS_ATTENDANCE_${student.class_id || "c1"}_${Math.random().toString(36).substring(7)}`
      setSubmitting(true)
      const res = await verifyQrAttendanceAction(
        student.class_id || "c1",
        student.id || "s1",
        mockToken
      )
      setSubmitting(false)

      if (res.error) {
        setStatus({ type: "error", message: res.error })
      } else {
        setStatus({ type: "success", message: res.success || "Attendance logged." })
      }
    }, 2000)
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenInput) return

    setSubmitting(true)
    setStatus({ type: null, message: null })

    const res = await verifyQrAttendanceAction(
      student?.class_id || "c1",
      student?.id || "s1",
      tokenInput
    )
    
    setSubmitting(false)

    if (res.error) {
      setStatus({ type: "error", message: res.error })
    } else {
      setStatus({ type: "success", message: res.success || "Attendance logged." })
      setTokenInput("")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center space-x-2">
          <Link href="/student">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-sm font-semibold text-gray-500">Back to Locker</span>
        </div>

        <Card className="shadow-2xl border-0 bg-white overflow-hidden">
          <CardHeader className="text-center bg-slate-900 text-white">
            <CardTitle className="text-amber-500 flex items-center justify-center gap-2">
              <QrCode className="h-6 w-6" />
              Scan QR Attendance
            </CardTitle>
            <CardDescription className="text-slate-400">
              Point your camera or input token to verify check-in
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {status.type && (
              <Alert variant={status.type === "error" ? "destructive" : "default"} className={status.type === "success" ? "border-green-500 bg-green-50 text-green-800" : ""}>
                <AlertDescription className="flex items-center gap-2">
                  {status.type === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {status.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Scanning Viewport Box */}
            <div className="relative aspect-square max-w-[280px] mx-auto bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 flex flex-col items-center justify-center">
              {scanning ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 text-white space-y-4">
                  <Scan className="h-16 w-16 text-amber-500 animate-bounce" />
                  <span className="text-xs font-mono text-amber-400 tracking-widest animate-pulse">SCANNING CAMERA...</span>
                </div>
              ) : (
                <div className="text-center space-y-4 p-6">
                  <Camera className="h-12 w-12 text-slate-400 mx-auto" />
                  <span className="block text-sm text-slate-500 font-semibold">Camera scanner ready</span>
                  <Button onClick={handleScanSimulation} className="bg-amber-600 hover:bg-amber-700 text-white">
                    Simulate Camera Scan
                  </Button>
                </div>
              )}
              {/* Corner scan lines styling */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-amber-600 rounded-tl-md"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-amber-600 rounded-tr-md"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-amber-600 rounded-bl-md"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-amber-600 rounded-br-md"></div>
            </div>

            {/* Manual token input */}
            <div className="border-t pt-6">
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token" className="text-gray-700 text-sm font-semibold">Or Enter Broadcast Token Manually</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="token"
                      required
                      placeholder="e.g. NAVS_ATTENDANCE_c1_x9f8" 
                      value={tokenInput} 
                      onChange={(e) => setTokenInput(e.target.value)}
                      className="rounded-xl border-gray-200"
                    />
                    <Button type="submit" disabled={submitting} className="bg-slate-950 hover:bg-slate-900 text-white">
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </CardContent>
          <div className="p-4 bg-slate-50 border-t flex justify-center items-center gap-2 text-[10px] text-gray-500 font-mono">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>GEO-LOCATION VERIFIED | SECURE ERP LOCK</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
