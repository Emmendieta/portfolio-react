import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import "./Contacts.css";
import { fetchContacts, fetchDeleteContact } from "./logicContacts.js";
import { useRefresh } from "../../../context/RefreshContext.jsx";
import { useConfirmSweet } from "../../../context/SweetAlert2Context.jsx";

function Contacts() {
    const [contacts, setContacts] = useState([]);
    const { user } = useContext(UserContext);
    const { refreshKey } = useRefresh();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();

    useEffect(() => {
        const loadContacts = async () => {
            const contactsData = await fetchContacts();
            setContacts(contactsData);
        };
        loadContacts();
    }, [refreshKey]);

    const handleDelete = async (sid) => {
        const confirmDelete = await confirmSweet({
            title: "Delete Contact:",
            text: "Are you sure you want to delete the Contact?",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        });
        if (!confirmDelete) return;

        try {
            const result = await fetchDeleteContact(sid);

            if (result.error) {
                await errorSweet("Error deleting Contact: ", result.error.message);
            } else {
                await successSweet("Contact Deleted!");
                setContacts(prev => prev.filter(contact => contact._id !== sid));
            }
        } catch (error) {
            //LOGGER:
            console.error("Error deleting Contact: ", error.message);
            await errorSweet("Internal Error deleting Contact: " + error.message);
        }
    };

    return (
        <ul id="contactList">
            {contacts.map((contact) => (
                <li key={contact._id} data-id={contact._id}>
                    <a href={contact.linkSocial} target="_blank" rel="noopener noreferrer" title={contact.title}>
                        {<img
                            src={contact.thumbnails || "/img/imagen-no-disponible.png"}
                            alt={contact.title}
                            className="socialMediaContactIcon"
                            onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                        />}
                        <h5>{contact.title}</h5>
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
