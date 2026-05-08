import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {

    const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: `"My Family App Support" <${process.env.EMAIL_USER}>`,
    to,
    // text,
    subject,
    html,
  };

  return await transporter.sendMail(mailOptions);
};