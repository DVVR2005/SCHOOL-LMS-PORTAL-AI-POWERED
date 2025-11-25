"use client"

import { useState } from "react"
import { Star } from "lucide-react"

export default function TestimonialsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const testimonials = [
    {
      quote:
        "NAVS transformed my daughter's confidence and character. The teachers truly care about each student's growth and development.",
      author: "MaheshBabu G.",
      role: "Parent of 8th Grader",
      image: "/placeholder.svg?height=80&width=80&text=JK",
      stars: 5,
      rotation: "-rotate-12",
    },
    {
      quote:
        "The academic preparation here is exceptional. My son was well-prepared for university challenges and received multiple scholarship offers.",
      author: "Ravi Kiran T.",
      role: "Parent of Graduate",
      image: "/placeholder.svg?height=80&width=80&text=MT",
      stars: 5,
      rotation: "rotate-6",
    },
    {
      quote:
        "The values-based education at NAVS has shaped our children into compassionate, responsible young adults. Worth every investment.",
      author: "Sarah & Arjun L.",
      role: "Parent of Two Students",
      image: "/placeholder.svg?height=80&width=80&text=SL",
      stars: 5,
      rotation: "-rotate-3",
    },
    {
      quote:
        "Outstanding faculty and curriculum. Our daughter developed leadership skills and confidence that will serve her throughout life.",
      author: "Jai Krishna R.",
      role: "Parent of Graduate",
      image: "/placeholder.svg?height=80&width=80&text=DR",
      stars: 5,
      rotation: "rotate-8",
    },
    {
      quote:
        "The spiritual foundation combined with academic excellence creates well-rounded students. Highly recommend NAVS to any family.",
      author: "Sam",
      role: "Parent of 6th Grader",
      image: "/placeholder.svg?height=80&width=80&text=MG",
      stars: 5,
      rotation: "-rotate-6",
    },
  ]

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">What Parents Say</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hear from families who've experienced the NAVS difference
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 max-w-7xl mx-auto min-h-[400px]">
          {testimonials.map((testimonial, index) => {
            const isCorner = index === 0 || index === 4
            const isCenter = index === 1 || index === 2 || index === 3

            return (
              <div
                key={index}
                className={`relative transition-all duration-500 ${testimonial.rotation} ${
                  isCorner
                    ? hoveredCard === index
                      ? "opacity-100 scale-110 z-20"
                      : "opacity-40 scale-95 z-10"
                    : "opacity-100 scale-100 z-15"
                } ${hoveredCard === index ? "rotate-0" : ""}`}
                style={{
                  transform: hoveredCard === index ? "rotate(0deg) scale(1.1)" : "",
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`bg-gray-800 rounded-2xl p-6 w-80 h-72 transition-all duration-500 ${
                    hoveredCard === index && isCorner
                      ? "shadow-2xl shadow-amber-500/30 border-2 border-amber-500/60 ring-4 ring-amber-500/30"
                      : isCenter
                        ? "shadow-xl border border-gray-700"
                        : "shadow-lg border border-gray-700/50"
                  }`}
                >
                  {/* Stars */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-300 mb-6 text-sm leading-relaxed line-clamp-4">"{testimonial.quote}"</p>

                  {/* Author */}
                  <div className="flex items-center mt-auto">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{testimonial.author}</div>
                      <div className="text-gray-400 text-xs">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-amber-500">Our Excellence</h3>
        </div>
      </div>
    </section>
  )
}
