import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCreateSocialMediaContact, fetchSocialMediaById, fetchUpdateSocialMediaContact } from "../socialMedias/logicSocialMedias";
import { useRefresh } from "../../../context/RefreshContext";

function SocialmediasForm() {
    const { triggerRefresh } = useRefresh();
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const isEdit = id && id !== "new";
    const [formData, setFormData] = useState({
        title: "",
        linkSocial: "",
        type: "",
        thumbnails: ""
    });

    useEffect(() => {
        if (isEdit) {
            const loadSocialMediaContact = async () => {
                const result = await fetchSocialMediaById(id);
                if (result?.error) {
                    //SWEET ALERT:
                    alert("Error loading Social Media/Contact by Id!");
                    return;
                };
                setFormData(result.response);
            };
            loadSocialMediaContact();
        };
    }, [id, isEdit]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(formData.type === "") {
            //SWEET ALERT:
            alert("Please select a valid Type of Social Media - Contact!");
            return;
        };

        let result;
        if (isEdit) {
            result = await fetchUpdateSocialMediaContact(id, formData);
        } else {
            result = await fetchCreateSocialMediaContact(formData);
        };

        if (result?.error) {
            //SWEET ALERT:
            alert("Error saving Social Media/Contact");
        } else {
            //SWEET ALERT:
            alert("Social Media/Contact saved!");
            triggerRefresh();
            navigate("/");
        };
    };

    return (
        <div id="formBodyGeneral">
            <div id="formBodyGeneralTop">
                <h3>{isEdit ? "Update Social Media - Contact:" : "Create Social Media - Contact:"}</h3>
            </div>
            <form id="formGeneralContent" onSubmit={handleSubmit}>
                <div id="formGeneralContentBody">
                    <SocialMediasContactField label="Title: " value={formData.title} placeholder="Type here the name of the Social Media - Contact" name="title" type="text" onChange={handleChange} />
                    <SocialMediasContactField label="Link Social Media/Contact:" value={formData.linkSocial} placeholder="Type here the Link of the Social Media - Contact" name="linkSocial" type="text" onChange={handleChange} />
                    <SocialMediasContactSelectField
                        label="Type:"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        options={["Social Media", "Contact"]} />
                    <SocialMediasContactField label="Image: " value={formData.thumbnails} placeholder="Type here the URL of the Image of the Social Media - Contact" name="thumbnails" type="text" onChange={handleChange} />
                </div>
                <div id="formGeneralBottom">
                    <a className="btn btn-outline-success" id="btnGoBack" href="/">Go Back</a>
                    <button className="btn btn-outline-success" type="submit">{isEdit ? "Update" : "Create"}</button>
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

function SocialMediasContactSelectField({ label, name, value, options, onChange }) {
    return (
        <div className="divFieldsSelectGeneral">
            <h3>{label}</h3>
            <select name={name} value={value} onChange={onChange}>
                <option value="">Select between Social Media or Contact</option>
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default SocialmediasForm;