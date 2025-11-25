"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Users, Plane, Bus, Backpack } from "lucide-react"

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("past")

  const pastEvents = [
    {
      title: "Annual Art Exhibition",
      date: "April 25, 2024",
      location: "School Art Gallery",
      description: "Students displayed their creative masterpieces in painting, sculpture, and digital art.",
      image: "/art_2.png?height=200&width=300&text=Art+Exhibition",
    },
    {
      title: "Annual Day Celebrations",
      date: "March 28, 2024",
      location: "School Hall",
      description: "Students and families came together to celebrate school annual day.",
      image: "/annual_day.png?height=200&width=300&text=Easter+Charity",
    },
    {
      title: "Christmas Charity Festival",
      date: "December 20, 2023",
      location: "School Auditorium",
      description:
        "Annual Christmas celebration with performances and charity collection for underprivileged children.",
      image: "/charithy.png?height=200&width=300&text=Christmas+Charity",
    },
    {
      title: "Annual Sports Festival",
      date: "November 15, 2023",
      location: "School Sports Complex",
      description: "Inter-house sports competition featuring athletics, team sports, and individual challenges.",
      image: "/sports_day.png?height=200&width=300&text=Sports+Festival",
    },
  ]

  const trips = [
    {
      title: "Playground Adventure",
      grades: "Kindergarten",
      date: "Monthly",
      description: "Fun outdoor play sessions at the local playground to develop motor skills and social interaction.",
      image: "/play_adventure.png?height=200&width=300&text=Playground+Trip",
      icon: Backpack,
    },
    {
      title: "Pepsi Factory Tour",
      grades: "Grades 1-4",
      date: "October 2024",
      description:
        "Educational visit to learn about manufacturing processes and quality control in beverage production.",
      image: "/pepsi_factory_tour.png?height=200&width=300&text=Pepsi+Factory",
      icon: Bus,
    },
    {
      title: "Ethba Soap Factory",
      grades: "Grades 5-8",
      date: "September 2024",
      description: "Hands-on learning experience about chemical processes and sustainable manufacturing practices.",
      image: "/soap_factory.png?height=200&width=300&text=Soap+Factory",
      icon: Bus,
    },
    {
      title: "Hawassa College Visit",
      grades: "Grades 9-10",
      date: "November 2024",
      description: "University preparation visit to explore higher education opportunities and campus life.",
      image: "/college_visit.png?height=200&width=300&text=Hawassa+College",
      icon: Plane,
    },
    {
      title: "Technology & Innovation Centre",
      grades: "Grades 11-12",
      date: "December 2024",
      description:
        "Advanced technology exploration and innovation workshops for senior students preparing for university.",
      image: "/technology.png?height=200&width=300&text=Tech+Centre",
      icon: Bus,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-800 to-pink-900"></div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 md:w-64 h-32 md:h-64 bg-orange-500 rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-40 md:w-80 h-40 md:h-80 bg-pink-500 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-40 right-40 w-20 md:w-40 h-20 md:h-40 bg-red-500 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Events & Trips</h1>
            <p className="text-lg md:text-2xl text-orange-100">Enriching experiences beyond the classroom</p>
          </div>
        </div>
      </section>

      {/* Events Tabs */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="inline-flex rounded-lg border border-gray-200 p-1 w-full max-w-md md:w-auto">
              <button
                className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "past" ? "bg-orange-600 text-white" : "text-gray-700 hover:text-orange-600"
                }`}
                onClick={() => setActiveTab("past")}
              >
                Past Events
              </button>
              <button
                className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "trips" ? "bg-orange-600 text-white" : "text-gray-700 hover:text-orange-600"
                }`}
                onClick={() => setActiveTab("trips")}
              >
                School Trips
              </button>
            </div>
          </div>

          {/* Past Events */}
          {activeTab === "past" && (
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">Past Events</h2>

              <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                {pastEvents.map((event, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="grid md:grid-cols-2">
                      <div className="h-48 md:h-full">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600 text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-orange-600 flex-shrink-0" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-orange-600 flex-shrink-0" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{event.description}</p>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* School Trips */}
          {activeTab === "trips" && (
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">Educational Trips</h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {trips.map((trip, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-40 md:h-48 overflow-hidden relative">
                      <img
                        src={trip.image || "/placeholder.svg"}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md">
                        <trip.icon className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
                      </div>
                    </div>
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{trip.title}</h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600 text-sm">
                          <Users className="h-4 w-4 mr-2 text-orange-600 flex-shrink-0" />
                          <span>{trip.grades}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-orange-600 flex-shrink-0" />
                          <span>{trip.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{trip.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-orange-50 p-4 md:p-6 rounded-xl border border-orange-200 max-w-4xl mx-auto mt-12">
                <h3 className="text-lg md:text-xl font-bold text-orange-800 mb-3">About Our Educational Trips</h3>
                <p className="text-orange-700 text-sm md:text-base">
                  At NAVS Global School, we believe in learning beyond the classroom. Our carefully planned
                  educational trips provide students with enriching experiences that complement our curriculum. Each
                  grade level participates in age-appropriate trips designed to enhance learning, build community, and
                  create lasting memories.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
