import "./LanguageSelect.css";

function LanguageSelect({ allLanguages, selectedLanguages, setSelectedLanguages }) {

    const handleSelect = (event) => {
        const selectId = event.target.value;
        if (!selectedLanguages.some(lang => lang._id === selectId)) {
            const selectedLang = allLanguages.find(lang => lang._id === selectId);
            if (selectedLang) {
                setSelectedLanguages(prev => [...prev, selectedLang]);
            }
        }
    };

    const handleRemove = (langId) => {
        setSelectedLanguages(prev => prev.filter(lang => lang._id !== langId));
    };

    return (
        <div className="divFiledsGeneralLanguages">
            <div className="divFiledsGeneralLanguagesTop">
                <h3>Languages:</h3>
                <select onChange={handleSelect} value="">
                    <option value="">Select a Language</option>
                    {allLanguages.map(lang => (
                        <option key={lang._id} value={lang._id}>{lang.title}</option>
                    ))}
                </select>
            </div>
            <div className="divFiledsGeneralLanguagesBottom">
                {selectedLanguages.map(lang => (
                    <div key={lang._id || lang.id} className="selectedLanguageItem">
                        <div className="selectedLanguageItemDescription">
                            <img
                                src={lang.thumbnails}
                                alt={lang.title}
                                onError={(event) => (event.currentTarget.src = "/img/imagen-no-disponible.png")}
                            />
                            <span>{lang.title}</span>
                        </div>
                        <button
                            className="btn btn-outline-danger"
                            type="button"
                            onClick={() => handleRemove(lang._id || lang.id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LanguageSelect;