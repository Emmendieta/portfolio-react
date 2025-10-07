import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { fetchDeleteProyect, fetchProyects } from "./logicProyects.js";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

function Proyects() {
    const { user } = useContext(UserContext);
    const [proyects, setProyects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        //HAY QUE HACER UN FETCH CON POPULATE
        const loadProyects = async () => {
            const proyectsData = await fetchProyects();
            if(proyectsData?.error) {
                //SWEET ALERT:
                alert(proyectsData.error.message);
                setLoading(false);
                return;
            };

            const proyects = proyectsData.response;
            setProyects(proyects);
            setLoading(false);
        };
        loadProyects();
    }, []);

    const handleDelete = async (pyid) => {
        //SWEET ALERT:
        const confirmDelete = window.confirm("Are you sure you want to delete the Proyect?");
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteProyect(pyid);

            if (result.error) {
                //SWEET ALERT:
                alert("Error deleting the Proyect", result.error.message);
            } else {
                //SWEET ALERT:
                alert("Proyect deleted!");
                setProyects(prev => prev.filter(proyect => proyect._id !== pyid));
            }
        } catch (error) {
            //LOGGER:
            console.error("Error deleting Proyect: ", error.message);
            //SWEET ALERT:
            alert("Error deleting Proyect: ", error.message);
        }
    };

    //VER DE CAMBIAR:
    if(loading) return <p>Loading...</p>
    if(!proyects) return <p>No Proyects data available.</p>

    return (
        <div id="proyectsDiv">
            <div id="proyectsDivTitle">
                <h3 id="proyectsDivH3Title">Proyects:</h3>
            </div>
            <ul id="proyectsList">
                {proyects.map((proyect) => (
                    <li key={proyect._id} data-id={proyect._id}>
                        <div><h3>ACA VER SI PONGO ALGO O LAS IMAGENES LAS DEJO ABAJO</h3></div>
                        <ProyectField label="Title: " value={proyect.title} />
                        <ProyectField label="Company: " value={proyect.company} />
                        <ProyectField label="Link Company: " value={proyect.linkCompany} />
                        <ProyectField label="Link to Proyect: " value={proyect.linkProyect} />
                        <ProyectField label="Date Started: " value={proyect.dateStart.slice(0, 10)} />
                        <ProyectField label="Date Ended: " value={proyect.dateEnd.slice(0, 10)}/>
                        <ProyectField label="Description: " value={proyect.description} />
                        <ProyectField label="Languages: " value={proyect.languages} />

                        {user?.role === "admin" &&(
                            <div className="editionsControlsGeneral">
                                <Link to={`/proyects/edit/${proyect._id}`} id="proyectEdit" className="btn btn-outline-primary btn-sm">
                                    <FaPen />
                                </Link>
                                <button className="btn btn-outline-danger btn-sm" id="proyectDelete" onClick={() => handleDelete(proyect._id)}>
                                    <FaRegTrashCan />
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

//VER SI ESTO LO DEJO COMO GENERAL:
function ProyectField({ label, value }) {
    return (
        <div className="proyectDivDiv">
            <h3 className="proyectDivH3">{label}</h3>
            <h3 className="proyectDivH3">{value || "-"}</h3>
        </div>
    );
};

export default Proyects;