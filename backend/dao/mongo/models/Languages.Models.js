import mongoose from "mongoose";

const languageSchema  = new mongoose.Schema(
    {
        title: { type: String, required: true },
        percent: { type: Number, required: true },
        thumbnails: [{ type: String }]
    },
    { timestamps: true }
);

export const LanguagesModel  = mongoose.model("languages", languageSchema );