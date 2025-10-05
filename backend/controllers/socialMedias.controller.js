import { isValidObjectId } from "mongoose";
import socialMediasService from "../services/socialMedias.service.js";

class SocialMediasController {
    constructor() {
        this.sMService = socialMediasService;
    };

    createSocialMedia = async (req, res) => {
        const data = req.body;
        if (!data || !data.title || !data.linkSocial || !data.type) { return res.json400("Missing Information!(C)"); };
        const verifyTitle = await this.verifySocialMediaTitle(data.title);
        if (verifyTitle === 1) { return res.json400("Social Media alredy Exist!(C)"); }
        else {
            const socialMedia = await this.sMService.createOne(data);
            return res.json201(socialMedia);
        };
    };

    getSocialMediaById = async (req, res) => {
        const { sid } = req.params;
        if (sid.length !== 24) { return res.json400("Invalid Social Media ID!(C)"); };
        const socialMedia = await this.verifySocialMediaFun(sid);
        if (socialMedia === null) { return res.json404("Not Social Media Found!(C)"); };
        return res.json200(socialMedia);
    };

    getSocialMediaByFilter = async (req, res) => {
        //Falta Buscar por Filtro!!!
    };

    getAllSocialMedias = async (req, res) => {
        const socialMedias = await this.sMService.readAll();
        if (!socialMedias || socialMedias.length === 0) { return res.json404("Not Social Medias Found!(C)"); };
        return res.json200(socialMedias);
    };

    updateSocialMediaById = async (req, res) => {
        const { sid } = req.params;
        if (sid.length !== 24) { return res.json400("Invalid Social Media ID!(C)"); };
        const data = req.body;
        if (!data) { return res.json400("No Data to update!(C)"); };
        const socialMedia = await this.verifySocialMediaFun(sid);
        if (socialMedia === null) { return res.json404("No Social Media Found!(C)"); };
        const verifyTitle = await this.verifySocialMediaTitle(data.title);
        if (verifyTitle === 1) { return res.json400("Social Media alredy Exist!(C)"); }
        else {
            const socialMediaUpdated = await this.sMService.updateById(sid, data);
            return res.json200(socialMediaUpdated);
        };
    };

    deleteSocialMediabyId = async (req, res) => {
        const { sid } = req.params;
        if (sid.length !== 24) { return res.json400("Invalid Social Media ID!(C)"); };
        const socialMedia = await this.verifySocialMediaFun(sid);
        if (socialMedia === null) { return res.json404("Not Social Media Found!"); };
        const socialMediaDeleted = await this.sMService.destroyById(sid);
        return res.json200(socialMediaDeleted);
    };

    verifySocialMediaFun = async (sid) => {
        if (!isValidObjectId(sid)) { return res.json400("Invalid Social Media ID!(C)"); };
        const verify = await this.sMService.readById(sid);
        if (!verify) { return null; }
        else { return verify; };
    };

    verifySocialMediaTitle = async (title) => {
        const verifyTitle = await this.sMService.readByFilter({ title });
        if (!verifyTitle || verifyTitle.length === 0) { return 0; }
        else { return 1; };
    };
};

const socialMediaController = new SocialMediasController();

export default socialMediaController;