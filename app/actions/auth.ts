"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function login(state: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Please fill in all fields." }
  }

  let redirectUrl: string | null = null

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()

      const role = profile?.role
      if (role) {
        redirectUrl = `/${role}`
      }
    }
    if (!redirectUrl) {
      redirectUrl = "/"
    }
  } catch (error: any) {
    console.error("Login error:", error)
    return { error: error.message || "Failed to connect to authentication server. Please check your network connection." }
  }

  if (redirectUrl) {
    redirect(redirectUrl)
  }
}

export async function signup(state: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const role = formData.get("role") as string

  if (!email || !password || !name || !role) {
    return { error: "Please fill in all fields." }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const isDemo = !supabaseUrl || supabaseUrl.includes("placeholder-project")

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/callback`,
        data: {
          name,
          role,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    if (isDemo) {
      return { success: "Registration successful! (Demo Mode: Simulated session active. Proceed to login using your email.)" }
    }

    return { success: "Registration successful! Please check your email to verify your account." }
  } catch (error: any) {
    console.error("Signup error:", error)
    return { error: error.message || "Failed to connect to authentication server. Please check your network connection." }
  }
}

export async function logout() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.error("Logout error:", error)
  }
  redirect("/login")
}

export async function forgotPassword(state: any, formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Please enter your email address." }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const isDemo = !supabaseUrl || supabaseUrl.includes("placeholder-project")

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/update-password`,
    })

    if (error) {
      return { error: error.message }
    }

    if (isDemo) {
      return { success: "Password reset link simulated sent! (Demo Mode)" }
    }

    return { success: "Password reset link sent to your email." }
  } catch (error: any) {
    console.error("Forgot password error:", error)
    return { error: error.message || "Failed to connect to authentication server. Please check your network connection." }
  }
}
