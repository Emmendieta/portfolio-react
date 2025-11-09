import { sendEmailHelper } from "../helpers/sendEmailHelper.js";
import { validateRecaptcha } from "../helpers/validateRecaptcha.js";

class EmailController {
    constructor() { };

    sendEmailContactMe = async (req, res) => {
        try {
            const { name, email, message, recaptcha } = req.body;
            if (!name || !email || !message || !recaptcha) { return res.json400("All fields are needed!"); };
            const isHuman = await validateRecaptcha(recaptcha);
            if (!isHuman) { return res.json400("Recaptcha validation failed!"); };
            const result = await sendEmailHelper({
                name,
                email,
                message
            });
            if (!result.success) {
                console.error("Error in sendEmailHelpler: ", result.error);
                return res.json500("Error sending Email!(C)2");
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