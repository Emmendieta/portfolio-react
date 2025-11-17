const { PERSISTENCE } = process.env;
import crypto from "crypto";

class ProyectsDTO {
    constructor(data = {}) {
        if (PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
        };
        this.title = typeof data.title === "string" ? { en: data.title } : data.title;
        this.dateStart = data.dateStart;
        this.dateEnd = data.dateEnd;
        this.linkProyect = data.linkProyect;
        this.company = typeof data.company === "string" ? { en: data.company } : data.company;
        this.linkCompany = data.linkCompany;
        this.description = typeof data.description === "string" ? { en: data.description } : data.description;
        this.languages = data.languages || [""];
        this.categories = data.categories || [""],
        this.thumbnails = data.thumbnails || [""];
        this.order = data.order;
        if (PERSISTENCE !== "mongo") {
            this.createdAt = new Date();
            this.updateAt = new Date();
        };
    };
};

export default ProyectsDTO;

