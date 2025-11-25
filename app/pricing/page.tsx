"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Users, BookOpen, Trophy, Heart } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual")

  const pricingPlans = [
    {
      name: "Kindergarten",
      description: "Ages 3-5 • Foundation Learning",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      monthly: 12000,
      annual: 120000,
      popular: false,
      features: [
        "Play-based learning curriculum",
        "Qualified early childhood educators",
        "Nutritious meals and snacks",
        "Indoor and outdoor play areas",
        "Parent-teacher conferences",
        "School supplies included",
        "Art and music activities",
        "Basic computer introduction",
      ],
    },
    {
      name: "Primary School",
      description: "Grades 1-6 • Core Foundation",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      monthly: 15000,
      annual: 150000,
      popular: true,
      features: [
        "Comprehensive academic curriculum",
        "English and Amharic instruction",
        "Mathematics and science labs",
        "Library access and reading programs",
        "Physical education and sports",
        "Art, music, and drama classes",
        "Computer and technology training",
        "Field trips and educational tours",
        "After-school tutoring support",
      ],
    },
    {
      name: "Middle School",
      description: "Grades 7-8 • Academic Excellence",
      icon: Users,
      color: "from-amber-500 to-orange-500",
      monthly: 18000,
      annual: 180000,
      popular: false,
      features: [
        "Advanced academic curriculum",
        "Specialized subject teachers",
        "Science laboratory experiments",
        "Foreign language instruction",
        "Leadership development programs",
        "Extracurricular activities",
        "Career guidance counseling",
        "Technology integration",
        "Competitive academic programs",
        "Student council participation",
      ],
    },
    {
      name: "High School",
      description: "Grades 9-12 • University Preparation",
      icon: Trophy,
      color: "from-purple-500 to-indigo-500",
      monthly: 22000,
      annual: 220000,
      popular: false,
      features: [
        "University preparatory curriculum",
        "Advanced placement courses",
        "College counseling services",
        "Research and project-based learning",
        "Internship opportunities",
        "SAT/ACT preparation",
        "University application support",
        "Advanced science laboratories",
        "Debate and public speaking",
        "Community service programs",
        "Scholarship opportunities",
      ],
    },
  ]

  const additionalFees = [
    { name: "Registration Fee", amount: 15000, description: "One-time enrollment fee" },
    { name: "Uniform Package", amount: 5000, description: "Complete school uniform set" },
    { name: "Books & Materials", amount: 10000, description: "Annual textbooks and supplies" },
    { name: "Transportation", amount: 20000, description: "Monthly bus service (optional)" },
    { name: "Lunch Program", amount: 15000, description: "Monthly meal plan (optional)" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Tuition & Fees</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Invest in your child's future with our comprehensive educational programs. We offer competitive pricing with
            exceptional value for quality education.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-full p-1 shadow-lg">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-amber-600 text-white shadow-md"
                    : "text-gray-600 hover:text-amber-600"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  billingCycle === "annual" ? "bg-amber-600 text-white shadow-md" : "text-gray-600 hover:text-amber-600"
                }`}
              >
                Annual
              </button>
            </div>
          </div>

          {billingCycle === "annual" && (
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Save up to 17% with annual payment
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingPlans.map((plan, index) => {
            const IconComponent = plan.icon
            const price = billingCycle === "monthly" ? plan.monthly : plan.annual

            return (
              <Card
                key={plan.name}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.popular ? "ring-2 ring-amber-500 shadow-xl" : "shadow-lg"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute top-4 right-4 bg-amber-600 hover:bg-amber-700">Most Popular</Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="text-center pb-6">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{price.toLocaleString()}</span>
                    <span className="text-gray-600 ml-2">Rupees</span>
                    <div className="text-sm text-gray-500 mt-1">
                      per {billingCycle === "monthly" ? "month" : "year"}
                    </div>
                  </div>

                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full ${
                      plan.popular ? "bg-amber-600 hover:bg-amber-700" : "bg-gray-900 hover:bg-gray-800"
                    } text-white font-medium py-3 transition-all duration-300`}
                  >
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Additional Fees Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Additional Fees</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFees.map((fee, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{fee.name}</h3>
                  <span className="text-xl font-bold text-amber-600">{fee.amount} Rupees</span>
                </div>
                <p className="text-gray-600 text-sm">{fee.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl shadow-xl p-8 text-white mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Flexible Payment Options</h2>
            <p className="text-amber-100 text-lg">
              We understand that education is an investment. Choose the payment plan that works best for your family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Annual Payment</h3>
              <p className="text-amber-100">Pay the full year upfront and save up to 17%</p>
            </div>

            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Semester Payment</h3>
              <p className="text-amber-100">Split payments into two installments per year</p>
            </div>

            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Monthly Payment</h3>
              <p className="text-amber-100">Convenient monthly installments throughout the year</p>
            </div>
          </div>
        </div>

        {/* Financial Aid Section */}
        <div className="text-center bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Financial Assistance Available</h2>
          <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
            We believe every child deserves quality education. NAVS Global School offers need-based financial aid and
            merit scholarships to qualified families.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">Apply for Financial Aid</Button>
            <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
