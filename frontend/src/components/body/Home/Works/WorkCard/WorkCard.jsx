import { useContext, useEffect, useRef, useState } from "react";
import "./WorkCard.css";
import { UserContext } from "../../../../../context/UserContext";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import GeneralFields from "../../GeneralFields/GeneralFields";
import { useLanguage } from "../../../../../context/LanguageContext";
import { LANG_CONST } from "../../../../constants/selectConstLang.js";

function WorkCard({ work, onDelete, isDraggable }) {
    const { user } = useContext(UserContext);
    const isAdmin = user?.role === "admin";
    const { language } = useLanguage();

    const cardRef = useRef(null);
    const [ visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    setVisible(entry.isIntersecting);
                });
            },
            { 
                threshold: 0.1,
            }
        );

        const currentRef = cardRef.current;
        if(currentRef) { observer.observe(currentRef); };

        return () => {
            if (currentRef) { observer.unobserve(currentRef); };
        };
    }, []);

    const TEXT = LANG_CONST[language];

    return (
        <li 
        className={`workListLi ${visible ? "fade-in" : ""}`} 
        data-id={work._id}
        ref={cardRef}
        style={{ cursor: isDraggable ? "grab" : "default" }}
        >
            <div className="workCardGrid" style={{ gridTemplateColumns: isAdmin ? "10% 83% 7%" : "15% 85%" }} >

                <div className="workListTop">
                    <a href={work.thumbnails} target="_blank" rel="noopener noreferrer">
                        <img
                            src={work.thumbnails || "/img/imagen-no-disponible.png"}
                            alt={work.company?.[language] || ""} 
                            className="workIcon"
                            onError={(event) =>
                                (event.currentTarget.src = "/img/imagen-no-disponible.png")
                            }
                        />
                    </a>
                </div>

                <div className="workListBody">
                    <div className="workListBodyTop">
                        <GeneralFields label={TEXT.COMPANY} value={work.company?.[language] || ""} />
                        <GeneralFields label={TEXT.LINK_COMPANY} value={work.linkCompany} language={language} />
                        <GeneralFields label={TEXT.JOB_TITLE} value={work.jobTitle?.[language] || ""} />
                        <GeneralFields label={TEXT.DATE_START} value={work.dateStart?.slice(0, 10)} />
                        <GeneralFields label={TEXT.DATE_END} value={work.dateEnd?.slice(0, 10)} />
                    </div>
                    <div className="workListBodyBottom">
                        <GeneralFields label={TEXT.DESCRIPTION} value={work.description?.[language] || ""} isTextArea />
                    </div>
                </div>

                {isAdmin && (
                    <div className="workListBottom">
                        <div className="editionsControlsWork">
                            <Link  to={`/works/form/${work._id}`} id="workEdit" className="btn btn-outline-primary btn-sm" >
                                <FaPen />
                            </Link>
                            <button className="btn btn-outline-danger btn-sm" id="workDelete" onClick={() => onDelete(work._id)} >
                                <FaRegTrashCan />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
};

export default WorkCard;
