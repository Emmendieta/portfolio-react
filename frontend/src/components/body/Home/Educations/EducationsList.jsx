import { useContext, useEffect, useState } from "react";
import "./EducationsList.css";
import { UserContext } from "../../../../context/UserContext";
import { fetchDeleteEducation, fetchEducations } from "./Educations";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import EducationCard from "./EducationCard/EducationCard";
import { useLoading } from "../../../../context/LoadingContext";
import "../../../GlobalLoader.css";

function EducationsList() {
    const { user } = useContext(UserContext);
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();

    useEffect(() => {
        const loadEducations = async () => {

            try {
                startLoading();

                const educationsData = await fetchEducations();
                if (educationsData?.error) {
                    //SWEET ALERT:
                    alert(educationsData.error.message);
                    setLoading(false);
                    return;
                };

                const educations = educationsData.response;
                setEducations(educations);

            } catch (error) {
                console.error("Error loading Educations:", error);
                alert("Error loading Educations: " + error.message);
            } finally {
                setLoading(false);
                stopLoading();
            }
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
    if (educations.length === 0) return <p>No Educations data available.</p>;

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
