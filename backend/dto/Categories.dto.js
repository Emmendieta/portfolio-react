const { PERSISTENCE } = process.env;
import crypto from "crypto";

class CategoriesDTO {
    constructor(data = {}) {
        if (PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
        };
        this.title = typeof data.title === "string" ? { en: data.title } : data.title;
        this.thumbnails = data.thumbnails;
        this.order = data.order;
        if (PERSISTENCE !== "mongo") {
            this.createdAt = new Date();
            this.updateAt = new Date();
        };
    };
};

export default CategoriesDTO;