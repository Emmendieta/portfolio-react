import socialMediasController from "../../controllers/socialMedias.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

class SocialMediasRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.read("/:sid", ["public"], socialMediasController.getSocialMediaById);
        this.read("/", ["public"], socialMediasController.getAllSocialMedias);
        this.create("/", ["user", "admin"], socialMediasController.createSocialMedia);
        this.update("/reorder", ["user", "admin"], socialMediasController.reorderSocialMedias);
        this.update("/:sid", ["user", "admin"], socialMediasController.updateSocialMediaById);
        this.destroy("/:sid", ["user", "admin"], socialMediasController.deleteSocialMediabyId);
    };
};

const socialMediasRouter = (new SocialMediasRouter()).getRouter();

export default socialMediasRouter;