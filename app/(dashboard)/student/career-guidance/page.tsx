"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Compass, 
  Loader2, 
  CheckCircle,
  Briefcase,
  Lightbulb,
  GraduationCap
} from "lucide-react"
import Link from "next/link"

export default function StudentCareerGuidancePage() {
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [interests, setInterests] = useState("")
  const [skills, setSkills] = useState("")
  const [results, setResults] = useState<any[]>([])

  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [careerPaths, setCareerPaths] = useState<any[] | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadAcademicFolder() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from("students")
          .select("*, users(*)")
          .eq("user_id", user.id)
          .single()
        setStudent(profile)

        // Fetch exam results
        if (profile?.id) {
          const { data: grades } = await supabase
            .from("results")
            .select("*, exams(*)")
            .eq("student_id", profile.id)
          setResults(grades || [])
        }
      } catch (err) {
        console.error("Error loading academic folder:", err)
      } finally {
        setLoading(false)
      }
    }
    loadAcademicFolder()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setCareerPaths(null)

    // Map student marks to simple object
    const marksSummary = results.map(r => ({
      exam: r.exams?.title,
      score: r.marks,
      grade: r.grade
    }))

    try {
      const res = await fetch("/api/ai/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marks: marksSummary.length > 0 ? marksSummary : [{ exam: "Math midterm", score: 85, grade: "A" }],
          interests,
          skills
        })
      })

      const data = await res.json()
      setCareerPaths(data.pathways || [])
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
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
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
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
            <Compass className="h-8 w-8 text-amber-600" />
            AI Career Advisor
          </h1>
          <p className="text-gray-500 text-sm">Analyze interests, academic results, and skills to guide future career plans</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Inputs Form */}
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Counseling Profile Sheet
                </CardTitle>
                <CardDescription>Share your career interests and technical skills</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="interests">Hobbies & Interests *</Label>
                    <Textarea 
                      id="interests" 
                      required 
                      placeholder="e.g. Building electronics, designing websites, writing short stories, playing piano..." 
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      className="rounded-xl border-gray-200 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="skills">My Core Strengths & Skills *</Label>
                    <Textarea 
                      id="skills" 
                      required 
                      placeholder="e.g. Critical logic solving, visual sketching, debating, algebra mathematics..." 
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="rounded-xl border-gray-200 min-h-[100px]"
                    />
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-xl mt-4">
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Compass className="h-5 w-5 mr-2" />}
                    Analyze Career Pathways
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* AI Pathways list */}
            {careerPaths && (
              <div className="space-y-6">
                <h3 className="font-extrabold text-xl text-gray-900 flex items-center gap-2 pt-2">
                  <Briefcase className="h-6 w-6 text-amber-600 animate-pulse" />
                  Recommended Career Matches
                </h3>
                
                {careerPaths.map((career, index) => (
                  <Card key={index} className="shadow border-0 bg-white hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="py-4 bg-slate-50 border-b flex flex-row justify-between items-center">
                      <CardTitle className="text-gray-800 text-base font-extrabold">{career.path}</CardTitle>
                      <Badge className="bg-amber-100 text-amber-800 font-bold">Match #{index+1}</Badge>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-700 text-sm leading-relaxed">{career.reason}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Academic Profile summary */}
          <div className="space-y-6">
            <Card className="shadow border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-800 text-sm">Academic Standings</CardTitle>
                <CardDescription>Scores feed directly into the mapping system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.length === 0 ? (
                  <div className="text-xs text-gray-400">No active grades found in database. Standard baseline GPA will be used.</div>
                ) : (
                  results.map((r) => (
                    <div key={r.id} className="flex justify-between items-center text-xs border-b pb-2 last:border-0 last:pb-0">
                      <span className="text-gray-500 font-semibold">{r.exams?.title}</span>
                      <span className="font-bold text-gray-800 font-mono">{r.marks}% ({r.grade})</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="shadow border-0 bg-gradient-to-br from-indigo-950 to-slate-900 text-white">
              <CardHeader>
                <CardTitle className="text-amber-500 text-sm flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" />
                  Counselor Note
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[11px] text-slate-300 leading-relaxed pt-0">
                This counselor report combines cognitive performance stats from term tests with your personal interests to generate recommendations from the Gemini Large Language Model.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
