import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCreateLanguage, fetchLanguageById, fetchUpdateLangauge } from "../Language";
import "../../FormGeneral.css";
import { useConfirmSweet } from "../../../../../context/SweetAlert2Context";

//Falta Validar si el usuario es Admin:
function LanguagesForm() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const { successSweet, errorSweet } = useConfirmSweet();

    const isEdit = id && id !== "new";
    const [formData, setFormData] = useState({
        title: "",
        percent: 0,
        thumbnails: "",
        type: ""
    });

    useEffect(() => {
        if (!user) {
            navigate("/forbidden");
            return;
        };
        if (isEdit) {
            const loadLanguage = async () => {
                const result = await fetchLanguageById(id);
                if (result?.error) {
                    await errorSweet("Error loadign Language by Id");
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

        if (!formData.type) {
            await errorSweet("Please select a valid Type of Language!");
            return;
        };

        let result;
        if (isEdit) {
            result = await fetchUpdateLangauge(id, formData);
        } else {
            result = await fetchCreateLanguage(formData);
        };

        if (result?.error) {
            await errorSweet("Error saving Language");
        } else {
            await successSweet("Language saved!");
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

                    {/* 👉 Tipo (Hard / Soft) */}
                    <div className="divFieldsSelectGeneral">
                        <h3>Type:</h3>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="div"
                        >
                            <option value="">Select type of Language</option>
                            <option value="Hard">Hard</option>
                            <option value="Soft">Soft</option>
                        </select>
                    </div>

                    <LanguageField label="Image: " value={formData.thumbnails} placeholder="Type here the Link of the Image" name="thumbnails" type="text" onChange={handleChange} />
                </div>

                {formData.thumbnails && (
                    <div className="iconPreviewContanier">
                        <h4>Preview of The Image:</h4>
                        <img
                            src={formData.thumbnails}
                            alt="Language Image"
                            onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                            className="previewImage"
                        />
                    </div>

                )}


                <div id="formGeneralBottom">
                    <a className="btn btn-outline-success" id="btnGoBack" href="/">Go Back</a>
                    <button className="btn btn-outline-success" type="submit">{isEdit ? "Update" : "Create"}</button>
                </div>
            </form>
        </div>
    );
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