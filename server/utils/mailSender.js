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
    
    // Check if response has error
    if (info && info.error) {
      const errorMsg = typeof info.error === 'string' ? info.error : (info.error.message || JSON.stringify(info.error))
      console.log("Resend API error:", errorMsg)
      return { success: false, error: errorMsg }
    }
    
    console.log("Email sent successfully:", info?.id)
    return { success: true, data: info }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.log("MailSender error:", errorMsg)
    throw new Error(errorMsg)
  }
}

module.exports = mailSender
