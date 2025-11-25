import { NextResponse } from "next/server"
import { nanoid } from "nanoid"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Payment request received:", body)

    // Validate environment variables
    if (!process.env.CHAPA_SECRET_KEY) {
      console.error("CHAPA_SECRET_KEY environment variable is not set")
      return NextResponse.json(
        {
          success: false,
          message: "Payment service configuration error. Please contact support.",
        },
        { status: 500 },
      )
    }

    const tx_ref = "NAVS_" + nanoid()

    const chapaPayload = {
      amount: "15000", // Registration fee in Rupees
      currency: "Rupees",
      email: body.email,
      first_name: body.student_name || body.name,
      phone_number: body.phone,
      tx_ref,
      return_url: `https://v0-navsschoolwebsite.vercel.app/register-success?student_name=${encodeURIComponent(body.student_name || "")}&grade=${encodeURIComponent(body.grade || "")}&parent_name=${encodeURIComponent(body.parent_name || "")}&email=${encodeURIComponent(body.email || "")}&phone=${encodeURIComponent(body.phone || "")}&message=${encodeURIComponent(body.message || "")}&tx_ref=${tx_ref}`,
      callback_url: `https://v0-navsschoolwebsite.vercel.app/api/payment-callback`,
      customization: {
        title: "NAVS Registration", // Fixed: 16 characters exactly
        description: "Secure your seat at NAVS", // Fixed: Only allowed characters
        logo: "https://v0-navsschoolwebsite.vercel.app/logo.png",
      },
      metadata: {
        student_name: body.student_name,
        grade: body.grade,
        parent_name: body.parent_name,
        email: body.email,
        phone: body.phone,
        message: body.message,
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
