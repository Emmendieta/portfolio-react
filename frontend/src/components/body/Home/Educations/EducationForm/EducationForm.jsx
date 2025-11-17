import { useContext, useEffect, useState } from "react";
import "../../FormGeneral.css";
import { UserContext } from "../../../../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCreateEducation, fetchEducationById, fetchUpdateEducation } from "../Educations";
import { useConfirmSweet } from "../../../../../context/SweetAlert2Context";
import { useLanguage } from "../../../../../context/LanguageContext";
import { LANG_CONST } from "../../../../constants/selectConstLang.js";

//FALTA QUE SE VALIDE SI EL USUARIO ES ADMIN!!!!

function EducationForm() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const { successSweet, errorSweet } = useConfirmSweet();
    const { language } = useLanguage();
    const isEdit = id && id !== "new";
    const [formData, setFormData] = useState({
        institutionName: {},
        linkInstitution: "",
        title: {},
        linkCertificate: "",
        dateStart: "",
        dateEnd: "",
        finished: false,
        typeEducation: "",
        description: {},
        iconInstitution: ""
    });
    const educationTypes = [
        "Primary School",
        "High School",
        "University",
        "Course",
        "Conference",
        "Other"
    ];

    const typeEducationLabels = {
        "Primary School": { en: "Primary School", es: "Escuela primaria" },
        "High School": { en: "High School", es: "Secundario" },
        "University": { en: "University", es: "Universidad" },
        "Course": { en: "Course", es: "Curso" },
        "Conference": { en: "Conference", es: "Conferencia" },
        "Other": { en: "Other", es: "Otro" }
    };

    useEffect(() => {
        if (!user) {
            navigate("/forbidden");
            return;
        };
        if (isEdit) {
            const loadEducation = async () => {
                const TEXT = LANG_CONST[language];
                const result = await fetchEducationById(id);
                if (result?.error) {
                    await errorSweet(TEXT.ERROR_SWEET_TEXT_EDUCATION_LOADING_ID);
                    return;
                };
                setFormData(result.response);
            };
            loadEducation();
        };
    }, [id, isEdit]);

    const TEXT = LANG_CONST[language];

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === "checkbox" ? checked : value;
        if (["institutionName", "title", "description"].includes(name)) {
            setFormData(prev => ({ ...prev, [name]: { ...prev[name], [language]: newValue } }));
        } else { setFormData(prev => ({ ...prev, [name]: newValue })); }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.typeEducation === "") {
            await errorSweet(TEXT.ERROR_SWEET_TEXT_INVALID_EDUCATION);
            return;
        };

        let result;
        if (isEdit) {
            result = await fetchUpdateEducation(id, formData);
        } else {
            result = await fetchCreateEducation(formData);
        };

        if (result?.error) {
            await errorSweet(TEXT.ERROR_SWEET_TEXT_EDUCATION_SAVING);
        } else {
            await successSweet(TEXT.SUCCESS_SWEET_EDUCATION_SAVED);
            navigate("/");
        };
    };

    return (
        <div id="formBodyGeneral">
            <div id="formBodyGeneralTop">
                <h3>{isEdit ? TEXT.UPDATE + " " + TEXT.EDUCATION + ":" : TEXT.CREATE + " " + TEXT.EDUCATION + ":"}</h3>
            </div>
            <form id="formGeneralContent" onSubmit={handleSubmit}>
                <div id="formGeneralContentBody">
                    <EducationField label={`${TEXT.INSTITUTION} (${language.toUpperCase()}): `} value={formData.institutionName?.[language] || ""} placeholder={TEXT.PLACEHOLDER_EDUCATION_INSTITUTION_NAME} name="institutionName" type="text" onChange={handleChange} />
                    <EducationField label={TEXT.LINK_INSTITUTION} value={formData.linkInstitution} placeholder={TEXT.PLACEHOLDER_EDUCATION_LINK} name="linkInstitution" type="text" onChange={handleChange} />
                    <EducationField label={`${TEXT.TITLE} (${language.toUpperCase()}): `} value={formData.title?.[language] || ""} placeholder={TEXT.PLACEHOLDER_EDUCATION_TITLE} name="title" type="text" onChange={handleChange} />
                    <EducationField label={TEXT.LINK_CERTIFICATE} value={formData.linkCertificate} placeholder={TEXT.PLACEHOLDER_EDUCATION_LINK_CERTIFICATE} name="linkCertificate" type="text" onChange={handleChange} />
                    <EducationField label={TEXT.DATE_START} value={formData.dateStart.slice(0, 10)} placeholder={TEXT.PLACEHOLDER_EDUCATION_DATE_STARTED} name="dateStart" type="date" onChange={handleChange} />
                    <EducationField label={TEXT.DATE_END} value={formData.dateEnd.slice(0, 10)} placeholder={TEXT.PLACEHOLDER_EDUCATION_DATE_ENDED} name="dateEnd" type="date" onChange={handleChange} />
                    <EducationField label={TEXT.FINISHED} value={formData.finished} name="finished" type="checkbox" onChange={handleChange} />
                    <EducationField label={`${TEXT.DESCRIPTION} (${language.toUpperCase()}): `} value={formData.description?.[language] || ""} placeholder={TEXT.PLACEHOLDER_EDUCATION_DESCRIPTION} name="description" type="text" onChange={handleChange} />
                    <EducationSelectField
                        label={TEXT.TYPE_EDUCATION}
                        name="typeEducation"
                        value={formData.typeEducation}
                        onChange={handleChange}
                        options={educationTypes}
                        renderLabel={(key) => typeEducationLabels[key][language]}
                        placeholder={TEXT.SELECT_TYPE_OF_EDUCATION}
                    />
                    <EducationField label={TEXT.INSTITUTION_ICON} value={formData.iconInstitution} placeholder={TEXT.PLACEHOLDER_EDUCATION_ICON} name="iconInstitution" type="text" onChange={handleChange} />

                    {formData.iconInstitution && (
                        <div className="iconPreviewContanier">
                            <h4>{TEXT.PREVIEW_ICON}</h4>
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
                    <a className="btn btn-outline-success" id="btnGoBack" href="/">{TEXT.GO_BACK}</a>
                    <button className="btn btn-outline-success" type="submit">{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
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

function EducationSelectField({ label, name, value, options, onChange, renderLabel, placeholder }) {
    return (
        <div className="divFieldsSelectGeneral">
            <h3>{label}</h3>
            <select name={name} value={value} onChange={onChange}>
                <option value="">{placeholder}</option>
                {options.map(option => (
                    <option key={option} value={option}>
                        {renderLabel(option)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default EducationForm;