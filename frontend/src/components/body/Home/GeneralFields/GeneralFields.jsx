import "./GeneralFields.css";

function GeneralFields({ label, value, isTextArea = false, id = "" }) {
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
            <h3 className="fieldLabel">{label} {value || "-"}</h3>
        </div>
    );
};

export default GeneralFields;