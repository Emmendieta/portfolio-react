import "./GeneralFieldsDark.css";

function GeneralFieldsDark({ label, value, isTextArea = false, id = "" }) {
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
            <h3 className="fieldLabelDark">{label} {value || "-"}</h3>
        </div>
    );
};

export default GeneralFieldsDark;