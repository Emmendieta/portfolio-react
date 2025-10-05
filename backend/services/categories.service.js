import { categoriesRepository } from "../repositories/repository.js";

class CategoriesService {
    constructor() {
        this.manager = categoriesRepository;
    };
    createOne = async (data) => await this.manager.createOne(data);
    readAll = async () => await this.manager.readAll();
    readById = async (cid) => await this.manager.readById(cid);
    readByFilter = async (filter) => await this.manager.readByFilter(filter);
    readByIdAndPopulate = async (cid, populateFields = []) => {
        return await this.manager.readByIdAndPopulate(cid, populateFields);
    };
    readOneByFilter = async (filter) => await this.manager.readOneByFilter(filter);
    updateById = async (cid, data) => await this.manager.updateById(cid, data);
    destroyById = async (cid) => await this.manager.destroyById(cid);
};

const categoriesService = new CategoriesService(categoriesRepository);

export default categoriesService;