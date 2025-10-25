import { useContext, useEffect, useRef, useState } from "react";
import "./WorkCard.css";
import { UserContext } from "../../../../../context/UserContext";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import GeneralFields from "../../GeneralFields/GeneralFields";

function WorkCard({ work, onDelete, isDraggable }) {
    const { user } = useContext(UserContext);
    const isAdmin = user?.role === "admin";

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
                        <GeneralFields label="Company:" value={work.company} />
                        <GeneralFields label="Link Company:" value={work.linkCompany} />
                        <GeneralFields label="Job Title:" value={work.jobTitle} />
                        <GeneralFields label="Date Started:" value={work.dateStart?.slice(0, 10)} />
                        <GeneralFields label="Date End:" value={work.dateEnd?.slice(0, 10)} />
                    </div>
                    <div className="workListBodyBottom">
                        <GeneralFields label="Description:" value={work.description} isTextArea />
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
