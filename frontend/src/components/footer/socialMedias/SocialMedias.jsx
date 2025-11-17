import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { fetchDeleteSocialMedia, fetchSocialMedias } from "./logicSocialMedias";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import "./SocialMedias.css";
import { useRefresh } from "../../../context/RefreshContext";
import { useConfirmSweet } from "../../../context/SweetAlert2Context";
import { useLanguage } from "../../../context/LanguageContext";
import { LANG_CONST } from "../../constants/selectConstLang.js";

function SocialMedias() {
    const [socialMedias, setSocialMedias] = useState([]);
    const { user } = useContext(UserContext);
    const { refreshKey } = useRefresh();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();
    const { language } = useLanguage();

    useEffect(() => {
        const loadSocialMedias = async () => {
            const socialMediasData = await fetchSocialMedias();
            setSocialMedias(socialMediasData);
        };
        loadSocialMedias();
    }, [refreshKey]);

    const TEXT = LANG_CONST[language];

    const handleDelte = async (sid) => {
        const confirmDelete = await confirmSweet({
            title: TEXT.CONFIRM_SWEET_TITLE_DELETE_SOCIAL,
            text: TEXT.CONFIRM_SWEET_TEXT_DELETE_SOCIAL,
            confirmButtonText: TEXT.YES,
            cancelButtonText: TEXT.NO
        });
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteSocialMedia(sid);

            if(result.error) {
                await errorSweet(TEXT.ERROR_SWEET_TEXT_SOCIAL_MEDIA, result.error.message);
            } else {
                await successSweet(TEXT.SUCCESS_SWEET_TEXT_SOCIAL_MEDIA);
                setSocialMedias(prev => prev.filter(socialMedia => socialMedia._id !== sid));
            }

        } catch (error) {
            //LOGGER:
            console.error(TEXT.ERROR_SWEET_TEXT_SOCIAL_MEDIA, error.message);
            await errorSweet(TEXT.INTERNAL_SERVER_ERROR_DELETING + error.message);
        }
    };

    return (
        <ul id="socialMediasList">
            { socialMedias.map((socialMedia) => (
                <li key={socialMedia._id} data-id={socialMedia._id}>
                    <a href={socialMedia.linkSocial} target="_blank" rel="noopener noreferrer" title={socialMedia.title?.[language]}>
                        { <img 
                            src={socialMedia.thumbnails || "/img/imagen-no-disponible.png"}
                            alt={socialMedia.title?.[language]}
                            className="socialMediaIcon"
                            onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                        /> }
                        <h5>{socialMedia.title?.[language]}</h5>
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