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
