import { useContext, useEffect, useState } from "react";
import "../../FormGeneral.css";
import { UserContext } from "../../../../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCreateEducation, fetchEducationById, fetchUpdateEducation } from "../Educations";

//FALTA QUE SE VALIDE SI EL USUARIO ES ADMIN!!!!

function EducationForm() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const isEdit = id && id !== "new";
    const [formData, setFormData] = useState({
        institutionName: "",
        linkInstitution: "",
        title: "",
        linkCertificate: "",
        dateStart: "",
        dateEnd: "",
        finished: false,
        typeEducation: "",
        description: "",
        iconInstitution: ""
    });

    useEffect(() => {
        if (isEdit) {
            const loadEducation = async () => {
                const result = await fetchEducationById(id);
                if (result?.error) {
                    //SWEET ALERT:
                    alert("Error loading Education by Id");
                    return;
                };
                setFormData(result.response);
            };
            loadEducation();
        };
    }, [id, isEdit]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === "checkbox" ? checked : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.typeEducation === "") {
            //SWEET ALERT:
            alert("Please select a valid type of Education!");
            return;
        };

        let result;
        if (isEdit) {
            result = await fetchUpdateEducation(id, formData);
        } else {
            result = await fetchCreateEducation(formData);
        };

        if (result?.error) {
            //SWEET ALERT:
            alert("Error saving Education");
        } else {
            //SWEET ALERT:
            alert("Education saved!");
            navigate("/");
        };
    };

    return (
        <div id="formBodyGeneral">
            <div id="formBodyGeneralTop">
                <h3>{isEdit ? "Update Education:" : "Create Education:"}</h3>
            </div>
            <form id="formGeneralContent" onSubmit={handleSubmit}>
                <div id="formGeneralContentBody">
                    <EducationField label="Institution: " value={formData.institutionName} placeholder="Type the Name of the Institution" name="institutionName" type="text" onChange={handleChange} />
                    <EducationField label="Link Institution" value={formData.linkInstitution} placeholder="Type the Link of the Institution" name="linkInstitution" type="text" onChange={handleChange} />
                    <EducationField label="Title: " value={formData.title} placeholder="Type the title or what you studied" name="title" type="text" onChange={handleChange} />
                    <EducationField label="Link Certificate: " value={formData.linkCertificate} placeholder="Type the Link of the Certificate" name="linkCertificate" type="text" onChange={handleChange} />
                    <EducationField label="Date Started: " value={formData.dateStart.slice(0, 10)} placeholder="Select the date you started" name="dateStart" type="date" onChange={handleChange} />
                    <EducationField label="Date Ended: " value={formData.dateEnd.slice(0, 10)} placeholder="Select the date you ended" name="dateEnd" type="date" onChange={handleChange} />
                    <EducationField label="Finished" value={formData.finished} name="finished" type="checkbox" onChange={handleChange}  />
                    <EducationField label="Description: " value={formData.description} placeholder="Type a description of what you studied" name="description" type="text" onChange={handleChange} />
                    <EducationSelectField
                        label="Type of Education:"
                        name="typeEducation"
                        value={formData.typeEducation}
                        onChange={handleChange}
                        options={["Primary School", "High School", "University", "Course", "Conference", "Other"]}
                    />
                    <EducationField label="Institution Icon: " value={formData.iconInstitution} placeholder="Type the Link of the Icon of the Institution" name="iconInstitution" type="text" onChange={handleChange} />

                    {formData.iconInstitution && (
                        <div className="iconPreviewContanier">
                            <h4>Preview of Icon:</h4>
                            <img
                                src={formData.iconInstitution}
                                alt="Instution Icon"
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

//VER SI ESTO LO DEJO COMO GENERAL:
function EducationField({ label, value, type, placeholder, name, onChange }) {
    return (
        <div className="divFieldsGeneral">
            <h3>{label}</h3>
            {type === "checkbox" ? (
                <input
                    type={type}
                    name={name}
                    checked={value}
                    onChange={onChange}
                />
            ) : (
                <input type={type} name={name} value={value || ""} placeholder={placeholder} onChange={onChange} />
            )}
        </div>
    );
};

function EducationSelectField({ label, name, value, options, onChange }) {
    return (
        <div className="divFieldsSelectGeneral">
            <h3>{label}</h3>
            <select name={name} value={value} onChange={onChange}>
                <option value="">Select type of Education</option>
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default EducationForm;