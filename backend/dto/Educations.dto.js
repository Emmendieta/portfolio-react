const { PERSISTENCE } = process.env;

const VALID_EDUCATION_TYPES = [
    "Primary School",
    "High School",
    "University",
    "Course",
    "Congress"
];

class EducationsDTO {
    constructor(data = {}) {
        if (PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
        };
        this.institutionName = data.institutionName;
        this.title = data.title;
        this.dateStart = data.dateStart;
        this.dateEnd = data.dateEnd;
        this.linkInstitution = data.linkInstitution;
        this.iconInstitution = data.iconInstitution;
        this.certificate = data.certificate;
        this.linkCertificate = data.linkCertificate;
        this.finished = data.finished;
        this.description = data.description;
        if (VALID_EDUCATION_TYPES.includes(data.typeEducation)) {
            this.typeEducation = data.typeEducation;
        } else {
            throw new Error(
                `Invalid typeEducation: "${data.typeEducation}". Valid values: ${VALID_EDUCATION_TYPES.join(", ")}`
            );
        }
        if (PERSISTENCE !== "mongo") {
            this.createdAt = new Date();
            this.updateAt = new Date();
        };
    };
};

export default EducationsDTO;