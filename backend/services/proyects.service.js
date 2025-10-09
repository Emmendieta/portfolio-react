import { proyectsRepository } from "../repositories/repository.js";

class ProyectsServices {
    constructor() {
        this.manager = proyectsRepository;
    };

    createOne = async (data) => await this.manager.createOne(data);
    readAll = async () => await this.manager.readAll();
    readById = async (pyid) => await this.manager.readById(pyid);
    readByIdAndPopulate = async (pyid, populateFields = []) => {
        return await this.manager.readByIdAndPopulate(pyid, populateFields);
    };
    readAllAndPopulate = async (populateFields = []) => {
        return await this.manager.readAllAndPopulate(populateFields);
    };
    readOneByFilter = async (filter) => await this.manager.readOneByFilter(filter);
    readByFilter = async (filter) => await this.manager.readByFilter(filter);
    updateById = async (pyid, data) => await this.manager.updateById(pyid, data);
    destroyById = async (pyid) => await this.manager.destroyById(pyid);
};

const proyectsService = new ProyectsServices(proyectsRepository);

export default proyectsService;