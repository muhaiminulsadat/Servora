import {transporter} from "../config/mail.config.ts";
import type {IMailData} from "../controllers/mail.controller.ts";

export const sendMailService = async (mailData: IMailData) => {
  let info = await transporter.sendMail({
    from: mailData.from || process.env.EMAIL_USER,
    to: mailData.to,
    subject: mailData.subject,
    html: mailData.body,
  });
  return info;
};
