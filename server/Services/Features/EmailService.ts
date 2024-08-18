import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { BusinessError } from "../Exceptions/BusinessErrors";
import { HttpStatusCode } from "../Constants/HttpStatusCodes";

dotenv.config();

export async function sendEmail(email: string, content: string): Promise<void> {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  if (content === undefined || content === null || content === "") {
    throw new BusinessError("Content is required", HttpStatusCode.BAD_REQUEST);
  }

  const message = {
    to: email,
    from: process.env.SENDGRID_EMITTER_EMAIL!,
    subject: "BookReviewer: " + email,
    html: `<p>${content}</p>`,
  };

  await sgMail.send(message);
}

export async function sendPasswordRecoveryEmail(
  email: string,
  token: string
): Promise<void> {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  const recoverLink = `http://localhost:5173/#reset-password/?token=${token}`;

  const message = {
    to: email,
    from: process.env.SENDGRID_EMITTER_EMAIL!,
    subject: "BookReviewer: Password Recovery",
    html: `
      <p>Hello,</p>
      <p>You have requested to recover your password for your BookReviewer account. Click the button below to reset your password:</p>
      <p><a href="${recoverLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">Reset Password</a></p>
      <p>If you did not request this password reset, please ignore this email.</p>
      <p>Thank you,<br/>The BookReviewer Team</p>
    `,
  };

  await sgMail.send(message);
}
