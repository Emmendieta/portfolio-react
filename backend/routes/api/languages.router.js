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
        this.create("/", ["public"], languagesController.createLanguage);
        this.update("/:lid", ["public"], languagesController.updateLanguageById);
        this.destroy("/:lid", ["public"], languagesController.deleteLanguageById);
    };
};

const languagesRouter = (new LanguagesRouter()).getRouter();

export default languagesRouter;