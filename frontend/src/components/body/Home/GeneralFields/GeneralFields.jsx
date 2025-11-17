import "./GeneralFields.css";
import { LANG_CONST } from "../../../constants/selectConstLang.js";

function GeneralFields({ label, value, isTextArea = false, id = "", language }) {

    const TEXT = LANG_CONST[language];

    // Comprobamos si es un link
    const isLink =
        typeof value === "string" &&
        (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("www."));

    // Si value es un objeto (como {en: "Title", es: "Título"}), extraemos el idioma
    const displayValue =
        value && typeof value === "object" ? value[language] || "-" : value;

    if (isTextArea) {
        return (
            <div className="fieldDiv" id={id}>
                <h3 className="fieldLabel">{label}</h3>
                <textarea
                    className="fieldTextArea"
                    value={displayValue || "-"}
                    readOnly
                    rows={9}
                />
            </div>
        );
    }

    return (
        <div className="fieldDiv" id={id}>
            <h3 className="fieldLabel">
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
                ) : (
                    displayValue || "-"
                )}
            </h3>
        </div>
    );
}

export default GeneralFields;

