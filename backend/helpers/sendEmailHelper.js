import { createTransport } from "nodemailer";

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
        console.error("Error sending Email: ", error);
        return { success: false, error };
    }
};

export { sendEmailHelper };