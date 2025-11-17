import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCreateWork, fetchUpdateWork, fetchWorkById } from "../Works";
import "../../FormGeneral.css";
import { useConfirmSweet } from "../../../../../context/SweetAlert2Context";
import { useLanguage } from "../../../../../context/LanguageContext";
import { LANG_CONST } from "../../../../constants/selectConstLang.js";

//Falta Validar si el usuario es Admin:
function WorksForm() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const { successSweet, errorSweet } = useConfirmSweet();
    const { language } = useLanguage();
    const isEdit = id && id !== "new";
    const [formData, setFormData] = useState({
        jobTitle: {},
        dateStart: "",
        dateEnd: "",
        company: {},
        linkCompany: "",
        finished: false,
        description: {},
        thumbnails: ""
    });

    useEffect(() => {
        if (!user) {
            navigate("/forbidden");
            return;
        };
        if (isEdit) {
            const TEXT = LANG_CONST[language];
            const loadWork = async () => {
                const result = await fetchWorkById(id);
                if (result?.error) {
                    await errorSweet(TEXT.ERROR_SWEET_TEXT_WORK_LOADING_ID);
                    return;
                };
                setFormData(result.response);
            };
            loadWork();
        };
    }, [id, isEdit]);

    const TEXT = LANG_CONST[language];

    const handleChange = (event) => {
        const { name, type, value, checked } = event.target;
        const newValue = type === "checkbox" ? checked : value;
        if(["jobTitle", "company", "description"].includes(name)) {
            setFormData(prev => ({ ...prev, [name]: { ...prev[name], [language]: newValue }}))
        } else { setFormData(prev => ({ ...prev, [name]: newValue })); }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let result;
        if (isEdit) {
            result = await fetchUpdateWork(id, formData);
        } else {
            result = await fetchCreateWork(formData);
        };

        if (result?.error) {
            await errorSweet(TEXT.ERROR_SWEET_TEXT_WORK_SAVING);
        } else {
            await successSweet(TEXT.SUCCESS_SWEET_WORK_SAVED);
            navigate("/");
        };
    };

    return (
        <div id="formBodyGeneral">
            <div id="formBodyGeneralTop">
                <h3>{isEdit ? TEXT.UPDATE + " " + TEXT.WORK : TEXT.CREATE + " " + TEXT.WORK}</h3>
            </div>
            <form id="formGeneralContent" onSubmit={handleSubmit}>
                <div id="formGeneralContentBody">
                    <WorkField label={`${TEXT.COMPANY} (${language.toUpperCase()}): `} value={formData.company?.[language] || ""} placeholder={TEXT.PLACEHOLDER_WORK_COMPANY} name="company" type="text" onChange={handleChange} />
                    <WorkField label={TEXT.LINK_COMPANY} value={formData.linkCompany} placeholder={TEXT.PLACEHOLDER_WORK_LINK_COMPANY} name="linkCompany" type="text" onChange={handleChange} />
                    <WorkField label={`${TEXT.JOB_TITLE} (${language.toUpperCase()}): `} value={formData.jobTitle?.[language] || ""} placeholder={TEXT.PLACEHOLDER_WORK_JOB_TITLE} name="jobTitle" type="text" onChange={handleChange} />
                    <WorkField label={TEXT.DATE_START} value={formData.dateStart.slice(0, 10)} placeholder={TEXT.PLACEHOLDER_WORK_DATE_STARTED} name="dateStart" type="date" onChange={handleChange} />
                    <WorkField label={TEXT.DATE_END} value={formData.dateEnd.slice(0, 10)} placeholder={TEXT.PLACEHOLDER_WORK_DATE_ENDED} name="dateEnd" type="date" onChange={handleChange} />
                    <WorkField label={TEXT.FINISHED} value={formData.finished} placeholder={TEXT.PLACEHOLDER_WORK_FINISHED} name="finished" type="checkbox" onChange={handleChange} />
                    <WorkField label={TEXT.IMAGE} value={formData.thumbnails} placeholder={TEXT.THUMBNAILS_INPUT_PLACEHOLDER_URL} name="thumbnails" type="text" onChange={handleChange} />
                    <WorkField label={`${TEXT.DESCRIPTION} (${language.toUpperCase()}): `} value={formData.description?.[language] || ""} placeholder={TEXT.PLACEHOLDER_WORK_DESCRIPTION} name="description" type="text" onChange={handleChange} />

                    {formData.thumbnails && (
                        <div className="iconPreviewContanier">
                            <h4>{TEXT.PREVIEW_IMAGE}</h4>
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
                    <a className="btn btn-outline-success" id="btnGoBack" href="/">{TEXT.GO_BACK}</a>
                    <button className="btn btn-outline-success" type="submit">{isEdit ? TEXT.UPDATE : TEXT.CREATE }</button>
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