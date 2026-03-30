import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const createTransporter = () => {
  if (env.emailProvider === "brevo") {
    return nodemailer.createTransport({
      host: env.brevoHost,
      port: env.brevoPort,
      secure: true,
      auth: {
        user: env.brevoUser,
        pass: env.brevoPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }

  return nodemailer.createTransport({
    host: env.mailtrapHost,
    port: env.mailtrapPort,
    secure: false,
    auth: {
      user: env.mailtrapUser,
      pass: env.mailtrapPass,
    },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: env.mailFrom,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Brevo Error:", error); // This will tell you if it's "Auth Failed" or "Sender Rejected"
    throw error;
  }
};
