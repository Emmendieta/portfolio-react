import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../../../context/UserContext";
import {
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import "./LanguageCard.css";
import { useLanguage } from "../../../../../context/LanguageContext";
import { useConfirmSweet } from "../../../../../context/SweetAlert2Context";
import { LANG_CONST } from "../../../../constants/selectConstLang.js";

function LanguageCard({ language, onDelete, isDraggable }) {
    const { user } = useContext(UserContext);
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);
    const animationRef = useRef(null);
    const { errorSweet } = useConfirmSweet();
    const { language: currentLanguage } = useLanguage();
    const TEXT = LANG_CONST[currentLanguage];
    const typesLeves = {
        "Beginner": { en: "Beginner", es: "Principiante" },
        "Medium": { en: "Medium", es: "Intermedio" },
        "Advanced": { en: "Advanced", es: "Avanzado" },
        "Expert": { en: "Expert", es: "Experto" }
    };
    const getLevel = () => {
        const percent = language.percent;
        if (percent > 0 && percent <= 25) return typesLeves.Beginner[currentLanguage];
        if (percent > 25 && percent <= 50) return typesLeves.Medium[currentLanguage];
        if (percent > 50 && percent <= 75) return typesLeves.Advanced[currentLanguage];
        if (percent > 75 && percent <= 100) return typesLeves.Expert[currentLanguage];
        return "-";
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        animateProgress(language.percent || 0);
                    } else {
                        setVisible(false);
                        resetProgress();
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);

        return () => {
            observer.disconnect();
            if (animationRef.current) clearInterval(animationRef.current);
        };
    }, [language.percent]);

    const animateProgress = (target) => {
        if (animationRef.current) clearInterval(animationRef.current);

        let start = 0;
        const duration = 1500;
        const stepTime = 20;
        const increment = target / (duration / stepTime);

        animationRef.current = setInterval(() => {
            start += increment;
            if (start >= target) {
                start = target;
                clearInterval(animationRef.current);
            }
            setProgress(Math.round(start));
        }, stepTime);
    };

    const resetProgress = () => {
        if (animationRef.current) clearInterval(animationRef.current);
        setProgress(0);
    };
    const isAdmin = user?.role === "admin";
    const isSoft = language.type == "Soft";

    return  (
        <li
            className={`languageListLi ${visible ? "fade-in" : ""}`}
            ref={ref}
            data-id={language._id}
            style={{ cursor: isDraggable ? "grab" : "default" }}
        >

            {/* ---------------- HARD SKILL = Imagen arriba ---------------- */}
            {!isSoft && (
                <div className="languageListBodyTop">
                    <div style={{ width: 100, height: 100 }}>
                        <CircularProgressbarWithChildren
                            value={progress}
                            styles={buildStyles({
                                pathColor: "#3c9b75ff",
                                trailColor: "#27496bff",
                                strokeLinecap: "round",
                            })}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <img
                                    src={language.thumbnails || "/img/imagen-no-disponible.png"}
                                    alt={language.title?.[currentLanguage]}
                                    style={{
                                        width: "84%",
                                        height: "84%",
                                        borderRadius: "50%",
                                        objectFit: "cover"
                                    }}
                                    onError={e =>
                                        (e.currentTarget.src = "/img/imagen-no-disponible.png")
                                    }
                                />
                            </div>
                        </CircularProgressbarWithChildren>
                    </div>
                </div>
            )}

            {/* ----------- TÍTULO + (Porcentaje o Nivel) ----------- */}
            <div className="languageListBodyMiddle">
                <LanguageField value={language.title?.[currentLanguage] || ""} />

                {!isSoft ? (
                    <LanguageField value={`${language.percent}%`} />
                ) : (
                    <LanguageField value={getLevel()} />
                )}
            </div>

            {/* ---------------- TIPO DE VISUALIZACIÓN ---------------- */}
            <div className="languageListBodyBottom">
                {/* Hard: circular (mantenido EXACTO) */}
                {!isSoft && (
                    <div style={{ width: 120, height: 120 }}>
                        {/* Circle ya está arriba con imagen, evitamos duplicado */}
                    </div>
                )}

                {/* Soft: barra segmentada */}
                {isSoft && <SoftSkillBar percent={progress} />}
            </div>

            {/* ---------------- CONTROLES ADMIN ---------------- */}
            {isAdmin && (
                <div className="editionsControlsLanguage admin-visible">
                    <Link
                        to={`/languages/form/${language._id}`}
                        className="btn btn-outline-primary btn-sm"
                    >
                        <FaPen />
                    </Link>
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onDelete(language._id)}
                    >
                        <FaRegTrashCan />
                    </button>
                </div>
            )}
        </li>
    );
}

/* ---------------- Soft Skill Bar ---------------- */
function SoftSkillBar({ percent }) {
    const steps = [25, 50, 75, 100];

    return (
        <div className="softSkillBar">
            {steps.map((step, i) => (
                <div
                    key={i}
                    className={`barSegment ${percent >= step ? "active" : ""}`}
                />
            ))}
        </div>
    );
}

/* ---------------- Campo de texto ---------------- */
function LanguageField({ value }) {
    return (
        <div className="languageDivDiv">
            <h3 className="languageDivH3">{value || "-"}</h3>
        </div>
    );
}

export default LanguageCard;