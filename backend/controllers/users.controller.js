import usersService from "../services/users.service.js";
import { createHash } from "../helpers/hash.helper.js";
import { isValidObjectId } from "mongoose";

class UsersController {
    constructor() {
        this.uService = usersService;
    };

    createUser = async (req, res) => {
        const data = req.body;
        if (!data || !data.user || !data.email || !data.password) { return res.json400("Missing Information!(C)"); };
        const verify = await this.verifyUserAndEmailFun(data.user, data.email);
        if (verify === 0 || verify === 1 || verify === 2) { return res.json400("User or Emial alredy Exist!(C)"); }
        else {
            const passHash = createHash(data.password)
            data.password = passHash;
            const user = await this.uService.createOne(data);
            return res.json201(user);
        };
    };

    getUserById = async (req, res) => {
        const { uid } = req.params;
        if (uid.length !== 24) { return res.json400("Invalid User ID!(C)"); };
        const user = await this.verifyUserFun(uid);
        if (user === null) { return res.json404("User Not Found!(C)"); };
        return res.json200(user);
    };

    getuserByFitlter = async (req, res) => {
        const { email } = req.params;
        if (!email) { return res.json400("Missing Email!(C)"); };
        const user = await this.uService.readOneByFilter({ email });
        if (!user) { return res.json404("User Not Found!(C)"); };
        return res.json200(user);
    };

    getuserByIdPopulated = async (req, res) => {
        try {
            const { uid } = req.params;
            if (!isValidObjectId(uid)) { return res.json400("Invalid User ID!(C)"); };
            const { populate } = req.query;
            const populateFields = populate ? populate.split("&") : [];
            const user = await this.uService.readByIdAndPopulate(uid, populateFields);
            if (!user) { return res.json404("User Not Found!(C)"); };
            return res.json200(user);
        } catch (error) {
            console.log("Error in getUserByIdPopulated!", error);
            return res.json500();
        };
    };

    getAllUsers = async (req, res) => {
        const users = await this.uService.readAll();
        if (!users || users.length === 0) { return res.json404("Not Users Found!(C)"); };
        return res.json200(users);
    };

    updateUserById = async (req, res) => {
        const { uid } = req.params;
        if (uid.length !== 24) { return res.json400("Invalid User ID!(C)"); };
        const data = req.body;
        if (!data) { return res.json400("No Information to Update!(C)"); };
        const user = await this.verifyUserFun(uid);
        if (user === null) { return res.json404("User Not Found!(C)"); }
        if (data.email || data.user) {
            const verifyData = await this.verifyUserAndEmailFun(data.user, data.email);
            if (verifyData === 0) { return res.json400("User and Email alredy Exist!(C)"); }
            else if (verifyData === 1) { return res.json400("User alredy Exist!(C)"); }
            else if (verifyData === 2) { return res.json400("Email alredy Exist!(C)"); }
            else {
                const userUpdated = await this.uService.updateById(uid, data);
                return res.json200(userUpdated);
            };
        } else {
            if (data.password) {
                const passHash = createHash(data.password);
                data.password = passHash;
            };
            const userUpdated = await this.uService.updateById(uid, data);
            return res.json200(userUpdated);
        };
    };

    deleteUserById = async (req, res) => {
        const { uid } = req.params;
        if (uid.length !== 24) { return res.json400("Invalid User ID!(C)"); };
        const user = await this.verifyUserFun(uid);
        if (user === null) { return res.json404("User Not Found!(C)"); };
        const userDeleted = await this.uService.destroyById(uid);
        return res.json200(userDeleted);
    };

    verifyUserFun = async (uid) => {
        if (!isValidObjectId(uid)) { return res.json400("Invalid User ID!(C)"); };
        const verify = await this.uService.readById(uid);
        if (!verify) { return null; }
        else { return verify; };
    };

    verifyUserEmail = async (email) => {
        const verify = await this.uService.readByFilter({ email });
        if (!verify) { return false; }
        else return true;
    };

    verifyUserAndEmailFun = async (user, email) => {
        const verifyUser = await this.uService.readByFilter({ user });
        const verifyEmail = await this.uService.readByFilter({ email });
        if (verifyUser && verifyEmail) { return 0; } // Ambos estan usandose.
        else if (verifyUser) { return 1; } // El usuario esta usado
        else if (verifyEmail) { return 2; } // El Emial esta usado
        else { return 3; }; //Los dos campos estan libres
    };
};

const usersController = new UsersController();

export default usersController;