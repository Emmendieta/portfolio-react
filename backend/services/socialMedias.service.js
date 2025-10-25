import { socialMediasRepository } from "../repositories/repository.js";

class SocialMediasService {
    constructor() {
        this.manager = socialMediasRepository;
    };

    createOne = async (data) => await this.manager.createOne(data);
    readAll = async () => await this.manager.readAll();
    readById = async (sid) => await this.manager.readById(sid);
    readByIdAndPopulate = async (sid, populateFields = []) => {
        return await this.manager.readByIdAndPopulate(sid, populateFields);
    };
    readOneByFilter = async (filter) => await this.manager.readOneByFilter(filter);
    readByFilter = async (filter) => await this.manager.readByFilter(filter);
    updateById = async (sid, data) => await this.manager.updateById(sid, data);
    //drag and drop:
    updateOrder = async (orderedIds) => await this.manager.updateOrder(orderedIds);
    readLastByOrder = async () => await this.manager.readLastByOrder();
    destroyById = async (sid) => await this.manager.destroyById(sid);
    reorderAfterDelete = async () => await this.manager.reorderAfterDelete();
};

const socialMediasService = new SocialMediasService(socialMediasRepository);

export default socialMediasService;