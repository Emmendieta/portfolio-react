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
        this.create("/", ["public"], peopleController.createPerson);
        this.update("/:pid", ["public"], peopleController.updatePersonById);
        this.destroy("/:pid", ["public"], peopleController.deletePersonById);
    };
};

const peopleRouter = (new PeopleRouter()).getRouter();

export default peopleRouter;