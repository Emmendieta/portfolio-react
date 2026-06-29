import { useEffect, useState, version } from "react";
import "./CookieTermGuard.css";
import { Link, Route, useLocation } from "react-router-dom";
import { useLanguage } from "../LanguageContext.jsx";
import { LANG_CONST } from "../../components/constants/selectConstLang.js";

export default function CookieTermGuard({ children }) {
    const [accepted, setAccepted] = useState(null);
    const location = useLocation();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsentEMM");
        setAccepted(consent === "accepted");
    }, []);

    const handleAccepted = () => {
        localStorage.setItem(
            "cookieConsentEMM", 
            JSON.stringify({
                accepted: true,
                version: "1.0.0",
                date: new Date().toISOString()
            })
        );
        setAccepted(true);
    };

    const handleReject = () => {
        if(document.referrer) { window.location.replace(document.referrer); }
        else { window.close(); };
    };

    const publicRoutes = ["/terms", "/privacy-policy"];
    const isPublicRoute = publicRoutes.includes(location.pathname);
    if (!accepted && !isPublicRoute) {
        return (

            <div className="cookie-container">
                <div className="cookie-modal">
                    <h1 className="cookie-h1">{TEXT.TERM_COND}</h1>
                    <h2 className="cookie-h2"><Link to="/terms" target="_blank" rel="noopener noreferrer" className="cookie-link">{TEXT.VIEW_TERM_COND}</Link></h2>
                    <h1 className="cookie-h1">{TEXT.PRIVACY_2}</h1>
                    <h2 className="cookie-h2"><Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="cookie-link">{TEXT.VIEW_PRIVACY_COND}</Link></h2>
                    <p className="cookie-p">{TEXT.ACCEPT_COND}</p>
                    <div className="cookie-btns-container">
                        <button onClick={handleAccepted} className="btn btn-outline-success">{TEXT.ACCEPT}</button>
                        <button onClick={handleReject} className="btn btn-outline-danger">{TEXT.REJECT}</button>
                    </div>
                </div>
            </div>
        );
    };

    return children;
};