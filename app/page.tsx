"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, BookOpen, Phone, Users, Award } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import TestimonialsSection from "@/components/testimonials"

const heroImages = [
  "/placeholder.svg?height=600&width=800&text=Students+Learning",
  "/placeholder.svg?height=600&width=800&text=Classroom+Excellence",
  "/placeholder.svg?height=600&width=800&text=Character+Building",
]

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100 via-orange-50 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900">We don't just</span>
                <span className="block text-amber-600">educate.</span>
              </h1>

              <p className="text-xl text-gray-700 leading-relaxed">
                At NAVS Global School, we shape character, nurture brilliance, and build tomorrow's leaders with
                purpose and grace.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg font-semibold rounded-xl">
                    Apply Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/programs">
                  <Button
                    variant="outline"
                    className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 px-8 py-4 text-lg font-semibold rounded-xl"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Our Programs
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Images */}
            <div className="relative">
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                {heroImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                        src="https://media.istockphoto.com/id/578291882/photo/indian-kids-studying-on-study-table.jpg?s=612x612&w=0&k=20&c=XVwGhbMTIko1fht8W3maUIB6U8ztBMRPmZR27P2j1j8="
                        alt="School Foundation"
                        className="rounded-lg shadow-md w-full"
                      />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amber-600 mb-2">500+</div>
              <div className="text-gray-600">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-600 mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-600 mb-2">50+</div>
              <div className="text-gray-600">Teachers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-600 mb-2">15+</div>
              <div className="text-gray-600">Years</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose NAVS?</h2>
            <p className="text-xl text-gray-600">Excellence in education with strong values</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Academic Excellence</h3>
              <p className="text-gray-600">UK-style curriculum preparing students for global success</p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Character Building</h3>
              <p className="text-gray-600">Moral guidance shaping well-rounded individuals</p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Future Leaders</h3>
              <p className="text-gray-600">Developing leadership skills for tomorrow's challenges</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Join Our Family?</h2>
          <p className="text-xl text-amber-100 mb-8">Give your child the foundation for lifelong success</p>
          <div className="space-x-4">
            <Link href="/register">
              <Button className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-lg font-semibold">
                Apply Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-600 px-8 py-3 text-lg rounded-lg"
              >
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
