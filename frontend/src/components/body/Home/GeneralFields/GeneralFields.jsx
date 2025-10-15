import "./GeneralFields.css";

function GeneralFields({ label, value, isTextArea = false, id = "" }) {

    const clickHere = "Click Here";
    const isLink = typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("www."));
    if (isTextArea) {
        return (
            <div className="fieldDiv" id={id}>
                <h3 className="fieldLabel">{label}</h3>
                <textarea className="fieldTextArea" value={value || "-"} readOnly rows={9} />
            </div>
        );
    };
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
                        {clickHere}
                    </a>
                ) : (value || "-")}
            </h3>
        </div>
    );
};

export default GeneralFields;