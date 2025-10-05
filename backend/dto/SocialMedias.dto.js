const { PERSISTENCE } = process.env;
import crypto from "crypto";

class SocialMediasDTO {
    constructor(data = {}) {
        if (PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
        };
        this.title = data.title;
        this.linkSocial = data.linkSocial;
        this.type = data.type || "social";
        this.thumbnails = data.thumbnails || [];
        if (PERSISTENCE !== "mongo") {
            this.createdAt = new Date();
            this.updateAt = new Date();
        };
    };
};

export default SocialMediasDTO;