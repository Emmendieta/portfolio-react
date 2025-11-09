import proyectsController from "../../controllers/proyects.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

class ProyectsRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.read("/", ["public"], proyectsController.getAllProyects);
        this.read("/populated", ["public"], proyectsController.getAllProyectsPopulated);
        this.read("/:pyid", ["public"], proyectsController.getProyectById);
        this.read("/:pyid/populated", ["public"], proyectsController.getProyectByIdPopulated);
        this.update("/reorder", ["user", "admin"], proyectsController.reorderProyects);
        this.create("/", ["user", "admin"], proyectsController.createProyect);
        this.update("/:pyid", ["user", "admin"], proyectsController.updateProyectById);
        this.destroy("/:pyid", ["user", "admin"], proyectsController.deleteProyectById);
    };
};

const proyectsRouter = (new ProyectsRouter()).getRouter();

export default proyectsRouter;