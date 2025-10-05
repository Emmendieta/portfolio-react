import RouterHelper from "../helpers/router.helper.js";
import authRouter from "./api/auth.router.js";
import peopleRouter from "./api/people.router.js";
import usersRouter from "./api/users.router.js";
import categoriesRouter from "./api/categories.router.js";
import socialMediasRouter from "./api/socialMedias.router.js";
import educationsRouter from "./api/educations.router.js";
import languagesRouter from "./api/languages.router.js";
import worksRouter from "./api/works.router.js";
import proyectsRouter from "./api/proyects.router.js";

class ApiRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.use("/auth", authRouter);
        this.use("/people", peopleRouter);
        this.use("/users", usersRouter);
        this.use("/categories", categoriesRouter);
        this.use("/social-medias", socialMediasRouter);
        this.use("/educations", educationsRouter);
        this.use("/languages", languagesRouter);
        this.use("/works", worksRouter);
        this.use("/proyects", proyectsRouter);
    };
};

const apiRouter = (new ApiRouter()).getRouter();

export default apiRouter;