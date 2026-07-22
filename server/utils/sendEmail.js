const nodemailer = require("nodemailer");

async function sendResetEmail(toEmail, resetLink) {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  
    },
  });


  function sendMail(to, sub,msg) {
    transporter.sendMail({
      to:to,
      subject:sub,
      html:msg
    })
  }
  sendMail(toEmail,
     "Reset your password" ,
    `<div style="font-family: sans-serif;">
        <h2>Reset your password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
      </div>`)
}

module.exports = sendResetEmail;
