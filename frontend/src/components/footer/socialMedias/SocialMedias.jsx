import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { fetchDeleteSocialMedia, fetchSocialMedias } from "./logicSocialMedias";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import "./SocialMedias.css";
import { useRefresh } from "../../../context/RefreshContext";
import { useConfirmSweet } from "../../../context/SweetAlert2Context";

function SocialMedias() {
    const [socialMedias, setSocialMedias] = useState([]);
    const { user } = useContext(UserContext);
    const { refreshKey } = useRefresh();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();

    useEffect(() => {
        const loadSocialMedias = async () => {
            const socialMediasData = await fetchSocialMedias();
            setSocialMedias(socialMediasData);
        };
        loadSocialMedias();
    }, [refreshKey]);

    const handleDelte = async (sid) => {
        const confirmDelete = await confirmSweet({
            title: "Delete Social Media:",
            text: "Are you sure you want to delete the Social Medias?",
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        });
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteSocialMedia(sid);

            if(result.error) {
                await errorSweet("Error deleting Social Media: ", result.error.message);
            } else {
                await successSweet("Social Media Deleted!");
                setSocialMedias(prev => prev.filter(socialMedia => socialMedia._id !== sid));
            }

        } catch (error) {
            //LOGGER:
            console.error("Error deleting Social Media: ", error.message);
            await errorSweet("Internal Error deleting Social Media: " + error.message);
        }
    };

    return (
        <ul id="socialMediasList">
            { socialMedias.map((socialMedia) => (
                <li key={socialMedia._id} data-id={socialMedia._id}>
                    <a href={socialMedia.linkSocial} target="_blank" rel="noopener noreferrer" title={socialMedia.title}>
                        { <img 
                            src={socialMedia.thumbnails || "/img/imagen-no-disponible.png"}
                            alt={socialMedia.title}
                            className="socialMediaIcon"
                            onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                        /> }
                        <h5>{socialMedia.title}</h5>
                    </a>

                    {user?.role === "admin" && (
                        <div className="editionControls">
                            <Link to={`/social-medias/form/${socialMedia._id}`} id="socialMediaEdit" className="btn btn-outline-primary btn-sm" >
                                <FaPen />
                            </Link>
                            <button className="btn btn-outline-danger btn-sm" id="socialMediaDelete" onClick={() => handleDelte(socialMedia._id)} >
                                <FaRegTrashCan />
                            </button>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default SocialMedias;