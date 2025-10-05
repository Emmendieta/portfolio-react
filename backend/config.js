import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

export default {
    PORT: process.env.PORT,
    LINK_MONGODB: process.env.LINK_MONGODB,
    SECRET: process.env.SECRET,
    PERSISTENCE: process.env.PERSISTENCE,
};