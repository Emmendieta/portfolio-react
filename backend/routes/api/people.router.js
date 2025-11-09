import peopleController from "../../controllers/people.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

class PeopleRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.read("/:pid", ["public"], peopleController.getPersonById);
        this.read("/", ["public"], peopleController.getAllPeople);
        this.create("/", ["user", "admin"], peopleController.createPerson);
        this.update("/:pid", ["user", "admin"], peopleController.updatePersonById);
        this.destroy("/:pid", ["user", "admin"], peopleController.deletePersonById);
    };
};

const peopleRouter = (new PeopleRouter()).getRouter();

export default peopleRouter;