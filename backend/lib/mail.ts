import 'dotenv/config';
import { createTransport, getTestMessageUrl } from 'nodemailer';

// set up the mail transporter
const transporter = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// create simple email
// this should look better of course
// (): is how you type the return
function makeANiceEmail(text: string): string {
  return `
    <div style="
      border: 1px solid black;
      padding: 20px;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello there!</h2>
      <p>${text}</p>
      <p>Thanks!</p>
    </div>
  `;
}

interface Envolpe {
  from: string;
  to?: string | null;
}

// custom interface for sendMail
interface MailResponse {
  message: string;
  accepted?: string[] | null;
  rejected?: null[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envolpe;
  messageId: string;
}

// ethereal is real nice for testing emails to trap
// takes "resetToken" and "to" and sends the reset email
export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  const info = (await transporter.sendMail({
    to,
    from: 'test@example.com',
    subject: 'Your password reset token!',
    html: makeANiceEmail(`Your password reset token is here!
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click here to reset</a>
    `),
  })) as MailResponse;

  // if the email address was an ethereal one
  // generate the preview link in the console
  if (process.env.MAIL_USER.includes('ethereal.email')) {
    console.log(`Message sent! Preview it at ${getTestMessageUrl(info)}`);
  }
}
