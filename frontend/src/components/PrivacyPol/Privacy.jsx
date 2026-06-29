import { useLanguage } from "../../context/LanguageContext";
import { LANG_CONST } from "../constants/selectConstLang";
import "../Terms/Terms.css";

function Privacy () {
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    return (
        <div className="terms_container">
            <section className="terms_sect">
                <h1 className="terms_h1">{TEXT.PRIVACY_2}</h1>
                <h2 className="terms_h2">{TEXT.LAST_UPDATE} {TEXT.DATE_UPDATE}</h2>
                <p className="terms_p">{TEXT.WELCOME_TO} <strong><a href="https://www.emmendieta.com/">emmendieta.com</a></strong> ({TEXT.THE_WEBSITE}). {TEXT.PRIVACY_POL_EXP}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.INFO_COLLECT}</h2>
                <p className="terms_p">{TEXT.INFO_COLLECT_EXP}</p>
                <ul className="terms_ul">
                    <li className="terms_li">{TEXT.INFO_COLLECT_EXP_LI_1}</li>
                    <li className="terms_li">{TEXT.INFO_COLLECT_EXP_LI_2}</li>
                    <li className="terms_li">{TEXT.INFO_COLLECT_EXP_LI_3}</li>
                </ul>
                <p className="terms_p">{TEXT.INFO_COLLECT_EXP_2}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.HOW_USE_INFO}</h2>
                <p className="terms_p">{TEXT.HOW_USE_INFO_EXP}</p>
                <ul className="terms_ul">
                    <li className="terms_li">{TEXT.HOW_USE_INFO_EXP_LI_1}</li>
                    <li className="terms_li">{TEXT.HOW_USE_INFO_EXP_LI_2}</li>
                    <li className="terms_li">{TEXT.HOW_USE_INFO_EXP_LI_3}</li>
                </ul>
                <p className="terms_p">{TEXT.HOW_USE_INFO_EXP_2}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.CONTACT_FORM_PRO}</h2>
                <p className="terms_p">{TEXT.CONTACT_FORM_PRO_EXP}</p>
                <p className="terms_p">{TEXT.CONTACT_FORM_PRO_EXP_2}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.THIRD_PARTY_SER}</h2>
                <p className="terms_p">{TEXT.THIRD_PARTY_SER_EXP}</p>
                <ul className="terms_ul">
                    <li className="terms_li">{TEXT.THIRD_PARTY_SER_EXP_LI_1}</li>
                    <li className="terms_li">{TEXT.THIRD_PARTY_SER_EXP_LI_2}</li>
                    <li className="terms_li">{TEXT.THIRD_PARTY_SER_EXP_LI_3}</li>
                    <li className="terms_li">{TEXT.THIRD_PARTY_SER_EXP_LI_4}</li>
                </ul>
                <p className="terms_p">{TEXT.THIRD_PARTY_SER_EXP_2}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.COOKIES}</h2>
                <p className="terms_p">{TEXT.COOKIES_EXP}</p>
                <p className="terms_p">{TEXT.COOKIES_EXP_2}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.THIRD_PARTY_LINKS}</h2>
                <p className="terms_p">{TEXT.THIRD_PARTY_LINKS_EXP}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.DATA_SECURITY}</h2>
                <p className="terms_p">{TEXT.DATA_SECURITY_EXP}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.YOUR_RIGHTS}</h2>
                <p className="terms_p">{TEXT.YOUR_RIGHTS_EXP}</p>
                <p className="terms_p">{TEXT.YOUR_RIGHTS_EXP_1}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.CHANGE_PRIVACY}</h2>
                <p className="terms_p">{TEXT.CHANGE_PRIVACY_EXP}</p>
            </section>
            <section className="terms_sect">
                <h2 className="terms_h2">{TEXT.CONTACT_PRIVACY}</h2>
                <p className="terms_p">{TEXT.CONTACT_PRIVACY_EXP}</p>
                <p className="terms_p">Email: {" "} <a href="mailto:emmendieta12@gmail.com">emmendieta12@gmail.com</a></p>
            </section>
        </div>
    );
};

export default Privacy;