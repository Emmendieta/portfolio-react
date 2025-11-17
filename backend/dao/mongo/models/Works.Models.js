import mongoose from "mongoose";

const worksSchema = new mongoose.Schema(
    {
        jobTitle: { type: Map, of: String, required: true },
        dateStart: { type: Date, required: true },
        dateEnd: { type: Date },
        company: {  type: Map, of: String, required: true },
        linkCompany: { type: String },
        finished: { type: Boolean },
        description: { type: Map, of: String, required: true },
        thumbnails: { type: String },
        order: { type: Number , required: true, default: 0 }
    },
    { timestamps: true }    
);

export const WorksModel = mongoose.model("works", worksSchema);