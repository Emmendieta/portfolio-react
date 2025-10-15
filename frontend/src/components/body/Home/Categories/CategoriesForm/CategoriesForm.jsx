import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategoryById, fetchCreateCategory, fetchUpdateCategory } from "../Categories";
import "../../FormGeneral.css";

function CategoriesForm() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const isEdit = id && id !== "new";
    const [formData, setFormData] = useState({
        "title": "",
        "thumbnails": ""
    });

    useEffect(() => {
        if (isEdit) {
            const loadCategory = async () => {
                const result = await fetchCategoryById(id);
                if(result?.error) {
                    //SWEET ALERT:
                    alert("Error loading Category by Id");
                    return;
                };
                setFormData(result.response);
            };
            loadCategory();
        };
    }, [id, isEdit]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let result;
        if (isEdit) { result = await fetchUpdateCategory(id, formData); }
        else { result = await fetchCreateCategory(formData); };

        if (result?.error) {
            //SWEET ALERT:
            alert("Error saving Category");
        } else {
            //SWEET ALERT:
            alert("Category saved!");
            navigate("/");
        };
    };

    return (
        <div id="formBodyGeneral">
            <div id="formBodyGeneralTop">
                <h3>{isEdit ? "Update Category:" : "Create Category:"}</h3>
            </div>
            <form id="formGeneralContent" onSubmit={handleSubmit}>
                <div id="formGeneralContentBody">
                    <CategoryField label= "Name: " value={formData.title} placeholder="Type Here the Name of the Category" name="title" type="text" onChange={handleChange} />
                    <CategoryField label= "Image: " value={formData.thumbnails} placeholder="Type Here the Url of the Category" name="thumbnails" type="text" onChange={handleChange} />
                </div>

                {formData.thumbnails && (
                    <div className="iconPreviewContanier">
                        <h4>Preview of The Image:</h4>
                        <img
                            src={formData.thumbnails}
                            alt="Category Image"
                            onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                            className="previewImage"
                        />
                    </div>
                )}

                <div id="formGeneralBottom">
                    <a className="btn btn-outline-success" id="btnGoBack" href="/">Go Back</a>
                    <button type="submit" className="btn btn-outline-success">{isEdit ? "Update" : "Create"}</button>
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