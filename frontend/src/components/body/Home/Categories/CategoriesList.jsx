import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { fetchCategories, fetchDeleteCategory } from "./Categories";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import CategoryCard from "./CategoryCard/CategoryCard";
import "./CategoriesList.css";

function CategoriesList({ onCategorySelect, selectedCategory  }) {
    const { user } = useContext(UserContext);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            const categoriesData = await fetchCategories();
            if (categoriesData?.error) {
                //SWEET ALERT:
                alert(categoriesData.error.message); 
                setLoading(false);
                return;
            }
            setCategories(categoriesData.response || []);
            setLoading(false);
        };
        loadCategories();
    }, []);
    

    const handleCategoryClick = (categoryId) => {
        if(selectedCategory === categoryId) {
            onCategorySelect(null);
        } else {
            onCategorySelect(categoryId);
        }
    };

    const handleDelete = async (cid) => {
        const confirmDelete = window.confirm("Are you sure you want to delete the Category?");
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteCategory(cid);
            if (result?.error) {
                //SWEET ALERT:
                alert("Error deleting Category: " + result.error.message);
            } else {
                //SWEET ALERT:
                alert("Category Deleted!");
                setCategories(prev => prev.filter(category => category._id !== cid));
            }
        } catch (error) {
            console.error("Error deleting Category: ", error.message);
            //SWEET ALERT:
            alert("Error deleting Category: " + error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
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
                        onClick= {()=> handleCategoryClick(category._id)}
                        isSelected={category._id === selectedCategory}
                    />
                ))}
            </ul>
        </div>
    );
};

export default CategoriesList;
