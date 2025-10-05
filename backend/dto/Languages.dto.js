const { PERSISTENCE } = process.env;
import crypto from "crypto";

class LanguagesDTO {
    constructor(data = {}) {
        if (PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
        };
        this.title = data.title;
        this.percent = data.percent;
        this.thumbnails = data.thumbnails;
        if (PERSISTENCE !== "mongo") {
            this.createdAt = new Date();
            this.updateAt = new Date();
        };
    };
};

export default LanguagesDTO;