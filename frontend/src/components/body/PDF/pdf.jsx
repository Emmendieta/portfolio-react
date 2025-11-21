import { useEffect, useState } from "react"
import { fetchData, exportPDF } from "../PDF/pdfLogic.js";
import { useConfirmSweet } from "../../../context/SweetAlert2Context";
import { useLanguage } from "../../../context/LanguageContext";
import { LANG_CONST } from "../../constants/selectConstLang.js";
import "./pdf.css";

//GENERAR UN QR PARA IR A LA PAGINA PERSONAL!!!
const PDFExportView = () => {
    const [data, setData] = useState(null);
    const { errorSweet } = useConfirmSweet();
    const { language } = useLanguage();
    const typeEducationLabels = {
        "Primary School": { en: "Primary School", es: "Escuela primaria" },
        "High School": { en: "High School", es: "Secundario" },
        "University": { en: "University", es: "Universidad" },
        "Course": { en: "Course", es: "Curso" },
        "Conference": { en: "Conference", es: "Conferencia" },
        "Other": { en: "Other", es: "Otro" }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const TEXT = LANG_CONST[language];
                const loadData = await fetchData();
                if (loadData?.error) {
                    await errorSweet(TEXT.ERROR_SWEET_TEXT_LOADING_DATA);
                    return;
                };
                setData(loadData.response);
            } catch (error) {
                console.error(TEXT.ERROR_SWEET_TEXT_LOADING_DATA);
                await errorSweet(TEXT.ERROR_SWEET_TEXT_LOADING_DATA);
            }
        };
        loadData();
    }, [language]);

    const TEXT = LANG_CONST[language];
    const EDUCATION_ORDER = {
        "Course": 1,
        "University": 2,
        "High School": 3,
        "Primary School": 4
    };

    const sortedEducations = [...(data?.educations || [])].sort((a, b) => {
        return (EDUCATION_ORDER[a.type] || 99) - (EDUCATION_ORDER[b.type] || 99);
    });

    const gropuedEducations = sortedEducations.reduce((acc, edu) => {
        const type = edu.typeEducation;
        if (!acc[type]) acc[type] = [];
        acc[type].push(edu);
        return acc;
    }, {});

    const formatDate = (date) => {
        if (!date) return "COMPLETAR CON TEXTO";
        const [year, month, day] = date.slice(0, 10).split("-");
        return `${day}-${month}-${year}`;
    };

    const sortedWorks = [...(data?.works || [])].sort((a, b) => {
        const dateA = new Date(a.endDate || a.startDate);
        const dateB = new Date(b.endDate || b.startDate);
        return dateB - dateA;
    });

    const hardSkills = data?.languages?.filter(lang => lang.type === "Hard") || [];
    const softSkills = data?.languages?.filter(lang => lang.type === "Soft") || [];
    const driverLicenses = [];
    const otherSoftSkills = [];

    softSkills.forEach(lang => {
        const titleLower = lang.title?.[language]?.toLowerCase() || "";
        if (titleLower.includes("carnet de conducir") || titleLower.includes("driver license")) {
            driverLicenses.push(lang);
        } else {
            otherSoftSkills.push(lang);
        }
    });

    if (!data) return <p>{TEXT.LOADING_PDF}</p>

    return (
        <div id="pdfBody">
            <div id="pdfContent">
                {/* PERSON */}
                <div id="pdfDivTitle">
                    <section id="pdfTitleSecTop">
                        <h1>{data?.person?.firstName + " " + data?.person?.lastName}</h1>
                    </section>
                    <section id="pdfTitleSecMiddle">
                        <h1>{TEXT.CURRICULUM_VITAE}</h1>
                    </section>
                    <section id="pdfTitleSecBottom"></section>
                </div>
                <div id="pdfDivPersonBody">
                    <section id="pdfPersonSec">
                        <h2>{TEXT.PERSONAL_INFORMATION}</h2>
                    </section>
                    <section id="pdfPersonSecInfo">
                        <div>
                            <h3>{TEXT.DNI} {data?.person?.dni}</h3>
                            <h3>{TEXT.LOCATION} {data?.person?.city + " - " + data?.person?.province + " - " + data?.person?.country}</h3>
                            <h3>{TEXT.DATE_BIRTHDAY} {data?.person?.birthday ? formatDate(data.person.birthday) : ""}</h3>
                            <h3>{TEXT.EMAIL} {data?.users?.email}</h3>
                        </div>
                        <div>
                            <img src={data?.person?.thumbnails?.[0] || "/img/imagen-no-disponible.png"}
                                alt={data?.person?._id}
                                className="pdfPersonImg"
                                onError={(e) => { e.currentTarget.src = "/img/imagen-no-disponible.png"; }}
                            />
                        </div>
                    </section>

                </div >
                {/* EDUCATION */}
                <div id="pdfEducations">
                    <section id="pdfEducationsSec">
                        <h2>{TEXT.ACADEMIC_FORMATION}</h2>
                    </section>
                    <section>
                        {Object.keys(EDUCATION_ORDER).map((type) => {
                            const educations = gropuedEducations[type];
                            if (!educations || educations.length === 0) return null;
                            return (
                                <section key={type} id="pdfEducationSecBottom">
                                    <h2>{typeEducationLabels[type]?.[language || type]}</h2>
                                    {educations.map((edu) => (
                                        <div key={edu._id}>
                                            <h3>{TEXT.INSTITUTION} {edu.institutionName?.[language] || ""}</h3>
                                            <h3>{TEXT.DEGREE} {edu.title?.[language] || ""}</h3>
                                            <h3>{TEXT.START} {formatDate(edu.dateStart)} - {TEXT.END} {formatDate(edu.dateEnd)}</h3>
                                        </div>
                                    ))}
                                </section>
                            );
                        })}
                    </section>
                </div>
                {/* WORKS */}
                <div id="pdfWorks">
                    <section id="pdfWorksSec">
                        <h2>{TEXT.PROFESIONAL_EXPERIENCE}</h2>
                    </section>
                    <section>
                        {sortedWorks.map((work) => (
                            <div key={work._id}>
                                <h3>{TEXT.COMPANY} {work.company?.[language] || ""}</h3>
                                <h3>{TEXT.JOB_TITLE} {work.jobTitle?.[language] || ""}</h3>
                                <h3>{TEXT.START} {formatDate(work.dateStart)} - {TEXT.END} {formatDate(work.dateEnd)}</h3>
                            </div>
                        ))}
                    </section>
                </div>
                {/* LANGUAGES */}
                <div id="pdfLanguages">
                    <section id="pdfLanguagesSec">
                        <h2>{TEXT.ABILITIES}</h2>
                    </section>
                    {hardSkills.length > 0 && (
                        <section>
                            <h3 className="pdfLanguesTypes">{TEXT.HARD_SKILLS + ":"}</h3>
                            {hardSkills.map(lang => (
                                <div key={lang._id}>
                                    <h3>{lang.title?.[language] || ""}</h3>
                                </div>
                            ))}
                        </section>
                    )}
                    {otherSoftSkills.length > 0 && (
                        <section>
                            <h3 className="pdfLanguesTypes">{TEXT.SOFT_SKILLS + ":"}</h3>
                            {otherSoftSkills.map(lang => (
                                <div key={lang._id}>
                                    <h3>{TEXT.TITLE + ": "} {lang.title?.[language] || ""}</h3>
                                </div>
                            ))}
                        </section>
                    )}
                    {driverLicenses.length > 0 && (
                        <section id="pdfLanguagesOtherSec">
                            <h3 className="pdfLanguesTypesOther">{TEXT.OTHERS}</h3>
                            {driverLicenses.map(lang => (
                                <div key={lang._id}>
                                    <h3>{lang.title?.[language] || ""}</h3>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>
            <div id="pdfDivButton">
                <button className="btn btn-outline-success" onClick={() => exportPDF(language)}>{TEXT.EXPORT_PDF}</button>
            </div>
        </div>
    );
};

export default PDFExportView;