import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const safeLanguages = ["es", "en"];

    // Garantizamos que el estado inicial nunca sea undefined
    const getInitialLang = () => {
        try {
            const saved = localStorage.getItem("portfolioEmmLang");

            if (safeLanguages.includes(saved)) {
                return saved; // válido → usarlo
            }

            // si viene null, undefined o corrupto → forzar español
            localStorage.setItem("portfolioEmmLang", "es");
            return "es";

        } catch (err) {
            // fallback total en caso de errores
            return "es";
        }
    };

    const [language, setLanguage] = useState(getInitialLang);

    useEffect(() => {
        // segunda protección (extra seguridad en producción)
        const savedLang = localStorage.getItem("portfolioEmmLang");

        if (!safeLanguages.includes(savedLang)) {
            localStorage.setItem("portfolioEmmLang", "es");
            setLanguage("es");
        }
    }, []);

    const changeLanguge = (lang) => {
        if (!safeLanguages.includes(lang)) return; // evita estados inválidos
        setLanguage(lang);
        localStorage.setItem("portfolioEmmLang", lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguge }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);