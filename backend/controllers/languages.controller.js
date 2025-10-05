import { isValidObjectId } from "mongoose";
import languagesService from "../services/languages.service.js";

class LanguagesController {
    constructor() {
        this.lService = languagesService;
    };

    createLanguage = async (req, res) => {
        const data = req.body;
        if (!data || !data.title || !data.percent) { return res.json400("Missing Information!(C)"); };
        const verifyLanguage = await this.verifyLanguageTitle(data.title);
        if (verifyLanguage) { return res.json400("Language Alredy Exist!(C)"); }
        else {
            const language = await this.lService.createOne(data);
            res.json201(language);
        };
    };

    getLanguageById = async (req, res) => {
        const { lid } = req.params;
        if (lid.length !== 24) { return res.json400("Invalid Language ID!(C)"); };
        const language = await this.verifyLanguageFun(lid);
        if (language === null) { return res.json404("Lenguage Not Found!(C)"); };
        return res.json200(language);
    };

    getLanguageByFilter = async (req, res) => {
        //FALTA BUSCAR POR FILTRO!
    };

    getAllLanguages = async (req, res) => {
        const languages = await this.lService.readAll();
        if (languages.length === 0) { return res.json404("Not Lenguages Found!(C)"); };
        return res.json200(languages);
    };

    updateLanguageById = async (req, res) => {
        const { lid } = req.params;
        if (lid.length !== 24) { return res.json400("Invalid Language ID!(C)"); };
        const data = req.body;
        if (!data) { return res.json400("Not information to Udpate!(C)"); };
        const language = await this.verifyLanguageFun(lid);
        if (language === null) { return res.json404("Lenguage Not Found!(C)"); };
        if (data.title) {
            const verifyLanguage = await this.verifyLanguageTitle(data.title);
            if (verifyLanguage) { return res.json400("Language Alredy Exist!(C)"); }
            const languageUpdated = await this.lService.updateById(lid, data);
            return res.json200(languageUpdated);
        } else {
            const languageUpdated = await this.lService.updateById(lid, data);
            return res.json200(languageUpdated);
        };
    };

    deleteLanguageById = async (req, res) => {
        const { lid } = req.params;
        if (lid.length !== 24) { return res.json400("Invalid Language ID!(C)"); };
        const language = await this.verifyLanguageFun(lid);
        if (language === false) { return res.json400("Lenguage Not Found!(C)"); };
        if (language === null) { return res.json404("Lenguage Not Found!(C)"); };
        const languageDeleted = await this.lService.destroyById(lid);
        return res.json200(languageDeleted);
    };

    verifyLanguageFun = async (lid) => {
        if (!isValidObjectId(lid)) { return false; };
        const verify = await this.lService.readById(lid);
        if (!verify) { return null; }
        else { return verify; };
    };

    verifyLanguageTitle = async (title) => {
        const verify = await this.lService.readByFilter({ title });
        if (!verify) { return false; }
        else { return true; }
    };
};

const languagesController = new LanguagesController();

export default languagesController;