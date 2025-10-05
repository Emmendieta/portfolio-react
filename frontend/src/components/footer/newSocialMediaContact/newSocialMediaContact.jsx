import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import "./NewSocialMediaContact.css";


function NewSocialMediaContact() {
    const { user } = useContext(UserContext);

    if(!user || user.role !== "admin") return null;

    return (
        <Link to="/social-medias/create" className="btn btn-outline-success iconABMPlus-sm" id="addBtnSocialMedia">
            <IoIosAddCircleOutline />
        </Link>
    );
};

export default NewSocialMediaContact;