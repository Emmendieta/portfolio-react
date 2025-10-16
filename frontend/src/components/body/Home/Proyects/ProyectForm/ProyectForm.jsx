import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchLanguages } from "../../Languajes/Language";
import { fetchCreateProyect, fetchProyectById, fetchUpdateProyect } from "../logicProyects";
import LanguageSelect from "../../Languajes/LanguageSelect/LanguageSelect";
import ThumbnailsMananger from "./ThumbnailsMananger/ThumbnailsMananger";
import { fetchCategories } from "../../Categories/Categories";
import CategorySelect from "../../Categories/CategorySelect/CategorySelect";

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
    });

    const [allLanguages, setAllLanguages] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);

    useEffect(() => {
        const loadInitialData = async () => {
            // 1.1 Traer todos los lenguajes
            const langResult = await fetchLanguages();
            if (langResult?.error) {
                //SWEET ALERT:
                alert("Error fetching Languages");
                return;
            };
            const allLangs = langResult.response;
            setAllLanguages(allLangs);

            //1.2

            const catResult = await fetchCategories();
            if (catResult?.error) {
                //SWEET ALERT:
                alert("Error fetching Categories");
                return;
            };

            const allCats = catResult.response;
            setAllCategories(allCats);

            // 2. Si estás editando, traé el proyecto
            if (isEdit) {
                const projResult = await fetchProyectById(id);
                if (projResult?.error) {
                    //SWEET ALERT:
                    alert("Error loading Proyect by Id!");
                    return;
                };

                const { languages, categories, thumbnails, ...rest } = projResult.response;
                setFormData(rest);
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
    }, [id, isEdit]);

    //verifico que All siempre este:
    useEffect(() => {
        const allCategory = allCategories.find(cat => cat.title === "All");
        if (allCategory && !selectedCategories.some(cat => cat._id === allCategory._id)) {
            setSelectedCategories(prev => [allCategory, ...prev]);
        };
    }, [allCategories, selectedCategories]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            //SWEET ALERT:
            alert("Error saving Proyect!");
        } else {
            //SWEET ALERT:
            alert("Proyect saved!");
            navigate("/");
        };
    };

    return (
        <div id="formBodyGeneral">
            <div id="formBodyGeneralTop">
                <h3>{isEdit ? "Update Proyect:" : "Create Proyect"}</h3>
            </div>
            <form id="formGeneralContent" onSubmit={handleSubmit}>
                <div id="formGeneralContentBody">
                    <ProyectField label="Title" name="title" value={formData.title} type="text" placeholder="Title" onChange={handleChange} />
                    <ProyectField label="Company" name="company" value={formData.company} type="text" placeholder="Company" onChange={handleChange} />
                    <ProyectField label="Link Company" name="linkCompany" value={formData.linkCompany} type="text" placeholder="Link Company" onChange={handleChange} />
                    <ProyectField label="Link Proyect" name="linkProyect" value={formData.linkProyect} type="text" placeholder="Link Proyect" onChange={handleChange} />
                    <ProyectField label="Date Started" name="dateStart" value={formData.dateStart?.slice(0, 10)} type="date" placeholder="Start Date" onChange={handleChange} />
                    <ProyectField label="Date Ended" name="dateEnd" value={formData.dateEnd?.slice(0, 10)} type="date" placeholder="End Date" onChange={handleChange} />
                    <ProyectField label="Description" name="description" value={formData.description} type="text" placeholder="Description" onChange={handleChange} />

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
                    <a className="btn btn-outline-success" id="btnGoBack" href="/">Go Back</a>
                    <button className="btn btn-outline-success" type="submit">{isEdit ? "Update" : "Create"}</button>
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
