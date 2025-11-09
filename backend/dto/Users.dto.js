const { PERSISTENCE } = process.env;
import crypto from "crypto";

class UsersDTO {
    constructor(data = {}) {
        if (PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
        };
        this.user = data.user;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role || ["user"];
        this.person = data.person;
        this.order = data.order;
        if (PERSISTENCE !== "mongo") {
            this.createdAt = new Date();
            this.updateAt = new Date();
        };
    };
};

export default UsersDTO;