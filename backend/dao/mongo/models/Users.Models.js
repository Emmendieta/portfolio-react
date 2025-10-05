import mongoose from "mongoose";

const userSchema = new mongoose.Schema( 
    {
        user: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, default: 'user' },
        person: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "people",
        }
        //FALTA ASOCIAR: EDUCATIONS, LENGUAGES, PROYECTS, SOCIALMEDIAS, WORKS
    },
    { timestamps: true}
);

export const  UsersModel = mongoose.model("users", userSchema);