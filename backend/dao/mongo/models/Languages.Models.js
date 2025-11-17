import mongoose from "mongoose";

const languageSchema  = new mongoose.Schema(
    {
        title: { type: Map, of: String, required: true },
        percent: { type: Number, required: true },
        thumbnails: { type: String },
        type: {
            type: String,
            enum: ["Hard", "Soft"],
            required:true,
            default: "Hard"
        },
        order: { type: Number , required: true, default: 0 }
    },
    { timestamps: true }
);

export const LanguagesModel  = mongoose.model("languages", languageSchema );