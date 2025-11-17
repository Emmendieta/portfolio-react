import { useState } from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import { AR, US } from 'country-flag-icons/react/3x2';

const LANGUAGES = {
    es: { label: "ES", Flag: AR },
    en: { label: "EN", Flag: US },
};

function LanguageSelector() {
    const { language, changeLanguge } = useLanguage();
    const [open, setOpen] = useState(false);

    const CurrentFlag = LANGUAGES[language].Flag; 
    return (
        <div className="dropdown">
            <button
                className="btn btn-dark dropdown-toggle"
                type="button"
                onClick={() => setOpen(!open)}
            >
                <CurrentFlag style={{ width: 20, marginRight: 5 }} />
                {LANGUAGES[language].label}
            </button>
            <ul className={`dropdown-menu${open ? " show" : ""}`}>
                {Object.entries(LANGUAGES).map(([key, { label, Flag }]) => (
                    <li key={key}>
                        <button
                            className="dropdown-item"
                            onClick={() => {
                                changeLanguge(key);
                                setOpen(false);
                            }}
                        >
                            <Flag style={{ width: 20, marginRight: 5 }} /> {label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LanguageSelector;
