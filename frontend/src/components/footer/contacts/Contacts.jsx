import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import "./Contacts.css";
import { fetchContacts, fetchDeleteContact } from "./logicContacts.js";
import { useRefresh } from "../../../context/RefreshContext.jsx";
import { useConfirmSweet } from "../../../context/SweetAlert2Context.jsx";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import { LANG_CONST } from "../../constants/selectConstLang.js";

function Contacts() {
    const [contacts, setContacts] = useState([]);
    const { user } = useContext(UserContext);
    const { refreshKey } = useRefresh();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();
    const { language } = useLanguage();

    useEffect(() => {
        const loadContacts = async () => {
            const contactsData = await fetchContacts();
            setContacts(Array.isArray(contactsData) ? contactsData : []);
            setContacts(contactsData);
        };
        loadContacts();
    }, [refreshKey]);

    const TEXT = LANG_CONST[language];

    const handleDelete = async (sid) => {
        const confirmDelete = await confirmSweet({
            title: TEXT.CONFIRM_SWEET_TITLE_DELETE,
            text: TEXT.CONFIRM_SWEET_TEXT_DELETE,
            confirmButtonText: TEXT.YES,
            cancelButtonText: TEXT.NO,
        });
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteContact(sid);

            if (result.error) {
                await errorSweet(TEXT.ERROR_SWEET_TEXT_CONTACT, result.error.message);
            } else {
                await successSweet(TEXT.SUCCESS_SWEET_TEXT);
                setContacts(prev => prev.filter(contact => contact._id !== sid));
            }
        } catch (error) {
            //LOGGER:
            console.error(TEXT.ERROR_SWEET_TEXT_CONTACT, error.message);
            await errorSweet(TEXT.INTERNAL_SERVER_ERROR_DELETING + TEXT.CONTACT + error.message);
        }
    };

    return (
        <ul id="contactList">
            {contacts.map((contact) => (
                <li key={contact._id} data-id={contact._id}>
                    <a href={contact.linkSocial} target="_blank" rel="noopener noreferrer" title={contact.title?.[language]?.[language]}>
                        {<img
                            src={contact.thumbnails || "/img/imagen-no-disponible.png"}
                            alt={contact.title?.[language]}
                            className="socialMediaContactIcon"
                            onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                        />}
                        <h5>{contact.title?.[language]}</h5>
                    </a>

                    {user?.role === "admin" && (
                        <div className="editionControlsContacts">
                            <Link to={`/social-medias/form/${contact._id}`} id="contactEdit" className="btn btn-outline-primary btn-sm" >
                                <FaPen />
                            </Link>
                            <button className="btn btn-outline-danger btn-sm" id="contactDelete" onClick={() => handleDelete(contact._id)} >
                                <FaRegTrashCan />
                            </button>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default Contacts;
