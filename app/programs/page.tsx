"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Award, Music, Trophy, Heart, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

export default function ProgramsPage() {
  const [expandedProgram, setExpandedProgram] = useState<number | null>(null)

  const programs = [
    {
      title: "Kindergarten",
      icon: Heart,
      color: "pink",
      shortDesc: "Nurturing foundation with play-based learning",
      fullDesc:
        "Our Kindergarten program provides a nurturing foundation where young learners develop essential skills through play-based learning, structured activities, and spiritual formation. We focus on building confidence, curiosity, and character.",
      features: [
        "Small class sizes (max 15 students)",
        "Early literacy and numeracy",
        "Creative arts and music",
        "Character development",
      ],
      image: "/kindergarden.jpeg?height=300&width=500&text=Kindergarten+Program",
    },
    {
      title: "Primary School",
      icon: BookOpen,
      color: "blue",
      shortDesc: "Strong academic foundations with creativity",
      fullDesc:
        "Our Primary School program builds strong academic foundations while fostering creativity, critical thinking, and moral development. Students engage with a comprehensive curriculum that prepares them for future academic success.",
      features: ["Core subjects mastery", "STEM exploration", "Leadership development", "Community service"],
      image: "/primary_school.png?height=300&width=500&text=Primary+School+Program",
    },
    {
      title: "Middle School",
      icon: Users,
      color: "green",
      shortDesc: "Transition years with rigorous academics",
      fullDesc:
        "Our Middle School program guides students through the crucial transition years with rigorous academics, character development, and leadership opportunities. We prepare students for high school success while nurturing their unique talents and interests.",
      features: [
        "Advanced mathematics and sciences",
        "Foreign language options",
        "Student government",
        "Peer mentoring",
      ],
      image: "/middle_school.png?height=300&width=500&text=Middle+School+Program",
    },
    {
      title: "High School",
      icon: Award,
      color: "purple",
      shortDesc: "University preparation with advanced coursework",
      fullDesc:
        "Our High School program provides rigorous academic preparation for university admission while developing mature, responsible leaders. Students engage with challenging coursework, advanced placement options, and real-world applications.",
      features: ["Advanced Placement courses", "University counseling", "Research projects", "Leadership positions"],
      image: "/high_school.png?height=300&width=500&text=High+School+Program",
    },
  ]

  const toggleProgram = (index: number) => {
    if (expandedProgram === index) {
      setExpandedProgram(null)
    } else {
      setExpandedProgram(index)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900"></div>

        {/* Decorative elements */}
        <div className="absolute top-10 md:top-20 left-10 md:left-20 w-32 md:w-64 h-32 md:h-64 bg-green-500 rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 md:right-20 w-40 md:w-80 h-40 md:h-80 bg-teal-500 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-20 md:top-40 right-20 md:right-40 w-20 md:w-40 h-20 md:h-40 bg-emerald-500 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Programs</h1>
            <p className="text-lg md:text-xl text-green-100">
              Comprehensive education from Kindergarten to High School
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid - With Expansion */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {programs.map((program, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-${program.color}-50 to-${getGradientColor(program.color)}-50 rounded-2xl transition-all duration-300 ${
                  expandedProgram === index ? "shadow-xl" : "shadow-md hover:shadow-lg"
                }`}
              >
                <div className="p-6 md:p-8 cursor-pointer relative" onClick={() => toggleProgram(index)}>
                  {/* Hint overlay - only show when not expanded and on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-5 rounded-2xl flex items-center justify-center transition-opacity duration-300">
                    {expandedProgram !== index && (
                      <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-80 px-4 py-2 rounded-full">
                        <p className="text-sm font-medium text-gray-700">Click to learn more</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 mb-4 md:mb-6">
                      <program.icon className={`h-6 md:h-8 w-6 md:w-8 text-${program.color}-600`} />
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{program.title}</h2>
                    </div>
                    <div>
                      {expandedProgram === index ? (
                        <ChevronUp className="h-5 md:h-6 w-5 md:w-6 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 md:h-6 w-5 md:w-6 text-gray-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2 text-sm md:text-base">{program.shortDesc}</p>
                </div>

                {/* Expanded content */}
                {expandedProgram === index && (
                  <div className="px-6 md:px-8 pb-6 md:pb-8 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-center">
                      <div>
                        <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base">{program.fullDesc}</p>
                        <h3 className="font-bold text-gray-900 mb-3">Key Features:</h3>
                        <ul className="space-y-2 text-gray-700 mb-4 md:mb-6 text-sm md:text-base">
                          {program.features.map((feature, i) => (
                            <li key={i}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <img
                          src={program.image || "/placeholder.svg"}
                          alt={`${program.title} Program`}
                          className="rounded-lg shadow-md w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extracurriculars - Simple Icons */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Beyond Academics</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="h-6 md:h-8 w-6 md:w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm md:text-base">Music & Arts</h3>
            </div>

            <div className="text-center">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 md:h-8 w-6 md:w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm md:text-base">Sports</h3>
            </div>

            <div className="text-center">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 md:h-8 w-6 md:w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm md:text-base">Academic Clubs</h3>
            </div>

            <div className="text-center">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 md:h-8 w-6 md:w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm md:text-base">Community Service</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Find Your Child's Perfect Program</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-white text-green-600 hover:bg-gray-100 px-6 md:px-8 py-3 text-base md:text-lg rounded-lg font-semibold w-full sm:w-auto">
                Apply Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 px-6 md:px-8 py-3 text-base md:text-lg rounded-lg w-full sm:w-auto"
              >
                Schedule Tour
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// Helper function to get gradient color
function getGradientColor(color: string): string {
  const colorMap: { [key: string]: string } = {
    pink: "rose",
    blue: "indigo",
    green: "emerald",
    purple: "violet",
  }
  return colorMap[color] || color
}
