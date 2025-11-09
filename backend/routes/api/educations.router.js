import educationsController from "../../controllers/educations.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

class EducationsRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.read("/", ["public"], educationsController.getAllEducations);
        this.read("/:eid", ["public"], educationsController.getEducationById);
        this.create("/", ["user", "admin"], educationsController.createEducation);
        this.update("/reorder", ["user", "admin"], educationsController.reorderEducations);
        this.update("/:eid", ["user", "admin"], educationsController.updateEducationById);
        this.destroy("/:eid", ["user", "admin"], educationsController.deleteEducationById);
    };
};

const educationsRouter = (new EducationsRouter()).getRouter();

export default educationsRouter;