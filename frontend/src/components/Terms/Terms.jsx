import { useLanguage } from "../../context/LanguageContext";
import { LANG_CONST } from "../constants/selectConstLang";
import "./Terms.css";

function Terms() {
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    return (
        <div className="terms_container">
            <section className="terms_sect">
                <h1 className="terms_h1">{TEXT.TERM_COND_USE}</h1>
                <h2 className="terms_h2">{TEXT.LAST_UPDATE} {TEXT.DATE_UPDATE}</h2>
                <p className="terms_p">{TEXT.WELCOME_TO} <strong><a href="https://www.emmendieta.com">emmendieta.com</a></strong> ({TEXT.THE_WEBSITE}). {TEXT.ACCEPTING_WEB}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.PURPOSE}</h2>
                <p className="terms_p">{TEXT.PUPROSE_EXP}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.INTELLECTUAL_PROPERTY}</h2>
                <p className="terms_p">{TEXT.INTELLECTUAL_PROPERTY_EXP_1}</p>
                <p className="terms_p">{TEXT.INTELLECTUAL_PROPERTY_EXP_2}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.ACCEPTABLE_USE}</h2>
                <p className="terms_p">{TEXT.ACCEPTABLE_USE_EXP}</p>
                <ul id="terms_ul">
                    <li className="terms_li">{TEXT.ACCEPTABLE_USE_LI_1}</li>
                    <li className="terms_li">{TEXT.ACCEPTALBE_USE_LI_2}</li>
                    <li className="terms_li">{TEXT.ACCEPTABLE_USE_LI_3}</li>
                    <li className="terms_li">{TEXT.ACCEPTABLE_USE_LI_4}</li>
                </ul>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.ACCURACY_INFO}</h2>
                <p className="terms_p">{TEXT.ACCURACY_INFO_EXP_1}</p>
                <p className="terms_p">{TEXT.ACCURACY_INFO_EXP_2}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.THIRD_PARTY}</h2>
                <p className="terms_p">{TEXT.THIRD_PARTY_EXP}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.LIMITATION_LIABILITY}</h2>
                <p className="terms_p">{TEXT.LIMITATION_LIABILITY_EXP}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.CONTACT_FORM}</h2>
                <p className="terms_p">{TEXT.CONTACT_FORM_EXP_1}</p>
                <p className="terms_p">{TEXT.CONTACT_FORM_EXP_2}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.PRIVACY}</h2>
                <p className="terms_p">{TEXT.PRIVACY_EXP}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.CHANGE_TERMS}</h2>
                <p className="terms_p">{TEXT.CHANGE_TERMS_EXP}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.GOV_LAW}</h2>
                <p className="terms_p">{TEXT.GOV_LAW_EXP}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.CONTACT_TERMS}</h2>
                <p className="terms_p">{TEXT.CONTACT_EXP_1}</p>
                <p className="terms_p">Email:{" "} <a href="mailto:emmendieta12@gmail.com">emmendieta12@gmail.com</a></p>
            </section>
        </div>
    );
};

export default Terms;