import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("en");

    useEffect(() => {
        const savedLang = localStorage.getItem("portfolioEmmLang");
        if (savedLang) { setLanguage(savedLang) }
        else { 
            localStorage.setItem("portfolioEmmLang", "es"); 
            setLanguage("es");
        }
    }, []);

    const changeLanguge = (lang) => {
        setLanguage(lang);
        localStorage.setItem("portfolioEmmLang", lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguge }}>{ children }</LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);