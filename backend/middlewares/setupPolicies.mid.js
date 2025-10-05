import { isValidObjectId } from "mongoose";
import { verifyToken } from "../helpers/token.helper.js";
import { usersRepository } from "../repositories/repository.js";

const setupPolicies = (policies) => async (req, res, next) => {
    try {
        if(policies.includes("public")) { return next(); };
        const token = req?.cookies?.token;
        if(!token) { return res.json401(); };
        const data = verifyToken(token);
        const { user_id, email, role } = data;
        if (!isValidObjectId(user_id)) { return res.json401("Invalid User Id!"); };
        if(!user_id || !email || !role) { return res.json401("Invalid Data from User!"); };
        const listRoles = {
            user: policies.includes("user"),
            admin: policies.includes("admin")
        };
        if (!listRoles[role]) { return res.json401("Invalid type of Role!"); };
        const user = await usersRepository.readById(user_id);
        if(!user) { return res.json404("User not Found!"); };
        //Ver si aca en el req paso menos informacion del usuario:
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export default setupPolicies;