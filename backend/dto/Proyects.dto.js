const { PERSISTENCE } = process.env;
import crypto from "crypto";

class ProyectsDTO {
    constructor(data = {}) {
        if (PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
        };
        this.title = data.title;
        this.dateStart = data.dateStart;
        this.dateEnd = data.dateEnd;
        this.linkProyect = data.linkProyect;
        this.company = data.company;
        this.linkCompany = data.linkCompany;
        this.description = data.description;
        this.languages = data.languages || [""];
        if (PERSISTENCE !== "mongo") {
            this.createdAt = new Date();
            this.updateAt = new Date();
        };
    };
};

export default ProyectsDTO;

