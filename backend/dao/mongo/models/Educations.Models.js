import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const educationSchema = new mongoose.Schema(
    {
        institutionName: { type: Map, of: String, required: true },
        title: { type: Map, of: String, required: true },
        dateStart: { type: Date, required: true },
        dateEnd: { type: Date },
        linkInstitution: { type: String },
        iconInstitution: {type: String },
        certificate: { type: String },
        linkCertificate: { type: String },
        finished: { type: Boolean },
        typeEducation: {
            type: String,
            enum: ["Primary School", "High School", "University", "Course", "Conference", "Other"],
            required: true
        },
        description: { type: Map, of: String, required: true },
        order: { type: Number , required: true, default: 0 }
        
    },
    { timestamps: true }
);

educationSchema.plugin(paginate);

export const EducationModel = mongoose.model(
    "educations",
    educationSchema
);