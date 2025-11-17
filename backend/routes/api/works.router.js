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
        this.read("/filter", ["public"], worksController.getWorkByFilter);
        this.create("/", ["user", "admin"], worksController.createWork);
        this.update("/reorder", ["user", "admin"], worksController.reorderWorks);
        this.update("/:wid", ["user", "admin"], worksController.updateWorkById);
        this.destroy("/:wid", ["user", "admin"], worksController.deleteWorkById);
    };
};

const worksRouter = (new WorksRouter()).getRouter();

export default worksRouter;