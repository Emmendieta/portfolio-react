import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const educationSchema = new mongoose.Schema(
    {
        institutionName: { type: String, required: true },
        title: { type: String, required: true },
        dateStart: { type: Date, required: true },
        dateEnd: { type: Date },
        linkInstitution: { type: String },
        iconInstitution: {type: String },
        certificate: { type: String },
        linkCertificate: { type: String },
        finished: { type: Boolean },
        typeEducation: {
            type: String,
            enum: ["Primary School", "High School", "University", "Course", "Conference"],
            required: true
        },
        description: { type: String, required: true }
    },
    { timestamps: true }
);

educationSchema.plugin(paginate);

export const EducationModel = mongoose.model(
    "educations",
    educationSchema
);