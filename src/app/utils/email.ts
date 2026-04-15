import nodemailer from "nodemailer";
import { envVariables } from "../../config/env";
import path from "node:path";
import AppErrors from "../errorHandler/AppErrors";
import status from "http-status";
import ejs from "ejs";

const isSecure = Number(envVariables.SMTP_PORT) === 465;

const transporter = nodemailer.createTransport({
  host: envVariables.SMTP_HOST,
  port: Number(envVariables.SMTP_PORT || "465"),
  secure: true,                   
  auth: {
    user: envVariables.EMAIL_USER,
    pass: envVariables.EMAIL_PASS, 
  },
  tls: {
    rejectUnauthorized: false,
  },

  connectionTimeout: 15000,  
  greetingTimeout: 15000,
  socketTimeout: 20000,
  debug: true,               
  logger: true,
});

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`,
    );

    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: envVariables.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType,
      })),
    });
    console.log("Email sent: ", info.messageId);
  } catch (error: any) {
  console.error("=== EMAIL SEND FAILED ===");
  console.error("Error Code:", error.code);
  console.error("Command:", error.command);
  console.error("Message:", error.message);
  console.error("Full Error:", JSON.stringify(error, null, 2));
    console.error("Error sending email:", error);
    throw new AppErrors(status.INSUFFICIENT_STORAGE, "Failed to send email");
  }
};
