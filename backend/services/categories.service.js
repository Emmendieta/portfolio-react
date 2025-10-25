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
    //drag and drop:
    updateOrder = async (orderedIds) => await this.manager.updateOrder(orderedIds);
    readLastByOrder = async () => await this.manager.readLastByOrder();
    destroyById = async (cid) => await this.manager.destroyById(cid);
    reorderAfterDelete = async () => await this.manager.reorderAfterDelete();
};

const categoriesService = new CategoriesService(categoriesRepository);

export default categoriesService;