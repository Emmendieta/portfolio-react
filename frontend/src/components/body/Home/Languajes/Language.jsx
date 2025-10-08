import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { fetchDeleteLanguage, fetchLanguages } from "./Language";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import "./Language.css";
import { IoIosAddCircleOutline } from "react-icons/io";

function Language() {
    const { user } = useContext(UserContext);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLanguages = async () => {
            const languagesData = await fetchLanguages();
            if (languagesData?.error) {
                //SWEET AlERT:
                alert(languagesData.error.message);
                setLoading(false);
                return;
            };

            const languages = languagesData.response;
            setLanguages(languages);
            setLoading(false);
        };
        loadLanguages();
    }, []);

    const handleDelete = async (lid) => {
        //SWEET ALERT:
        const confirmDelete = window.confirm("Are you sure you want to delete de Language?");
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteLanguage(lid);

            if (result.error) {
                //SWEET ALERT:
                alert("Error deleting the Language", result.error.message);
            } else {
                //SWEET ALERT:
                alert("Language Deleted!");
                setLanguages(prev => prev.filter(language => language._id !== lid));
            }
        } catch (error) {
            //LOGGER:
            console.error("Error deleting Language: ", error.message);
            //SWEET ALERT:
            alert("Error deleting Language: ", error.message);
        }
    };

    //VER DE CAMBIAR:
    if (loading) return <p>Loading...</p>;
    if (!languages) return <p>No Languages data available.</p>;

    return (
        <div id="langaugesDiv">
            <div id="languagesDivTitle">
                <h3 id="languagesDivH3Title">Languages:</h3>
                {user?.role === "admin" && (
                    <div className="addingControlGeneral">
                        <Link to="/languages/form/new" className="btn btn-outline-success" id="addBtnLanguage">
                            <IoIosAddCircleOutline id="addIcon" />
                        </Link>
                    </div>
                )}
            </div>
            <ul id="languageList">
                {languages.map((language) => (
                    <li className="languageListLi" key={language._id} data-id={language._id}>
                        <div className="languageListBodyTop">
                            <a href={language.thumbnails?.[0]} target="_blank" rel="noopener noreferrer">
                                {<img
                                    src={language.thumbnails?.[0] || "/img/imagen-no-disponible.png"}
                                    alt={language.title}
                                    className="languageIcon"
                                    onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                                />}
                            </a>
                        </div>
                        <div className="languageListBodyMiddle">
                            <LanguageField label="Title: " value={language.title} />
                            <LanguageField label="Percent: " value={language.percent} />
                        </div>
                        {user?.role === "admin" && (
                            <div className="editionsControlsLanguage">
                                <Link to={`/languages/form/${language._id}`} id="languageEdit" className="btn btn-outline-primary btn-sm" >
                                    <FaPen />
                                </Link>
                                <button className="btn btn-outline-danger btn-sm" id="languageDelete" onClick={() => handleDelete(language._id)}>
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
function LanguageField({ label, value }) {
    return (
        <div className="languageDivDiv">
            <h3 className="languageDivH3">{label} {value || "-"}</h3>
        </div>
    );
};

export default Language;