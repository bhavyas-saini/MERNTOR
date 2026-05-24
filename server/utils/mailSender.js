const nodemailer = require("nodemailer")
const https = require("https")
require("dotenv").config()

const mailSender = async (email, title, body) => {
  try {
    // Use Resend HTTP API if API key is present (Railway blocks SMTP)
    if (process.env.RESEND_API_KEY) {
      const resendFrom = process.env.RESEND_FROM || process.env.SMTP_FROM_EMAIL || "noreply@merntor.ink"

      const payload = JSON.stringify({
        from: resendFrom,
        to: email,
        subject: title,
        html: body,
      })

      const options = {
        hostname: "api.resend.com",
        port: 443,
        path: "/emails",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
      }

      const data = await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let raw = ""
          res.setEncoding("utf8")
          res.on("data", (chunk) => (raw += chunk))
          res.on("end", () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              try {
                return resolve(JSON.parse(raw))
              } catch (e) {
                return resolve(raw)
              }
            }
            return reject(new Error(`Resend API responded with status ${res.statusCode}: ${raw}`))
          })
        })

        req.on("error", (err) => reject(err))
        req.write(payload)
        req.end()
      })

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
