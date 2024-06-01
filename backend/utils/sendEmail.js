import nodemailer from "nodemailer";

const sendEmail = async (email, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email: " + error.message);
  }
};

export default sendEmail;
