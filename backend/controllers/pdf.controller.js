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
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    //Importar CSS:
    getCSS(fileName) {
        return fs.readFileSync(
            path.join(__dirname, "../views/curriculum", fileName),
            "utf8"
        );
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
        let proyects = await this.proService.readAllAndPopulate(populateFields);
        proyects = proyects.sort((a, b) => new Date(b.dateStart) - new Date(a.dateStart)) || [];
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

            //CSSs:
            const headerCSS = this.getCSS("header.css");
            const mainCSS = this.getCSS("main.css");
            const worksCSS = this.getCSS("works.css");
            const educationsCSS = this.getCSS("educations.css");
            const skillsCSS = this.getCSS("skills.css");
            const proyectsCSS = this.getCSS("proyects.css");
            const footerCSS = this.getCSS("footer.css");

            const EDUCATION_ORDER = [
                "Course",
                "University",
                "High School",
                "Primary School",
                "Conference",
                "Other"
            ];

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
            const sortedWorks = [...(works || [])].sort((a, b) => {
                // Si uno de los trabajos no tiene fecha final, debe ir primero
                if (!a.dateEnd && b.dateEnd) return -1;  // A (sin fecha final) debe ir antes de B
                if (a.dateEnd && !b.dateEnd) return 1;   // B (sin fecha final) debe ir antes de A

                // Si ambos tienen fecha final, se ordenan de los más nuevos a los más viejos
                return new Date(b.dateStart) - new Date(a.dateStart);
            });

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
                                    * {
                                        margin: 0;
                                        padding: 0;
                                        box-sizing: border-box;
                                        width:100%
                                        font-family: Arial, sans-serif;
                                    }
                                    .page-section {
                                        break-inside: avoid;
                                        page-break-inside: avoid;
                                    }
                                </style>
                                <style>
                                    ${headerCSS}
                                    ${mainCSS}
                                    ${worksCSS}
                                    ${educationsCSS}
                                    ${skillsCSS}
                                    ${proyectsCSS}
                                    ${footerCSS}
                                </style>
                            </head>

                            <body>
                                <div id="pdfContent">
                                    <!-- HEADER -->
                                    <header id="header">
                                        <section id="hdNameWork">
                                            <div id="hdName">
                                                <h1>${person?.firstName || ""} ${person?.lastName || ""}</h1>
                                            </div>
                                            <div id="hdWorkTitle">
                                                <h3>${person?.jobTitles.get(language)}</h3>
                                            </div>
                                        </section>
                                        <section id="hdImage">
                                            <img src="${personImage}" id="hdImg">
                                        </section>
                                        <section id="hdPersonalInfo">
                                            <div id="hdPersonalInfoBox">
                                                <h3>${TEXT.PERSONAL_ADDRESS}: Brown 274 ${person?.city || ""} - ${person?.province || ""} - ${person?.country || ""}</h3>
                                                <h3>${TEXT.DATE_BIRTHDAY} ${person?.birthday ? this.formatDate(person.birthday) : ""}</h3>
                                                <h3>${TEXT.EMAIL} ${users?.email || ""}</h3>
                                                <h3>${TEXT.PHONE}: +${person?.phone || ""}</h3>
                                            </div>
                                        </section>
                                    </header>

                                    <!-- MAIN -->
                                    <main id="mainId">

                                        <!-- WORKS -->
                                        <div id="pdfList">
                                            <section id="pdfListSecTitle">
                                                <h2>${TEXT.PROFESSIONAL_EXPERIENCE}</h2>
                                            </section>
                                            <section class="pdfListSecUl">
                                                <ul class="pdfListUl">
                                                    ${sortedWorks.map(work => `
                                                        <li class="pdfListLi">
                                                            <h3 class="title">${work.jobTitle?.get(language) || ""} </h3>
                                                            <p>${work.company?.get(language) || ""}</p>
                                                            <p class="date"> ${this.formatDate(work.dateStart)} -  ${work.dateEnd ? this.formatDate(work.dateEnd) : TEXT.CONTINUES} </p>
                                                        </li>
                                                    `).join("")}
                                                </ul>
                                            </section>
                                        </div>
                                                    
                                        <!-- EDUCATIONS -->
                                        <div id="pdfListEdu">
                                            <section id="pdfListSecTitleEdu">
                                                <h2 class="academicFormationTitleEdu">${TEXT.ACADEMIC_FORMATION}</h2>
                                            </section>
                                            <section class="pdfListSecUlEduContainer">
                                                ${EDUCATION_ORDER.filter(type => groupedEducations[type]).map(type => `
                                                    <div class="educationGroupEdu">
                                                        <!-- TITLE -->
                                                        <section class="educationSecTitleEdu">
                                                            <h2 class="educationTypeEdu">${TEXT.TYPE_LABELS?.[type]?.[language] || type}</h2>
                                                        </section>
                                                        <!-- LIST -->
                                                        <section class="pdfListSecUlEdu">
                                                            <ul class="pdfListUlEdu">
                                                                ${groupedEducations[type].map(edu => `
                                                                    <li class="pdfListLiEdu">
                                                                        <h3 class="titleEdu">${edu.title?.get?.(language) || ""}</h3>
                                                                        <p class="institutionNameEdu">${edu.institutionName?.get?.(language) || ""}</p>
                                                                        <p class="dateEdu">${this.formatDate(edu.dateStart)} - ${edu.dateEnd ? this.formatDate(edu.dateEnd) : TEXT.INCOMPLETE}</p>
                                                                    </li>
                                                                `).join("")}
                                                            </ul>
                                                        </section>
                                                    </div>
                                                `).join("")}
                                            </section>
                                        </div>
                                                                
                                        <!-- SKILLS -->
                                        <div id="pdfSkills" class="page-section">
                                            <section id="pdfListSecTitleSkills">
                                                <h2>${TEXT.ABILITIES}</h2>
                                            </section>
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
                                                                <div class="skillBarFill" style="width: ${skill.percent || 0}%"></div>
                                                            </div>
                                                        </div>
                                                    `).join("")}
                                                </div>
                                            </section>
                                            ` : ""}
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
                                            <section id="pdfListSecTitleProyects">
                                                <h2>${TEXT.PROYECTS}</h2>
                                            </section>                                            
                                            <div id="projectsContainer">
                                                ${proyects.map(project => `
                                                    <div class="projectItem">
                                                        <h3>${project.title?.get(language) || ""}:</h3>
                                                        <p>${project.company?.get(language) || ""}</p>
                                                        <p>${this.formatDate(project.dateStart)} - ${project.dateEnd ? this.formatDate(project.dateEnd) : TEXT.CONTINUES}</p>
                                                        <p class="pDescription">${project.description?.get(language) || ""}</p>                       
                                                        <div class="projectMeta">
                                                            <div class="projectBlock">
                                                                <h4 class="projectBlockTitle">${TEXT.HARD_SKILLS || "Languages"}</h4>
                                                                <div class="projectLanguages">
                                                                    ${project.languages?.map(lang => `
                                                                        <span class="tag">${lang.title?.get(language) || ""}</span>
                                                                    `).join("")}
                                                                </div>
                                                            </div>                                           
                                                            <div class="projectBlock">
                                                                <h4 class="projectBlockTitle">${TEXT.CATEGORIES || "Categories"}</h4>
                                                                <div class="projectCategories">
                                                                    ${project.categories?.map(cat => `
                                                                        <span class="tag">${cat.title?.get(language) || ""}</span>
                                                                    `).join("")}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `).join("")}
                                            </div>                                            
                                        </div>
                                                                    
                                        <!-- QR -->
                                        <div class="qrContainer">
                                            <h1 id="titlePortfolioQr">${TEXT.PORTFOLIO}</h1>
                                            <img src="${qrCodeImage}" class="pdfQR" />
                                        </div>
                                    </main>
                            </body>
                        </html>
                        `
            //PARA EL PDF
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
                    bottom: "30px"
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

    generatePDFWithDNI = async (req, res) => {
        try {
            const language = req.query.lang || "en";
            const TEXT = LANG_PDF[language] || LANG_PDF["en"];
            const { person, users, educations, languages, works, proyects } = await this.getAll();

            //CSSs:
            const headerCSS = this.getCSS("header.css");
            const mainCSS = this.getCSS("main.css");
            const worksCSS = this.getCSS("works.css");
            const educationsCSS = this.getCSS("educations.css");
            const skillsCSS = this.getCSS("skills.css");
            const proyectsCSS = this.getCSS("proyects.css");
            const footerCSS = this.getCSS("footer.css");

            const EDUCATION_ORDER = [
                "Course",
                "University",
                "High School",
                "Primary School",
                "Conference",
                "Other"
            ];

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
            const sortedWorks = [...(works || [])].sort((a, b) => {
                // Si uno de los trabajos no tiene fecha final, debe ir primero
                if (!a.dateEnd && b.dateEnd) return -1;  // A (sin fecha final) debe ir antes de B
                if (a.dateEnd && !b.dateEnd) return 1;   // B (sin fecha final) debe ir antes de A

                // Si ambos tienen fecha final, se ordenan de los más nuevos a los más viejos
                return new Date(b.dateStart) - new Date(a.dateStart);
            });

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
                                    * {
                                        margin: 0;
                                        padding: 0;
                                        box-sizing: border-box;
                                        width:100%
                                        font-family: Arial, sans-serif;
                                    }
                                    .page-section {
                                        break-inside: avoid;
                                        page-break-inside: avoid;
                                    }
                                </style>
                                <style>
                                    ${headerCSS}
                                    ${mainCSS}
                                    ${worksCSS}
                                    ${educationsCSS}
                                    ${skillsCSS}
                                    ${proyectsCSS}
                                    ${footerCSS}
                                </style>
                            </head>
                                
                            <body>
                                <div id="pdfContent">
                                    <!-- HEADER -->
                                    <header id="header">
                                        <section id="hdNameWork">
                                            <div id="hdName">
                                                <h1>${person?.firstName || ""} ${person?.lastName || ""}</h1>
                                            </div>
                                            <div id="hdWorkTitle">
                                                <h3>${person?.jobTitles.get(language)}</h3>
                                            </div>
                                        </section>
                                        <section id="hdImage">
                                            <img src="${personImage}" id="hdImg">
                                        </section>
                                        <section id="hdPersonalInfo">
                                            <div id="hdPersonalInfoBox">
                                                <h3>${TEXT.PERSONAL_ADDRESS}: Brown 274 ${person?.city || ""} - ${person?.province || ""} - ${person?.country || ""}</h3>
                                                <h3>${TEXT.POSTAL_ADDRESS}: Brown 274 ${person?.city || ""} - ${person?.province || ""} - ${person?.country || ""}</h3>
                                                <h3>${TEXT.DATE_BIRTHDAY} ${person?.birthday ? this.formatDate(person.birthday) : ""}</h3>
                                                <h3>${TEXT.EMAIL} ${users?.email || ""}</h3>
                                                <h3>${TEXT.PHONE}: +${person?.phone || ""}</h3>
                                                <h3>${TEXT.DNI} ${person?.dni || ""}</h3>
                                            </div>
                                        </section>
                                    </header>
                                
                                    <!-- MAIN -->
                                    <main id="mainId">
                                
                                        <!-- WORKS -->
                                        <div id="pdfList">
                                            <section id="pdfListSecTitle">
                                                <h2>${TEXT.PROFESSIONAL_EXPERIENCE}</h2>
                                            </section>
                                            <section class="pdfListSecUl">
                                                <ul class="pdfListUl">
                                                    ${sortedWorks.map(work => `
                                                        <li class="pdfListLi">
                                                            <h3 class="title">${work.jobTitle?.get(language) || ""} </h3>
                                                            <p>${work.company?.get(language) || ""}</p>
                                                            <p class="date"> ${this.formatDate(work.dateStart)} -  ${work.dateEnd ? this.formatDate(work.dateEnd) : TEXT.CONTINUES} </p>
                                                        </li>
                                                    `).join("")}
                                                </ul>
                                            </section>
                                        </div>
                                                    
                                        <!-- EDUCATIONS -->
                                        <div id="pdfListEdu">
                                            <section id="pdfListSecTitleEdu">
                                                <h2 class="academicFormationTitleEdu">${TEXT.ACADEMIC_FORMATION}</h2>
                                            </section>
                                            <section class="pdfListSecUlEduContainer">
                                                ${EDUCATION_ORDER.filter(type => groupedEducations[type]).map(type => `
                                                    <div class="educationGroupEdu">
                                                        <!-- TITLE -->
                                                        <section class="educationSecTitleEdu">
                                                            <h2 class="educationTypeEdu">${TEXT.TYPE_LABELS?.[type]?.[language] || type}</h2>
                                                        </section>
                                                        <!-- LIST -->
                                                        <section class="pdfListSecUlEdu">
                                                            <ul class="pdfListUlEdu">
                                                                ${groupedEducations[type].map(edu => `
                                                                    <li class="pdfListLiEdu">
                                                                        <h3 class="titleEdu">${edu.title?.get?.(language) || ""}</h3>
                                                                        <p class="institutionNameEdu">${edu.institutionName?.get?.(language) || ""}</p>
                                                                        <p class="dateEdu">${this.formatDate(edu.dateStart)} - ${edu.dateEnd ? this.formatDate(edu.dateEnd) : TEXT.INCOMPLETE}</p>
                                                                    </li>
                                                                `).join("")}
                                                            </ul>
                                                        </section>
                                                    </div>
                                                `).join("")}
                                            </section>
                                        </div>
                                                                
                                        <!-- SKILLS -->
                                        <div id="pdfSkills" class="page-section">
                                            <section id="pdfListSecTitleSkills">
                                                <h2>${TEXT.ABILITIES}</h2>
                                            </section>
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
                                                                <div class="skillBarFill" style="width: ${skill.percent || 0}%"></div>
                                                            </div>
                                                        </div>
                                                    `).join("")}
                                                </div>
                                            </section>
                                            ` : ""}
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
                                            <section id="pdfListSecTitleProyects">
                                                <h2>${TEXT.PROYECTS}</h2>
                                            </section>                                            
                                            <div id="projectsContainer">
                                                ${proyects.map(project => `
                                                    <div class="projectItem">
                                                        <h3>${project.title?.get(language) || ""}:</h3>
                                                        <p>${project.company?.get(language) || ""}</p>
                                                        <p>${this.formatDate(project.dateStart)} - ${project.dateEnd ? this.formatDate(project.dateEnd) : TEXT.CONTINUES}</p>
                                                        <p class="pDescription">${project.description?.get(language) || ""}</p>                       
                                                        <div class="projectMeta">
                                                            <div class="projectBlock">
                                                                <h4 class="projectBlockTitle">${TEXT.HARD_SKILLS || "Languages"}</h4>
                                                                <div class="projectLanguages">
                                                                    ${project.languages?.map(lang => `
                                                                        <span class="tag">${lang.title?.get(language) || ""}</span>
                                                                    `).join("")}
                                                                </div>
                                                            </div>                                           
                                                            <div class="projectBlock">
                                                                <h4 class="projectBlockTitle">${TEXT.CATEGORIES || "Categories"}</h4>
                                                                <div class="projectCategories">
                                                                    ${project.categories?.map(cat => `
                                                                        <span class="tag">${cat.title?.get(language) || ""}</span>
                                                                    `).join("")}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `).join("")}
                                            </div>                                            
                                        </div>
                                                                    
                                        <!-- QR -->
                                        <div class="qrContainer">
                                            <h1 id="titlePortfolioQr">${TEXT.PORTFOLIO}</h1>
                                            <img src="${qrCodeImage}" class="pdfQR" />
                                        </div>
                                    </main>
                            </body>
                        </html>
                        `
            //PARA EL PDF
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
                    bottom: "30px"
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