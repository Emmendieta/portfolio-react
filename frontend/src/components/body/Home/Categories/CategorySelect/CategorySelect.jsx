import { useLanguage } from "../../../../../context/LanguageContext";
import { useConfirmSweet } from "../../../../../context/SweetAlert2Context";
import "./CategorySelect.css";
import { LANG_CONST } from "../../../../constants/selectConstLang.js";

function CategorySelect({ allCategories, selectedCategories, setSelectedCategories }) {
    const { errorSweet } = useConfirmSweet();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    const handleSelect = (event) => {
        const selectedId = event.target.value;
        if (!selectedId) return;

        const selectedCat = allCategories.find(cat => cat._id === selectedId);

        if (selectedCat && !selectedCategories.some(cat => cat._id === selectedId)) {
            setSelectedCategories(prev => [...prev, selectedCat]);
        };

        event.target.value = "";
    };

    const handleRemove = async (catId) => {
        const catToRemove = selectedCategories.find(cat => cat._id === catId);
        if (catToRemove?.title?.[language] === "All") {
            //SWEET ALERT:
            await errorSweet(TEXT.ERROR_SWEET_TEXT_CATEGORY_ALL);
            return;
        };

        setSelectedCategories(prev => prev.filter(cat => cat._id !== catId));
    };

    return (
        <div className="divFiledsGeneralCategories">
            <div className="divFieldsGeneralCategoriesTop">
                <h3>{TEXT.CATEGORIES}</h3>
                <select onChange={handleSelect} defaultValue="">
                    <option value="">{TEXT.SELECT_CATEGORY}</option>
                    {allCategories.filter(cat => !selectedCategories.some(sel => sel._id === cat._id)).map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.title?.[language]}</option>
                    ))}
                </select>
            </div>

            {selectedCategories.length > 0 && (
                <div className="divvFieldsGeneralCategoriesBottom">
                    {selectedCategories.map(cat => (
                        <div key={cat._id} className="selectedCategoryItem">
                            <div className="selectedCategoryItemDescription">
                                <img
                                    src={cat.thumbnails || "/img/imagen-no-disponible.png"}
                                    alt={cat.title}
                                    onError={(event) => (event.currentTarget.src = "/img/imagen-no-disponible.png")}
                                />
                                <span>{cat.title?.[language]}</span>
                            </div>
                            {cat.title !== "All" && (
                                <button className="btn btn-outline-danger" type="button" onClick={() => handleRemove(cat._id)}>{TEXT.REMOVE}</button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategorySelect;