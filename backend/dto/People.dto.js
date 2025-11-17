const { PERSISTENCE } = process.env;
import crypto from "crypto";

class PeopleDTO {
    constructor(data = {}) {
        if (PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
        };
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.dni = data.dni;
        this.cuil = data.cuil;
        this.birthday = data.birthday;
        this.jobTitles = data.jobTitles;
        this.about = typeof data.about === "string" ? { en: data.about } : data.about;
        this.city = data.city;
        this.province = data.province;
        this.country = data.country;
        this.thumbnails = data.thumbnails;
        this.banners = data.banners;
        this.user = data.user || ["user"];
        if (PERSISTENCE !== "mongo") {
            this.createdAt = new Date();
            this.updateAt = new Date();
        };
    };
};

export default PeopleDTO;