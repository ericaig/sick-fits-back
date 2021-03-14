import { createTransport, getTestMessageUrl } from "nodemailer";

const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// checkout html email templaters

function makeANiceEmail(text: string) {
    return `
    <div style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-style: 20px;
    ">
        <h2>Hello There!</h2>
        <p>${text}</p>
        <p>😊, Eric Aig</p>
    </div>
    `
}

interface MailResponse {
    envelope: { from: string, to: string[] }
    messageId: string
}

export async function sendPasswordResetEmail(resetToken: string, to: string) {
    // email the user a token

    const info = (await transporter.sendMail({
        to,
        from: 'test@example.com',
        subject: "Your password reset token!",
        html: makeANiceEmail(`Your password reset token is here!
        
            <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to reset</a>
        `)
    })) as MailResponse

    if (process.env.MAIL_USER.includes('ethereal.email')) {
        console.log(`📧 Message sent! Preview it at ${getTestMessageUrl(info)}`)
    }
}