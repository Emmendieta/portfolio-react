import { useContext, useEffect, useState } from "react";
import "./ProyectCard.css";
import { UserContext } from "../../../../../context/UserContext";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

function ProyectCard({ proyect, onDelete }) {
    const { user } = useContext(UserContext);
    const isAdmin = user?.role === "admin";

    return (
        <li className="proyectListLi" data-id={proyect._id}>
            <div className="proyectListLiInfo" style={{ gridTemplateColumns: isAdmin ? "28.5% 28.5% 36% 7%" : "35% 35% 30%" }}>
                <div id="proyectListLiBody">
                    <ProyectField label="Title: " value={proyect.title} />
                    <ProyectField label="Company: " value={proyect.company} />
                    <ProyectField label="Link Company: " value={proyect.linkCompany} />
                    <ProyectField label="Link to Proyect: " value={proyect.linkProyect} />
                    <ProyectField label="Date Started: " value={proyect.dateStart?.slice(0, 10)} />
                    <ProyectField label="Date Ended: " value={proyect.dateEnd?.slice(0, 10)} />
                </div>
                <div id="proyectListBodyNext">
                    <ProyectLanguages languages={proyect.languages} />
                    <ProyectField label="Description: " value={proyect.description} isTextArea />
                </div>
                <div id="proyectListLiImages">
                    <div id={`carousel-${proyect._id}`} className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            {(proyect.thumbnails.length > 0 ? proyect.thumbnails : ["/img/imagen-no-disponible.png"]).map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    data-bs-target={`#carousel-${proyect._id}`}
                                    data-bs-slide-to={index}
                                    className={index === 0 ? "active" : ""}
                                    aria-current={index === 0 ? "true" : undefined}
                                    aria-label={`Slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>

                        <div className="carousel-inner">
                            {(proyect.thumbnails.length > 0 ? proyect.thumbnails : ["/img/imagen-no-disponible.png"]).map((imgSrc, index) => (
                                <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
                                    <img
                                        src={imgSrc}
                                        className="d-block w-100"
                                        alt={`${proyect.title} - Image ${index + 1}`}
                                        onError={(e) => (e.currentTarget.src = "/img/imagen-no-disponible.png")}
                                    />
                                </div>
                            ))}
                        </div>

                        <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${proyect._id}`} data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${proyect._id}`} data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>

                {isAdmin && (
                    <div className="editionsControlsProyects">
                        <Link to={`/proyects/form/${proyect._id}`} id="proyectEdit" className="btn btn-outline-primary btn-sm">
                            <FaPen />
                        </Link>
                        <button className="btn btn-outline-danger btn-sm" id="proyectDelete" onClick={() => onDelete(proyect._id)}>
                            <FaRegTrashCan />
                        </button>
                    </div>
                )}
            </div>
        </li>
    )

};

function ProyectField({ label, value, isTextArea = false, id = "" }) {
    if (isTextArea) {
        return (
            <div className="proyectDivDivText" id={id}>
                <h3 className="proyectDivH3Text">{label}</h3>
                <textarea className="proyectDivH3TextArea" value={value || "-"} readOnly rows={9} />
            </div>
        );
    };

    return (
        <div className="proyectDivDiv" id={id}>
            <h3 className="proyectDivH3">{label}: {value || "-"}</h3>
        </div>
    );
};

function ProyectLanguages({ languages }) {
    if (!Array.isArray(languages) || languages.length === 0) {
        return (
            <div className="proyectDivDivLanguages" id="proyectFieldLanguages">
                <h3 className="proyectDivH3Languages">Languages:</h3>
                <p>-</p>
            </div>
        );
    };

    return (
        <div className="proyectDivDivLanguages" id="proyectFieldLanguages">
            <h3 className="proyectDivH3Languages">Languages:</h3>
            <ul className="proyectLanguagesList">
                {languages.map((lang) => (
                    <li key={lang._id} className="proyectLanguageItem">
                        <img
                            src={lang.thumbnails || "/img/imagen-no-disponible.png"}
                            alt={lang.title}
                            className="languageIcon"
                            onError={(e) => e.currentTarget.src = "/img/imagen-no-disponible.png"}
                        />
                        <h3 className="languageTitle">{lang.title}</h3>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProyectCard;