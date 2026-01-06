import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

/**
 * Create Mailgen instance once
 */
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Project Management",
    link: "https://projectmanagelink.com",
  },
});

/**
 * Create Nodemailer transporter once (connection reuse)
 */
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST,
    port: Number(process.env.MAILTRAP_SMTP_PORT),
    secure: false,
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS,
  },
});

/**
 * Send email utility
 */
const sendEmail = async (options) => {
  const { email, subject, mailGenContent } = options;

  if (!email || !subject || !mailGenContent) {
    throw new Error("Missing required email options");
  }

  const emailTextual = mailGenerator.generatePlaintext(mailGenContent);
  const emailHtml = mailGenerator.generate(mailGenContent);

  const mail = {
    from: process.env.MAILTRAP_SMTP_USER,
    to: email,
    subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

/**
 * Email verification template
 */
const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our platform! We're very excited to have you on board.",
      action: {
        instructions: "To verify your email, please click the button below:",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro: "Need help, or have questions? Just reply to this email—we’d love to help.",
    },
  };
};

/**
 * Forgot password template
 */
const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro:
        "We received a request to reset your password. Use the button below to proceed.",
      action: {
        instructions: "To reset your password, please click the button below:",
        button: {
          color: "#22BC66",
          text: "Reset your password",
          link: passwordResetUrl,
        },
      },
      outro:
        "If you did not request a password reset, you can safely ignore this email.",
    },
  };
};

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};
