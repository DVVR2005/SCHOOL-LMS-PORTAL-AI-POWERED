import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let user: any = null
  let role: string | null = null

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder-project")) {
    const mockSession = request.cookies.get("mock-session")?.value
    if (mockSession) {
      try {
        const parsed = JSON.parse(decodeURIComponent(mockSession))
        user = parsed.user
        role = user?.user_metadata?.role || "student"
      } catch {}
    }
  } else {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()
    user = supabaseUser

    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()

      role = profile?.role
    }
  }

  const path = request.nextUrl.pathname

  const isAuthPage =
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/verify-email")

  const isDashboardPage =
    path.startsWith("/admin") ||
    path.startsWith("/teacher") ||
    path.startsWith("/student") ||
    path.startsWith("/parent")

  if (!user && isDashboardPage) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (user) {
    if (isAuthPage) {
      const url = request.nextUrl.clone()
      url.pathname = role ? `/${role}` : "/"
      return NextResponse.redirect(url)
    }

    // RBAC validation
    if (path.startsWith("/admin") && role !== "admin") {
      const url = request.nextUrl.clone()
      url.pathname = role ? `/${role}` : "/"
      return NextResponse.redirect(url)
    }
    if (path.startsWith("/teacher") && role !== "teacher") {
      const url = request.nextUrl.clone()
      url.pathname = role ? `/${role}` : "/"
      return NextResponse.redirect(url)
    }
    if (path.startsWith("/student") && role !== "student") {
      const url = request.nextUrl.clone()
      url.pathname = role ? `/${role}` : "/"
      return NextResponse.redirect(url)
    }
    if (path.startsWith("/parent") && role !== "parent") {
      const url = request.nextUrl.clone()
      url.pathname = role ? `/${role}` : "/"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
