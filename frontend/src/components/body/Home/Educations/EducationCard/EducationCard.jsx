import { useContext, useEffect, useRef, useState } from "react";
import "./EducationCard.css";
import { UserContext } from "../../../../../context/UserContext";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import GeneralFieldsDark from "../../GeneralFieldsDark/GeneralFieldsDark";

function EducationCard({ education, onDelete }) {
    const { user } = useContext(UserContext);
    const isAdmin = user?.role === "admin";

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
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <li
            key={education._id}
            ref={cardRef}
            className={`educationCardItem ${visible ? "fade-in" : ""}`}
            style={{
                gridTemplateColumns: isAdmin ? "5% 44% 43% 8%" : "5% 48% 47%"
            }}
        >
            {/* ... el resto del contenido sin cambios */}
            <div className="educationDivImg">
                <a href={education.linkInstitution} target="_blank" rel="noopener noreferrer">
                    <img
                        src={education.iconInstitution || "/img/imagen-no-disponible.png"}
                        alt={education.institutionName}
                        className="educationIcon"
                        onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                    />
                </a>
            </div>
            <div className="educationDivBodyTop">
                <GeneralFieldsDark label="Institution:" value={education.institutionName} />
                <GeneralFieldsDark label="Link Institution:" value={education.linkInstitution} />
                <GeneralFieldsDark label="Title:" value={education.title} />
                <GeneralFieldsDark label="Link Certificate:" value={education.linkCertificate} />
                <GeneralFieldsDark label="Date Started:" value={education.dateStart?.slice(0, 10)} />
                <GeneralFieldsDark label="Date Ended:" value={education.dateEnd?.slice(0, 10)} />
                <GeneralFieldsDark label="Type of Education:" value={education.typeEducation} />
            </div>
            <div className="educationDivBodyBottom">
                <GeneralFieldsDark label="Description:" value={education.description} isTextArea />
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
