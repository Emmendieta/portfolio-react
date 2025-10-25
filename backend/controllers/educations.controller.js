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
        const verifyEducation = await this.verifyEducationTitleTypeAndName(data.title, data.typeEducation, data.institutionName);
        if (verifyEducation === 1) { return res.json400("Error: Alredy exist an Education with the same Name of the Institucion, de Type of Education and the Title!(C)"); };
        const lastEducation = await this.eService.readLastByOrder();
        const nextOrder = lastEducation ? lastEducation.order + 1 : 0;
        data.order = nextOrder;
        const education = await this.eService.createOne(data);
        if (!education) { return res.json400("Couldn't create the Education!(C)"); };
        res.json201(education);
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
        //const education = await this.eService.readByFilter({}, {sort: { order: 1 } });
        if (!educations || educations.length === 0) { return res.json404("Not Educations found!(C)"); };;
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

    reorderEducations = async (req, res) => {
        try {
            const { data } = req.body;
            if (!Array.isArray(data) || data.length === 0) { return res.json400("Data must be a non-empty array!(C)"); };
            // Extraemos solo los IDs y validamos
            const orderedIds = data.map(item => item._id).filter(id => id);
            if (orderedIds.length !== data.length) {  return res.json400("Some items are missing a valid id!(C)"); };
            for (const id of orderedIds) {
                if (!isValidObjectId(id)) { return res.json400(`Invalid Education ID: ${id}`); }
            };
            await this.eService.updateOrder(orderedIds);
            res.json200("Educations reordered successfully!(C)");
        } catch (error) {
            console.error("Error reordering educations: ", error);
            res.json500("Internal Server Error!(C)");
        }
    };

    deleteEducationById = async (req, res) => {
        const { eid } = req.params;
        if (eid.length !== 24) { return res.json400("Invalid Education ID!(C)"); };
        const education = await this.verifyEducationFun(eid);
        if (education === null) { return res.json404("Education Not Found!(C)"); };
        const educationDeleted = await this.eService.destroyById(eid);
        await this.eService.reorderAfterDelete();
        return res.json200(educationDeleted);
    };

    verifyEducationFun = async (eid) => {
        if (!isValidObjectId(eid)) { return res.json400("Invalid Education ID!(C)"); };
        const verify = await this.eService.readById(eid);
        if (!verify) { return null }
        else { return verify; };
    };

    verifyEducationTitleTypeAndName = async (title, typeEducation, institutionName, eid = null) => {
        const exitingEducation = await this.eService.readOneByFilter({ title, typeEducation, institutionName });
        if (!exitingEducation) { return 0; };
        if (eid && exitingEducation._id.toString() === eid.toString()) { return 0; }
        return 1;
    };
};

const educationsController = new EducationsController();

export default educationsController;