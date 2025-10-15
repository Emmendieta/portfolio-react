import "./GeneralFieldsDark.css";

function GeneralFieldsDark({ label, value, isTextArea = false, id = "" }) {

    const clickHere = "Click Here";
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
                        {clickHere}
                    </a>
                ) : (value || "-")
                }
            </h3>
        </div>
    );
};

export default GeneralFieldsDark;