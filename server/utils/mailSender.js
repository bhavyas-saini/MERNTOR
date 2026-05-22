const { Resend } = require("resend")
require("dotenv").config()

const mailSender = async (email, title, body) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const info = await resend.emails.send({
      from: "noreply@resend.dev",
      to: email,
      subject: title,
      html: body,
    })
    console.log("Email sent successfully:", info.id)
    return info
  } catch (error) {
    console.log(error.message)
    throw error
  }
}

module.exports = mailSender
