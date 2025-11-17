import mongoose from "mongoose";

const proyectSchema = new mongoose.Schema(
    {
        title: { type: Map, of: String, required: true },
        dateStart: { type: Date },
        dateEnd: { type: Date },
        company: { type: Map, of: String, required: true },
        linkProyect: { type: String },
        linkCompany: { type: String },
        description: { type: Map, of: String, required: true },
        languages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "languages",
            required: true
        }],
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "categories",
            required: true
        }],
        thumbnails: [{type: String, default: ""}],
        order: { type: Number , required: true, default: 0 }
    },
    { timestamps: true }
);

export const ProyectsModel = mongoose.model("proyects", proyectSchema);