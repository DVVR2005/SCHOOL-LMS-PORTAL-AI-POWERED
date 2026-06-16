import { NextResponse } from "next/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Payment callback received:", body)

    if (body.status === "success" && body.tx_ref) {
      const tx_ref = body.tx_ref

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const isDemo = !supabaseUrl || supabaseUrl.includes("placeholder-project")

      if (isDemo) {
        console.log("Demo Mode Active: Simulating successful callback update")
        return NextResponse.json({ success: true })
      }

      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createSupabaseClient(
        supabaseUrl!,
        serviceKey
      )

      if (tx_ref.startsWith("NAVS_FEE_")) {
        const parts = tx_ref.split("_")
        const invoiceId = parts[2] // NAVS_FEE_[invoiceId]_[nanoid]

        const { error } = await supabase
          .from("fees")
          .update({
            status: "paid",
            tx_ref,
            paid_at: new Date().toISOString()
          })
          .eq("id", invoiceId)

        if (error) {
          console.error("Database update error on payment callback:", error)
          return NextResponse.json({ success: false, message: error.message }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Payment callback error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
