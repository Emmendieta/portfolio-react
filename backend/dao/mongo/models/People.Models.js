import mongoose from "mongoose";

const peopleSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        dni: { type: Number, required: true },
        cuil: { type: String, required: true },
        birthday: { type: Date, required: true },
        jobTitles: { type: Map, of: String },
        about: { type: Map, of: String, required: true },
        city: { type: String },
        province: { type: String },
        country: { type: String },
        thumbnails: [{ type: String }],
        banners: [{ type: String }]
    },
    {
        timestamps: true,
        collection: "people"
    }
);

export const PeopleModel = mongoose.model("people", peopleSchema);