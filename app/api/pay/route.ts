import { NextResponse } from "next/server"
import { nanoid } from "nanoid"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Payment request received:", body)

    const chapaKey = process.env.CHAPA_SECRET_KEY
    const isDemo = !chapaKey || chapaKey.includes("your-chapa-secret-key") || chapaKey === ""

    const isInvoice = !!body.invoiceId
    const amount = isInvoice ? String(body.amount) : "15000"
    const tx_ref = isInvoice ? `NAVS_FEE_${body.invoiceId}_${nanoid()}` : "NAVS_" + nanoid()
    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    if (isDemo) {
      console.log("Demo Mode Active: Simulating payment success")
      return NextResponse.json({
        success: true,
        url: isInvoice 
          ? `${appUrl}/${body.role || "student"}/fees?payment_success=true&invoice_id=${body.invoiceId}&tx_ref=${tx_ref}`
          : `${appUrl}/register-success?student_name=${encodeURIComponent(body.student_name || "")}&grade=${encodeURIComponent(body.grade || "")}&parent_name=${encodeURIComponent(body.parent_name || "")}&email=${encodeURIComponent(body.email || "")}&phone=${encodeURIComponent(body.phone || "")}&message=${encodeURIComponent(body.message || "")}&tx_ref=${tx_ref}`,
        tx_ref,
      })
    }

    const chapaPayload = {
      amount,
      currency: "INR",
      email: body.email,
      first_name: body.student_name || body.name,
      phone_number: body.phone,
      tx_ref,
      return_url: isInvoice 
        ? `${appUrl}/${body.role || "student"}/fees?payment_success=true&invoice_id=${body.invoiceId}&tx_ref=${tx_ref}`
        : `${appUrl}/register-success?student_name=${encodeURIComponent(body.student_name || "")}&grade=${encodeURIComponent(body.grade || "")}&parent_name=${encodeURIComponent(body.parent_name || "")}&email=${encodeURIComponent(body.email || "")}&phone=${encodeURIComponent(body.phone || "")}&message=${encodeURIComponent(body.message || "")}&tx_ref=${tx_ref}`,
      callback_url: `${appUrl}/api/payment-callback`,
      customization: {
        title: isInvoice ? "NAVS Tuition Fee" : "NAVS Registration",
        description: isInvoice ? `Clearance for Invoice #${body.invoiceId}` : "Secure your seat at NAVS",
        logo: `${appUrl}/logo.png`,
      },
      metadata: {
        student_name: body.student_name || body.name,
        email: body.email,
        phone: body.phone,
        invoice_id: body.invoiceId || null,
        is_invoice: isInvoice,
      },
    }

    console.log("Sending to Chapa:", JSON.stringify(chapaPayload, null, 2))

    const chapaRes = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chapaPayload),
    })

    const responseText = await chapaRes.text()
    console.log("Chapa raw response:", responseText)
    console.log("Chapa response status:", chapaRes.status)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse Chapa response:", parseError)
      return NextResponse.json(
        {
          success: false,
          message: "Invalid response from payment service",
        },
        { status: 500 },
      )
    }

    console.log("Chapa parsed response:", JSON.stringify(data, null, 2))

    // Handle different response formats from Chapa
    if (data.status === "success" && data.data?.checkout_url) {
      return NextResponse.json({
        success: true,
        url: data.data.checkout_url,
        tx_ref,
      })
    } else if (data.status === "failed" || data.status === "error") {
      console.error("Chapa API error:", JSON.stringify(data, null, 2))

      // Extract meaningful error message from Chapa response
      let errorMessage = "Payment initialization failed"

      if (data.message && typeof data.message === "string") {
        errorMessage = data.message
      } else if (data.message && typeof data.message === "object") {
        // Handle validation errors from Chapa
        const errors = []
        for (const [field, messages] of Object.entries(data.message)) {
          if (Array.isArray(messages)) {
            errors.push(...messages)
          } else {
            errors.push(String(messages))
          }
        }
        errorMessage = errors.length > 0 ? errors.join(". ") : "Payment validation failed"
      }

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 400 },
      )
    } else if (!chapaRes.ok) {
      console.error("Chapa HTTP error:", chapaRes.status, JSON.stringify(data, null, 2))
      return NextResponse.json(
        {
          success: false,
          message: data.message || `Payment service error (${chapaRes.status})`,
        },
        { status: chapaRes.status },
      )
    } else {
      console.error("Unexpected Chapa response:", JSON.stringify(data, null, 2))
      return NextResponse.json(
        {
          success: false,
          message: "Unexpected response from payment service",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Payment API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 },
    )
  }
}
