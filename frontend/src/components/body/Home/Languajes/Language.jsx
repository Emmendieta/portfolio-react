import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../../../context/UserContext";
import { fetchDeleteLanguage, fetchLanguages } from "./Language";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import "./Language.css";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Language() {
    const { user } = useContext(UserContext);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLanguages = async () => {
            const languagesData = await fetchLanguages();
            if (languagesData?.error) {
                alert(languagesData.error.message);
                setLoading(false);
                return;
            }
            setLanguages(languagesData.response || []);
            setLoading(false);
        };
        loadLanguages();
    }, []);

    const handleDelete = async (lid) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Language?");
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteLanguage(lid);
            if (result.error) {
                alert("Error deleting the Language: " + result.error.message);
            } else {
                alert("Language Deleted!");
                setLanguages(prev => prev.filter(language => language._id !== lid));
            }
        } catch (error) {
            console.error("Error deleting Language: ", error.message);
            alert("Error deleting Language: " + error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!languages || languages.length === 0) return <p>No Languages data available.</p>;

    return (
        <div id="langaugesDiv">
            <div id="languagesDivTitle">
                <h3 id="languagesDivH3Title">Languages:</h3>
                {user?.role === "admin" && (
                    <div className="addingControlGeneral">
                        <Link to="/languages/form/new" className="btn btn-outline-success" id="addBtnLanguage">
                            <IoIosAddCircleOutline id="addIcon" />
                        </Link>
                    </div>
                )}
            </div>

            <ul id="languageList">
                {languages.map((language) => (
                    <LanguageItem
                        key={language._id}
                        language={language}
                        isAdmin={user?.role === "admin"}
                        onDelete={handleDelete}
                    />
                ))}
            </ul>
        </div>
    );
}

// ✅ Subcomponente con animación cada vez que entra al viewport
function LanguageItem({ language, isAdmin, onDelete }) {
    const [progress, setProgress] = useState(0);
    const ref = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Si entra al viewport → iniciar animación
                        animateProgress(language.percent || 0);
                    } else {
                        // Si sale del viewport → reiniciar
                        resetProgress();
                    }
                });
            },
            { threshold: 0.3 } // visible al 30%
        );

        if (ref.current) observer.observe(ref.current);
        return () => {
            observer.disconnect();
            if (animationRef.current) clearInterval(animationRef.current);
        };
    }, []);

    const animateProgress = (target) => {
        if (animationRef.current) clearInterval(animationRef.current);

        let start = 0;
        const duration = 1500; // 1.5 segundos
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

    return (
        <li className="languageListLi" ref={ref} data-id={language._id}>
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
                                src={language.thumbnails?.[0] || "/img/imagen-no-disponible.png"}
                                alt={language.title}
                                style={{
                                    width: "82%",
                                    height: "82%",
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

            {isAdmin && (
                <div className="editionsControlsLanguage">
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
                </div>
            )}
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

export default Language;
