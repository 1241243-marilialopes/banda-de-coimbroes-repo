import nodemailer from 'nodemailer';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER || 'sociedademusical1agosto@gmail.com',
    pass: process.env.SMTP_PASS || 'zvqn ojbm sjdb xklx',
  },
});

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  const logoPath = path.join(process.cwd(), 'logoc.png');

  return transporter.sendMail({
    from: process.env.SMTP_FROM || '"Sociedade Musical 1º de Agosto" <sociedademusical1agosto@gmail.com>',
    to,
    subject,
    html,
    attachments: [
      {
        filename: 'logoc.png',
        path: logoPath,
        cid: 'logo',
      },
    ],
  });
}

