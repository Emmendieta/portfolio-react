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
        this.create("/", ["public"], educationsController.createEducation);
        this.update("/:eid", ["public"], educationsController.updateEducationById);
        this.destroy("/:eid", ["public"], educationsController.deleteEducationById);
    };
};

const educationsRouter = (new EducationsRouter()).getRouter();

export default educationsRouter;