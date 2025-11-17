import { useContext, useEffect, useState } from "react";
import "./ContactMe.css";
import "../../Home/FormGeneral.css";
import { UserContext } from "../../../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "../../../../context/LoadingContext";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";
import { fetchCreateSendMessage } from "./ContactMeLogic";
import ReCAPTCHA from "react-google-recaptcha";
import { LANG_CONST } from "../../../constants/selectConstLang.js";
import { useLanguage } from "../../../../context/LanguageContext.jsx";

function ContactMe() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { successSweet, errorSweet } = useConfirmSweet();
    const { language } = useLanguage();

    const [form, setForm] = useState({
        name: "",
        email: "",
        message: ""
    });

    const TEXT = LANG_CONST[language];
    const [recaptchaValue, setRecaptchaValue] = useState(null);

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleRecaptcha = (value) => {
        setRecaptchaValue(value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!recaptchaValue) {
            await errorSweet(TEXT.NO_ROBOT);
            return;
        }
        startLoading();
        try {
            const result = await fetchCreateSendMessage({ ...form, recaptcha: recaptchaValue });

            if (result?.error) { await errorSweet(TEXT.ERROR_SENDING_MAIL); }
            else { await successSweet(TEXT.MAIL_SEND); }
        } catch (error) {
            console.error(TEXT.ERROR, error);
            await errorSweet(TEXT.ERROR_SENDING_MAIL);
        } finally {
            stopLoading();
        }
    };

    return (
        <div id="contactMe">
            <div id="contactMeTop">
                <h3>{TEXT.CONTACT_ME}</h3>
            </div>
            <div id="contactMeMiddle">
                <form id="contactForm" onSubmit={handleSubmit}>
                    <ContactField label={TEXT.NAME + ":"} name="name" value={form.name} placeholder={TEXT.PLACEHOLDER_CONTACT_NAME} onChange={handleChange} />
                    <ContactField label={TEXT.EMAIL} type="email" name="email" value={form.email} placeholder={TEXT.PLACEHOLDER_CONTACT_EMAIL} onChange={handleChange} />
                    <ContactField label={TEXT.MESSAGE} as="textarea" name="message" value={form.message} placeholder={TEXT.PLACEHOLDER_CONTACT_MESSAGE} onChange={handleChange} rows={10} id="contactFieldTextArea" />
                    <div style={{ margin: "20px 0" }} id="contactCaptcha">
                        <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} onChange={handleRecaptcha} />
                    </div>
                    <div id="contactMeBottom">
                        <Link to={"/"}>
                            <button className="btn btn-outline-success">{TEXT.HOME}</button>
                        </Link>
                            <button className="btn btn-outline-success" type="submit">{TEXT.SEND}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

function ContactField({ label, value, type = "text", placeholder, name, onChange, as = "input", rows }) {
    return (
        <div className="divFieldsGeneral">
            <h3>{label}</h3>
            {as === "textarea" ? (
                <textarea name={name} value={value || ""} placeholder={placeholder} onChange={onChange} rows={rows || 10} // valor por defecto
                />
            ) : (
                <input type={type} name={name} value={value || ""} placeholder={placeholder} onChange={onChange} />
            )}
        </div>
    );
};

export default ContactMe;