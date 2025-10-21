import { useContext, useEffect, useState } from "react";
import "./EducationsList.css";
import { UserContext } from "../../../../context/UserContext";
import { fetchDeleteEducation, fetchEducations } from "./Educations";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import EducationCard from "./EducationCard/EducationCard";
import { useLoading } from "../../../../context/LoadingContext";
import "../../../GlobalLoader.css";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";

function EducationsList() {
    const { user } = useContext(UserContext);
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();

    useEffect(() => {
        const loadEducations = async () => {

            try {
                startLoading();

                const educationsData = await fetchEducations();
                if (educationsData?.error) {
                    await errorSweet(educationsData.error.message);
                    setLoading(false);
                    return;
                };

                const educations = educationsData.response;
                setEducations(educations);

            } catch (error) {
                await errorSweet("Error loading Educations: " + error.message);
                console.error("Error loading Educations:", error);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadEducations();
    }, []);

    const handleDelete = async (eid) => {
        const confirmDelete = await confirmSweet({
            title: "Delete Education:", 
            text: "Are you sure you want to delete the education?", 
            confirmButtonText: "Yes", 
            cancelButtonText: "No"
        });
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteEducation(eid);

            if (result.error) {
                await errorSweet("Error deleting Education: ", result.error.message);
            } else {
                await successSweet("Education Deleted!");
                setEducations(prev => prev.filter(education => education._id !== eid));
            }

        } catch (error) {
            //LOGGER:
            console.error("Error deleting Education: ", error.message);
            await errorSweet("Internal Error deleting Education: " + error.message);
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
