import { educationsRepository } from "../repositories/repository.js";

class EducationsService {
    constructor() {
        this.manager = educationsRepository;
    };

    createOne = async (data) => await this.manager.createOne(data);
    readAll = async () => await this.manager.readAll();
    readById = async (eid) => await this.manager.readById(eid);
    readByFilter = async (filter) => await this.manager.readByFilter(filter);
    readByIdAndPopulate = async (eid, populateFields = []) => {
        return await this.manager.readByIdAndPopulate(eid, populateFields);
    };
    readOneByFilter = async (filter) => await this.manager.readOneByFilter(filter);
    updateById = async (eid, data) => await this.manager.updateById(eid, data);
    destroyById = async (eid) => await this.manager.destroyById(eid);
};

const educationsService = new EducationsService(educationsRepository);

export default educationsService;