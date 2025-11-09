import usersController from "../../controllers/users.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

class UsersRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.read("/", ["public"], usersController.getAllUsers);
        this.read("/:uid", ["public"], usersController.getUserById);
        this.read("/:uid/populated", ["public"], usersController.getuserByIdPopulated);
        this.update("/reorder", ["user", "admin"], usersController.reorderUsers);
        this.update("/:uid", ["user", "admin"], usersController.updateUserById);
        this.create("/", ["user", "admin"], usersController.createUser);
        this.destroy("/:uid", ["user", "admin"], usersController.deleteUserById);
    };
};

const usersRouter = (new UsersRouter()).getRouter();

export default usersRouter;