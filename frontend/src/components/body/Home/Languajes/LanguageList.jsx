import { useContext, useEffect, useState } from "react";
import { fetchDeleteLanguage, fetchLanguages } from "./Language";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import LanguageCard from "./LanguageCard/LanguageCard";
import { UserContext } from "../../../../context/UserContext";
import "./LanguagesList.css";

function LanguagesList() {
    const { user } = useContext(UserContext);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLanguages = async () => {
            const languagesData = await fetchLanguages();
            if (languagesData?.error) {
                alert(languagesData.error.message);
                setLoading(false);
                return;
            }
            setLanguages(languagesData.response || []);
            setLoading(false);
        };
        loadLanguages();
    }, []);

    const handleDelete = async (lid) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Language?");
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteLanguage(lid);
            if (result.error) {
                alert("Error deleting the Language: " + result.error.message);
            } else {
                alert("Language Deleted!");
                setLanguages(prev => prev.filter(language => language._id !== lid));
            }
        } catch (error) {
            console.error("Error deleting Language: ", error.message);
            alert("Error deleting Language: " + error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!languages || languages.length === 0) return <p>No Languages data available.</p>;

    return (
        <div id="langaugesDiv">
            <div id="languagesDivTitle">
                <h3 id="languagesDivH3Title">Languages:</h3>
                { user?.role === "admin" && (
                <div className="addingControlGeneral">
                    <Link to="/languages/form/new" className="btn btn-outline-success" id="addBtnLanguage">
                        <IoIosAddCircleOutline id="addIcon" />
                    </Link>
                </div>
                )}
            </div>

            <ul id="languageList">
                {languages.map((language) => (
                    <LanguageCard
                        key={language._id}
                        language={language}
                        onDelete={handleDelete}
                    />
                ))}
            </ul>
        </div>
    );
}

export default LanguagesList;
