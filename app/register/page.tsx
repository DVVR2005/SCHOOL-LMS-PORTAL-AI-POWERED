"use client"

import type React from "react"

import { useState, useRef } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null
    message: string | null
  }>({ type: null, message: null })

  const formRef = useRef<HTMLFormElement>(null)

  // Form state for controlled inputs
  const [formData, setFormData] = useState({
    student_name: "",
    grade: "",
    parent_name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      student_name: "",
      grade: "",
      parent_name: "",
      email: "",
      phone: "",
      message: "",
    })

    // Also reset the form element if it exists
    if (formRef.current) {
      formRef.current.reset()
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("Form submission started")

    setIsSubmitting(true)
    setFormStatus({ type: null, message: null })

    try {
      // Validate required fields on client side
      if (!formData.student_name || !formData.grade || !formData.parent_name || !formData.email || !formData.phone) {
        setFormStatus({
          type: "error",
          message: "Please fill in all required fields.",
        })
        setIsSubmitting(false)
        return
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setFormStatus({
          type: "error",
          message: "Please enter a valid email address.",
        })
        setIsSubmitting(false)
        return
      }

      console.log("Initiating payment for:", formData)

      // Send to payment API instead of directly to Supabase
      const paymentResponse = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      let paymentResult
      try {
        paymentResult = await paymentResponse.json()
      } catch (parseError) {
        console.error("Failed to parse payment response:", parseError)
        setFormStatus({
          type: "error",
          message: "Invalid response from payment service. Please try again.",
        })
        setIsSubmitting(false)
        return
      }

      console.log("Payment API result:", paymentResult)
      console.log("Payment response status:", paymentResponse.status)

      if (paymentResult.success && paymentResult.url) {
        // Store form data in localStorage as backup
        if (typeof window !== "undefined") {
          const registrationData = {
            ...formData,
            tx_ref: paymentResult.tx_ref,
            initiated_at: new Date().toISOString(),
            status: "payment_initiated",
          }
          localStorage.setItem("pendingRegistration", JSON.stringify(registrationData))
          console.log("Stored pending registration in localStorage")
        }

        // Redirect to Chapa payment page
        console.log("Redirecting to:", paymentResult.url)
        window.location.href = paymentResult.url
      } else {
        console.error("Payment initialization failed:", paymentResult)

        // Ensure we always set a string message
        let errorMessage = "Failed to initiate payment. Please try again."

        if (paymentResult && typeof paymentResult.message === "string") {
          errorMessage = paymentResult.message
        } else if (paymentResult && paymentResult.message) {
          // If message is an object, convert it to string
          errorMessage = JSON.stringify(paymentResult.message)
        }

        setFormStatus({
          type: "error",
          message: errorMessage,
        })
      }
    } catch (error) {
      console.error("Unexpected error in payment initiation:", error)

      // Ensure error message is always a string
      let errorMessage = "An unexpected error occurred. Please check your internet connection and try again."

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }

      setFormStatus({
        type: "error",
        message: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-900"></div>

        {/* Decorative elements */}
        <div className="absolute top-5 md:top-10 left-5 md:left-10 w-32 md:w-64 h-32 md:h-64 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-5 md:bottom-10 right-5 md:right-10 w-40 md:w-80 h-40 md:h-80 bg-indigo-500 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Apply to NAVS</h1>
            <p className="text-lg md:text-2xl text-purple-100 mb-8 md:mb-10">
              Start your child's journey to excellence today
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
                  Student Registration Form
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Please fill out all required fields to begin the application process
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {formStatus.type && formStatus.message && (
                  <Alert variant={formStatus.type === "success" ? "default" : "destructive"}>
                    <AlertDescription>
                      {typeof formStatus.message === "string" ? formStatus.message : "An error occurred"}
                    </AlertDescription>
                  </Alert>
                )}

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {/* Student Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Student Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="student_name">Student Full Name *</Label>
                      <Input
                        id="student_name"
                        name="student_name"
                        type="text"
                        required
                        value={formData.student_name}
                        onChange={(e) => handleInputChange("student_name", e.target.value)}
                        placeholder="Enter student's full name"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade Level *</Label>
                      <Select
                        name="grade"
                        required
                        value={formData.grade}
                        onValueChange={(value) => handleInputChange("grade", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kindergarten">Kindergarten</SelectItem>
                          <SelectItem value="1st">1st Grade</SelectItem>
                          <SelectItem value="2nd">2nd Grade</SelectItem>
                          <SelectItem value="3rd">3rd Grade</SelectItem>
                          <SelectItem value="4th">4th Grade</SelectItem>
                          <SelectItem value="5th">5th Grade</SelectItem>
                          <SelectItem value="6th">6th Grade</SelectItem>
                          <SelectItem value="7th">7th Grade</SelectItem>
                          <SelectItem value="8th">8th Grade</SelectItem>
                          <SelectItem value="9th">9th Grade</SelectItem>
                          <SelectItem value="10th">10th Grade</SelectItem>
                          <SelectItem value="11th">11th Grade</SelectItem>
                          <SelectItem value="12th">12th Grade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Parent/Guardian Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Parent/Guardian Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="parent_name">Parent/Guardian Full Name *</Label>
                      <Input
                        id="parent_name"
                        name="parent_name"
                        type="text"
                        required
                        value={formData.parent_name}
                        onChange={(e) => handleInputChange("parent_name", e.target.value)}
                        placeholder="Enter parent/guardian full name"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter email address"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter phone number (e.g., +91 1912345678)"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Comments (Optional)</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Any additional information you'd like to share..."
                        className="w-full min-h-[100px]"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold rounded-lg disabled:opacity-50"
                    >
                      {isSubmitting ? "Initiating Payment..." : "Pay Registration Fee (15000 Rupees)"}
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-600">
                    <p>
                      By submitting this form, you agree to our terms and conditions. We will contact you within 24-48
                      hours to schedule your campus visit.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
