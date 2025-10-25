import mongoose from "mongoose";

const socialMediasSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        linkSocial: { type: String, required: true },
        type: { type: String, required: true, default:"Social Media" }, 
        thumbnails: { type: String },
        order: { type: Number , required: true, default: 0 }
    },
    { timestamps: true }
);

export const SocialMediaModel = mongoose.model("socialMedias", socialMediasSchema);