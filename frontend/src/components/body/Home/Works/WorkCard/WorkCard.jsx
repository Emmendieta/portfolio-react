/* import { useContext } from "react";
import "./WorkCard.css";
import { UserContext } from "../../../../../context/UserContext";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";

function WorkCard({ work, onDelete }) {
    const { user } = useContext(UserContext);
    const isAdmin = user?.role === "admin";

    return (
        <li className="workListLi" data-id={work._id}>
            <div style={{ gridTemplateColumns: isAdmin ? "15% 78% 7%" : "15% 85%" }}>
                <div className="workListTop">
                    <a href={work.thumbnails?.[0]} target="_blank" rel="noopener noreferrer">
                        <img
                            src={work.thumbnails?.[0] || "/img/imagen-no-disponible.png"}
                            alt={work.company}
                            className="workIcon"
                            onError={(event) => (event.currentTarget.src = "/img/imagen-no-disponible.png")}
                        />
                    </a>
                </div>
                <div className="workListBody">
                    <div className="workListBodyTop">
                        <WorkField label="Company: " value={work.company} />
                        <WorkField label="Link Company: " value={work.linkCompany} />
                        <WorkField label="Job Title: " value={work.jobTitle} />
                        <WorkField label="Date Started: " value={work.dateStart?.slice(0, 10)} />
                        <WorkField label="Date End: " value={work.dateEnd?.slice(0, 10)} />
                    </div>
                    <div className="workListBodyBottom">
                        <WorkField label="Description: " value={work.description} />
                    </div>
                </div>
                <div className="workListBottom">
                    {isAdmin && (
                        <div className="editionsControlsWork">
                            <Link to={`/works/form/${work._id}`} id="workEdit" className="btn btn-outline-primary btn-sm">
                                <FaPen />
                            </Link>
                            <button className="btn btn-outline-danger btn-sm" id="workDelete" onClick={() => onDelete(work._id)}>
                                <FaRegTrashCan />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );

};

function WorkField({ label, value }) {
    return (
        <div className="workDivDiv">
            <h3 className="workDivH3">{label} {value || "-"}</h3>
        </div>
    );
};

export default WorkCard; */

import { useContext } from "react";
import "./WorkCard.css";
import { UserContext } from "../../../../../context/UserContext";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";

function WorkCard({ work, onDelete }) {
    const { user } = useContext(UserContext);
    const isAdmin = user?.role === "admin";

    return (
        <li className="workListLi" data-id={work._id}>
            <div className="workCardGrid" style={{ gridTemplateColumns: isAdmin ? "10% 83% 7%" : "15% 85%" }} >

                <div className="workListTop">
                    <a href={work.thumbnails?.[0]} target="_blank" rel="noopener noreferrer">
                        <img
                            src={work.thumbnails?.[0] || "/img/imagen-no-disponible.png"}
                            alt={work.company}
                            className="workIcon"
                            onError={(event) =>
                                (event.currentTarget.src = "/img/imagen-no-disponible.png")
                            }
                        />
                    </a>
                </div>

                <div className="workListBody">
                    <div className="workListBodyTop">
                        <WorkField label="Company:" value={work.company} />
                        <WorkField label="Link Company:" value={work.linkCompany} />
                        <WorkField label="Job Title:" value={work.jobTitle} />
                        <WorkField label="Date Started:" value={work.dateStart?.slice(0, 10)} />
                        <WorkField label="Date End:" value={work.dateEnd?.slice(0, 10)} />
                    </div>
                    <div className="workListBodyBottom">
                        <WorkField label="Description:" value={work.description} />
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
}

function WorkField({ label, value }) {
    return (
        <div className="workDivDiv">
            <h3 className="workDivH3">{label} {value || "-"}</h3>
        </div>
    );
}

export default WorkCard;
