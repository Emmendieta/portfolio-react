import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategoryById, fetchCreateCategory, fetchUpdateCategory } from "../Categories";
import "../../FormGeneral.css";
import { useConfirmSweet } from "../../../../../context/SweetAlert2Context";
import { useLanguage } from "../../../../../context/LanguageContext";
import { LANG_CONST } from "../../../../constants/selectConstLang.js";

function CategoriesForm() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const { successSweet, errorSweet } = useConfirmSweet();
    const { language } = useLanguage();
    const isEdit = id && id !== "new";
    const [formData, setFormData] = useState({
        "title": {},
        "thumbnails": ""
    });

    useEffect(() => {
        if (!user) {
            navigate("/forbidden");
            return;
        };
        if (isEdit) {
            const loadCategory = async () => {
                const TEXT = LANG_CONST[language];
                const result = await fetchCategoryById(id);
                if (result?.error) {
                    await errorSweet(TEXT.ERROR_SWEET_TEXT_CATEGORY_LOADING_ID);
                    return;
                };
                setFormData(result.response);
            };
            loadCategory();
        };
    }, [id, isEdit, user]);

    const TEXT = LANG_CONST[language];

    const handleChange = (event) => {
        const { name, value } = event.target;
        if(name === "title") { setFormData(prev => ({ ...prev, title: { ...prev.title, [language]: value }}))}
        else { setFormData(prev => ({ ...prev, [name]: value })); }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.title?.[language] || formData.title?.[language].trim() === "") {
            await errorSweet(TEXT.ERROR_SWEET_TEXT_CATEGORY_NAME);
            return;
        }
        let result;
        if (isEdit) { result = await fetchUpdateCategory(id, formData); }
        else { result = await fetchCreateCategory(formData); };

        if (result?.error) {
            await errorSweet(TEXT.ERROR_SWEET_TEXT_CATEGORY_SAVING);
        } else {
            await successSweet(TEXT.SUCCESS_SWEET_CATEGORY_SAVED);
            navigate("/");
        };
    };

    return (
        <div id="formBodyGeneral">
            <div id="formBodyGeneralTop">
                <h3>{isEdit ? TEXT.UPDATE + " " + TEXT.CATEGORY + ":" : TEXT.CREATE + " " + TEXT.CATEGORY + ":"}</h3>
            </div>
            <form id="formGeneralContent" onSubmit={handleSubmit}>
                <div id="formGeneralContentBody">
                    <CategoryField label={`Name (${language.toUpperCase()}):`} value={formData.title?.[language] || ""} placeholder={TEXT.PLACEHOLDER_CATEGORY_NAME} name="title" type="text" onChange={handleChange} />
                    <CategoryField label="Image: " value={formData.thumbnails} placeholder={TEXT.PLACEHOLDER_CATEGORY_URL} name="thumbnails" type="text" onChange={handleChange} />
                </div>

                {formData.thumbnails && (
                    <div className="iconPreviewContanier">
                        <h4>{TEXT.PREVIEW_IMAGE}</h4>
                        <img
                            src={formData.thumbnails}
                            alt="Category Image"
                            onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                            className="previewImage"
                        />
                    </div>
                )}

                <div id="formGeneralBottom">
                    <a className="btn btn-outline-success" id="btnGoBack" href="/">{TEXT.GO_BACK}</a>
                    <button type="submit" className="btn btn-outline-success">{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                </div>
            </form>
        </div>
    );
};

//VER SI ESTO LO DEJO COMO GENERAL:

function CategoryField({ label, value, type, placeholder, name, onChange }) {
    return (
        <div className="divFieldsGeneral">
            <h3>{label}</h3>
            <input type={type} name={name} value={value || ""} placeholder={placeholder} onChange={onChange} />
        </div>
    );
};

export default CategoriesForm;