import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { fetchDeleteProyect, fetchProyects } from "./logicProyects.js";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoIosAddCircleOutline } from "react-icons/io";
import "./Proyects.css";

function Proyects() {
    const { user } = useContext(UserContext);
    const [proyects, setProyects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProyects = async () => {
            const proyectsData = await fetchProyects();
            if (proyectsData?.error) {
                alert(proyectsData.error.message);
                setLoading(false);
                return;
            }

            const proyects = proyectsData.response;
            setProyects(proyects);
            setLoading(false);
        };
        loadProyects();
    }, []);

    const handleDelete = async (pyid) => {
        const confirmDelete = window.confirm("Are you sure you want to delete the Proyect?");
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteProyect(pyid);

            if (result.error) {
                alert("Error deleting the Proyect: " + result.error.message);
            } else {
                alert("Proyect deleted!");
                setProyects(prev => prev.filter(proyect => proyect._id !== pyid));
            }
        } catch (error) {
            console.error("Error deleting Proyect: ", error.message);
            alert("Error deleting Proyect: " + error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!proyects) return <p>No Proyects data available.</p>;

    return (
        <div id="proyectsDiv">
            <div id="proyectsDivTitle">
                <h3 id="proyectsDivH3Title">Proyects:</h3>
                {user?.role === "admin" && (
                    <div className="addControlGeneral">
                        <Link to="/proyects/form/new" className="btn btn-outline-success" id="addBtnproyect">
                            <IoIosAddCircleOutline id="addIcon" />
                        </Link>
                    </div>
                )}
            </div>

            <div><h3>Aca van las categorias</h3></div>

            <ul id="proyectsList">
                {proyects.map((proyect) => (
                    <li className="proyectListLi" key={proyect._id} data-id={proyect._id}>
                        <div className="proyectListLiInfo">
                            <div id="proyectListLiBody">
                                <ProyectField label="Title: " value={proyect.title} />
                                <ProyectField label="Company: " value={proyect.company} />
                                <ProyectField label="Link Company: " value={proyect.linkCompany} />
                                <ProyectField label="Link to Proyect: " value={proyect.linkProyect} />
                                <ProyectField label="Date Started: " value={proyect.dateStart?.slice(0, 10)} />
                                <ProyectField label="Date Ended: " value={proyect.dateEnd?.slice(0, 10)} />
                                <ProyectField label="Description: " value={proyect.description} />
                                <ProyectField label="Languages: " value={proyect.languages?.join(", ")} />
                            </div>

                            <div id="proyectListLiImages">
                                <div id={`carousel-${proyect._id}`} className="carousel slide" data-bs-ride="carousel">
                                    {/* Indicators */}
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

                                    {/* Images */}
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

                                    {/* Controls */}
                                    <button
                                        className="carousel-control-prev"
                                        type="button"
                                        data-bs-target={`#carousel-${proyect._id}`}
                                        data-bs-slide="prev"
                                    >
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button
                                        className="carousel-control-next"
                                        type="button"
                                        data-bs-target={`#carousel-${proyect._id}`}
                                        data-bs-slide="next"
                                    >
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Next</span>
                                    </button>
                                </div>
                            </div>

                            {user?.role === "admin" && (
                                <div className="editionsControlsProyects">
                                    <Link
                                        to={`/proyects/form/${proyect._id}`}
                                        id="proyectEdit"
                                        className="btn btn-outline-primary btn-sm"
                                    >
                                        <FaPen />
                                    </Link>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        id="proyectDelete"
                                        onClick={() => handleDelete(proyect._id)}
                                    >
                                        <FaRegTrashCan />
                                    </button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ProyectField({ label, value }) {
    return (
        <div className="proyectDivDiv">
            <h3 className="proyectDivH3">{label} {value || "-"}</h3>
        </div>
    );
}

export default Proyects;