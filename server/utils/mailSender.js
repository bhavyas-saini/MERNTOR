const { Resend } = require("resend")
require("dotenv").config()

const mailSender = async (email, title, body) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    // For Resend free tier, only your verified email can receive emails
    const recipientEmail = process.env.NODE_ENV === "production" ? 
      "bhavyasaini93@gmail.com" : email

    const info = await resend.emails.send({
      from: "noreply@resend.dev",
      to: recipientEmail,
      subject: title,
      html: body,
    })
    
    if (info.error) {
      throw new Error(info.error.message)
    }
    
    console.log("Email sent successfully:", info.data?.id)
    return info
  } catch (error) {
    console.log("Email error:", error.message)
    throw error
  }
}

module.exports = mailSender
