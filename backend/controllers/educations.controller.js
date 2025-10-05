import { isValidObjectId } from "mongoose";
import educationsService from "../services/educations.service.js";

class EducationsController {
    constructor() {
        this.eService = educationsService;
    };

    createEducation = async (req, res) => {
        const data = req.body;
        if (!data || !data.institutionName || !data.title || !data.dateStart || !data.typeEducation || !data.description) {
            res.json400("Missing Information!(C)");
        };
        const education = await this.eService.createOne(data);
        if (!education) { return res.json400("Couldn't create the Education!(C)"); };
        res.json201(education);;
    };

    getEducationById = async (req, res) => {
        const { eid } = req.params;
        if (eid.length !== 24) { return res.json400("Invalid Education ID!(C)"); };
        const education = await this.verifyEducationFun(eid);
        if (education === null) { return res.json400("Education Not Found!(C)"); };
        res.json200(education);
    };

    getEducationByFilter = async (req, res) => {
        //Falta buscar por filtro!
    }

    getAllEducations = async (req, res) => {
        const educations = await this.eService.readAll();
        if (educations.length === 0) { return res.json404("Not Educations found!(C)"); };;
        return res.json200(educations);
    };

    updateEducationById = async (req, res) => {
        const { eid } = req.params;
        if (eid.length !== 24) { return res.json400("Invalid Education ID!(C)"); };
        const data = req.body;
        if (!data) { return res.json400("No data to update!(C)"); };
        const education = await this.verifyEducationFun(eid);
        //FALTA VERIFICAR SI YA EXISTE LA EDUCACION POR OTROS FILTROS
        if (education === null) { return res.json404("No Education found!(C)"); };
        const educationUpdated = await this.eService.updateById(eid, data);
        return res.json200(educationUpdated);
    };

    deleteEducationById = async (req, res) => {
        const { eid } = req.params;
        if (eid.length !== 24) { return res.json400("Invalid Education ID!(C)"); };
        const education = await this.verifyEducationFun(eid);
        if (education === null) { return res.json404("Education Not Found!(C)"); };
        const educationDeleted = await this.eService.destroyById(eid);
        return res.json200(educationDeleted);
    };

    verifyEducationFun = async (eid) => {
        if (!isValidObjectId(eid)) { return res.json400("Invalid Education ID!(C)"); };
        const verify = await this.eService.readById(eid);
        if (!verify) { return null }
        else { return verify; };
    };
};

const educationsController = new EducationsController();

export default educationsController;