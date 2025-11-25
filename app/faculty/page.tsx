import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { GraduationCap, Award } from "lucide-react"

export default function FacultyPage() {
  const facultyMembers = [
    {
      name: "Mr.Vardhan Reddy",
      position: "Director of NAVS Global School",
      image: "/placeholder.svg?height=300&width=300&text=Teacher+Hayelegnawu",
      education: "Ph.D. in Educational Leadership",
      experience: "15+ years in education",
      quote: "Education is not just about academics; it's about shaping character and purpose.",
    },
    {
      name: "Mr.Sai Kumar",
      position: "Director of NAVS Global School",
      image: "/placeholder.svg?height=300&width=300&text=Teacher+Akelilu",
      education: "M.Ed. in Educational Administration",
      experience: "12 years in education",
      quote: "We strive to create an environment where every student can thrive.",
    },
    {
      name: "Ms.Guru Nandini",
      position: "Kindergarten Lead",
      image: "/placeholder.svg?height=300&width=300&text=Mrs.+Simerete",
      education: "B.A. in Early Childhood Education",
      experience: "10 years teaching kindergarten",
      quote: "Young minds are like seeds; they need nurturing, care, and the right environment to grow.",
    },
    {
      name: "Mr.Abhilash Reddy",
      position: "Primary School Lead",
      image: "/placeholder.svg?height=300&width=300&text=Mrs.+Bethlehem",
      education: "M.A. in Elementary Education",
      experience: "8 years in primary education",
      quote: "Building strong foundations in these formative years is essential for future success.",
    },
    {
      name: "Mr. Rahul",
      position: "Middle School Lead",
      image: "/placeholder.svg?height=300&width=300&text=Mrs.+Rahel",
      education: "Ph.D. in Curriculum Development",
      experience: "14 years in education",
      quote: "Middle school is a crucial transition period where students discover their unique strengths.",
    },
    {
      name: "Mr.Arjun Reddy",
      position: "High School Lead",
      image: "/placeholder.svg?height=300&width=300&text=Mrs.+Tsion",
      education: "M.Ed. in Secondary Education",
      experience: "16 years in high school education",
      quote: "We prepare our students not just for university, but for life's challenges and opportunities.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"></div>

        {/* Decorative elements */}
        <div className="absolute top-10 md:top-20 left-10 md:left-20 w-32 md:w-64 h-32 md:h-64 bg-gray-500 rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 md:right-20 w-40 md:w-80 h-40 md:h-80 bg-slate-500 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-20 md:top-40 right-20 md:right-40 w-20 md:w-40 h-20 md:h-40 bg-gray-600 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Our Faculty</h1>
            <p className="text-lg md:text-2xl text-gray-300">
              Meet the dedicated educators shaping the future of our students
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Our experienced leadership team guides our school with vision and dedication
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
            {facultyMembers.slice(0, 2).map((member, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                <div className="w-32 md:w-48 h-32 md:h-48 rounded-full overflow-hidden flex-shrink-0 border-4 border-gray-200">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-base md:text-lg font-medium text-gray-600 mb-3">{member.position}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-center md:justify-start text-gray-600 text-sm md:text-base">
                      <GraduationCap className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                      <span>{member.education}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start text-gray-600 text-sm md:text-base">
                      <Award className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                      <span>{member.experience}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 italic text-sm md:text-base">"{member.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Department Leads */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Department Leads</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced educators leading our academic departments
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {facultyMembers.slice(2).map((member, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="h-48 md:h-64 overflow-hidden relative">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 md:p-6 text-white">
                      <h3 className="text-lg md:text-xl font-bold">{member.name}</h3>
                      <p className="text-gray-200 text-sm md:text-base">{member.position}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 bg-white">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-xs md:text-sm">
                      <GraduationCap className="h-3 md:h-4 w-3 md:w-4 mr-2 text-gray-500 flex-shrink-0" />
                      <span>{member.education}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs md:text-sm">
                      <Award className="h-3 md:h-4 w-3 md:w-4 mr-2 text-gray-500 flex-shrink-0" />
                      <span>{member.experience}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm italic">"{member.quote}"</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Stats */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-300 text-sm md:text-base">Expert Teachers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-gray-300 text-sm md:text-base">Advanced Degrees</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">12</div>
              <div className="text-gray-300 text-sm md:text-base">Average Years Experience</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-300 text-sm md:text-base">Committed to Excellence</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
