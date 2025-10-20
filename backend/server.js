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
/* APP.use(cors({
    origin: [
        "http://localhost:3000",
        "https://portfolio-react-production-6460.up.railway.app",
        "https://frontend-production-2871.up.railway.app/"
    ],
    credentials: true
})); */

const allowedOrigins = [
    "http://localhost:3000",                            // desarrollo local
    "https://frontend-production-2871.up.railway.app",
    "frontend-production-2871.up.railway.app",  // frontend en Railway
];

APP.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }

    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    // Responder automáticamente a las preflight requests
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

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
