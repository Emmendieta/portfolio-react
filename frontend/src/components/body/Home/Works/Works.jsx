import { useContext, useEffect, useState } from "react";
import "./Works.css";
import { UserContext } from "../../../../context/UserContext";
import { fetchDeleteWork, fetchWorks } from "./Works";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoIosAddCircleOutline } from "react-icons/io";

function Works() {
    const { user } = useContext(UserContext);
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWorks = async () => {
            const worksData = await fetchWorks();
            if (worksData?.error) {
                //SWEET ALERT:
                alert(worksData.error.message);
                setLoading(false);
                return;
            };

            const works = worksData.response;
            setWorks(works);
            setLoading(false);
        };
        loadWorks();
    }, []);

    const handleDelete = async (wid) => {
        //SWEET ALERT:
        const confirmDelete = window.confirm("Are you sure you want to delete de Work?");
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteWork(wid);

            if (result.error) {
                //SWEET ALERT:
                alert("Error deleting the Work", result.error.message);
            } else {
                //SWEET ALERT:
                alert("Work Deleted!");
                setWorks(prev => prev.filter(work => work._id !== wid));
            }
        } catch (error) {
            //LOGGER:
            console.error("Error deleting Work: ", error.message);
            //SWEET ALERT:
            alert("Error deleting Work: ", error.message);
        }
    };

    //VER DE CAMBIAR:
    if (loading) return <p>Loading...</p>;
    if (!works) return <p>No Works data available.</p>;

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
                    <li className="worksListLi" key={work._id} data-id={work._id}>
                        <div className="workListTop">
                            <a href={work.thumbnails?.[0]} target="_blank" rel="noopener noreferrer">
                                {<img
                                    src={work.thumbnails?.[0] || "/img/imagen-no-disponbible.png"}
                                    alt={work.company}
                                    className="workIcon"
                                    onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                                />}
                            </a>
                        </div>
                        <div className="workListBody">
                            <div className="workListBodyTop">
                                <div>
                                    <WorkField label="Company: " value={work.company} />
                                    <WorkField label="Link Company: " value={work.linkCompany} />
                                    <WorkField label="Job Title: " value={work.jobTitle} />
                                    <WorkField label="Date Started: " value={work.dateStart.slice(0, 10)} />
                                    <WorkField label="Date End: " value={work.dateEnd.slice(0, 10)} />
                                </div>
                                <div className="workListBodyBottom">
                                    <WorkField label="Description: " value={work.description} />
                                </div>
                            </div>
                            <div className="workListBottom">
                                {user?.role === "admin" && (
                                    <div className="editionsControlsWork">
                                        <Link to={`/works/form/${work._id}`} id="workEdit" className="btn btn-outline-primary btn-sm" >
                                            <FaPen />
                                        </Link>
                                        <button className="btn btn-outline-danger btn-sm" id="workDelete" onClick={() => handleDelete(work._id)} >
                                            <FaRegTrashCan />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )

};

//VER SI ESTO LO DEJO COMO GENERAL:
function WorkField({ label, value }) {
    return (
        <div className="workDivDiv">
            <h3 className="workDivH3">{label}</h3>
            <h3 className="workDivH3">{value || "-"}</h3>
        </div>
    );
};

export default Works;