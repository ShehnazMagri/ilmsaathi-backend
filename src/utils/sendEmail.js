import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const message = {
    from: `${process.env.FROM_NAME || 'School ERP'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>${options.subject}</h2>
      <p>${options.message.replace(/\n/g, '<br>')}</p>
    </div>`
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('[Nodemailer] Email sent successfully: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('[Nodemailer Error] Could not send email:', error.message);
    throw error;
  }
};
