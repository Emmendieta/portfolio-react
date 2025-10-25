import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../../../context/UserContext";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import "./CategoryCard.css";

function CategoryCard({ category, onDelete, onClick, isSelected, isDraggable }) {
    const { user } = useContext(UserContext);
    const isAdmin = user?.role === "admin";
    const cardRef = useRef(null);
    const [visible, setVisble] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    setVisble(entry.isIntersecting);
                });
            },
            {
                threshold: 0.6,
            }
        );

        const currentRef = cardRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        };

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            };
        };
    }, []);

    return (
        <li
            key={category._id}
            ref={cardRef}
            className={`categoryCardItem ${visible ? "fade-in" : ""} ${isSelected ? "selected" : ""}`}
            id="categoryLi"
            onClick={() => onClick(category._id)}
            style={{cursor: isDraggable ? "grab" : "default"}}
        >
            <div className={`categoryDivvImg ${isSelected ? "selected": ""}`}
                onClick={() => onClick(category._id)}
            >
                <img
                    src={category.thumbnails || "/img/imagen-no-disponible.png"}
                    alt={category.title}
                    className="categoryIcon"
                    onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                />
                <h3>{category.title}</h3>
            </div>
            {isAdmin && (
                <div className="editionsControlsGeneral">
                    <Link to={`/categories/form/${category._id}`} id="categoryEdit" className="btn btn-outline-primary btn-sm" >
                        <FaPen />
                    </Link>
                    <button className="btn btn-outline-danger btn-sm" id="categoryDelete" onClick={() => onDelete(category._id)}>
                        <FaRegTrashCan />
                    </button>
                </div>
            )}
        </li>
    );
};

export default CategoryCard;