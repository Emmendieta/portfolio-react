import categoriesService from "../services/categories.service.js";
import educationsService from "../services/educations.service.js";
import languagesService from "../services/languages.service.js";
import peopleService from "../services/people.service.js";
import proyectsService from "../services/proyects.service.js";
import socialMediasService from "../services/socialMedias.service.js";
import usersService from "../services/users.service.js";
import worksService from "../services/works.service.js";
import puppeteer from "puppeteer";
import { LANG_PDF } from "../utils/langPDF.js";

import fetch from "node-fetch";

class PDFController {
    constructor() {
        this.cService = categoriesService;
        this.eService = educationsService;
        this.lSrervice = languagesService;
        this.pService = peopleService;
        this.proService = proyectsService;
        this.sMService = socialMediasService;
        this.wService = worksService;
        this.uService = usersService;
    };

    getPeople = async () => {
        const people = await this.pService.readAll();
        return people[0] || null;
    };

    getEducations = async () => {
        const educations = await this.eService.readAll();
        return educations || [];
    };

    getLanguages = async () => {
        const languages = await this.lSrervice.readAll();
        return languages || [];
    };

    getProyects = async () => {
        const proyects = await this.proService.readAll();
        return proyects || [];
    };

    getSocialMedias = async () => {
        const socialMedias = await this.sMService.readAll();
        return socialMedias || [];
    };

    getWorks = async () => {
        const works = await this.wService.readAll();
        return works || [];
    };

    getCategories = async () => {
        const categories = await this.cService.readAll();
        return categories || [];
    };

    getUsers = async () => {
        const users = await this.uService.readAll();
        return users[0] || [];
    };

    getAll = async () => {
        try {
            const [person, users, educations, languages, proyects, socialMedias, works, categories] =
                await Promise.all([
                    this.getPeople(),
                    this.getUsers(),
                    this.getEducations(),
                    this.getLanguages(),
                    this.getProyects(),
                    this.getSocialMedias(),
                    this.getWorks(),
                    this.getCategories()
                ]);
            return { person, users, educations, languages, proyects, socialMedias, works, categories };
        } catch (error) {
            console.error("Error in getAll: ", error);
            throw error;
        }
    };

    getAllEndpoint = async (req, res) => {
        try {
            const data = await this.getAll();
            res.json200(data);
        } catch (error) {
            res.json500("Error fetching PDF data");
        }
    };

    formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    async toBase64(url) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Image not found");
            const buffer = await res.arrayBuffer();
            return `data:${res.headers.get("content-type")};base64,${Buffer.from(buffer).toString("base64")}`;
        } catch (err) {
            console.error("Error converting image to Base64:", err);
            return "/img/imagen-no-disponible.png"; // fallback
        }
    };

    generatePDF = async (req, res) => {
        try {
            const language = req.query.lang || "en";
            const TEXT = LANG_PDF[language] || LANG_PDF["en"];
            const { person, users, educations, languages, works } = await this.getAll();

            const EDUCATION_ORDER = {
                "Course": 1,
                "University": 2,
                "High School": 3,
                "Primary School": 4,
                "Conference": 5,
                "Other": 6
            };

            // Ordenar educaciones
            const sortedEducations = [...(educations || [])].sort(
                (a, b) => (EDUCATION_ORDER[a.typeEducation] || 99) - (EDUCATION_ORDER[b.typeEducation] || 99)
            );

            // Agrupar educaciones por tipo
            const groupedEducations = sortedEducations.reduce((acc, edu) => {
                const type = edu.typeEducation;
                if (!acc[type]) acc[type] = [];
                acc[type].push(edu);
                return acc;
            }, {});

            // Skills
            const hardSkills = languages.filter(l => l.type === "Hard") || [];
            const softSkills = languages.filter(l => l.type === "Soft") || [];
            const driverLicenses = [];
            const otherSoftSkills = [];
            softSkills.forEach(lang => {
                const titleLower = (lang.title?.get(language) || "").toLowerCase();
                if (titleLower.includes("carnet de conducir") || titleLower.includes("driver license")) {
                    driverLicenses.push(lang);
                } else {
                    otherSoftSkills.push(lang);
                }
            });

            // Ordenar trabajos
            const sortedWorks = [...(works || [])].sort((a, b) => {
                const dateA = new Date(a.dateEnd || a.dateStart);
                const dateB = new Date(b.dateEnd || b.dateStart);
                return dateB - dateA;
            });

            const personImage = person?.thumbnails?.[0]
                ? await this.toBase64(person.thumbnails[0])
                : "/img/imagen-no-disponible.png";

            // Generar HTML
            const html = `
                    <html>
                        <head>
                            <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                                background-color: #f4f4f4;
                                color: #333;
                                margin: 0;
                                padding: 0;
                            }

                            #pdfBody {
                                width: 100%;
                                max-width: 800px; /* Limitar el ancho máximo */
                                margin: 0 auto; /* Centrar el contenido */
                                display: flex;
                                flex-direction: column;
                                background-color: #fff;
                                padding: 30px;
                                border-radius: 8px;
                            }

                            #pdfDivTitle {
                                width: 100%;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                margin-bottom: 30px;
                            }

                            #pdfTitleSecTop h1 {
                                margin: 0;
                                color: #2c3e50;
                                font-weight: bolder;
                                font-size: 2.5rem;
                                text-transform: uppercase;
                            }

                            #pdfTitleSecMiddle h1 {
                                margin-bottom: 10px;
                                color: #3498db;
                                font-size: 1.75rem;
                                font-weight: normal;
                            }

                            #pdfTitleSecBottom {
                                width: 75%;
                                border-bottom: 3px solid #3498db;
                                margin-top: 15px;
                            }

                            #pdfDivPersonBody {
                                width: 100%;
                                display: flex;
                                flex-direction: column;
                                margin-bottom: 40px;
                            }

                            #pdfPersonSec, #pdfEducations, #pdfWorks, #pdfLanguages {
                                width: 100%;
                                margin: 25px 0;
                            }

                            #pdfPersonSec h2,
                            #pdfEducationsSec h2,
                            #pdfWorksSec h2,
                            #pdfLanguagesSec h2 {
                                font-size: 1.75rem;
                                color: #34495e;
                                border-bottom: 2px solid #ecf0f1;
                                padding-bottom: 10px;
                                margin-bottom: 20px;
                            }

                            #pdfPersonSecInfo {
                                display: flex;
                                flex-direction: row;
                                justify-content: space-between;
                                margin-bottom: 25px;
                                width: 100%; /* Asegurarse de que el contenido no se desborde */
                                box-sizing: border-box; /* Incluir padding y márgenes en el cálculo del ancho */
                            }

                            .pdfPersonImg {
                                max-width: 250px;
                                max-height: 250px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                border-radius: 15px;
                            }

                            h3 {
                                margin-bottom: 10px;
                                font-size: 1rem;
                            }

                            #pdfEducationsSec, #pdfWorksSec, #pdfLanguagesSec {
                                margin-bottom: 30px;
                            }

                            #pdfEducationSecBottom {
                                margin-bottom: 30px;
                            }

                            .pdfLanguesTypes {
                                font-size: 1.25rem;
                                font-weight: bold;
                                color: #e67e22;
                                margin-bottom: 15px;
                            }

                            .pdfLanguesTypesOther {
                                font-size: 1.25rem;
                                font-weight: bold;
                                color: #16a085;
                                margin-top: 35px;
                            }

                            /* Estilos para los contenedores de cada sección */
                            section {
                                margin-bottom: 15px;
                            }

                            section h3 {
                                font-size: 1.1rem;
                                color: #34495e;
                                margin-bottom: 8px;
                            }

                            section div {
                                margin-bottom: 10px;
                            }

                            /* Colores de fondo suaves para separar las secciones */
                            .pdfPersonImg {
                                border-radius: 8px;
                                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            }

                            /* Fondo y bordes elegantes */
                            #pdfDivPersonBody, #pdfEducations, #pdfWorks, #pdfLanguages {
                                background-color: #ecf0f1;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                            }

                            /* Espaciado entre items */
                            .pdfPersonImg {
                                margin-left: 20px;
                            }

                            #pdfLanguagesOtherSec {
                                margin-top: 25px;
                            }

                            /* Para evitar desbordamientos inesperados */
                            * {
                                box-sizing: border-box;
                            }

                            /* Asegura que no haya desbordamiento en el contenedor principal */
                            #pdfContent {
                                overflow: hidden;
                            }

                            </style>
                        </head>
                        <body id="pdfBody">
                            <div id="pdfContent">

                            <!-- PERSON -->
                            <div id="pdfDivTitle">
                                <section id="pdfTitleSecTop"><h1>${person?.firstName || ""} ${person?.lastName || ""}</h1></section>
                                <section id="pdfTitleSecMiddle"><h1>${TEXT.CURRICULUM_VITAE}</h1></section>
                                <section id="pdfTitleSecBottom"></section>
                            </div>

                            <div id="pdfDivPersonBody">
                                <section id="pdfPersonSec"><h2>${TEXT.PERSONAL_INFORMATION}</h2></section>
                                <section id="pdfPersonSecInfo">
                                <div>
                                    <h3>${TEXT.DNI} ${person?.dni || ""}</h3>
                                    <h3>${TEXT.LOCATION} ${person?.city || ""} - ${person?.province || ""} - ${person?.country || ""}</h3>
                                    <h3>${TEXT.DATE_BIRTHDAY} ${person?.birthday ? this.formatDate(person.birthday) : ""}</h3>
                                    <h3>${TEXT.EMAIL} ${users?.email || ""}</h3>
                                </div>
                                <div>
                                    <img src="${personImage}" class="pdfPersonImg" />
                                </div>
                                </section>
                            </div>

                            <!-- EDUCATIONS -->
                            <div id="pdfEducations">
                                <section id="pdfEducationsSec"><h2>${TEXT.ACADEMIC_FORMATION}</h2></section>
                                ${Object.keys(groupedEducations).map(type => `
                                <section id="pdfEducationSecBottom">
                                    <h2>${TEXT.TYPE_LABELS[type][language]}</h2>
                                    ${groupedEducations[type].map(edu => `
                                    <div>
                                        <h3>${TEXT.INSTITUTION} ${edu.institutionName?.get(language) || ""}</h3>
                                        <h3>${TEXT.DEGREE} ${edu.title?.get(language) || ""}</h3>
                                        <h3>${TEXT.START} ${this.formatDate(edu.dateStart)} - ${TEXT.END} ${this.formatDate(edu.dateEnd)}</h3>
                                    </div>
                                    `).join("")}
                                </section>
                                `).join("")}
                            </div>

                            <!-- WORKS -->
                            <div id="pdfWorks">
                                <section id="pdfWorksSec"><h2>${TEXT.PROFESSIONAL_EXPERIENCE}</h2></section>
                                ${sortedWorks.map(work => `
                                <div>
                                    <h3>${TEXT.COMPANY} ${work.company?.get(language) || ""}</h3>
                                    <h3>${TEXT.JOB_TITLE} ${work.jobTitle?.get(language) || ""}</h3>
                                    <h3>${TEXT.START} ${this.formatDate(work.dateStart)} - ${TEXT.END} ${this.formatDate(work.dateEnd)}</h3>
                                </div>
                                `).join("")}
                            </div>

                            <!-- LANGUAGES / SKILLS -->
                            <div id="pdfLanguages">
                                <section id="pdfLanguagesSec"><h2>${TEXT.ABILITIES}</h2></section>
                                ${hardSkills.length ? `
                                <section>
                                    <h3 class="pdfLanguesTypes">${TEXT.HARD_SKILLS}:</h3>
                                    ${hardSkills.map(lang => `<div><h3>${lang.title?.get(language) || ""}</h3></div>`).join("")}
                                </section>` : ""}
                                ${otherSoftSkills.length ? `
                                <section>
                                    <h3 class="pdfLanguesTypes">${TEXT.SOFT_SKILLS}:</h3>
                                    ${otherSoftSkills.map(lang => `<div><h3>${TEXT.TITLE}: ${lang.title?.get(language) || ""}</h3></div>`).join("")}
                                </section>` : ""}
                                ${driverLicenses.length ? `
                                <section id="pdfLanguagesOtherSec">
                                    <h3 class="pdfLanguesTypesOther">${TEXT.OTHERS}</h3>
                                    ${driverLicenses.map(lang => `<div><h3>${lang.title?.get(language) || ""}</h3></div>`).join("")}
                                </section>` : ""}
                            </div>

                            </div>
                        </body>
                        </html>
            `
            const browser = await puppeteer.launch({ headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: "networkidle0" });
            const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
            await browser.close();

            // Enviar PDF al frontend
            res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Curriculum-Mendieta-Emiliano-Manuel.pdf"`
            });
            res.send(pdfBuffer);

        } catch (error) {
            console.error("PDF ERROR:", error);
            return res.status(500).json({ message: "Error generating PDF" });
        }
    };
};

const pdfController = new PDFController();

export default pdfController;