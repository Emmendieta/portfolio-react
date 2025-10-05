import { config } from "dotenv";
import argvsHelper from "./argvs.helper.js";

const mode = argvsHelper.mode;
const path = `.env.${mode}`;

config({ path });

const env = {
    PORT: process.env.PORT,
    LINK_MONGODB: process.env.LINK_MONGODB,
    SECRET: process.env.SECRET
};

export default env;