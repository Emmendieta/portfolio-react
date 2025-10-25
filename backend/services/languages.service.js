import { languagesRepository } from "../repositories/repository.js";

class LanguagesService {
    constructor() {
        this.manager = languagesRepository;
    };

    createOne = async (data) => await this.manager.createOne(data);
    readAll = async () => await this.manager.readAll();
    readById = async (lid) => await this.manager.readById(lid);
    readByFilter = async (filter) => this.manager.readByFilter(filter);
    readByIdAndPopulate = async (lid, populateFields = []) => {
        return await this.manager.readByIdAndPopulate(lid, populateFields);
    };
    readOneByFilter = async (filter) => await this.manager.readOneByFilter(filter);
    updateById = async (lid, data) => this.manager.updateById(lid, data);
    //drag and drop:
    updateOrder = async (orderedIds) => await this.manager.updateOrder(orderedIds);
    readLastByOrder = async () => await this.manager.readLastByOrder();
    destroyById = async (lid) => this.manager.destroyById(lid);
    reorderAfterDelete = async () => await this.manager.reorderAfterDelete();
};

const languagesService = new LanguagesService(languagesRepository);

export default languagesService;