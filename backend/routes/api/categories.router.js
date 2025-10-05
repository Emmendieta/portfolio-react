import categoriesController from "../../controllers/categories.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

class CategoriesRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.read("/", ["public"], categoriesController.getAllCategories);
        this.read("/:cid", ["public"], categoriesController.getCategoryById);
        this.create("/", ["public"], categoriesController.createCategory);
        this.update("/:cid", ["public"], categoriesController.updateCategoryById);
        this.destroy("/:cid", ["public"], categoriesController.deleteCategoryById);
    };
};

const categoriesRouter = (new CategoriesRouter()).getRouter();

export default categoriesRouter;