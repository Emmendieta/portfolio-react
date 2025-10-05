import mongoose from "mongoose";

const proyectSchema = new mongoose.Schema(
    {
        title: {type: String, required: true },
        dateStart: { type: Date },
        dateEnd: { type: Date },
        company: { type: String, required: true },
        linkProyect: { type: String },
        linkCompany: { type: String },
        description: { type: String, required: true },
        languages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "languages",
            required: true
        }]
    },
    { timestamps: true }
);

export const ProyectsModel = mongoose.model("proyects", proyectSchema);