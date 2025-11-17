import { useContext, useEffect, useRef, useState } from "react";
import "./EducationCard.css";
import { UserContext } from "../../../../../context/UserContext";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import GeneralFieldsDark from "../../GeneralFieldsDark/GeneralFieldsDark";
import { useLanguage } from "../../../../../context/LanguageContext";
import { LANG_CONST } from "../../../../constants/selectConstLang.js";

function EducationCard({ education, onDelete, isDraggable }) {
    const { user } = useContext(UserContext);
    const isAdmin = user?.role === "admin";
    const { language } = useLanguage();
    const cardRef = useRef(null);
    const [visible, setVisible] = useState(false);

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
        if (currentRef) {
            observer.observe(currentRef);
        };

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            };
        };
    }, []);

    const TEXT = LANG_CONST[language];

    return (
        <li
            key={education._id}
            ref={cardRef}
            className={`educationCardItem ${visible ? "fade-in" : ""}`}
            style={{
                gridTemplateColumns: isAdmin ? "5% 44% 43% 8%" : "5% 48% 47%",
                cursor: isDraggable ? "grab" : "default",
            }}
        >
            <div className="educationDivImg">
                <a href={education.linkInstitution} target="_blank" rel="noopener noreferrer">
                    <img
                        src={education.iconInstitution || "/img/imagen-no-disponible.png"}
                        alt={education.institutionName?.[language] || ""}
                        className="educationIcon"
                        onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                    />
                </a>
            </div>
            <div className="educationDivBodyTop">
                <GeneralFieldsDark label={TEXT.INSTITUTION} value={education.institutionName?.[language] || ""} language={language}/>
                <GeneralFieldsDark label={TEXT.LINK_INSTITUTION}  value={education.linkInstitution} language={language} />
                <GeneralFieldsDark label={TEXT.TITLE}  value={education.title?.[language] || ""} language={language}/>
                <GeneralFieldsDark label={TEXT.LINK_CERTIFICATE}  value={education.linkCertificate} language={language} />
                <GeneralFieldsDark label={TEXT.DATE_START}  value={education.dateStart?.slice(0, 10)} language={language} />
                <GeneralFieldsDark label={TEXT.DATE_END}  value={education.dateEnd?.slice(0, 10)} language={language} />
                <GeneralFieldsDark label={TEXT.TYPE_EDUCATION}  value={education.typeEducation} language={language} />
            </div>
            <div className="educationDivBodyBottom">
                <GeneralFieldsDark label={TEXT.DESCRIPTION}  value={education.description?.[language] || ""} isTextArea language={language} />
            </div>

            {isAdmin && (
                <div className="editionsControlsGeneral">
                    <Link to={`/educations/form/${education._id}`} id="educationEdit" className="btn btn-outline-primary btn-sm" >
                        <FaPen />
                    </Link>
                    <button className="btn btn-outline-danger btn-sm" id="educationDelete" onClick={() => onDelete(education._id)} >
                        <FaRegTrashCan />
                    </button>
                </div>
            )}
        </li>
    );
};

export default EducationCard;
