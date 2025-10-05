import worksController from "../../controllers/works.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

class WorksRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.read("/", ["public"], worksController.getAllWorks);
        this.read("/:wid", ["public"], worksController.getWorkById);
        this.create("/", ["public"], worksController.createWork);
        this.update("/:wid", ["public"], worksController.updateWorkById);
        this.destroy("/:wid", ["public"], worksController.deleteWorkById);
    };
};

const worksRouter = (new WorksRouter()).getRouter();

export default worksRouter;