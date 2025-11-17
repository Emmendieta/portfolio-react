const { PERSISTENCE } = process.env;
import crypto from "crypto";

class WorksDTO {
    constructor(data = {}) {
        if (PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
        };
        this.jobTitle = typeof data.jobTitle === "string" ? { en: data.jobTitle } : data.jobTitle;
        this.dateStart = data.dateStart;
        this.dateEnd = data.dateEnd;
        this.company = typeof data.company === "string" ? { en: data.company } : data.company;
        this.linkCompany = data.linkCompany;
        this.finished = data.finished;
        this.description = typeof data.description === "string" ? { en: data.description } : data.description;
        this.thumbnails = data.thumbnails || [];
        this.order = data.order;
        if (PERSISTENCE !== "mongo") {
            this.createdAt = new Date();
            this.updateAt = new Date();
        };
    };
};

export default WorksDTO;