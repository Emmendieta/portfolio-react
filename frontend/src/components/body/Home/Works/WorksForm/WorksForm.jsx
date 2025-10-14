import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCreateWork, fetchUpdateWork, fetchWorkById } from "../Works";
import "../../FormGeneral.css";

//Falta Validar si el usuario es Admin:
function WorksForm() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const isEdit = id && id !== "new";
    const [formData, setFormData] = useState({
        jobTitle: "",
        dateStart: "",
        dateEnd: "",
        company: "",
        linkCompany: "",
        finished: false,
        description: "",
        thumbnails: ""
    });

    useEffect(() => {
        if (isEdit) {
            const loadWork = async () => {
                const result = await fetchWorkById(id);
                if(result?.error) {
                    //SWEET ALERT:
                    alert("Error loading Work by Id");
                    return;
                };
                setFormData(result.response);
            };
            loadWork();
        };
    }, [id, isEdit]);

    const handleChange = (event) => {
        const { name, type, value, checked } = event.target;
        const newValue = type === "checkbox" ? checked: value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let result;
        if(isEdit) {
            result = await fetchUpdateWork(id, formData);
        } else {
            result = await fetchCreateWork(formData);
        };

        if(result?.error) {
            //SWEET ALERT:
            alert ("Error saving Work");
        } else {
            //SWEET ALERT:
            alert("Work saved!");
            navigate("/");
        };
    };

    return (
        <div id="formBodyGeneral">
            <div id="formBodyGeneralTop">
                <h3>{isEdit ? "Update Work:" : "Create Work:"}</h3>
            </div>
            <form id="formGeneralContent" onSubmit={handleSubmit}>
                <div id="formGeneralContentBody">
                    <WorkField label="Company: " value={formData.company} placeholder="Type the name of the Company" name="company" type="text" onChange={handleChange} />
                    <WorkField label="Link Company: " value={formData.linkCompany} placeholder="Type the Link of the Company" name="linkCompany" type="text" onChange={handleChange} />
                    <WorkField label="Job Title: " value={formData.jobTitle} placeholder="Type the title you have in your work" name="jobTitle" type="text" onChange={handleChange} />
                    <WorkField label="Date Started: " value={formData.dateStart.slice(0, 10)} placeholder="Select the date you started to work in the company" name="dateStart" type="date" onChange={handleChange} />
                    <WorkField label="Date Ended: " value={formData.dateEnd.slice(0, 10)} placeholder="Select the date you finish working in the company" name="dateEnd" type="date" onChange={handleChange} />
                    <WorkField label="Finished?: " value={formData.finished} placeholder="Still working in the company?" name="finished" type="checkbox" onChange={handleChange} />
                    <WorkField label="Image: " value={formData.thumbnails} placeholder="Type the link to the image" name="thumbnails" type="text" onChange={handleChange} />
                    <WorkField label="Description: " value={formData.description} placeholder="Type a description of you functions in the work" name="description" type="text" onChange={handleChange} />

                    {formData.thumbnails && (
                        <div className="iconPreviewContanier">
                            <h4>Preview of Image:</h4>
                            <img 
                                src={formData.thumbnails}
                                alt="Image Work"
                                onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                                className="previewImage"
                            />
                        </div>
                    )}
                </div>
                <div id="formGeneralBottom">
                    <a className="btn btn-outline-success" id="btnGoBack" href="/">Go Back</a>
                    <button className="btn btn-outline-success" type="submit">{isEdit ? "Update" : "Create"}</button>
                </div>
            </form>
        </div>
    );
};

//VER SI HAGO UNO GENERAL:

function WorkField({ label, value, type, placeholder, name, onChange }) {
    return (
        <div className="divFieldsGeneral">
            <h3>{label}</h3>
            <input type={type} name={name} value={value || ""} placeholder={placeholder} onChange={onChange} />
        </div>
    )
}

export default WorksForm;