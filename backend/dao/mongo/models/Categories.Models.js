import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        title: { type: String, required: true},
        thumbnails: { type: String },
        order: { type: Number , required: true, default: 0 }
    },
    { timestamps: true }
);

export const CategoryModel = mongoose.model(
    "categories",
    categorySchema
);
