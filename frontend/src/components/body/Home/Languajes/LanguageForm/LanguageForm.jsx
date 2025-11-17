import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCreateLanguage, fetchLanguageById, fetchUpdateLangauge } from "../Language";
import "../../FormGeneral.css";
import { useConfirmSweet } from "../../../../../context/SweetAlert2Context";
import { useLanguage } from "../../../../../context/LanguageContext";
import { LANG_CONST } from "../../../../constants/selectConstLang.js";

//Falta Validar si el usuario es Admin:
function LanguagesForm() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const { successSweet, errorSweet } = useConfirmSweet();
    const { language: currentLanguage } = useLanguage();
    const isEdit = id && id !== "new";
    const [formData, setFormData] = useState({
        title: {},
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
            const TEXT = LANG_CONST[currentLanguage];
            const loadLanguage = async () => {
                const result = await fetchLanguageById(id);
                if (result?.error) {
                    await errorSweet(TEXT.ERROR_SWEET_TEXT_LANGUAGE_LOADING_ID);
                    return;
                };
                setFormData(result.response);
            };
            loadLanguage();
        };
    }, [id, isEdit]);

    const TEXT = LANG_CONST[currentLanguage];

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "title") {
        setFormData(prev => ({
            ...prev,
            [name]: { ...prev[name], [currentLanguage]: value }
        }))
        } else { setFormData(prev => ({ ...prev, [name]: value })); }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.type) {
            await errorSweet(TEXT.ERROR_SWEET_TEXT_INVALID_LANGUAGE);
            return;
        };

        let result;
        if (isEdit) {
            result = await fetchUpdateLangauge(id, formData);
        } else {
            result = await fetchCreateLanguage(formData);
        };

        if (result?.error) {
            await errorSweet(TEXT.ERROR_SWEET_TEXT_LANGUAGE_SAVING);
        } else {
            await successSweet(TEXT.SUCCESS_SWEET_LANGUAGE_SAVED);
            navigate("/");
        }
    };

    return (
        <div id="formBodyGeneral">
            <div id="formBodyGeneralTop">
                <h3>{isEdit ? TEXT.UPDATE + " " + TEXT.LANGUAGE : TEXT.CREATE + " " + TEXT.LANGUAGE }</h3>
            </div>
            <form id="formGeneralContent" onSubmit={handleSubmit}>
                <div id="formGeneralContentBody">
                    <LanguageField label={`${TEXT.NAME} (${currentLanguage.toUpperCase()}): `} value={formData.title?.[currentLanguage] || ""} placeholder={TEXT.PLACEHOLDER_LANGUAGE_NAME} name="title" type="text" onChange={handleChange} />
                    <LanguageField label={TEXT.PERCENT} value={formData.percent} placeholder={TEXT.PLACEHOLDER_LANGUAGE_PERCENT} name="percent" type="number" onChange={handleChange} />

                    {/* 👉 Tipo (Hard / Soft) */}
                    <div className="divFieldsSelectGeneral">
                        <h3>{TEXT.TYPE + ":"}</h3>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="div"
                        >
                            <option value="">{TEXT.SELECT_TYPE_LANGUAGE}</option>
                            <option value="Hard">{TEXT.HARD}</option>
                            <option value="Soft">{TEXT.SOFT}</option>
                        </select>
                    </div>

                    <LanguageField label={TEXT.IMAGE} value={formData.thumbnails} placeholder={TEXT.THUMBNAILS_INPUT_PLACEHOLDER_URL} name="thumbnails" type="text" onChange={handleChange} />
                </div>

                {formData.thumbnails && (
                    <div className="iconPreviewContanier">
                        <h4>{TEXT.PREVIEW_IMAGE}</h4>
                        <img
                            src={formData.thumbnails}
                            alt="Language Image"
                            onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                            className="previewImage"
                        />
                    </div>

                )}


                <div id="formGeneralBottom">
                    <a className="btn btn-outline-success" id="btnGoBack" href="/">{TEXT.GO_BACK}</a>
                    <button className="btn btn-outline-success" type="submit">{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
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