import { sendEmailHelper } from "../helpers/sendEmailHelper.js";
import { validateRecaptcha } from "../helpers/validateRecaptcha.js";

class EmailController {
    constructor() { };

    sendEmailContactMe = async (req, res) => {
        try {
            const { name, email, message, recaptcha } = req.body;
            if (!name || !email || !message || !recaptcha) { return res.json400("All fields are needed!"); };
            console.log("Body recibido:", req.body);
            console.log("Clave secreta:", process.env.RECAPTCHA_SECRET_KEY ? "OK" : "Falta");
            const isHuman = await validateRecaptcha(recaptcha);
            if (!isHuman) { return res.json400("Recaptcha validation failed!"); };
            const result = await sendEmailHelper({
                fromName: name,
                fromEmail: email,
                message
            });
            if (!result.success) {
                console.error("Error in sendEmailHelpler: ", result.error);
                return res.json500("Error sending Email!");
            };

            return res.json201("Message sent!");
        } catch (error) {
            console.error("Error in sending Emial!(C)", error);
            res.json500("Error sending Email");
        }
    };
};

const emailController = new EmailController();

export default emailController;