const { PERSISTENCE } = process.env;
import crypto from "crypto";

class WorksDTO {
    constructor(data = {}) {
        if (PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
        };
        this.jobTitle = data.jobTitle;
        this.dateStart = data.dateStart;
        this.dateEnd = data.dateEnd;
        this.company = data.company;
        this.linkCompany = data.linkCompany;
        this.finished = data.finished;
        this.description = data.description;
        this.thumbnails = data.thumbnails || [];
        if (PERSISTENCE !== "mongo") {
            this.createdAt = new Date();
            this.updateAt = new Date();
        };
    };
};

export default WorksDTO;