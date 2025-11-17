import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { fetchCategories, fetchDeleteCategory, fetchUpdateCategoriesOrder } from "./Categories";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import CategoryCard from "./CategoryCard/CategoryCard";
import "./CategoriesList.css";
import "../../../GlobalLoader.css";
import { useLoading } from "../../../../context/LoadingContext";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useMediaQuery } from "../../../hooks/UseMediaQuery";
import { useLanguage } from "../../../../context/LanguageContext";
import { LANG_CONST } from "../../../constants/selectConstLang.js";

function CategoriesList({ onCategorySelect, selectedCategory }) {
    const { user } = useContext(UserContext);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { language } = useLanguage();

    useEffect(() => {
        const loadCategories = async () => {

            try {
                startLoading();
                const categoriesData = await fetchCategories(language);
                if (categoriesData?.error) {
                    await errorSweet(categoriesData.error.message);
                    setLoading(false);
                    return;
                }

                const categories = categoriesData.response;
                //Reorder:
                const sorted = categories.sort((a, b) => a.order - b.order);
                setCategories(sorted || []);

            } catch (error) {
                await errorSweet(TEXT.ERROR_SWEET_TEXT_CATEGORIES_LOADING + error.message);
                console.error(TEXT.ERROR_SWEET_TEXT_CATEGORIES_LOADING, error);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadCategories();
    }, [language]);

    const TEXT = LANG_CONST[language];

    const handleCategoryClick = (categoryId) => {
        if (selectedCategory === categoryId) {
            onCategorySelect(null);
        } else {
            onCategorySelect(categoryId);
        }
    };

    const handleDelete = async (cid) => {
        const categoryToDelete = categories.find(cat => cat._id === cid);

        if (categoryToDelete?.title === "All") {
            await errorSweet(TEXT.ERROR_SWEET_TEXT_CATEGORY_ALL);
            return;
        };
        const confirmDelete = await confirmSweet({
            title: TEXT.CONFIRM_SWEET_TITLE_DELETE_CATEGORY,
            text: TEXT.CONFIRM_SWEET_TEXT_DELETE_CATEGORY,
            confirmButtonText: TEXT.YES,
            cancelButtonText: TEXT.NO
        });
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteCategory(cid);
            if (result?.error) {
                await errorSweet(TEXT.ERROR_SWEET_TEXT_CATEGORY_DELETING + result.error.message);
                console.error(TEXT.ERROR_SWEET_TEXT_CATEGORY_DELETING, result.error.message);
            } else {
                await successSweet(TEXT.SUCCESS_SWEET_CATEGORY_DELETED);
                setCategories(prev => prev.filter(category => category._id !== cid));
            }
        } catch (error) {
            errorSweet(TEXT.ERROR_SWEET_TEXT_CATEGORY_DELETING + error.message);
            console.error(TEXT.ERROR_SWEET_TEXT_CATEGORY_DELETING, error.message);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const reordered = Array.from(categories);
        const [movedItem] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, movedItem);

        const reorderedWithOrder = reordered.map((item, index) => ({
            ...item,
            order: index,
        }));

        setCategories(reorderedWithOrder);

        try {
            const res = await fetchUpdateCategoriesOrder(reorderedWithOrder);
            if (res?.error) { await errorSweet(TEXT.ERROR_SWEET_ORDER_SAVE, res.error.message); }
            else { await successSweet(TEXT.SUCCESS_SWEET_ORDER); }
        } catch (error) {
            console.error(TEXT.ERROR_SWEET_ORDER_UPDATE, error);
            await errorSweet(TEXT.ERROR_SWEET_ORDER_UPDATE + error.message);
        }
    };

    if (!categories || categories.length === 0) return <p>{TEXT.NO_CATEGORIES}</p>;

    return (
        <div id="categoriesDiv">
            <div id="categoriesDivTitle">
                <h3>{TEXT.CATEGORIES + ":"}</h3>
                {user?.role === "admin" && (
                    <div className="addingControlGeneral">
                        <Link to="/categories/form/new" className="btn btn-outline-success" id="addBtnCategory">
                            <IoIosAddCircleOutline id="addIcon" />
                        </Link>
                    </div>
                )}
            </div>

            {user?.role === "admin" ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="categoriesDiContainer" direction={isMobile ? "vertical" : "horizontal"}>
                        {(provided) => (
                            <ul id="categoriesDiContainer" {...provided.droppableProps} ref={provided.innerRef}>
                                {categories.map((category, index) => (
                                    <Draggable key={category._id} draggableId={category._id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <CategoryCard
                                                    key={category._id}
                                                    category={category}
                                                    onDelete={handleDelete}
                                                    onClick={() => handleCategoryClick(category._id)}
                                                    isSelected={category._id === selectedCategory}
                                                    isDraggable={true}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            ) : (
            <ul id="categoriesDiContainer">
                {categories.map((category) => (
                    <CategoryCard
                        key={category._id}
                        category={category}
                        onDelete={handleDelete}
                        onClick={() => handleCategoryClick(category._id)}
                        isSelected={category._id === selectedCategory}
                        isDraggable={false}
                    />
                ))}
            </ul>
            )}
        </div>
    );
};

export default CategoriesList;
