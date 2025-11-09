import languagesController from "../../controllers/languages.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

class LanguagesRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.read("/", ["public"], languagesController.getAllLanguages);
        this.read("/:lid", ["public"], languagesController.getLanguageById);
        this.create("/", ["user", "admin"], languagesController.createLanguage);
        this.update("/reorder", ["user", "admin"], languagesController.reorderLanguages);
        this.update("/:lid", ["user", "admin"], languagesController.updateLanguageById);
        this.destroy("/:lid", ["user", "admin"], languagesController.deleteLanguageById);
    };
};

const languagesRouter = (new LanguagesRouter()).getRouter();

export default languagesRouter;