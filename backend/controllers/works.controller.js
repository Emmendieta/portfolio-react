import { isValidObjectId } from "mongoose";
import worksServices from "../services/works.services.js";

class WorksController {
    constructor() {
        this.wService = worksServices;
    };

    createWork = async (req, res) => {
        const data = req.body;
        if (!data || !data.jobTitle || !data.dateStart || !data.company || !data.description) { return res.json400("Missing information!(C)"); };
        const verifyWork = await this.verifyWorkJobDateStartCompany(data.jobTitle, data.dateStart, data.company);
        if (verifyWork === 1) { return res.json400("Work with the same Job Title, Start Date and Company alredy Exist!(C)"); }
        else {
            const workUpdated = await this.wService.createOne(data);
            return res.json200(workUpdated);
        };
    };

    getWorkById = async (req, res) => {
        const { wid } = req.params;
        const work = await this.verifyWorkFun(wid);
        if (work === false) { return res.json400("Invalid Work ID!(C)"); };
        if (work === null) { return res.json404("Not Work Found!(C)"); };
        return res.json200(work);
    };

    getWorkByFilter = async (req, res) => {
        //Falta Buscar por filtro!
    };

    getAllWorks = async (req, res) => {
        const works = await this.wService.readAll();
        if (works.length === 0) { return res.json404("Not Works Found!(C)"); };
        return res.json200(works);
    };

    updateWorkById = async (req, res) => {
        const { wid } = req.params;
        const data = req.body;
        if (!data) { return res.json400("No Data to update!(C)"); };
        const work = await this.verifyWorkFun(wid);
        if (work === false) { return res.json400("Invalid Work ID!(C)"); };
        if (work === null) { return res.json404("Not Work Found!(C)"); };
        if (data.jobTitle && data.dateStart && data.company) {
            const verifyWork = await this.verifyWorkJobDateStartCompany(data.jobTitle, data.dateStart, data.company, wid);
            if (verifyWork === 1) { return res.json400("Work with the same Job Title, Start Date and Company alredy Exist!(C)"); }
            else {
                const workUpdated = await this.wService.updateById(wid, data);
                return res.json200(workUpdated);
            }
        } else {
            const workUpdated = await this.wService.updateById(wid, data);
            return res.json200(workUpdated);
        };
    };

    deleteWorkById = async (req, res) => {
        const { wid } = req.params;
        const work = await this.verifyWorkFun(wid);
        if (work === false) { return res.json400("Invalid Work ID!(C)"); };
        if (work === null) { return res.json404("Not Work Found!(C)"); };
        const workDeleted = await this.wService.destroyById(wid);
        return res.json200(workDeleted);
    };

    verifyWorkFun = async (wid) => {
        if (!isValidObjectId(wid)) { return false; };
        const verify = await this.wService.readById(wid);
        if (!verify) { return null; }
        else return verify;
    };

    verifyWorkJobDateStartCompany = async (jobTitle, dateStart, company, wid = null) => {
        const verify = await this.wService.readOneByFilter({ jobTitle, dateStart, company });
        if (!verify) { return 0; }
        if (wid && verify._id.toString() === wid.toString()) { return 0; }
        else return 1;
    };
};

const worksController = new WorksController();

export default worksController;