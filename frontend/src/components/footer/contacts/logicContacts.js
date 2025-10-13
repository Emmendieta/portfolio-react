import { getData, deleteData } from "../../../helpers/crud.js";

export const fetchContacts = async () => {
    try {
        const url = 'social-medias/';
        const data = await getData(url);

        if (data?.response) {
            const onlyContacts = data.response.filter(item => item.type === "Contact");
            return onlyContacts;
        }
    } catch (error) {
        //LOGGER:
        console.error("Error fetching contancts:", error.message);
        return [];
    }
};

export const fetchDeleteContact = async (sid) => {
    try {
        const url = "social-medias";
        const response = await deleteData(url, sid);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error deleting contact:", error.message);
        return { error: { message: error.message } };
    }
};