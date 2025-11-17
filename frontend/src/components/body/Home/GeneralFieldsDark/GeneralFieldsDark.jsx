import "./GeneralFieldsDark.css";
import { LANG_CONST } from "../../../constants/selectConstLang.js";

function GeneralFieldsDark({ label, value, isTextArea = false, id = "", language }) {

    const TEXT = LANG_CONST[language];
    const isLink = typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("www."));
    if (isTextArea) {
        return (
            <div className="fieldDivDark" id={id}>
                <h3 className="fieldLabelDark">{label}</h3>
                <textarea className="fieldTextAreaDark" value={value || "-"} readOnly rows={9} />
            </div>
        );
    };

    return (
        <div className="fieldDivDark" id={id}>
            <h3 className="fieldLabelDark">
                {label}{" "}
                {isLink ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fieldLinkDark"
                    >
                        {TEXT.CLICK_HERE}
                    </a>
                ) : (value || "-")
                }
            </h3>
        </div>
    );
};

export default GeneralFieldsDark;