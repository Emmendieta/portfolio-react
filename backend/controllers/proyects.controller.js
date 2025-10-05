import { isValidObjectId } from "mongoose";
import proyectsService from "../services/proyects.service.js";

class ProyectsController {
    constructor() {
        this.pService = proyectsService;
    };

    createProyect = async (req, res) => {
        const data = req.body;
        if (!data || !data.title || !data.company || !data.description || !data.languages) { return res.json400("Missing Information!(C)"); };
        const verifyProyect = await this.verifyInfoProyect(data.title, data.company);
        if (verifyProyect === true) { return res.json400("Proyect with the same Title and Company alredy Exist!(C)"); }
        else {
            const proyect = await this.pService.createOne(data);
            return res.json201(proyect);
        };
    };

    getProyectById = async (req, res) => {
        const { pyid } = req.params;
        const proyect = await this.verifyProyectFun(pyid);
        if (proyect === false) { return res.json400("Invalid Proyect Id"); };
        if (proyect === null) { return res.json404("Proyect Not Found!(C)"); };
        return res.json200(proyect);
    };

    getProyectByFilter = async (req, res) => {
        //Falta Buscar por Filtro!
    };


    getProyectByIdPopulated = async (req, res) => {
        const { pyid } = req.params;
        if (!isValidObjectId(pyid)) { return res.json400("Invalid Proyect Id!(C)"); };
        const proyect = await this.pService.readByIdAndPopulate(pyid, ["languages"]);
        if (!proyect) { return res.json404("Proyect Not Found!(C)"); };
        return res.json200(proyect);
    };

    getAllProyects = async (req, res) => {
        const proyects = await this.pService.readAll();
        if (proyects.length === 0) { return res.json404("No Proyects Found!(C)"); };
        return res.json200(proyects);
    };

    updateProyectById = async (req, res) => {
        const { pyid } = req.params;
        const data = req.body;
        if (!data) { return res.json400("No Information to Udpate!(C)"); };
        const proyect = await this.verifyProyectFun(pyid);
        if (proyect === false) { return res.json400("Invalid Proyect Id"); };
        if (proyect === null) { return res.json404("Proyect Not Found!(C)"); };
        if (data.title && data.company) {
            const verifyProyect = await this.verifyInfoProyect(data.title, data.company);
            if (verifyProyect === true) { return res.json400("Proyect with the same Title and Company alredy Exist!(C)"); }
            else {
                const proyectUpdated = await this.pService.updateById(pyid, data);
                return res.json200(proyectUpdated);
            };
        }
        else {
            const proyectUpdated = await this.pService.updateById(pyid, data);
            return res.json200(proyectUpdated);
        };
    };

    deleteProyectById = async (req, res) => {
        const { pyid } = req.params;
        const proyect = await this.verifyProyectFun(pyid);
        if (proyect === false) { return res.json400("Invalid Proyect Id"); };
        if (proyect === null) { return res.json404("Proyect Not Found!(C)"); };
        const proyectDeleted = await this.pService.destroyById(pyid);
        return res.json200(proyectDeleted);
    };

    verifyProyectFun = async (pyid) => {
        if (!isValidObjectId(pyid)) { return false; };
        const verify = await this.pService.readById(pyid);
        if (!verify) { return null }
        else { return verify; };
    };

    verifyInfoProyect = async (title, company) => {
        const verify = await this.pService.readByFilter({ title, company });
        if (!verify) { return false; }
        else { return true; };
    };
};

const proyectsController = new ProyectsController();

export default proyectsController;