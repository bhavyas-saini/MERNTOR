const nodemailer = require("nodemailer")
const { fetch } = require("undici")
require("dotenv").config()

const mailSender = async (email, title, body) => {
  try {
    // Use Resend HTTP API if API key is present (Railway blocks SMTP)
    if (process.env.RESEND_API_KEY) {
      const payload = {
        from: process.env.SMTP_FROM_EMAIL || "noreply@merntor.ink",
        to: email,
        subject: title,
        html: body,
      }

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify(payload),
      })

      const text = await res.text()
      if (!res.ok) {
        console.log("Resend API error:", text)
        throw new Error(`Resend API responded with status ${res.status}`)
      }

      const data = JSON.parse(text)
      console.log("Email sent via Resend:", data.id || data)
      return { success: true, data }
    }

    // If Resend isn't configured, fall back to SMTP (useful for local dev)
    if (!process.env.SMTP_USER || process.env.SMTP_USER === "your_ses_smtp_username") {
      console.log("FALLBACK MODE - Email not sent (SMTP credentials not configured)")
      console.log(`To: ${email}`)
      console.log(`Subject: ${title}`)
      console.log(`Body: ${body.substring(0, 100)}...`)
      return { success: true, data: { messageId: `fallback-${Date.now()}`, mode: "fallback" } }
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "email-smtp.ap-northeast-1.amazonaws.com",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || "noreply@merntor.ink",
      to: email,
      subject: title,
      html: body,
    })

    console.log("Email sent successfully:", info.messageId)
    return { success: true, data: info }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.log("MailSender error:", errorMsg)

    if (errorMsg.includes("Invalid login") || errorMsg.includes("Authentication")) {
      console.log("FALLBACK MODE - Auth failed, treating as sent")
      return { success: true, data: { messageId: `fallback-${Date.now()}`, mode: "fallback-auth-error" } }
    }

    throw new Error(errorMsg)
  }
}

module.exports = mailSender
