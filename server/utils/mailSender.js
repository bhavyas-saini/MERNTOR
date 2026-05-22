const { Resend } = require("resend")
require("dotenv").config()

const mailSender = async (email, title, body) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const info = await resend.emails.send({
      from: "noreply@merntor.ink",
      to: email,
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
