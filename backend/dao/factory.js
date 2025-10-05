const { PERSISTENCE } = process.env;

let dao = {};

switch(PERSISTENCE) {
        case "memory":
        console.log("Logica pendiente de memory");
        {
            const { categoryManager, educationManager, lenguagesManager, peopleManager, proyectsManager, socialMediasManager,usersManager, worksManager } = await import("./memory/dao.memory.js");
            dao = { categoryManager, educationManager, lenguagesManager, peopleManager, proyectsManager, socialMediasManager,usersManager, worksManager };
        };
        break;
    case "fs":
        console.log("Logica pendiente de fs");
        {
            const { categoryManager, educationManager, lenguagesManager, peopleManager, proyectsManager, socialMediasManager,usersManager, worksManager } = await import("./fs/dao.fs.js");
            dao = { categoryManager, educationManager, lenguagesManager, peopleManager, proyectsManager, socialMediasManager,usersManager, worksManager };
        };
        break;
    default:
        {
            const { categoryManager, educationManager, lenguagesManager, peopleManager, proyectsManager, socialMediasManager,usersManager, worksManager } = await import("./mongo/dao.mongo.js");
            dao = { categoryManager, educationManager, lenguagesManager, peopleManager, proyectsManager, socialMediasManager,usersManager, worksManager };
        };
        break;
};

const { categoryManager, educationManager, lenguagesManager, peopleManager, proyectsManager, socialMediasManager,usersManager, worksManager } = dao;

export { categoryManager, educationManager, lenguagesManager, peopleManager, proyectsManager, socialMediasManager,usersManager, worksManager };

export default dao;