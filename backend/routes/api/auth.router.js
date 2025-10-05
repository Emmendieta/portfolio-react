import authController from "../../controllers/auth.controller.js";
import RouterHelper from "../../helpers/router.helper.js";
import passportCB from "../../middlewares/passportCB.mid.js";

class AuthRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.create("/register", ["public"], passportCB("register"), authController.registerCB);
        this.create("/login", ["public"], passportCB("login"), authController.loginCB);
        this.create("/signout", ["user", "admin"], authController.singOutCB);
        this.create("/current", ["user", "admin"], authController.currentCB);
        this.create("/online", ["user", "admin"], authController.currentCB);
        this.read("/bad-auth", ["public"], authController.badAuthCB);
        this.read("/forbidden", ["public"], authController.forbiddenCB);
    };
};

const authRouter = (new AuthRouter()).getRouter();

export default authRouter;