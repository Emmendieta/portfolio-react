import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCreateLanguage, fetchLanguageById, fetchUpdateLangauge } from "../Language";


//Falta Validar si el usuario es Admin:
function LanguagesForm() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const isEdit = id && id !== "new";
    const [formData, setFormData] = useState({
        title: "",
        percent: 0,
        thumbnails: ""
    });

    useEffect(() => {
        if (isEdit) {
            const loadLanguage = async () => {
                const result = await fetchLanguageById(id);
                if(result?.error) {
                    //SWEET ALERT:
                    alert("Error loadign Language by Id");
                    return;
                };
                setFormData(result.response);
            };
            loadLanguage();
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
            result = await fetchUpdateLangauge(id, formData);
        } else {
            result = await fetchCreateLanguage(formData);
        };

        if(result?.error) {
            //SWEET ALERT:
            alert("Error saving Language");
        } else {
            //SWEET ALERT:
            alert("Language saved!");
            navigate("/");
        }
    };

    return (
        <div id="formBodyGeneral">
            <div id="formBodyGeneralTop">
                <h3>{isEdit ? "Update Language:" : "Create Language:"}</h3>
            </div>
            <form id="formGeneralContent" onSubmit={handleSubmit}>
                <div id="formGeneralContentBody">
                    <LanguageField label="Name: " value={formData.title} placeholder="Type here the name of the Language" name="title" type="text" onChange={handleChange} />
                    <LanguageField label="Percent: " value={formData.percent} placeholder="Type the percent of knowledge" name="percent" type="number" onChange={handleChange} />
                    <LanguageField label="Images: " value={formData.thumbnails} placeholder="Type here the Link of the Image" name="thumbnails" type="text" onChange={handleChange} />
                </div>
                <div id="formGeneralBottom">
                    <a className="btn btn-outline-success" id="btnGoBack" href="/">Go Back</a>
                    <button className="btn btn-outline-success" type="submit">{isEdit ? "Update" : "Create"}</button>
                </div>
            </form>
        </div>
    )
};

//VER SI ESTO LO DEJO COMO GENERAL:

function LanguageField({ label, value, type, placeholder, name, onChange }) {
    return (
        <div className="divFieldsGeneral">
            <h3>{label}</h3>
            <input type={type} name={name} value={value || ""} placeholder={placeholder} onChange={onChange} />
        </div>
    );
};

export default LanguagesForm;