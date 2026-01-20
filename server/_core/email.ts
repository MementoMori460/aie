
import nodemailer from 'nodemailer';
import { getSystemSettings } from '../db';

interface MailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: MailOptions) {
    try {
        // 1. Fetch settings from DB
        const settings = await getSystemSettings();
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        // 2. data validation
        const host = settingsMap['SMTP_HOST'];
        const port = parseInt(settingsMap['SMTP_PORT'] || '587');
        const user = settingsMap['SMTP_USER'];
        const pass = settingsMap['SMTP_PASS'];
        const secure = settingsMap['SMTP_SECURE'] === 'true'; // usually false for 587
        const from = settingsMap['SMTP_FROM'] || '"Academic Impact Evaluator" <noreply@example.com>';

        if (!host || !user || !pass) {
            console.warn("SMTP settings are missing. Email not sent.");
            return { success: false, error: "SMTP settings missing" };
        }

        // 3. Create transporter
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // 4. Send email
        const info = await transporter.sendMail({
            from,
            to,
            subject,
            html,
        });

        console.log("Email sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error: (error as Error).message };
    }
}
