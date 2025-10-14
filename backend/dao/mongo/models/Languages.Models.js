import mongoose from "mongoose";

const languageSchema  = new mongoose.Schema(
    {
        title: { type: String, required: true },
        percent: { type: Number, required: true },
        thumbnails: { type: String },
        type: {
            type: String,
            enum: ["Hard", "Soft"],
            required:true,
            default: "Hard"
        }
    },
    { timestamps: true }
);

export const LanguagesModel  = mongoose.model("languages", languageSchema );