const { Resend } = require("resend")
require("dotenv").config()

const mailSender = async (email, title, body) => {
  try {
    // Initialize Resend with API key
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Send email
    const response = await resend.emails.send({
      from: "noreply@merntor.ink",
      to: email,
      subject: title,
      html: body,
    })

    // Check for errors in response
    if (response.error) {
      const errorMsg = response.error.message || JSON.stringify(response.error)
      console.log("Resend API error:", errorMsg)
      throw new Error(errorMsg)
    }

    console.log("Email sent successfully:", response.data?.id)
    return { success: true, data: response.data }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.log("MailSender error:", errorMsg)
    throw new Error(errorMsg)
  }
}

module.exports = mailSender
