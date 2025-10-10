import { useContext } from "react";
import "./EducationCard.css";
import { UserContext } from "../../../../../context/UserContext";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

function EducationCard({ education, onDelete }) {
    const { user } = useContext(UserContext);
    const isAdmin = user?.role === "admin";

    return (
        <li key={education._id} data-id={education._id} className="educationCardItem" style={{ gridTemplateColumns: isAdmin ? "5% 44% 43% 8%" : "5% 48% 47%" }}>
            <div className="educationDivImg">
                <a href={education.linkInstitution} target="_blank" rel="noopener noreferrer">
                    {<img
                        src={education.iconInstitution || "/img/imagen-no-disponible.png"}
                        alt={education.institutionName}
                        className="educationIcon"
                        onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                    />}
                </a>
            </div>
            <div className="educationDivBodyTop">
                <EducationField label="Institution: " value={education.institutionName} />
                <EducationField label="Link Institution: " value={education.linkInstitution} />
                <EducationField label="Title: " value={education.title} />
                <EducationField label="Link Certificate: " value={education.linkCertificate} />
                <EducationField label="Date Started: " value={education.dateStart.slice(0, 10)} />
                <EducationField label="Date Ended: " value={education.dateEnd.slice(0, 10)} />
                <EducationField label="Type of Education: " value={education.typeEducation} />
            </div>
            <div className="educationDivBodyBottom">
                <EducationField label="Description: " value={education.description} />
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

//VER SI ESTO LO DEJO COMO GENERAL:
function EducationField({ label, value }) {
    return (
        <div className="educationDivDiv">
            <h3 className="educationDivH3">{label} {value || "-"}</h3>
        </div>
    );
};


export default EducationCard;