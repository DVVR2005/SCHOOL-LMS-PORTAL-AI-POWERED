"use client"

import type React from "react"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Connect to your backend here
    console.log("Contact form data:", formData)
    alert("Message sent! We'll get back to you soon.")
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900"></div>

        {/* Decorative elements */}
        <div className="absolute top-10 md:top-20 left-10 md:left-20 w-32 md:w-64 h-32 md:h-64 bg-teal-500 rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 md:right-20 w-40 md:w-80 h-40 md:h-80 bg-cyan-500 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-20 md:top-40 right-20 md:right-40 w-20 md:w-40 h-20 md:h-40 bg-blue-500 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Contact Us</h1>
            <p className="text-lg md:text-2xl text-teal-100">We're here to help with any questions</p>
          </div>
        </div>
      </section>

      {/* Contact Info - Horizontal Cards */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="text-center p-4 md:p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Phone className="h-5 md:h-6 w-5 md:w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Call Us</h3>
                <p className="text-gray-600 text-sm md:text-base">+91 9876543210</p>
                <p className="text-gray-500 text-xs md:text-sm">Mon-Fri, 8am-5pm</p>
              </CardContent>
            </Card>

            <Card className="text-center p-4 md:p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Mail className="h-5 md:h-6 w-5 md:w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Email Us</h3>
                <p className="text-gray-600 text-sm md:text-base">info@NAVSglobalschool.edu</p>
                <p className="text-gray-500 text-xs md:text-sm">24hr response</p>
              </CardContent>
            </Card>

            <Card className="text-center p-4 md:p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <MapPin className="h-5 md:h-6 w-5 md:w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Visit Us</h3>
                <p className="text-gray-600 text-sm md:text-base">Hyderabad,Vishakapatnam</p>
                <p className="text-gray-500 text-xs md:text-sm"></p>
              </CardContent>
            </Card>

            <Card className="text-center p-4 md:p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Clock className="h-5 md:h-6 w-5 md:w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Office Hours</h3>
                <p className="text-gray-600 text-sm md:text-base">Mon-Fri: 8AM-5PM</p>
                <p className="text-gray-500 text-xs md:text-sm">Sat: 9AM-12PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form - Side by Side */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Map */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Find Us</h2>
              <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-lg mb-4 md:mb-6">
                <img
                  src="/NAVS_droneview.png?height=400&width=600&text=School+Location"
                  alt="School Location"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Send Message</h2>
              <Card>
                <CardContent className="p-4 md:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm md:text-base"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm md:text-base"
                        placeholder="Your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm md:text-base"
                      >
                        <option value="">Select subject</option>
                        <option value="admission">Admission Inquiry</option>
                        <option value="tour">Schedule Tour</option>
                        <option value="general">General Question</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm md:text-base"
                        placeholder="Your message"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base"
                    >
                      <Send className="h-4 md:h-5 w-4 md:w-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
