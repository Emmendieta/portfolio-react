import { useContext, useEffect, useState } from "react";
import "./Educations.css"; import { UserContext } from "../../../../context/UserContext";
import { fetchDeleteEducation, fetchEducations } from "./Educations";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
;

function Educations() {
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

            if(result.error) {
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
    }

    //VER DE CAMBIAR:
    if (loading) return <p>Loading...</p>;
    if (!educations) return <p>No Educations data available.</p>;

    return (
        <div id="educationsDiv">
            <div id="educationsDivTitle">
                <h3 id="educationsDivH3Title">Educations:</h3>
            </div>
            <ul id="educationsList">
                {educations.map((education) => (
                    <li key={education._id} data-id={education._id}>
                        <div>
                            <a href={education.linkInstitution} target="_blank" rel="noopener noreferrer"></a>
                            {<img
                                src={education.iconInstitution || "/img/imagen-no-disponible.png"}
                                alt={education.institutionName}
                                className="educationIcon"
                                onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                            />}
                        </div>
                        <EducationField label="Institution: " value={education.institutionName} />
                        <EducationField label="Link Institution: " value={education.linkInstitution} />
                        <EducationField label="Title: " value={education.title} />
                        <EducationField label="ink Certificate: " value={education.linkCertificate} />
                        <EducationField label="Date Started: " value={education.dateStart.slice(0, 10)} />
                        <EducationField label="Date Ended: " value={education.dateEnd.slice(0, 10)} />
                        <EducationField label="Type of Education: " value={education.typeEducation} />
                        <EducationField label="Description: " value={education.description} />

                        {user?.role === "admin" && (
                            <div className="editionsControlsGeneral">
                                <Link to={`/educations/edit/${education._id}`} id="educationEdit" className="btn btn-outline-primary btn-sm" >
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

//VER SI ESTO LO DEJO COMO GENERAL:
function EducationField({ label, value }) {
    return (
        <div className="educationDivDiv">
            <h3 className="educationDivH3">{label}</h3>
            <h3 className="educationDivH3">{value || "-"}</h3>
        </div>
    );
};


export default Educations;