import { connect } from "mongoose";

const dbConnect = async (link) => {
    try {
        await connect(link);
        //FALTA LOGGER PARA CUANDO SE CONECTA A MONGO;
        console.log("Connected to MongoDB");
    } catch (error) {
        // FALTA LOGGER PARA ERROR.
        console.log(error);
    }
};

export default dbConnect;