import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchLanguages } from "../../Languajes/Language";
import { fetchCreateProyect, fetchProyectById, fetchUpdateProyect } from "../logicProyects";
import LanguageSelect from "../../Languajes/LanguageSelect/LanguageSelect";
import ThumbnailsMananger from "./ThumbnailsMananger/ThumbnailsMananger";
import { fetchCategories } from "../../Categories/Categories";
import CategorySelect from "../../Categories/CategorySelect/CategorySelect";
import { useConfirmSweet } from "../../../../../context/SweetAlert2Context";
import { useLanguage } from "../../../../../context/LanguageContext";
import { LANG_CONST } from "../../../../constants/selectConstLang.js";

function ProyectForm() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const { successSweet, errorSweet } = useConfirmSweet();
    const { language } = useLanguage();
    const isEdit = id && id !== "new";

    const [formData, setFormData] = useState({
        title: {},
        dateStart: "",
        dateEnd: "",
        company: {},
        linkProyect: "",
        linkCompany: "",
        description: {},
    });

    const [allLanguages, setAllLanguages] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate("/forbidden");
            return;
        };
        const loadInitialData = async () => {
            const TEXT = LANG_CONST[language];
            // 1.1 Traer todos los lenguajes
            const langResult = await fetchLanguages();
            if (langResult?.error) {
                await errorSweet(TEXT.ERROR_SWEET_TEXT_PROYECT_FETCHING_LANGUAGES);
                return;
            };
            const allLangs = langResult.response;
            setAllLanguages(allLangs);

            //1.2

            const catResult = await fetchCategories();
            if (catResult?.error) {
                await errorSweet(TEXT.ERROR_SWEET_TEXT_PROYECT_FETCHING_CATEGORIES);
                return;
            };

            const allCats = catResult.response;
            setAllCategories(allCats);

            // 2. Si estás editando, traé el proyecto
            if (isEdit) {
                const projResult = await fetchProyectById(id);
                if (projResult?.error) {
                    await errorSweet(TEXT.ERROR_SWEET_TEXT_PROYECT_LOADING_ID);
                    return;
                };

                const { languages, categories, thumbnails, ...rest } = projResult.response;
                setFormData({
                    title: { ...rest.title, [language]: rest.title?.[language] || "" },
                    company: { ...rest.company, [language]: rest.company?.[language] || "" },
                    description: { ...rest.description, [language]: rest.description?.[language] || "" },
                    dateStart: rest.dateStart || "",
                    dateEnd: rest.dateEnd || "",
                    linkProyect: rest.linkProyect || "",
                    linkCompany: rest.linkCompany || "",
                });
                setThumbnails(thumbnails || []);

                // 3. Filtrar los objetos de lenguajes seleccionados
                const selectedLangObjects = allLangs.filter(lang => languages.includes(lang._id));
                setSelectedLanguages(selectedLangObjects);

                const selectedCatObjects = allCats.filter(cat => categories.includes(cat._id));
                setSelectedCategories(selectedCatObjects);
            } else {
                //4 Si es nueva, se incluye autamitcamente "ALL" por defecto:
                const allCategory = allCats.find(cat => cat.title === "All");
                if (allCategory) setSelectedCategories([allCategory]);
            };
        };

        loadInitialData();
    }, [id, isEdit, user, navigate, errorSweet]);

    const TEXT = LANG_CONST[language];

    //verifico que All siempre este:
    useEffect(() => {
        const allCategory = allCategories.find(cat => cat.title === "All");
        if (allCategory && !selectedCategories.some(cat => cat._id === allCategory._id)) {
            setSelectedCategories(prev => [allCategory, ...prev]);
        };
    }, [allCategories, selectedCategories]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (["title", "company", "description"].includes(name)) {
            setFormData(prev => ({
                ...prev,
                [name]: { ...prev[name], [language]: value }
            }));
        } else { setFormData(prev => ({ ...prev, [name]: value })); }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const languageIds = selectedLanguages.map(lang => lang._id);
        const categoryIds = selectedCategories.map(cat => cat._id);
        const dataToSend = {
            ...formData,
            languages: languageIds,
            categories: categoryIds,
            thumbnails
        };

        const result = isEdit ? await fetchUpdateProyect(id, dataToSend) : await fetchCreateProyect(dataToSend);

        if (result?.error) {
            await errorSweet(TEXT.ERROR_SWEET_TEXT_PROYECT_SAVING);
        } else {
            await successSweet(TEXT.SUCCESS_SWEET_PROYECT_SAVED);
            navigate("/");
        };
    };

    return (
        <div id="formBodyGeneral">
            <div id="formBodyGeneralTop">
                <h3>{isEdit ? TEXT.UPDATE + " " + TEXT.PROYECT : TEXT.CREATE + " " + TEXT.PROYECT}</h3>
            </div>
            <form id="formGeneralContent" onSubmit={handleSubmit}>
                <div id="formGeneralContentBody">
                    <ProyectField label={`${TEXT.TITLE} (${language.toUpperCase()}):`} name="title" value={formData.title?.[language] || ""} type="text" placeholder={TEXT.PLACEHOLDER_PROYECT_TITLE} onChange={handleChange} />
                    <ProyectField label={`${TEXT.COMPANY} (${language.toUpperCase()}):`} name="company" value={formData.company?.[language] || ""} type="text" placeholder={TEXT.PLACEHOLDER_WORK_COMPANY} onChange={handleChange} />
                    <ProyectField label={TEXT.LINK_COMPANY} name="linkCompany" value={formData.linkCompany || ""} type="text" placeholder={TEXT.PLACEHOLDER_WORK_LINK_COMPANY} onChange={handleChange} />
                    <ProyectField label={TEXT.LINK_PROYECT} name="linkProyect" value={formData.linkProyect || ""} type="text" placeholder={TEXT.PLACEHOLDER_PROYECT_LINK_PROYECT} onChange={handleChange} />
                    <ProyectField label={TEXT.DATE_START} name="dateStart" value={formData.dateStart?.slice(0, 10) || ""} type="date" placeholder={TEXT.PLACEHOLDER_PROYECT_DATE_STARTED} onChange={handleChange} />
                    <ProyectField label={TEXT.DATE_END} name="dateEnd" value={formData.dateEnd?.slice(0, 10) || ""} type="date" placeholder={TEXT.PLACEHOLDER_PROYECT_DATE_ENDED} onChange={handleChange} />
                    <ProyectField label={`${TEXT.DESCRIPTION} (${language.toUpperCase()}):`} name="description" value={formData.description?.[language] || ""} type="text" placeholder={TEXT.PLACEHOLDER_PROYECT_DESCRIPTION} onChange={handleChange} />

                    {/* Lenguajes */}
                    <LanguageSelect
                        allLanguages={allLanguages}
                        selectedLanguages={selectedLanguages}
                        setSelectedLanguages={setSelectedLanguages}
                    />

                    {/* Categories */}
                    <CategorySelect
                        allCategories={allCategories}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                    />

                    <ThumbnailsMananger
                        thumbnails={thumbnails}
                        setThumbnails={setThumbnails}
                    />

                </div>

                <div id="formGeneralBottom">
                    <a className="btn btn-outline-success" id="btnGoBack" href="/">{ TEXT.GO_BACK }</a>
                    <button className="btn btn-outline-success" type="submit">{isEdit ? TEXT.UPDATE : TEXT.CREATE }</button>
                </div>
            </form>
        </div>
    );
};

function ProyectField({ label, value, type, placeholder, name, onChange }) {
    return (
        <div className="divFieldsGeneral">
            <h3>{label}</h3>
            <input type={type} name={name} value={value || ""} placeholder={placeholder} onChange={onChange} />
        </div>
    );
};

export default ProyectForm;
