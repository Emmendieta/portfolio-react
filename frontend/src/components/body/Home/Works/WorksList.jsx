import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { fetchDeleteWork, fetchWorks } from "./Works.js";
import { IoIosAddCircleOutline } from "react-icons/io";
import WorkCard from "./WorkCard/WorkCard";
import { Link } from "react-router-dom";
import "./WorksList.css";
import { useLoading } from "../../../../context/LoadingContext.jsx";
import "../../../GlobalLoader.css";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context.jsx";


function WorksList() {
    const { user } = useContext(UserContext);
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();

    useEffect(() => {
        const loadWorks = async () => {

            try {
                startLoading();

                const worksData = await fetchWorks();
                if (worksData?.error) {
                    await errorSweet(worksData.error.message);
                    setLoading(false);
                    return;
                };

                setWorks(worksData.response);

            } catch (error) {
                console.error("Error loading Works:", error);
                await errorSweet("Error loading Works: " + error.message);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };

        loadWorks();
    }, []);

    const handleDelete = async (wid) => {
        const confirmDelete = await confirmSweet({
            title: "Delete Work:",
            text: "Are you sure you want to delete the Work?",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        });
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteWork(wid);
            if (result.error) {
                await errorSweet("Error deleting the Work: ", result.error.message);
            } else {
                await successSweet("Work Deleted!");
                setWorks((prev) => prev.filter((work) => work._id !== wid));
            }
        } catch (error) {
            //LOGGER:
            console.error("Error deleting Work: ", error.message);
            await errorSweet("Error deleting Work: ", error.message);
        }
    };

    //VER SI LO DEJO:
    if (!works) return <p>No Works data available.</p>

    return (
        <div id="worksDiv">
            <div id="worksDivTitle">
                <h3 id="worksDivH3Title">Works:</h3>
                {user?.role === "admin" && (
                    <div className="addingControlGeneral">
                        <Link to="/works/form/new" className="btn btn-outline-success" id="addBtnWork">
                            <IoIosAddCircleOutline id="addIcon" />
                        </Link>
                    </div>
                )}
            </div>
            <ul id="worksList">
                {works.map((work) => (
                    <WorkCard key={work._id} work={work} onDelete={handleDelete} />
                ))}
            </ul>
        </div>
    );
};

export default WorksList;