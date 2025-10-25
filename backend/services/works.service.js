import { worksRepository } from "../repositories/repository.js";

class WorksService {
    constructor() {
        this.manager = worksRepository;
    };
    createOne = async (data) => await this.manager.createOne(data);
    readAll = async () => await this.manager.readAll();
    readById = async (wid) => await this.manager.readById(wid);
    readByIdAndPopulate = async (wid, populateFields = []) => {
        return await this.manager.readByIdAndPopulate(wid, populateFields);
    };
    readOneByFilter = async (filter) => await this.manager.readOneByFilter(filter);
    readByFilter = async (filter) => await this.manager.readByFilter(filter);
    updateById = async (wid, data) => await this.manager.updateById(wid, data);
    //drag and drop:
    updateOrder = async (orderedIds) => await this.manager.updateOrder(orderedIds);
    readLastByOrder = async () => await this.manager.readLastByOrder();
    destroyById = async (wid) => await this.manager.destroyById(wid);
    reorderAfterDelete = async () => await this.manager.reorderAfterDelete();
};

const worksService = new WorksService(worksRepository);

export default worksService;