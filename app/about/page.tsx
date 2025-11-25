"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, Target, Award, Users, BookOpen, Shield } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)

  const values = [
    {
      icon: Shield,
      title: "Discipline",
      color: "amber",
      description: "Church-inspired discipline building character and respect",
    },
    { icon: Heart, title: "Integrity", color: "blue", description: "Honesty and moral courage in all actions" },
    {
      icon: Award,
      title: "Excellence",
      color: "green",
      description: "Striving for the highest standards in all we do",
    },
    { icon: Users, title: "Leadership", color: "purple", description: "Developing confident, responsible leaders" },
    { icon: BookOpen, title: "Wisdom", color: "red", description: "Combining knowledge with understanding" },
    { icon: Heart, title: "Compassion", color: "indigo", description: "Fostering empathy and service to others" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>

        {/* Decorative circles */}
        <div className="absolute top-10 md:top-20 left-10 md:left-20 w-32 md:w-64 h-32 md:h-64 bg-blue-500 rounded-full opacity-10"></div>
        <div className="absolute bottom-10 right-10 md:right-20 w-40 md:w-80 h-40 md:h-80 bg-purple-500 rounded-full opacity-10"></div>
        <div className="absolute top-20 md:top-40 right-20 md:right-40 w-20 md:w-40 h-20 md:h-40 bg-amber-500 rounded-full opacity-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Our Story</h1>
            <p className="text-lg md:text-2xl text-gray-300 leading-relaxed">
              Shaping young minds through academic excellence and spiritual development since 2009
            </p>
          </div>
        </div>
      </section>

      {/* History Section - Timeline Style */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our History</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              A journey of growth, excellence, and transformation
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line - hidden on mobile */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500"></div>

              {/* Timeline items */}
              <div className="space-y-8 md:space-y-16">
                {/* 2009 */}
                <div className="relative">
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                    <div className="md:text-right md:pr-12 order-2 md:order-1">
                      <h3 className="text-xl md:text-2xl font-bold text-blue-600">2009</h3>
                      <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Foundation</h4>
                      <p className="text-gray-600 text-sm md:text-base">
                        NAVS Global School was founded with a vision to combine academic rigor with spiritual
                        formation.
                      </p>
                    </div>
                    <div className="md:pl-12 order-1 md:order-2">
                      <img
                        src="/NAVS_school.png?height=200&width=300&text=School+Foundation"
                        alt="School Foundation"
                        className="rounded-lg shadow-md w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* 2014 */}
                <div className="relative">
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-500 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                    <div className="md:pr-12 order-1">
                      <img
                        src="/campus.png?height=200&width=300&text=Campus+Expansion"
                        alt="Campus Expansion"
                        className="rounded-lg shadow-md w-full"
                      />
                    </div>
                    <div className="md:pl-12 order-2">
                      <h3 className="text-xl md:text-2xl font-bold text-indigo-600">2014</h3>
                      <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Campus Expansion</h4>
                      <p className="text-gray-600 text-sm md:text-base">
                        Expanded our facilities to include state-of-the-art science labs, library, and sports complex.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2019 */}
                <div className="relative">
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-purple-500 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                    <div className="md:text-right md:pr-12 order-2 md:order-1">
                      <h3 className="text-xl md:text-2xl font-bold text-purple-600">2019</h3>
                      <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Excellence Award</h4>
                      <p className="text-gray-600 text-sm md:text-base">
                        Recognized as one of the top schools in the region for academic excellence and character
                        development.
                      </p>
                    </div>
                    <div className="md:pl-12 order-1 md:order-2">
                      <img
                        src="/excellece_award.png?height=200&width=300&text=Excellence+Award"
                        alt="Excellence Award"
                        className="rounded-lg shadow-md w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* 2024 */}
                <div className="relative">
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-amber-500 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                    <div className="md:pr-12 order-1">
                      <img
                        src="/students.png?height=200&width=300&text=Today"
                        alt="Today"
                        className="rounded-lg shadow-md w-full"
                      />
                    </div>
                    <div className="md:pl-12 order-2">
                      <h3 className="text-xl md:text-2xl font-bold text-amber-600">Today</h3>
                      <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Looking Forward</h4>
                      <p className="text-gray-600 text-sm md:text-base">
                        Continuing our mission with over 500 students, 50+ expert teachers, and a 98% university
                        acceptance rate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Card Layout */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <Target className="h-6 md:h-8 w-6 md:w-8 text-amber-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                To provide exceptional education rooted in Spiritual values, fostering academic excellence and character
                development, preparing students to become confident, compassionate leaders who make positive
                contributions to society.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <Heart className="h-6 md:h-8 w-6 md:w-8 text-blue-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                To be the leading educational institution that transforms lives through holistic education, creating
                future leaders who embody integrity, excellence, and service to humanity in everything they do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values - Perfect Bento Grid */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              These fundamental principles guide everything we do
            </p>
          </div>

          {/* Mobile: Stack layout */}
          <div className="block md:hidden space-y-4">
            {values.map((value, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                  hoveredValue === index ? "shadow-2xl scale-105" : "shadow-md"
                }`}
                style={{
                  background:
                    hoveredValue === index ? `linear-gradient(135deg, #fff, ${getColorHex(value.color)}10)` : "white",
                }}
                onMouseEnter={() => setHoveredValue(index)}
                onMouseLeave={() => setHoveredValue(null)}
              >
                {hoveredValue === index && (
                  <div
                    className="absolute inset-0 blur-3xl opacity-20"
                    style={{ background: getColorHex(value.color) }}
                  ></div>
                )}

                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                      hoveredValue === index ? `bg-${value.color}-600` : `bg-${value.color}-100`
                    }`}
                  >
                    <value.icon
                      className={`h-6 w-6 transition-all duration-300 ${
                        hoveredValue === index ? "text-white" : `text-${value.color}-600`
                      }`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Bento Grid Layout */}
          <div className="hidden md:grid grid-cols-12 gap-4 max-w-6xl mx-auto auto-rows-fr">
            {/* Discipline - Large card (top-left) */}
            <div
              className={`col-span-6 row-span-2 relative p-6 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                hoveredValue === 0 ? "shadow-2xl scale-105" : "shadow-md"
              }`}
              style={{
                background: hoveredValue === 0 ? `linear-gradient(135deg, #fff, ${getColorHex("amber")}10)` : "white",
              }}
              onMouseEnter={() => setHoveredValue(0)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              {hoveredValue === 0 && (
                <div
                  className="absolute inset-0 blur-3xl opacity-20"
                  style={{ background: getColorHex("amber") }}
                ></div>
              )}

              <div className="relative z-10 h-full flex flex-col">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                    hoveredValue === 0 ? "bg-amber-600" : "bg-amber-100"
                  }`}
                >
                  <Shield
                    className={`h-8 w-8 transition-all duration-300 ${
                      hoveredValue === 0 ? "text-white" : "text-amber-600"
                    }`}
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Discipline</h3>
                <p className="text-gray-600">inspired discipline building character and respect</p>
              </div>
            </div>

            {/* Integrity - Medium card (top-right) */}
            <div
              className={`col-span-6 row-span-1 relative p-6 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                hoveredValue === 1 ? "shadow-2xl scale-105" : "shadow-md"
              }`}
              style={{
                background: hoveredValue === 1 ? `linear-gradient(135deg, #fff, ${getColorHex("blue")}10)` : "white",
              }}
              onMouseEnter={() => setHoveredValue(1)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              {hoveredValue === 1 && (
                <div className="absolute inset-0 blur-3xl opacity-20" style={{ background: getColorHex("blue") }}></div>
              )}

              <div className="relative z-10 h-full flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${
                    hoveredValue === 1 ? "bg-blue-600" : "bg-blue-100"
                  }`}
                >
                  <Heart
                    className={`h-6 w-6 transition-all duration-300 ${
                      hoveredValue === 1 ? "text-white" : "text-blue-600"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Integrity</h3>
                  <p className="text-gray-600 text-sm">Honesty and moral courage in all actions</p>
                </div>
              </div>
            </div>

            {/* Excellence - Medium card */}
            <div
              className={`col-span-4 row-span-2 relative p-6 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                hoveredValue === 2 ? "shadow-2xl scale-105" : "shadow-md"
              }`}
              style={{
                background: hoveredValue === 2 ? `linear-gradient(135deg, #fff, ${getColorHex("green")}10)` : "white",
              }}
              onMouseEnter={() => setHoveredValue(2)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              {hoveredValue === 2 && (
                <div
                  className="absolute inset-0 blur-3xl opacity-20"
                  style={{ background: getColorHex("green") }}
                ></div>
              )}

              <div className="relative z-10 h-full flex flex-col">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                    hoveredValue === 2 ? "bg-green-600" : "bg-green-100"
                  }`}
                >
                  <Award
                    className={`h-7 w-7 transition-all duration-300 ${
                      hoveredValue === 2 ? "text-white" : "text-green-600"
                    }`}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-600 text-sm">Striving for the highest standards in all we do</p>
              </div>
            </div>

            {/* Leadership - Small card */}
            <div
              className={`col-span-4 row-span-1 relative p-4 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                hoveredValue === 3 ? "shadow-2xl scale-105" : "shadow-md"
              }`}
              style={{
                background: hoveredValue === 3 ? `linear-gradient(135deg, #fff, ${getColorHex("purple")}10)` : "white",
              }}
              onMouseEnter={() => setHoveredValue(3)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              {hoveredValue === 3 && (
                <div
                  className="absolute inset-0 blur-3xl opacity-20"
                  style={{ background: getColorHex("purple") }}
                ></div>
              )}

              <div className="relative z-10 h-full flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
                    hoveredValue === 3 ? "bg-purple-600" : "bg-purple-100"
                  }`}
                >
                  <Users
                    className={`h-6 w-6 transition-all duration-300 ${
                      hoveredValue === 3 ? "text-white" : "text-purple-600"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Leadership</h3>
                  <p className="text-gray-600 text-xs">Developing confident leaders</p>
                </div>
              </div>
            </div>

            {/* Wisdom - Medium card */}
            <div
              className={`col-span-4 row-span-1 relative p-4 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                hoveredValue === 4 ? "shadow-2xl scale-105" : "shadow-md"
              }`}
              style={{
                background: hoveredValue === 4 ? `linear-gradient(135deg, #fff, ${getColorHex("red")}10)` : "white",
              }}
              onMouseEnter={() => setHoveredValue(4)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              {hoveredValue === 4 && (
                <div className="absolute inset-0 blur-3xl opacity-20" style={{ background: getColorHex("red") }}></div>
              )}

              <div className="relative z-10 h-full flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
                    hoveredValue === 4 ? "bg-red-600" : "bg-red-100"
                  }`}
                >
                  <BookOpen
                    className={`h-6 w-6 transition-all duration-300 ${
                      hoveredValue === 4 ? "text-white" : "text-red-600"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Wisdom</h3>
                  <p className="text-gray-600 text-xs">Combining knowledge with understanding</p>
                </div>
              </div>
            </div>

            {/* Compassion - Large card */}
            <div
              className={`col-span-8 row-span-1 relative p-6 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                hoveredValue === 5 ? "shadow-2xl scale-105" : "shadow-md"
              }`}
              style={{
                background: hoveredValue === 5 ? `linear-gradient(135deg, #fff, ${getColorHex("indigo")}10)` : "white",
              }}
              onMouseEnter={() => setHoveredValue(5)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              {hoveredValue === 5 && (
                <div
                  className="absolute inset-0 blur-3xl opacity-20"
                  style={{ background: getColorHex("indigo") }}
                ></div>
              )}

              <div className="relative z-10 h-full flex items-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mr-6 transition-all duration-300 ${
                    hoveredValue === 5 ? "bg-indigo-600" : "bg-indigo-100"
                  }`}
                >
                  <Heart
                    className={`h-8 w-8 transition-all duration-300 ${
                      hoveredValue === 5 ? "text-white" : "text-indigo-600"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Compassion</h3>
                  <p className="text-gray-600">Fostering empathy and service to others</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Join Our Community of Excellence</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-6 md:px-8 py-3 text-base md:text-lg rounded-lg w-full sm:w-auto">
                Apply Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-900 px-6 md:px-8 py-3 text-base md:text-lg rounded-lg w-full sm:w-auto"
              >
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

// Helper function to get color hex codes
function getColorHex(color: string): string {
  const colorMap: { [key: string]: string } = {
    amber: "#d97706",
    blue: "#2563eb",
    green: "#16a34a",
    purple: "#9333ea",
    red: "#dc2626",
    indigo: "#4f46e5",
  }
  return colorMap[color] || "#000000"
}
