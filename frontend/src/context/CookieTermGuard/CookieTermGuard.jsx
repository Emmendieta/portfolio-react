import { useEffect, useState, version } from "react";
import "./CookieTermGuard.css";
import { TERM_COND, ACCEPT_COND, ACCEPT, REJECT } from "../../components/constants/englishConst.js";

export default function CookieTermGuard({ children }) {
    const [accepted, setAccepted] = useState(null);

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

    if (!accepted) {
        return (

            <div className="cookie-container">
                <div className="cookie-modal">
                    <h1 className="cookie-h1">{TERM_COND}</h1>
                    <h2 className="cookie-h2">FLATA EL LINK DE LOS TERMINOS Y CONDICIONES!!!</h2>
                    <p className="cookie-p">{ACCEPT_COND}</p>
                    <div className="cookie-btns-container">
                        <button onClick={handleAccepted} className="btn btn-outline-success">{ACCEPT}</button>
                        <button onClick={handleReject} className="btn btn-outline-danger">{REJECT}</button>
                    </div>
                </div>
            </div>
        );
    };

    return children;
};