import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { fetchDeleteProyect, fetchProyectsPopulated } from "./logicProyects.js";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import ProyectCard from "./ProyectCard/ProyectCard";
import "./ProyectsList.css";
import CategoriesList from "../Categories/CategoriesList.jsx";

function ProyectsList () {
    const { user } = useContext(UserContext);
    const [ proyects, setProyects ] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProyects = async () => {
            const proyectsData = await fetchProyectsPopulated();
            if(proyectsData?.error) {
                //SWEET ALERT:
                alert(proyectsData.error.message);
                setLoading(false);
                return;
            };

            setProyects(proyectsData.response);
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
                //SWEET ALERT:
                alert("Error deleting the Proyect", result.error.message);
            } else {
                //SWEET ALERT:
                alert("Proyect Deleted!");
                setProyects(prev => prev.filter(proyect => proyect._id !== pyid));
            }
        } catch (error) {
            //LOGGER:
            console.error("Error deleting Proyect: ", error.message);
            //SWEET ALERT:
            alert("Error deleting Proyect: " + error.message);
        }
    };

    //VER SI LO CAMBIO:
    if(loading) return <p>Loading...</p>
    if(!proyects) return <p>No Proyects data available.</p>

    return (
        <div id="proyectsDiv">
            <div id="proyectsDivTitle">
                <h3 id="proyectsDivH3Title">Proyects:</h3>
                {user?.role === "admin" && (
                    <div className="addControlGeneral">
                        <Link to="/proyects/form/new" className="btn btn-outline-success"id="addBtnproyect">
                            <IoIosAddCircleOutline id="addIcon" />
                        </Link>
                    </div>
                )}
            </div>
            <div id="proyectsCategoriesDiv">
                <CategoriesList />
            </div>

            <ul id="proyectList">
                {proyects.map(proyect => (
                    <ProyectCard
                        key = {proyect._id}
                        proyect = {proyect}
                        onDelete= {handleDelete}
                    />
                ))}
            </ul>
        </div>
    );
};

export default ProyectsList;