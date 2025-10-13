import { isValidObjectId } from "mongoose";
import categoriesService from "../services/categories.service.js";

class CategoriesController {
    constructor() {
        this.cService = categoriesService;
    };

    createCategory = async (req, res) => {
        const data = req.body;
        if (!data || !data.title) { return res.json400("Missing information!(C)"); };
        const verifyTitle = await this.verifyCategoryTitle(data.title);
        if (verifyTitle === 1) { return res.json400("The Title of the Category alredy Exist!(C)"); }
        else {
            const category = await this.cService.createOne(data);
            res.json201(category);
        };
    };

    getCategoryById = async (req, res) => {
        const { cid } = req.params;
        if (cid.length !== 24) { return res.json400("Invalid Category ID!(C)"); };
        const category = await this.verifyCategoryFun(cid);
        if (category === null) { return res.json404("Category Not Found!(C)"); };
        res.json200(category);
    };

    getCategoryByFilter = async (req, res) => {
        //FALTA EL DEL FILTRO
    };

    getAllCategories = async (req, res) => {
        const categories = await this.cService.readAll();
        if (categories.length === 0) { return res.json404("No categories found!(C)"); };
        return res.json200(categories);
    };

    updateCategoryById = async (req, res) => {
        const { cid } = req.params;
        if (cid.length !== 24) return res.json400("Invalid Category ID!(C)");

        const data = req.body;
        if (!data) return res.json400("No data to update!(C)");
        if (data.title && data.title.length === 0) {
            return res.json400("The Title of the Category can't be null!(C)");
        };

        const category = await this.verifyCategoryFun(cid);
        if (category === null) return res.json404("Category Not Found!(C)");

        // Verificamos si el título ya existe y si no es de la misma categoría
        if (data.title) {
            const verifyCategoryTitle = await this.verifyCategoryTitle(data.title, cid);
            if (verifyCategoryTitle === 1) {
                return res.json400("The Title of the Category already exists!(C)");
            };
        };

        const categoryUpdated = await this.cService.updateById(cid, data);
        return res.json200(categoryUpdated);
    };

    deleteCategoryById = async (req, res) => {
        const { cid } = req.params;
        if (cid.length !== 24) { return res.json400("Invalid Category ID!(C)"); };
        const category = await this.verifyCategoryFun(cid);
        if (category === null) { return res.json404("Category Not Found!(C)"); };
        const categoryDeleted = await this.cService.destroyById(cid);
        if (!categoryDeleted) { return res.json400("Couldn't Delete the Category!(C)"); };
        return res.json200(categoryDeleted);
    };

    verifyCategoryFun = async (cid) => {
        if (!isValidObjectId(cid)) { return res.json400("Invalid Category Id!(C)"); };
        const verify = await this.cService.readById(cid);
        if (!verify) { return null }
        else { return verify; }
    };

    verifyCategoryTitle = async (title, cid = null) => {
        const existingCategory = await this.cService.readOneByFilter({ title });
        if (!existingCategory) return 0;
        if (cid && existingCategory._id.toString() === cid.toString()) {
            return 0;
        };
        return 1;
    };
};

const categoriesController = new CategoriesController();

export default categoriesController;