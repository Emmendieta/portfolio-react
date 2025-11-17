import "./NotFound.css";
import { LANG_CONST } from "../../../constants/selectConstLang.js";
import { useLanguage } from "../../../../context/LanguageContext.jsx";

function NotFound() {

    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    return (
        <div className="divError">
            <h1 className="h1Error">{TEXT.ERROR_NOT_FOUND}</h1>
            <img src="/img/oops.png" alt="imageError" className="imgError" />
        </div>
    );
};

export default NotFound;