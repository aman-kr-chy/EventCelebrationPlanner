import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Using a test SMTP service or fake one if credentials aren't set
  // To keep it simple and working for the demo, we can just console.log the email
  // if no real SMTP is provided, or use Ethereal Mail.
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_EMAIL || 'ethereal.user@ethereal.email',
      pass: process.env.SMTP_PASSWORD || 'ethereal_password',
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Event Planner'} <${process.env.FROM_EMAIL || 'noreply@eventplanner.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    console.error('Email could not be sent', err);
  }
};

export default sendEmail;
