import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCreateSocialMediaContact, fetchSocialMediaById, fetchUpdateSocialMediaContact } from "../socialMedias/logicSocialMedias";
import { useRefresh } from "../../../context/RefreshContext";
import { useConfirmSweet } from "../../../context/SweetAlert2Context";
import { useLanguage } from "../../../context/LanguageContext";
import { LANG_CONST } from "../../constants/selectConstLang.js";

function SocialmediasForm() {
    const { triggerRefresh } = useRefresh();
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const { successSweet, errorSweet } = useConfirmSweet();
    const { language } = useLanguage();
    const isEdit = id && id !== "new";
    const [formData, setFormData] = useState({
        title: {},
        linkSocial: "",
        type: "",
        thumbnails: ""
    });

    useEffect(() => {
        if (!user) {
            navigate("/forbidden");
            return;
        };
        if (isEdit) {
            const loadSocialMediaContact = async () => {
                const result = await fetchSocialMediaById(id);
                if (result?.error) {
                    await errorSweet("Error loading Social Media/Contact by Id!");
                    return;
                };
                setFormData(result.response);
            };
            loadSocialMediaContact();
        };
    }, [id, isEdit, user, navigate, errorSweet]);

    const TEXT = LANG_CONST[language];

    const handleChange = (event) => {
        const { name, value } = event.target;
        if(name === "title") { setFormData(prev => ({ ...prev, title: { ...prev.title, [language]: value }}))}
        else { setFormData(prev => ({ ...prev, [name]: value })); }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(formData.type === "") {
            await errorSweet(TEXT.ERROR_SWEET_TEXT_INVALID_SOCIAL_MEDIA_CONTACT);
            return;
        };

        let result;
        if (isEdit) {
            result = await fetchUpdateSocialMediaContact(id, formData);
        } else {
            result = await fetchCreateSocialMediaContact(formData);
        };

        if (result?.error) {
            await errorSweet(TEXT.ERROR_SWEET_TEXT_ERROR_SAVING);
        } else {
            await successSweet(TEXT.SUCCESS_SWEET_SOCIAL_MEDIA_CONTACT_SAVED);
            triggerRefresh();
            navigate("/");
        };
    };

    return (
        <div id="formBodyGeneral">
            <div id="formBodyGeneralTop">
                <h3>{isEdit ? TEXT.UPDATE_SOCIAL_MEDIA_CONTACT : TEXT.CREATE_SOCIAL_MEDIA_CONTACT}</h3>
            </div>
            <form id="formGeneralContent" onSubmit={handleSubmit}>
                <div id="formGeneralContentBody">
                    <SocialMediasContactField label={`${TEXT.TITLE} (${language.toUpperCase()}): `} value={formData.title?.[language] || ""} placeholder={TEXT.PLACEHOLDER_SOCIAL_MEDIA_CONTACT_TITLE} name="title" type="text" onChange={handleChange} />
                    <SocialMediasContactField label={`${TEXT.LINK_SOCIAL_MEDIA_CONTACT}`} value={formData.linkSocial} placeholder={TEXT.PLACEHOLDER_SOCIAL_MEDIA_CONTACT_LINK} name="linkSocial" type="text" onChange={handleChange} />
                    <SocialMediasContactSelectField
                        label={TEXT.TYPE}
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        options={["Social Media", "Contact"]} 
                        TEXT={TEXT}/>
                    <SocialMediasContactField label="Image: " value={formData.thumbnails} placeholder={TEXT.PLACEHOLDER_SOCIAL_MEDIA_CONTACT_IMAGE} name="thumbnails" type="text" onChange={handleChange} />
                </div>
                <div id="formGeneralBottom">
                    <a className="btn btn-outline-success" id="btnGoBack" href="/">{TEXT.GO_BACK}</a>
                    <button className="btn btn-outline-success" type="submit">{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                </div>
            </form>
        </div>
    );
};

function SocialMediasContactField({ label, value, type, placeholder, name, onChange }) {
    return (
        <div className="divFieldsGeneral">
            <h3>{label}</h3>
            <input type={type} name={name} value={value || ""} placeholder={placeholder} onChange={onChange} />
        </div>
    );
};

function SocialMediasContactSelectField({ label, name, value, options, onChange , TEXT }) {
    return (
        <div className="divFieldsSelectGeneral">
            <h3>{label}</h3>
            <select name={name} value={value} onChange={onChange}>
                <option value="">{TEXT.SELECT_SOCIAL_MEDIA_CONTACT}</option>
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default SocialmediasForm;