/* import { useContext, useEffect, useState } from "react";
import "./EducationsList.css"; 
import { UserContext } from "../../../../context/UserContext";
import { fetchDeleteEducation, fetchEducations } from "./Educations";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
;

function EducationsList() {
    const { user } = useContext(UserContext);
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEducations = async () => {
            const educationsData = await fetchEducations();
            if (educationsData?.error) {
                //SWEET ALERT:
                alert(educationsData.error.message);
                setLoading(false);
                return;
            };

            const educations = educationsData.response;
            setEducations(educations);
            setLoading(false);
        };
        loadEducations();
    }, []);

    const handleDelete = async (eid) => {
        //SWEET ALERT:
        const confirmDelete = window.confirm("Are you sure you want to delete the education?");
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteEducation(eid);

            if (result.error) {
                //SWEET ALERT:
                alert("Error deleting Education: ", result.error.message);
            } else {
                //SWEET ALERT:
                alert("Education Deleted!");
                setEducations(prev => prev.filter(education => education._id !== eid));
            }

        } catch (error) {
            //LOGGER:
            console.error("Error deleting Education: ", error.message);
            //SWEET ALERT:
            alert("Internal Error deleting Education: " + error.message);
        }
    };

    //VER DE CAMBIAR:
    if (loading) return <p>Loading...</p>;
    if (!educations) return <p>No Educations data available.</p>;

    return (
        <div id="educationsDiv">
            <div id="educationsDivTitle">
                <h3 id="educationsDivH3Title">Educations:</h3>
                {user?.role === "admin" && (
                    <div className="addingControlGeneral">
                        <Link to="/educations/form/new" className="btn btn-outline-success" id="addBtnEducation">
                            <IoIosAddCircleOutline id="addIcon" />
                        </Link>
                    </div>
                )}
            </div>
            <ul id="educationsList">
                {educations.map((education) => (
                    <li key={education._id} data-id={education._id}>
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
                        <div className="educationDivBody">
                            <EducationField label="Institution: " value={education.institutionName} />
                            <EducationField label="Link Institution: " value={education.linkInstitution} />
                            <EducationField label="Title: " value={education.title} />
                            <EducationField label="Link Certificate: " value={education.linkCertificate} />
                            <EducationField label="Date Started: " value={education.dateStart.slice(0, 10)} />
                            <EducationField label="Date Ended: " value={education.dateEnd.slice(0, 10)} />
                            <EducationField label="Type of Education: " value={education.typeEducation} />
                            <EducationField label="Description: " value={education.description} />
                        </div>

                        {user?.role === "admin" && (
                            <div className="editionsControlsGeneral">
                                <Link to={`/educations/form/${education._id}`} id="educationEdit" className="btn btn-outline-primary btn-sm" >
                                    <FaPen />
                                </Link>
                                <button className="btn btn-outline-danger btn-sm" id="educationDelete" onClick={() => handleDelete(education._id)} >
                                    <FaRegTrashCan />
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
};



export default EducationsList; */


import { useContext, useEffect, useState } from "react";
import "./EducationsList.css";
import { UserContext } from "../../../../context/UserContext";
import { fetchDeleteEducation, fetchEducations } from "./Educations";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import EducationCard from "./EducationCard/EducationCard";


function EducationsList() {
    const { user } = useContext(UserContext);
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEducations = async () => {
            const educationsData = await fetchEducations();
            if (educationsData?.error) {
                //SWEET ALERT:
                alert(educationsData.error.message);
                setLoading(false);
                return;
            };

            const educations = educationsData.response;
            setEducations(educations);
            setLoading(false);
        };
        loadEducations();
    }, []);

    const handleDelete = async (eid) => {
        //SWEET ALERT:
        const confirmDelete = window.confirm("Are you sure you want to delete the education?");
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteEducation(eid);

            if (result.error) {
                //SWEET ALERT:
                alert("Error deleting Education: ", result.error.message);
            } else {
                //SWEET ALERT:
                alert("Education Deleted!");
                setEducations(prev => prev.filter(education => education._id !== eid));
            }

        } catch (error) {
            //LOGGER:
            console.error("Error deleting Education: ", error.message);
            //SWEET ALERT:
            alert("Internal Error deleting Education: " + error.message);
        }
    };

    //VER DE CAMBIAR:
    if (loading) return <p>Loading...</p>;
    if (!educations) return <p>No Educations data available.</p>;

    return (
        <div id="educationsDiv">
            <div id="educationsDivTitle">
                <h3 id="educationsDivH3Title">Educations:</h3>
                {user?.role === "admin" && (
                    <div className="addingControlGeneral">
                        <Link to="/educations/form/new" className="btn btn-outline-success" id="addBtnEducation">
                            <IoIosAddCircleOutline id="addIcon" />
                        </Link>
                    </div>
                )}
            </div>
            <ul id="educationsList">
                {educations.map((education) => (
                    <EducationCard
                        key={education._id}
                        education={education}
                        onDelete={handleDelete}
                    />
                ))}
            </ul>
        </div>
    );
};



export default EducationsList;