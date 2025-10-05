import mongoose from "mongoose";

const worksSchema = new mongoose.Schema(
    {
        jobTitle: { type: String, required: true },
        dateStart: { type: Date, required: true },
        dateEnd: { type: Date },
        company: { type: String, required: true },
        linkCompany: { type: String },
        finished: { type: Boolean },
        description: { type: String, required: true },
        thumbnails: [{ type: String }]
    },
    { timestamps: true }    
);

export const WorksModel = mongoose.model("works", worksSchema);