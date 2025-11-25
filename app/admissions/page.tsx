import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Star, ArrowRight, Users, Award, Sparkles } from "lucide-react"
import Link from "next/link"

export default function AdmissionsPage() {
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
        <div
          className="absolute top-20 md:top-40 right-20 md:right-40 w-20 md:w-40 h-20 md:h-40 bg-pink-500 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Transform Your Child's Future</h1>
            <p className="text-lg md:text-2xl text-purple-100 mb-8 md:mb-10">
              Limited spots available for the upcoming academic year
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button className="bg-white text-purple-700 hover:bg-gray-100 px-6 md:px-8 py-3 md:py-4 text-lg md:text-xl rounded-xl font-bold w-full sm:w-auto">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-6 md:px-8 py-3 md:py-4 text-lg md:text-xl rounded-xl w-full sm:w-auto"
                >
                  Schedule a Tour
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Compelling Benefits */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Parents Choose NAVS</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Join the hundreds of families who've discovered the NAVS difference
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 md:w-16 h-12 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <Award className="h-6 md:h-8 w-6 md:w-8 text-purple-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">98% University Acceptance</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Our graduates are accepted into top universities worldwide, with many receiving scholarships and
                  honors.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 md:w-16 h-12 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <Users className="h-6 md:h-8 w-6 md:w-8 text-blue-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Character Development</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Parents consistently report remarkable growth in their children's confidence, leadership, and moral
                  character.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 md:w-16 h-12 md:h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <Sparkles className="h-6 md:h-8 w-6 md:w-8 text-pink-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Lifelong Advantage</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  An NAVS education is an investment that pays dividends throughout your child's life and career.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials - Social Proof */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Families Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {[
              {
                quote:
                  "Enrolling our daughter at NAVS was the best decision we ever made for her education. The transformation in her confidence and academic abilities has been remarkable.",
                author: " Maheshbabu G., Parent of 8th Grader",
                stars: 5,
              },
              {
                quote:
                  "The teachers at NAVS don't just teach subjects; they mentor students and inspire excellence. My son was accepted to his dream university with a scholarship.",
                author: "Ravi T., Parent of Graduate",
                stars: 5,
              },
              {
                quote:
                  "The values-based education at NAVS has shaped our children into compassionate, responsible young adults. Worth every penny of the investment.",
                author: "Sarah and Arjun , Parents",
                stars: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <Star key={i} className="h-4 md:h-5 w-4 md:w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4 md:mb-6 text-sm md:text-base">"{testimonial.quote}"</p>
                  <div className="font-bold text-gray-900 text-sm md:text-base">{testimonial.author}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process - Simple Steps */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple Application Process</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              We've streamlined our admissions process to make it easy for busy parents
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { step: 1, title: "Apply Online", desc: "Takes just 30 seconds", icon: CheckCircle, color: "purple" },
                { step: 2, title: "Campus Visit", desc: "See our facilities", icon: Users, color: "blue" },
                { step: 3, title: "Assessment", desc: "Brief student evaluation", icon: Award, color: "green" },
                { step: 4, title: "Decision", desc: "Within 48 hours", icon: Clock, color: "pink" },
              ].map((item, index) => (
                <Card
                  key={index}
                  className={`border-l-4 border-${item.color}-500 shadow-md hover:shadow-lg transition-shadow`}
                >
                  <CardContent className="p-4 md:p-6">
                    <div
                      className={`w-8 md:w-10 h-8 md:h-10 bg-${item.color}-100 rounded-full flex items-center justify-center mb-3 md:mb-4`}
                    >
                      <span className={`font-bold text-${item.color}-600 text-sm md:text-base`}>{item.step}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-xs md:text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Limited Spaces Available</h2>
          <p className="text-lg md:text-xl text-purple-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Due to high demand, we have limited spots remaining for the upcoming academic year. Secure your child's
            place today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button className="bg-white text-purple-700 hover:bg-gray-100 px-6 md:px-8 py-3 text-base md:text-lg rounded-lg font-semibold w-full sm:w-auto">
                Apply Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-6 md:px-8 py-3 text-base md:text-lg rounded-lg w-full sm:w-auto"
              >
                Request Information
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
