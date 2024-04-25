import nodemailer from "nodemailer";
import { DEBUG } from "../../core/errors";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const isValidEmail = (email: string): boolean => {
    return emailRegex.test(email);
}

const isValidSubject = (subject: string): boolean => {
  return subject.length >= 5 && subject.length <= 100;
}

const isValidText = (text: string): boolean => {
  return text.length >= 3 && text.length <= 10000;
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  cc?: string;
  bcc?: string;
  sender?: string;
  replyTo?: string;
  inReplyTo?: string;
}

const sendMail = async(options: MailOptions): Promise<any> => {
  const type = process.env.EMAIL_SERVER_TYPE;
  if(process.env.EMAIL_SERVER_TYPE === undefined) {
    DEBUG.log("EMAIL_SERVER_TYPE has not been set in environment");
    return;
  }
  if(type === "service") {
    ServiceSendMail(options);
  } else if(type === "smtp") {
    SMTPSendMail(options);
  }
}

const ServiceSendMail = async (options: MailOptions): Promise<any> => {
  if(!options.to.trim()) throw new Error('Email address is required');
  if(!options.subject.trim()) throw new Error('Subject is required');
  if(!options.text.trim()) throw new Error('Text is required');
  if(!isValidEmail(options.to)) {
    throw new Error(`An error occurred while sending email: invalid email address.`);
  }
  if(!isValidSubject(options.subject)) {
    throw new Error(`Subject is too short or long for email.`);
  }
  if(!isValidText(options.text)) {
    throw new Error(`Text is too short or long for email.`);
  }
  let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  try {
    let info = transporter.sendMail(options);
    return info;
  } catch (error) {
    throw new Error("Failed to send email.");
  }
};

const SMTPSendMail = async (options: MailOptions): Promise<any> => {
  if(!options.to.trim()) throw new Error('Email address is required');
  if(!options.subject.trim()) throw new Error('Subject is required');
  if(!options.text.trim()) throw new Error('Text is required');
  if(!isValidEmail(options.to)) {
    throw new Error(`An error occurred while sending email: invalid email address.`);
  }
  if(!isValidSubject(options.subject)) {
    throw new Error(`Subject is too short or long for email.`);
  }
  if(!isValidText(options.text)) {
    throw new Error(`Text is too short or long for email.`);
  }
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER || 'mail.shellit.org',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    let info = await transporter.sendMail(options);
    return info;
  } catch (err) { 
    throw new Error("Failed to send email.");
  }
}

export default { 
  sendMail,
  ServiceSendMail, 
  SMTPSendMail 
};