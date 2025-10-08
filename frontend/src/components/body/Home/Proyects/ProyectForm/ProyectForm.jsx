import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../../../context/UserContext";
import { useContext, useEffect, useState } from "react";
import { fetchCreateProyect, fetchProyectById, fetchUpdateProyect } from "../logicProyects";
import "../../FormGeneral.css";


//Falta Validar si el usuario es Admin:
function ProyectForm() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const isEdit = id && id !== "new";
    const [formData, setFormData] = useState({
        title: "",
        dateStart: "",
        dateEnd: "",
        company: "",
        linkProyect: "",
        linkCompany: "",
        description: "",
        languages: "",
    });

    useEffect(() => {
        if (isEdit) {
            const loadProyect = async () => {
                const result = await fetchProyectById(id);
                if(result?.error) {
                    //SWEET ALERT:
                    alert("Error loading Proyect by Id");
                    return;
                };
                setFormData(result.response);
            };
            loadProyect();
        };
    }, [id, isEdit]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let result;
        if (isEdit) {
            result = await fetchUpdateProyect(id, formData);
        } else {
            result = await fetchCreateProyect(formData);
        };
        if(result?.error) {
            //SWEET ALERT:
            alert("Error saving Proyect");
        } else {
            //SWEET ALERT:
            alert("Proyect saved!");
            navigate("/");
        }
    };

    return (
        <div id="formBodyGeneral">
            <div id="formBodyGeneralTop">
                <h3>{isEdit ? "Update Proyect" : "Create Proyect"}</h3>
            </div>
            <form id="formGeneralContent" onSubmit={handleSubmit}>
                <div id="formGeneralContentBody">
                    <ProyectField label="Title: " value={formData.title} placeholder="Type here the Title of the Proyect" name="title" type="text" onChange={handleChange} />
                    <ProyectField label="Company: " value={formData.company} placeholder="Type here the name of the Company" name="company" type="text" onChange={handleChange} />
                    <ProyectField label="Link Company: " value={formData.linkCompany} placeholder="Type here the Link of the Company" name="linkCompany" type="text" onChange={handleChange} />
                    <ProyectField label="Link of the Proyect: " value={formData.linkProyect} placeholder="Type here the Link of the Proyect" name="linkProyect" type="text" onChange={handleChange} />
                    <ProyectField label="Date Started: " value={formData.dateStart.slice(0, 10)} placeholder="Select the Date you started the Proyect" name="dateStart" type="date" onChange={handleChange} />
                    <ProyectField label="Date Ended: " value={formData.dateEnd.slice(0, 10)} placeholder="Select the Date you ended the Proyect" name="dateEnd" type="date" onChange={handleChange} />
                    <ProyectField label="Languages: " value={formData.languages} placeholder="Type here the name of the Languages (ACA SE TIENE QUE SELECCIONAR DE LOS QUE EXISTEN)" name="languages" type="text" onChange={handleChange} />
                    <ProyectField label="Description: " value={formData.description} placeholder="Type here a description of the Proyect" name="description" type="text" onChange={handleChange} />
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

function ProyectField({ label, value, type, placeholder, name, onChange }) {
    return (
        <div className="divFieldsGeneral">
            <h3>{label}</h3>
            <input type={type} name={name} value={value || ""} placeholder={placeholder} onChange={onChange} />
        </div>
    );
};

export default ProyectForm;