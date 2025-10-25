import env from "./config.js";
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dbConnect from "./helpers/dbConnect.helper.js";
import argvsHelper from "./helpers/argvs.helper.js";
import __dirname from "./utils/utils.js";
import serverRouter from "./routes/server.router.js";
import pathHandler from "./middlewares/pathHandler.mid.js";
import errorHandler from "./middlewares/errorHandler.mid.js";

// Cargar variables de entorno desde src/.env (subiendo un nivel)
dotenv.config({ path: path.join(__dirname, "../.env") });

const APP = express();
const PORT = env.PORT || 8000;

/* ----------- Conexión a la base de datos ----------- */
const ready = async () => {
    if (env.PERSISTENCE === "mongo") {
        await dbConnect(env.LINK_MONGODB);
        console.log(`🟢 MongoDB conectado. Modo: ${argvsHelper.mode}`);
    } else if (env.PERSISTENCE === "fs") {
        console.log("⚠️ Fs no implementado aún.");
    } else {
        console.log("⚠️ Persistencia en memoria no disponible.");
    }
};

/* ----------------- Middlewares --------------------- */

const allowedOrigins = [
    "http://localhost:3000",                             // desarrollo local
    "https://frontend-production-2871.up.railway.app",  // frontend en Railway
    "frontend-production-2871.up.railway.app",          // frontend en Railway sin https
    "https://www.emmendieta.com",                        // dominio custom con www
    "https://emmendieta.com",
];

APP.use(cors({
    origin: function(origin, callback) {
        if(!origin) return callback(null, true); // permite Postman o server-to-server
        if(allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"));
        }
    },
    credentials: true,
    methods: "GET,HEAD,OPTIONS,POST,PUT,DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
}));

APP.use(compression());
APP.use(cookieParser(env.SECRET));
APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));
APP.use(morgan("dev"));

/* -------------------- Rutas ------------------------ */
APP.use("/api", serverRouter);

// Ruta de prueba (puedes eliminar luego)
APP.get('/api/mensaje', (req, res) => {
    res.json({ mensaje: '¡Hola desde el backend!' });
});

/* ---------- Middleware 404 y de errores ------------ */
APP.use(pathHandler);
APP.use(errorHandler);

/* ----------------- Iniciar servidor ----------------- */
APP.listen(PORT, ready);
