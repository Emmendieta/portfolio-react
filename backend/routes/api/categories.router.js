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
        this.read("/filter", ["public"], categoriesController.getCategoryByFilter);
        this.create("/", ["user", "admin"], categoriesController.createCategory);
        this.update("/reorder", ["user", "admin"], categoriesController.reorderCategories);
        this.update("/:cid", ["user", "admin"], categoriesController.updateCategoryById);
        this.destroy("/:cid", ["user", "admin"], categoriesController.deleteCategoryById);
    };
};

const categoriesRouter = (new CategoriesRouter()).getRouter();

export default categoriesRouter;