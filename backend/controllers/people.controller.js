import { isValidObjectId } from "mongoose";
import peopleService from "../services/people.service.js";

class PeopleController {
    constructor() {
        this.pService = peopleService;
    };

    createPerson = async (req, res) => {
        const data = req.body;
        if (!data || !data.firstName || !data.lastName || !data.dni || !data.cuil || !data.birthday || !data.about) { return res.json400("Missing information!(C)"); };
        const verifyDNI = await this.verifyPersonDNI(data.dni);
        if (verifyDNI) { return res.json400("Person alredy Exist!(C)"); };
        const person = await this.pService.createOne(data);
        return res.json201(person);
    };

    getPersonById = async (req, res) => {
        const { pid } = req.params;
        if((pid.length !== 24)) {return res.json400("Invalid Person ID!(C)"); };
        const person = await this.verifyPersonFun(pid);
        if (person === false ) { return res.json400("Invalid Person ID!(C)"); };
        if (person === null) { return res.json404("Person Not Found!(C)"); };
        return res.json200(person);
    };

    getPersonByFilter = async (req, res) => {
        //Falta Buscar persona por filtro!
    };

    getAllPeople = async (req, res) => {
        const people = await this.pService.readAll();
        if (people.length === 0) { return res.json404("People Not Found!(C)"); };
        return res.json200(people);
    };

    updatePersonById = async (req, res) => {
        const { pid } = req.params;
        if((pid.length !== 24)) {return res.json400("Invalid Person ID!(C)"); };
        const data = req.body;
        if (!data) { return res.json400("No Information to Update!(C)"); };
        const person = await this.verifyPersonFun(pid);
        if (person === null) { return res.json404("Person Not Found!(C)"); };
        const personUpdated = await this.pService.updateById(pid, data);
        return res.json200(personUpdated);
    };

    deletePersonById = async (req, res) => {
        const { pid } = req.params;
        if((pid.length !== 24)) {return res.json400("Invalid Person ID!(C)"); };
        const person = await this.verifyPersonFun(pid);
        if (person === null) { return res.json404("Person Not Found!(C)"); };
        const personDeleted = await this.pService.destroyById(pid);
        return res.json200(personDeleted);
    };

    verifyPersonFun = async (pid) => {
        if (!isValidObjectId(pid))  { return false; };
        const verify = await this.pService.readById(pid);
        if (!verify) { return null; }
        else { return verify; };
    };

    verifyPersonDNI = async (dni) => {
        const verify = await this.pService.readByFilter({ dni });
        if (!verify) { return false; }
        else { return true };
    };
};

const peopleController = new PeopleController();

export default peopleController;