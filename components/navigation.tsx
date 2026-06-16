"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    
    // Fetch initial user
    supabase.auth.getUser().then(({ data }: any) => {
      const user = data?.user
      setUser(user)
      if (user) {
        supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single()
          .then(({ data }: any) => {
            setRole(data?.role || null)
          })
      }
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data }: any) => {
            setRole(data?.role || null)
          })
      } else {
        setRole(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Programs", href: "/programs" },
    { name: "Admissions", href: "/admissions" },
    { name: "Pricing", href: "/pricing" },
    { name: "Events", href: "/events" },
    { name: "Faculty", href: "/faculty" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">NAVS</span>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">NAVS Global School</div>
              <div className="text-xs text-amber-600">ERP & LMS Portal</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                <Link href={role ? `/${role}` : "/"}>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-gray-500 hover:text-red-600">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <Link href="/login">
                  <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                    Apply Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-gray-700 hover:text-amber-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {user ? (
                <div className="pt-4 border-t flex flex-col space-y-2">
                  <Link href={role ? `/${role}` : "/"} onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full text-red-600 hover:bg-red-50" onClick={() => { setIsOpen(false); handleSignOut(); }}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t flex flex-col space-y-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-amber-600 text-amber-700">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
