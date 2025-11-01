import emailController from "../../controllers/email.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

class EmailRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.create("/contact", ["public"], emailController.sendEmailContactMe);
    };
};

const emailRouter = (new EmailRouter()).getRouter();

export default emailRouter;