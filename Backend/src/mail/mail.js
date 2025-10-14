import nodemailer from "nodemailer";

const sendVerificationMail = async (userEmail, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === "true", // ✅ ensure boolean
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const verificationUrl = `${process.env.BASE_URL}/api/v1/users/verify/${token}`;

        const mailOptions = {
            from: `"Email Verification | Ashfaq Akhtar" <${process.env.SENDER_EMAIL}>`,
            to: userEmail,
            subject: "Verify your email - Mindclaire",
            text: `Thank you for registering! Please verify your account using the link: ${verificationUrl}. This link expires in 10 minutes.`,
            html: `
        <p>Hello,</p>
        <p>Thank you for registering with Mindclaire.</p>
        <p>Please verify your email by clicking the link below. This link will expire in 10 minutes:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>If you did not request this, you can safely ignore this email.</p>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Verification email sent to: ${userEmail}`);
        return true;
    } catch (error) {
        console.error("❌ Error sending verification email:", error.message);
        return false;
    }
};

export default sendVerificationMail;
