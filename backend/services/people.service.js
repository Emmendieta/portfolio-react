import { peopleRepositry } from "../repositories/repository.js";

class PeopleService {
    constructor() {
        this.manager = peopleRepositry;
    };

    createOne = async (data) => await this.manager.createOne(data);
    readAll = async () => await this.manager.readAll();
    readById = async (pid) => await this.manager.readById(pid);
    readByIdAndPopulate = async (pid, populateFields = []) => {
        return await this.manager.readByIdAndPopulate(pid, populateFields);
    };
    readOneByFilter = async (filter) => await this.manager.readOneByFilter(filter);
    readByFilter = async (filter) => await this.manager.readByFilter(filter);
    updateById = async (pid, data) => await this.manager.updateById(pid, data);
    destroyById = async (pid) => await this.manager.destroyById(pid);
};

const peopleService = new PeopleService(peopleRepositry);

export default peopleService;