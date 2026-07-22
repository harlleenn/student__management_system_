const nodemailer = require("nodemailer");

async function sendInviteEmail(toEmail, resetLink) {

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
     "Invitation" ,
    `<div style="font-family: sans-serif;">
        <h2>Link to register</h2>
        <p>Click below to register </p>
        <a href="${resetLink}">Click to register</a>
      </div>`)
}

module.exports = sendInviteEmail;
