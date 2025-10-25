import { CategoryModel } from "./models/Categories.Models.js";
import { EducationModel } from "./models/Educations.Models.js";
import { LanguagesModel } from "./models/Languages.Models.js";
import { PeopleModel } from "./models/People.Models.js";
import { ProyectsModel } from "./models/Proyects.Models.js";
import { SocialMediaModel } from "./models/SocialMedias.Models.js";
import { UsersModel } from "./models/Users.Models.js";
import { WorksModel } from "./models/Works.Models.js";

class DaoMongo {
    constructor(model) {
        this.model = model;
    };
    createOne = async (data) => await this.model.create(data);
    createMany = async (data) => await this.model.insertMany(data);
    readAll = async (filter) => await this.model.find(filter);
    readById = async (id) => await this.model.findById(id);

    readAllAndPopulate = async (populateFileds = []) => {
        let query = this.model.find();
        if (populateFileds.length > 0) {
            populateFileds.forEach(field => {
                query = query.populate(field);
            });
            return await query;
        };
    };

    readByIdAndPopulate = async (id, populateFileds = []) => {
        let query = this.model.findById(id);
        if (populateFileds.length > 0) {
            populateFileds.forEach(field => {
                query = query.populate(field);
            });
            return await query;
        };
    };

    readByFilter = async (filter) => await this.model.find(filter);
    readOneByFilter = async (filter) => await this.model.findOne(filter);
    updateById = async (id, data) => await this.model.findByIdAndUpdate(id, data, { new: true });
    //Reordenada con el drag and drop
    bulkUpdateOrder = async (orderedIds) => {
        if (!Array.isArray(orderedIds)) throw new Error("OrderedIds must be an array");

        const bulkOps = orderedIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id },
                update: { order: index },
            },             
        }));
        return await this.model.bulkWrite(bulkOps);
    };
    readLastByOrder = async () => await this.model.findOne().sort({ order: -1 });

    destroyById = async (id) => await this.model.findByIdAndDelete(id);

    reorderAfterDelete = async () => {
        const educations = await this.model.find().sort({ order: 1 });
        const bulkOps = educations.map((edu, index) => ( {
            updateOne: {
                filter: { _id : edu._id },
                update: { order: index },
            },
        }));

        if(bulkOps.length > 0) { await this.model.bulkWrite(bulkOps); };
    };

};

const categoryManager = new DaoMongo(CategoryModel);
const educationManager = new DaoMongo(EducationModel);
const languagesManager = new DaoMongo(LanguagesModel);
const peopleManager = new DaoMongo(PeopleModel);
const proyectsManager = new DaoMongo(ProyectsModel);
const socialMediasManager = new DaoMongo(SocialMediaModel);
const usersManager = new DaoMongo(UsersModel);
const worksManager = new DaoMongo(WorksModel);

export { categoryManager, educationManager, languagesManager, peopleManager, proyectsManager, socialMediasManager, usersManager, worksManager };