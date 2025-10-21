import { useContext, useEffect, useState } from "react";
import { fetchDeleteLanguage, fetchLanguages } from "./Language";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import LanguageCard from "./LanguageCard/LanguageCard";
import { UserContext } from "../../../../context/UserContext";
import "./LanguagesList.css";
import { useLoading } from "../../../../context/LoadingContext";
import "../../../GlobalLoader.css";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";

function LanguagesList() {
    const { user } = useContext(UserContext);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();

    useEffect(() => {
        const loadLanguages = async () => {

            try {
                startLoading();
                const languagesData = await fetchLanguages();
                if (languagesData?.error) {
                    await errorSweet(languagesData.error.message);
                    setLoading(false);
                    return;
                };
                setLanguages(languagesData.response || []);

            } catch (error) {
                await errorSweet("Error loading Languages: " + error.message);
                console.error("Error loading Languages:", error);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadLanguages();
    }, []);

    const handleDelete = async (lid) => {
        const confirmDelete = await confirmSweet({
            title: "Delete Language:",
            text: "Are you sure you want to delete this Language?",
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        });
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteLanguage(lid);
            if (result.error) {
                await errorSweet("Error deleting the Language: " + result.error.message);
            } else {
                await successSweet("Language Deleted!");
                setLanguages(prev => prev.filter(language => language._id !== lid));
            }
        } catch (error) {
            //LOGGER:
            console.error("Error deleting Language: ", error.message);
            await errorSweet("Error deleting Language: " + error.message);
        }
    };

    if (!languages || languages.length === 0) return <p>No Languages data available.</p>;

    const hardSkills = languages.filter(lang => lang.type === "Hard");
    const softSkills = languages.filter(lang => lang.type === "Soft");

    return (
        <div id="langaugesDiv">
            <div id="languagesDivTitle">
                <h3 id="languagesDivH3Title">Skills:</h3>
                {user?.role === "admin" && (
                    <div className="addingControlGeneral">
                        <Link to="/languages/form/new" className="btn btn-outline-success" id="addBtnLanguage">
                            <IoIosAddCircleOutline id="addIcon" />
                        </Link>
                    </div>
                )}
            </div>
            <div id="languageDivContainer">
                {/* 🧠 Hard Skills */}
                {hardSkills.length > 0 && (
                    <div className="languageCategory">
                        <h4 className="languageCategoryTitle">Hard Skills:</h4>
                        <ul className="languageList">
                            {hardSkills.map(language => (
                                <LanguageCard
                                    key={language._id}
                                    language={language}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </ul>
                    </div>
                )}

                {/* 💬 Soft Skills */}
                {softSkills.length > 0 && (
                    <div className="languageCategory">
                        <h4 className="languageCategoryTitle">Soft Skills:</h4>
                        <ul className="languageList">
                            {softSkills.map(language => (
                                <LanguageCard
                                    key={language._id}
                                    language={language}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LanguagesList;
