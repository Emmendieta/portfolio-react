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
        this.create("/", ["public"], socialMediasController.createSocialMedia);
        this.update("/:sid", ["public"], socialMediasController.updateSocialMediaById);
        this.destroy("/:sid", ["public"], socialMediasController.deleteSocialMediabyId);
    };
};

const socialMediasRouter = (new SocialMediasRouter()).getRouter();

export default socialMediasRouter;