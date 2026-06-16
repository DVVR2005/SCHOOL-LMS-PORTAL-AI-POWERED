import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder-project")) {
    return createMockServerClient(cookieStore)
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Can be ignored if middleware handles refreshing user sessions
          }
        },
      },
    }
  )
}

function createMockServerClient(cookieStore: any) {
  return {
    auth: {
      async signUp({ email, password, options }: any) {
        const name = options?.data?.name || "New User"
        const role = options?.data?.role || "student"
        const sessionData = {
          user: {
            id: "mock-user-id-" + Math.random().toString(36).substring(7),
            email,
            user_metadata: { name, role }
          }
        }
        cookieStore.set("mock-session", JSON.stringify(sessionData))
        return { data: sessionData, error: null }
      },
      async signInWithPassword({ email, password }: any) {
        let role = "student"
        let name = "Mock Student"
        const emailLower = email.toLowerCase()
        if (emailLower.startsWith("admin")) {
          role = "admin"
          name = "Mock Administrator"
        } else if (emailLower.startsWith("teacher")) {
          role = "teacher"
          name = "Mock Teacher"
        } else if (emailLower.startsWith("parent")) {
          role = "parent"
          name = "Mock Parent"
        }

        const sessionData = {
          user: {
            id: `mock-user-id-${role}`,
            email,
            user_metadata: { name, role }
          }
        }
        cookieStore.set("mock-session", JSON.stringify(sessionData))
        return { data: sessionData, error: null }
      },
      async getUser() {
        const mockSession = cookieStore.get("mock-session")?.value
        if (mockSession) {
          try {
            const parsed = JSON.parse(mockSession)
            return { data: { user: parsed.user }, error: null }
          } catch {
            return { data: { user: null }, error: null }
          }
        }
        return { data: { user: null }, error: null }
      },
      async signOut() {
        cookieStore.delete("mock-session")
        return { error: null }
      }
    },
    from(table: string) {
      return createMockQueryBuilder(table)
    }
  } as any
}

export function createMockQueryBuilder(table: string) {
  const builder: any = {
    select(columns?: string) {
      return builder
    },
    eq(column: string, value: any) {
      return builder
    },
    single() {
      let mockData: any = null
      if (table === "users") {
        mockData = { role: "admin", name: "Mock Admin" }
      } else if (table === "teachers") {
        mockData = { id: "mock-teacher-id" }
      } else if (table === "students") {
        mockData = { id: "mock-student-id", admission_number: "ADM-2026-0001", users: { name: "Mock Student" } }
      }
      return Promise.resolve({ data: mockData, error: null })
    },
    order(column: string, options?: any) {
      return builder
    },
    insert(values: any[]) {
      return Promise.resolve({ data: values, error: null })
    },
    update(values: any) {
      return builder
    },
    delete() {
      return builder
    },
    then(onfulfilled: any) {
      let data: any[] = []
      if (table === "classes") {
        data = [
          { id: "c1", name: "Grade 10", section: "A", teacher_id: "mock-teacher-id" },
          { id: "c2", name: "Grade 9", section: "B", teacher_id: "mock-teacher-id" }
        ]
      } else if (table === "students") {
        data = [
          { id: "s1", user_id: "u1", admission_number: "ADM-2026-0001", users: { name: "Abigail Johnson", email: "abigail@school.com" }, classes: { name: "Grade 10", section: "A" } },
          { id: "s2", user_id: "u2", admission_number: "ADM-2026-0002", users: { name: "Benjamin Carter", email: "benjamin@school.com" }, classes: { name: "Grade 10", section: "A" } },
          { id: "s3", user_id: "u3", admission_number: "ADM-2026-0003", users: { name: "Chloe Williams", email: "chloe@school.com" }, classes: { name: "Grade 9", section: "B" } }
        ]
      } else if (table === "teachers") {
        data = [
          { id: "t1", user_id: "u_t1", department: "Science", qualification: "Ph.D. Physics", joining_date: "2024-09-01", users: { name: "Dr. Evelyn Vance", email: "evelyn@school.com" } },
          { id: "t2", user_id: "u_t2", department: "Mathematics", qualification: "M.Sc. Algebra", joining_date: "2025-01-15", users: { name: "Marcus Brody", email: "marcus@school.com" } }
        ]
      } else if (table === "subjects") {
        data = [
          { id: "sub1", name: "Physics", class_id: "c1", teacher_id: "t1", classes: { name: "Grade 10" } },
          { id: "sub2", name: "Algebra", class_id: "c2", teacher_id: "t2", classes: { name: "Grade 9" } }
        ]
      } else if (table === "assignments") {
        data = [
          { id: "a1", title: "Physics Homework 1", class_id: "c1", due_date: "2026-06-30T12:00:00Z", classes: { name: "Grade 10" } },
          { id: "a2", title: "Math Quiz Prep", class_id: "c2", due_date: "2026-07-05T12:00:00Z", classes: { name: "Grade 9" } }
        ]
      } else if (table === "submissions") {
        data = [
          { id: "sub1", assignment_id: "a1", student_id: "s1", submitted_at: new Date().toISOString(), file_url: "#", grade: "A", students: { users: { name: "Abigail Johnson" } } }
        ]
      } else if (table === "exams") {
        data = [
          { id: "ex1", title: "Science Quiz 1", class_id: "c1", exam_date: "2026-06-25", duration_minutes: 30, classes: { name: "Grade 10" } }
        ]
      } else if (table === "results") {
        data = [
          { id: "r1", exam_id: "ex1", student_id: "s1", marks: 95, grade: "A", students: { name: "Abigail Johnson", admission_number: "ADM-2026-0001", users: { name: "Abigail Johnson" } } }
        ]
      }
      return Promise.resolve(onfulfilled({ data, error: null }))
    }
  }
  return builder
}
