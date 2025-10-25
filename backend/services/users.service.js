import { usersRepository } from "../repositories/repository.js";

class UsersService {
    constructor() {
        this.manager = usersRepository;
    };
    createOne = async (data) => await this.manager.createOne(data);
    readAll = async () => await this.manager.readAll();
    readById = async (uid) => await this.manager.readById(uid);
    readByIdAndPopulate = async (uid, populateFields = []) => {
        return await this.manager.readByIdAndPopulate(uid, populateFields);
    };
    readOneByFilter = async (filter) => await this.manager.readOneByFilter(filter);
    readByFilter = async (filter) => await this.manager.readByFilter(filter);
    updateById = async (uid, data) => await this.manager.updateById(uid, data);
    //drag and drop:
    updateOrder = async (orderedIds) => await this.manager.updateOrder(orderedIds);
    readLastByOrder = async () => await this.manager.readLastByOrder();
    destroyById = async (uid) => await this.manager.destroyById(uid);
    reorderAfterDelete = async () => await this.manager.reorderAfterDelete();
};

const usersService = new UsersService(usersRepository);

export default usersService;