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

function LanguageCard({ language, onDelete, isDraggable }) {
    const { user } = useContext(UserContext);
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);
    const animationRef = useRef(null);

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

    return (
        <li
            className={`languageListLi ${visible ? "fade-in" : ""}`}
            ref={ref}
            data-id={language._id}
            style={{ cursor: isDraggable ? "grab" : "default" }}
        >
            <div className="languageListBodyTop">
                <div style={{ width: 100, height: 100 }}>
                    <CircularProgressbarWithChildren
                        value={progress}
                        styles={buildStyles({
                            pathColor: "#3c9b75ff",
                            trailColor: "#27496bff",
                            strokeLinecap: "round",
                            pathTransitionDuration: 0.15,
                        })}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            <img
                                src={language.thumbnails || "/img/imagen-no-disponible.png"}
                                alt={language.title}
                                style={{
                                    width: "84%",
                                    height: "84%",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                }}
                                onError={(e) => (e.currentTarget.src = "/img/imagen-no-disponible.png")}
                            />
                        </div>
                    </CircularProgressbarWithChildren>
                </div>
            </div>

            <div className="languageListBodyMiddle">
                <LanguageField label="" value={language.title} />
                <LanguageField label="" value={`${language.percent}%`} />
            </div>

            <div className={`editionsControlsLanguage ${isAdmin ? "admin-visible" : "admin-hidden"}`}>
                {isAdmin && (
                    <>
                        <Link
                            to={`/languages/form/${language._id}`}
                            id="languageEdit"
                            className="btn btn-outline-primary btn-sm"
                        >
                            <FaPen />
                        </Link>
                        <button
                            className="btn btn-outline-danger btn-sm"
                            id="languageDelete"
                            onClick={() => onDelete(language._id)}
                        >
                            <FaRegTrashCan />
                        </button>
                    </>
                )}
            </div>
        </li>
    );
}

function LanguageField({ label, value }) {
    return (
        <div className="languageDivDiv">
            <h3 className="languageDivH3">
                {label} {value || "-"}
            </h3>
        </div>
    );
}

export default LanguageCard;
