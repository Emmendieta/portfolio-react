import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { fetchCategories, fetchDeleteCategory } from "./Categories";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import CategoryCard from "./CategoryCard/CategoryCard";
import "./CategoriesList.css";
import "../../../GlobalLoader.css";
import { useLoading } from "../../../../context/LoadingContext";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";

function CategoriesList({ onCategorySelect, selectedCategory }) {
    const { user } = useContext(UserContext);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();

    useEffect(() => {
        const loadCategories = async () => {

            try {
                startLoading();

                const categoriesData = await fetchCategories();
                if (categoriesData?.error) {
                    //SWEET ALERT:
                    await errorSweet(categoriesData.error.message);
                    setLoading(false);
                    return;
                }
                setCategories(categoriesData.response || []);

            } catch (error) {
                await errorSweet("Error loading categories: " + error.message);
                console.error("Error loading categories:", error);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadCategories();
    }, []);


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
            await errorSweet("Error: This Category must be all time!");
            return;
        };
        const confirmDelete = await confirmSweet({
            title: "Delete Category:",
            text: "Are you sure you want to delete the Category?",
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        });
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteCategory(cid);
            if (result?.error) {
                await errorSweet("Error deleting Category: " + result.error.message);
                console.error("Error deleting Category: ", result.error.message);
            } else {
                await successSweet("Category Deleted!");
                setCategories(prev => prev.filter(category => category._id !== cid));
            }
        } catch (error) {
            errorSweet("Error deleting Category: " + error.message);
            console.error("Error deleting Category: ", error.message);
        }
    };

    if (!categories || categories.length === 0) return <p>No Categories data available</p>;

    return (
        <div id="categoriesDiv">
            <div id="categoriesDivTitle">
                <h3>Categories:</h3>
                {user?.role === "admin" && (
                    <div className="addingControlGeneral">
                        <Link to="/categories/form/new" className="btn btn-outline-success" id="addBtnCategory">
                            <IoIosAddCircleOutline id="addIcon" />
                        </Link>
                    </div>
                )}
            </div>

            <ul id="categoriesDiContainer">
                {categories.map((category) => (
                    <CategoryCard
                        key={category._id}
                        category={category}
                        onDelete={handleDelete}
                        onClick={() => handleCategoryClick(category._id)}
                        isSelected={category._id === selectedCategory}
                    />
                ))}
            </ul>
        </div>
    );
};

export default CategoriesList;
