"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { MailOpen } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navigation />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-md text-center">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <MailOpen className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-extrabold text-gray-900">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-gray-500">
              We've sent a verification link to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Please click the link in the email to verify your account and gain access to your portal.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center pb-8">
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full border-gray-200">
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
