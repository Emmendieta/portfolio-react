import RouterHelper from "../helpers/router.helper.js";
import apiRouter from "./api.router.js";
/* import viewsRouter from "./views.router.js"; */

class ServerRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.use("/", apiRouter);
        /* this.use("/", viewsRouter); */
    };
};

const serverRouter = (new ServerRouter()).getRouter();

export default serverRouter;