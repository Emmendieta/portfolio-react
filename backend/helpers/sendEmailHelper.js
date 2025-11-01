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
        const response = await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev>", // podés cambiarlo luego por tu dominio verificado
            to: "emmendieta12@gmail.com", // tu correo destino
            subject: `Mensaje de ${name} - Portfolio`,
            html: `
                <h3>Nuevo mensaje de tu portfolio</h3>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${message}</p>
            `,
        });

        console.log("✅ Email enviado con Resend:", response);
        return response;
    } catch (error) {
        console.error("❌ Error enviando con Resend:", error);
        throw new Error("Error sending Email");
    }
};
