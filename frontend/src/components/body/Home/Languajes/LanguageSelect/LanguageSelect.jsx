import { useState } from "react";
import { useLanguage } from "../../../../../context/LanguageContext";
import "./LanguageSelect.css";
import { LANG_CONST } from "../../../../constants/selectConstLang.js";

function LanguageSelect({ allLanguages, selectedLanguages, setSelectedLanguages }) {
    const { language: currentLanguage } = useLanguage();
    const [selectValue, setSelectValue] = useState("");

    const handleSelect = (event) => {
        const selectId = event.target.value;
        if (!selectId) return;

        const selectedLang = allLanguages.find(lang => lang._id === selectId);
        if (selectedLang && !selectedLanguages.some(lang => lang._id === selectId)) {
            setSelectedLanguages(prev => [...prev, selectedLang]);
        }

        setSelectValue(""); // reset select
    };

    const handleRemove = (langId) => {
        setSelectedLanguages(prev => prev.filter(lang => lang._id !== langId));
    };

    const TEXT = LANG_CONST[currentLanguage];

    return (
        <div className="divFieldsGeneralLanguages">
            <div className="divFieldsGeneralLanguagesTop">
                <h3>{TEXT.LANGUAGES}</h3>
                <select
                    value={selectValue}
                    onChange={(e) => {
                        setSelectValue(e.target.value);
                        handleSelect(e);
                    }}
                >
                    <option value="">{TEXT.SELECT_LANGUAGE}</option>
                    {allLanguages
                        .filter(lang => !selectedLanguages.some(sel => sel._id === lang._id))
                        .map(lang => (
                            <option key={lang._id} value={lang._id}>
                                {lang.title?.[currentLanguage] || "No Title"}
                            </option>
                        ))
                    }
                </select>
            </div>

            {selectedLanguages.length > 0 && (
                <div className="divFieldsGeneralLanguagesBottom">
                    {selectedLanguages.map(lang => (
                        <div key={lang._id} className="selectedLanguageItem">
                            <div className="selectedLanguageItemDescription">
                                <img
                                    src={lang.thumbnails || "/img/imagen-no-disponible.png"}
                                    alt={lang.title?.[currentLanguage] || "Language"}
                                    onError={(event) => (event.currentTarget.src = "/img/imagen-no-disponible.png")}
                                />
                                <span>{lang.title?.[currentLanguage] || "No Title"}</span>
                            </div>
                            <button
                                className="btn btn-outline-danger"
                                type="button"
                                onClick={() => handleRemove(lang._id)}
                                aria-label={`Remove ${lang.title?.[currentLanguage] || "Language"}`}
                            >
                                {TEXT.REMOVE}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LanguageSelect;
