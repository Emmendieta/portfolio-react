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
import QRCode from "qrcode";

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
        const populateFields = ["languages", "categories"];
        const proyects = await this.proService.readAllAndPopulate(populateFields);
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

            console.log("PROYECTOS", proyects);
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

    generateQR = async (url) => {
        try {
            return await QRCode.toDataURL(url, { width: 150 });
        } catch (error) {
            console.error("Error generating QR code: ", error);
            return "";
        }
    };

    generatePDF = async (req, res) => {
        try {
            const language = req.query.lang || "en";
            const TEXT = LANG_PDF[language] || LANG_PDF["en"];
            const { person, users, educations, languages, works, proyects } = await this.getAll();

/*             const EDUCATION_ORDER = {
                "Course": 1,
                "University": 2,
                "High School": 3,
                "Primary School": 4,
                "Conference": 5,
                "Other": 6
            }; */

            const EDUCATION_ORDER = [
    "Course",
    "University",
    "High School",
    "Primary School",
    "Conference",
    "Other"
];

            // Ordenar educaciones
            /* const sortedEducations = [...(educations || [])].sort(
                (a, b) => (EDUCATION_ORDER[a.typeEducation] || 99) - (EDUCATION_ORDER[b.typeEducation] || 99)
            ); */

            const sortedEducations = [...(educations || [])].sort((a, b) =>
                new Date(b.dateStart) - new Date(a.dateStart)
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
            const sortedWorks = [...(works || [])].sort((a, b) =>
                new Date(b.dateStart) - new Date(a.dateStart)
            );

            //Para separar en dos columnas los trabajos:
            const mid = Math.ceil(sortedWorks.length / 2);
            const leftWorks = sortedWorks.slice(0, mid);   // más nuevos
            const rightWorks = sortedWorks.slice(mid);     // más viejos

            const personImage = person?.thumbnails?.[0] ? await this.toBase64(person.thumbnails[0]) : "/img/imagen-no-disponible.png";

            const qrCodeImage = await this.generateQR("https://www.emmendieta.com/");


            const html = `
            <html>
<head>
<style>

/* RESET */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
}

.page-section {
    break-inside: avoid;
    page-break-inside: avoid;
}

body {
    padding-bottom: 60px;
}

main {
  margin-bottom: 80px; /* o más según altura del footer */
}

/* ================= HEADER ================= */

#header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-left: 30px;
    padding-right: 30px;
    height: 20%;

    background: linear-gradient(
        to right,
        #929292 0%,
        #bdbdbd 25%,
        #ffffff 50%,
        #bdbdbd 75%,
        #929292 100%
    );
}

#header section {
    flex: 1;
    height: 100%;
}

/* IZQUIERDA */
#hdNameWork {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

/* nombre */
#hdName h1 {
    text-align: center;
    margin-bottom: 5px;
    font-size: 22px;
    color: #2c3e50;
}

/* titulo */
#hdWorkTitle h3 {
    margin-top: 10px;
    text-align: center;
    font-weight: normal;
    color: white;
    font-size: 14px;
}

/* CENTRO */
#hdImage {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

#hdImg {
    height: 100%;
    width: auto;
    object-fit: cover;
}

/* DERECHA */
#hdPersonalInfo {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* contenedor interno para centrar bloque pero texto a la izquierda */
#hdPersonalInfoBox {
    width: 85%;
    display: flex;
    flex-direction: column;
}

/* textos */
#hdPersonalInfoBox h3 {
    font-weight: normal;
    font-size: 12px;
    text-align: left;
    margin-top: 5px;
    color: #2c3e50;
}

#pdfWorks {
    margin-top: 20px;
}

/* HEADER */
#pdfWorksSec {
    margin: 20px 40px 10px 40px; /* más aire lateral real */
}

#pdfWorksSec h2 {
    margin: 0;
}

/* CONTENEDOR */
#worksContainer {
    padding: 0 40px; /* 🔥 clave: margen real de contenido */
}

/* LISTA */
.column {
    width: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
}

/* ITEM */
.column li {
    position: relative;
    padding-left: 30px; /* 🔥 más espacio para no quedar pegado */
    margin-bottom: 18px;
}

/* PUNTO */
.column li::before {
    content: "";
    position: absolute;
    left: 8px; /* 🔥 antes estaba muy al borde */
    top: 8px;
    width: 10px;
    height: 10px;
    background: black;
    border-radius: 50%;
}

/* LINEA */
.column li::after {
    content: "";
    position: absolute;
    left: 12px;
    top: 18px;
    width: 2px;
    height: calc(100% + 10px);
    background: #999;
}

/* ÚLTIMO ITEM */
.column li:last-child::after {
    display: none;
}

/* TEXTO */
.jobTitle {
    font-weight: bold;
    margin-bottom: 3px;
}

.date {
    font-size: 0.9rem;
    color: #555;
}
    
/* ------------------ EDUCATIONS ------------------- */

#pdfEducations {
    margin-top: 20px;
}

/* 🔥 MISMO MARGEN QUE WORKS */
#pdfEducationsSec {
    margin: 20px 30px 20px 30px;
}

#pdfEducationsSec h2 {
    margin: 0;
}

/* Tipo */
.educationType {
    margin: 10px 30px;
    font-weight: bold;
}

/* LISTA (igual lógica que column pero 1 sola) */
.educationColumn {
    list-style: none;
    padding: 0 30px; /* 🔥 mismo padding lateral */
    min-height: 40px;
}

/* ITEM */
.educationColumn li {
    position: relative;
    padding-left: 25px;
    margin-bottom: 15px;
    min-height: 60px; /* 🔥 CLAVE */
}

/* 🔥 PUNTO (MISMA POSICIÓN QUE WORKS) */
.educationColumn li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px; /* 🔥 igual que works */
    width: 10px;
    height: 10px;
    background: black;
    border-radius: 50%;
}

/* 🔥 LINEA (MISMO COLOR QUE WORKS) */
.educationColumn li::after {
    content: "";
    position: absolute;
    left: 4px;
    top: 18px;
    width: 2px;
    height: 40px; /* 🔥 altura fija */
    background: #999;
}

/* 🔥 ÚLTIMO ITEM */
.educationColumn li:last-child::after {
    display: none;
}

/* TEXTO */
.educationTitle {
    font-weight: bold;
    margin-bottom: 3px;
}

.educationDate {
    font-size: 0.9rem;
    color: #555;
}

/* -------------------------- SKILLS ------------------------- */

#pdfSkills {
    margin-top: 20px;
}

/* TITULO */
#pdfSkillsSec {
    margin: 20px 30px;
}

.skillsSection {
    margin-top: 25px;  /* 🔥 separación entre bloques */
}

.skillsTitle {
    margin: 10px 30px;
    font-weight: bold;
}

/* GRID GENERAL */
.skillsGrid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center; /* 🔥 centra si sobra espacio */
    gap: 20px;
    padding: 0 30px;
}

/* HARD SKILLS (2 por fila) */
.hardGrid .skillItem {
    width: 45%; /* 🔥 2 por fila */
}

.skillsGrid.softGrid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 30px;
    gap: 25px 50px; /* 🔥 más espacio (vertical | horizontal) */
}

/* SOFT SKILLS (3 por fila) */
.softSkillItem {
    width: calc(33.33% - 50px); /* 🔥 compensa el gap horizontal */
    text-align: center;
}

/* NOMBRE */
.skillName {
    font-size: 0.95rem;
    margin-bottom: 5px;
}

/* -------- HARD BAR -------- */
.skillBar {
    width: 100%;
    height: 8px;
    background: #ddd;
    border-radius: 5px;
    overflow: hidden;
}

.skillBarFill {
    height: 100%;
    background: #1e5631; /* 🔥 verde oscuro */
}

/* -------- SOFT BARS -------- */
.softBars {
    display: flex;
    gap: 5px;
}

.softBar {
    flex: 1;
    height: 8px;
    background: #ddd;
    border-radius: 3px;
}

.softBar.active {
    background: #1e5631; /* 🔥 verde oscuro */
}

.skillsGrid.licenseGrid {
    display: flex;
    justify-content: center;
    padding: 0 30px;
    
}

.licenseItem {
    font-size: 0.95rem;
    text-align: center;
}

/* -------------------------- PROYECTS ------------------------- */

#pdfProjects {
    margin-top: 20px;
}

/* HEADER SECTION */
#pdfProjectsSec {
    margin: 20px 30px 20px 30px;
}

#pdfProjectsSec h2 {
    margin: 0;
}

/* LISTA */
#projectsContainer {
    list-style: none;
    padding: 0 30px;
}

/* ITEM PRINCIPAL */
.projectItem {
    position: relative;
    padding-left: 25px;
    margin-bottom: 25px; /* 🔥 MÁS ESPACIO ENTRE PROYECTOS */
    min-height: 60px;

    display: flex;
    flex-direction: column;
    gap: 6px; /* 🔥 ESPACIO ENTRE TODOS LOS ELEMENTOS INTERNOS */
}

/* 🔥 PUNTO (igual education) */
.projectItem::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 10px;
    height: 10px;
    background: black;
    border-radius: 50%;
}

/* 🔥 LINEA (igual education) */
.projectItem::after {
    content: "";
    position: absolute;
    left: 4px;
    top: 18px;
    width: 2px;
    height: 40px;
    background: #999;
}

/* 🔥 ÚLTIMO ITEM */
.projectItem:last-child::after {
    display: none;
}

/* TITLE */
.projectTitle {
    font-weight: bold;
    margin-bottom: 6px;
}

/* COMPANY */
.projectCompany {
    font-size: 0.95rem;
    margin-bottom: 4px;
}

/* DATE */
.projectDate {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 6px;
}

/* DESCRIPTION */
.projectDescription {
    font-size: 0.9rem;
    margin-bottom: 10px; /* 🔥 más aire acá */
}

/* META BLOCKS */
.projectMeta {
    display: flex;
    flex-direction: column;
    gap: 12px; /* 🔥 separación entre languages y categories */
}

/* SUB BLOCK (Languages / Categories) */
.projectBlock {
    display: flex;
    flex-direction: column;
    gap: 6px; /* 🔥 título vs tags */
}

/* TITLES */
.projectBlockTitle {
    font-size: 0.85rem;
    font-weight: bold;
    color: #444;
}

/* TAGS CONTAINER */
.projectLanguages,
.projectCategories {
    display: flex;
    flex-wrap: wrap;
    gap: 8px; /* 🔥 entre tags */
}

/* TAG */
.tag {
    font-size: 0.75rem;
    background: #e0e0e0;
    padding: 2px 6px;
    border-radius: 4px;
}

/* -------------------------- QR ------------------------- */

.qrContainer {
    width: 100%;
    display: flex;
    justify-content: center;

    margin-top: 40px;   /* separación del contenido */
    margin-bottom: 80px; /* evita choque con footer */
}

.pdfQR {
    width: 180px;
    height: 180px;
}

/* -------------------------- FOOTER ------------------------- */

#footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    height: 40px;

    background: linear-gradient(
        to right,
        #bdbdbd 0%,
        #e0e0e0 50%,
        #bdbdbd 100%
    );

    z-index: 9999;
}

#mainId {
    padding-bottom: 90px;
    margin-bottom: 90px;
}

</style>
</head>

<body>
<div id="pdfContent">

    <!-- HEADER -->
    <header id="header">

        <!-- IZQUIERDA -->
        <section id="hdNameWork">
            <div id="hdName">
                <h1>${person?.firstName || ""} ${person?.lastName || ""}</h1>
            </div>
            <div id="hdWorkTitle">
                <h3>${person?.jobTitles.get(language)}</h3>
            </div>
        </section>

        <!-- CENTRO -->
        <section id="hdImage">
            <img src="${personImage}" id="hdImg">
        </section>

        <!-- DERECHA -->
        <section id="hdPersonalInfo">
            <div id="hdPersonalInfoBox">
                <h3>Dirección Personal: Brown 274 ${person?.city || ""}-${person?.province || ""}-${person?.country || ""}</h3>
                <h3>Dirección Especial: Brown 274 ${person?.city || ""}-${person?.province || ""}-${person?.country || ""}</h3>
                <h3>${TEXT.DATE_BIRTHDAY} ${person?.birthday ? this.formatDate(person.birthday) : ""}</h3>
                <h3>${TEXT.EMAIL} ${users?.email || ""}</h3>
                <h3>Teléfono: +549280238041</h3>
                <h3>${TEXT.DNI} ${person?.dni || ""}</h3>
            </div>
        </section>

    </header>

    <main id="mainId">
<!-- WORKS -->
<div id="pdfWorks">
    <section id="pdfWorksSec">
        <h2>${TEXT.PROFESSIONAL_EXPERIENCE}</h2>
    </section>

    <ul class="column">
        ${sortedWorks.map(work => `
            <li>
                <h3 class="jobTitle">
                    ${work.jobTitle?.get(language) || ""}
                </h3>
                <p>${work.company?.get(language) || ""}</p>
                <p class="date">
                    ${this.formatDate(work.dateStart)} - ${this.formatDate(work.dateEnd)}
                </p>
            </li>
        `).join("")}
    </ul>

</div>

<!-- EDUCATIONS VIEJO -->
<!-- <div id="pdfEducations" class="page-section">

    <section id="pdfEducationsSec">
        <h2>${TEXT.ACADEMIC_FORMATION}</h2>
    </section>

    ${Object.keys(groupedEducations).map(type => `
        <section class="educationGroup">

            <h3 class="educationType">
                ${TEXT.TYPE_LABELS[type][language]}
            </h3>

            <ul class="educationColumn">
                ${groupedEducations[type].map(edu => `
                    <li>
                        <div class="educationContent">
                            <div class="educationTitle">
                                ${edu.title?.get(language) || ""}
                            </div>

                            <div>
                                ${edu.institutionName?.get(language) || ""}
                            </div>

                            <div class="educationDate">
                                ${this.formatDate(edu.dateStart)} - ${this.formatDate(edu.dateEnd)}
                            </div>
                        </div>
                    </li>
                `).join("")}
            </ul>

        </section>
    `).join("")}

</div> -->


<!-- EDUCATIONS -->
${EDUCATION_ORDER
    .filter(type => groupedEducations[type])
    .map(type => `
        <section class="educationGroup">

            <h3 class="educationType">
                ${TEXT.TYPE_LABELS[type][language]}
            </h3>

            <ul class="educationColumn">
                ${groupedEducations[type].map(edu => `
                    <li>
                        <div class="educationContent">
                            <div class="educationTitle">
                                ${edu.title?.get(language) || ""}
                            </div>

                            <div>
                                ${edu.institutionName?.get(language) || ""}
                            </div>

                            <div class="educationDate">
                                ${this.formatDate(edu.dateStart)} - ${this.formatDate(edu.dateEnd)}
                            </div>
                        </div>
                    </li>
                `).join("")}
            </ul>

        </section>
    `).join("")}

<!-- SKILLS -->
<div id="pdfSkills" class="page-section">

    <section id="pdfSkillsSec">
        <h2>${TEXT.ABILITIES}</h2>
    </section>

    <!-- HARD SKILLS -->
    ${hardSkills.length ? `
    <section class="skillsSection">
        <h3 class="skillsTitle">${TEXT.HARD_SKILLS}</h3>

        <div class="skillsGrid hardGrid">
            ${hardSkills.map(skill => `
                <div class="skillItem">
                    <div class="skillName">
                        ${skill.title?.get(language) || ""}
                    </div>

                    <div class="skillBar">
                        <div 
                            class="skillBarFill" 
                            style="width: ${skill.percent || 0}%">
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>
    </section>
    ` : ""}

    <!-- SOFT SKILLS -->
    ${otherSoftSkills.length ? `
    <section class="skillsSection">
        <h3 class="skillsTitle">${TEXT.SOFT_SKILLS}</h3>

        <div class="skillsGrid softGrid">
            ${otherSoftSkills.map(skill => {
                const percent = skill.percent || 0;
                let level = 1;
                if (percent > 25) level = 2;
                if (percent > 50) level = 3;
                if (percent > 75) level = 4;

                return `
                <div class="softSkillItem">
                    <div class="skillName">
                        ${skill.title?.get(language) || ""}
                    </div>

                    <div class="softBars">
                        ${[1, 2, 3, 4].map(i => `
                            <div class="softBar ${i <= level ? "active" : ""}"></div>
                        `).join("")}
                    </div>
                </div>
                `;
            }).join("")}
        </div>
    </section>
    ` : ""}

    <!-- OTHERS -->
${driverLicenses.length ? `
<section class="skillsSection">
    <h3 class="skillsTitle">${TEXT.OTHERS}</h3>

    <div class="skillsGrid licenseGrid">
        ${driverLicenses.map(skill => `
            <div class="licenseItem">
                ${skill.title?.get(language) || ""}
            </div>
        `).join("")}
    </div>
</section>
` : ""}

</div>


<!-- PROJECTS -->
<div id="pdfProjects" class="page-section">

    <section id="pdfProjectsSec">
        <h2>${TEXT.PROYECTS}</h2>
    </section>

    <div id="projectsContainer">

        ${proyects.map(project => `
            <div class="projectItem">

                <!-- TITLE -->
                <h3 class="projectTitle">
                    ${project.title?.get(language) || ""}
                </h3>

                <!-- COMPANY -->
                <p class="projectCompany">
                    ${project.company?.get(language) || ""}
                </p>

                <!-- DATE -->
                <p class="projectDate">
                    ${this.formatDate(project.dateStart)} - ${this.formatDate(project.dateEnd)}
                </p>

                <!-- DESCRIPTION -->
                <p class="projectDescription">
                    ${project.description?.get(language) || ""}
                </p>

                <!-- META -->
                <div class="projectMeta">

                    <!-- LANGUAGES -->
                    <div class="projectBlock">

                        <h4 class="projectBlockTitle">
                            ${TEXT.HARD_SKILLS || "Languages"}
                        </h4>

                        <div class="projectLanguages">
                            ${project.languages?.map(lang => `
                                <span class="tag">
                                    ${lang.title?.get(language) || ""}
                                </span>
                            `).join("")}
                        </div>

                    </div>

                    <!-- CATEGORIES -->
                    <div class="projectBlock">

                        <h4 class="projectBlockTitle">
                            ${TEXT.CATEGORIES || "Categories"}
                        </h4>

                        <div class="projectCategories">
                            ${project.categories?.map(cat => `
                                <span class="tag">
                                    ${cat.title?.get(language) || ""}
                                </span>
                            `).join("")}
                        </div>

                    </div>

                </div>

            </div>
        `).join("")}

    </div>

</div>

<div class="qrContainer">
    <img src="${qrCodeImage}" class="pdfQR" />
</div>


</div>

    </main>

   <!-- <footer id="footer"></footer> -->

</div>
</body>
</html>
            `

















            // *********** VERSION ORIGINAL!!!! ***********
            // Generar HTML
            const html2 = `
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
                            
                            #pdfTitleSecMiddle { 
                                position:relative; 
                                text-align:center;
                                margin-bottom:10px; 
                            }
                            
                            .pdfQR {
                                width: 150px;
                                height: 150px;
                                margin-top: 15px;
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
                            <!-- <div id="pdfDivTitle">
                                <section id="pdfTitleSecTop"><h1>${person?.firstName || ""} ${person?.lastName || ""}</h1></section>
                                <section id="pdfTitleSecMiddle"><h1>${TEXT.CURRICULUM_VITAE}</h1></section>
                                <section id="pdfTitleSecBottom"></section>
                            </div>  -->

                            <div id="pdfDivTitle">
                                <section id="pdfTitleSecTop"><h1>${person?.firstName || ""} ${person?.lastName || ""}</h1></section>
                                <section id="pdfTitleSecMiddle">
                                    <h1>${TEXT.CURRICULUM_VITAE}</h1>
                                    <img src="${qrCodeImage}" class="pdfQR" />
                                </section>
                                <section id="pdfTitleSecBottom"></section>
                            </div>

                            <div id="pdfDivPersonBody">
                                <section id="pdfPersonSec"><h2>${TEXT.PERSONAL_INFORMATION}</h2></section>
                                <section id="pdfPersonSecInfo">
                                <div>
                                    <h3>${TEXT.FULL_NAME} ${person?.lastName || ""} ${person?.firstName || ""}</h3>
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
                                        <h3>◘ ${TEXT.INSTITUTION} ${edu.institutionName?.get(language) || ""}</h3>
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
                                    <h3>♦ ${TEXT.COMPANY} ${work.company?.get(language) || ""}</h3>
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
                                    <h3 class="pdfLanguesTypes">${TEXT.HARD_SKILLS}</h3>
                                    ${hardSkills.map(lang => `<div><h3>• ${TEXT.LANGUAGE}: ${lang.title?.get(language) || ""}</h3></div>`).join("")}
                                </section>` : ""}
                                ${otherSoftSkills.length ? `
                                <section>
                                    <h3 class="pdfLanguesTypes">${TEXT.SOFT_SKILLS}</h3>
                                    ${otherSoftSkills.map(lang => `<div><h3>• ${TEXT.LANGUAGE2}: ${lang.title?.get(language) || ""}</h3></div>`).join("")}
                                </section>` : ""}
                                ${driverLicenses.length ? `
                                <section id="pdfLanguagesOtherSec">
                                    <h3 class="pdfLanguesTypesOther">${TEXT.OTHERS}</h3>
                                    ${driverLicenses.map(lang => `<div><h3>• ${lang.title?.get(language) || ""}</h3></div>`).join("")}
                                </section>` : ""}
                            </div>
                            </div>
                        </body>
                        </html>
            `
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: "networkidle0" });
            //const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
            const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
        bottom: "60px",
    }
});
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