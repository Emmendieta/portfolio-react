/* import { createTransport } from "nodemailer";

const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    //VVER SI NECESITO LO DE AUTH:
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASSWORD
    }
});

const sendEmailHelper = async ({ fromName, fromEmail, message }) => {
    try {
        console.log("Email:", process.env.GOOGLE_EMAIL);
        console.log("Password:", process.env.GOOGLE_PASSWORD ? "Existe" : "No existe");
        console.log("Transport:", transport);
        await transport.sendMail({
            from: `"${fromName}" <${fromEmail}>`, //Sender
            to: process.env.GOOGLE_EMAIL, //reciber
            subject: `New Message from ${fromName}`,
            html: `
                <h2>New Messafe from Portfolio</h2>
                <p><strong>Name:</strong> ${fromName}</p>
                <p><strong>Email:</strong> ${fromEmail}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });
        return { success: true };
    } catch (error) {
        //LOGGER:
        console.error("Error sending Email: ", error || error.response);
        return { success: false, error: error || error.response };
    }
};

export { sendEmailHelper }; */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailHelper = async ({ name, email, message }) => {
    try {
        console.log("Sending email with Resend...");
        const { data, error } = await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev>",
            to: ["emmendieta12@gmail.com"],
            subject: `Mensaje de ${name} - Portfolio`,
            html: `
                <h3>Nuevo mensaje de tu portfolio</h3>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${message}</p>
            `,
            text: `NUEVO MENSAJE DE TU PORTFOLIO\n\nNombre: ${name}\n\nEmail: ${email}\n\nMensaje:\n\n${message}`
        });

        if (error) {
            console.error("❌ Error enviando email con Resend:", error);
            return { success: false, error };
        }

        console.log("✅ Email enviado con Resend:", data);
        return { success: true, data }; // 👈 importante: success = true

    } catch (err) {
        console.error("Error in sendEmailHelpler:", err);
        return { success: false, error: err };
    }
};
