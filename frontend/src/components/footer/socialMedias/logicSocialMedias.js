import { createData, deleteData, getData, getDataById, updateData } from "../../../helpers/crud";

export const fetchSocialMedias = async () => {
    try {
        const url = 'social-medias/';
        const data = await getData(url);

        if (data?.response) {
            const onlySocialMedias = data.response.filter(item => item.type === "Social Media");
            return onlySocialMedias;
        }
    } catch (error) {
        //LOGGER:
        console.error("Error fetching Social Medias:", error.message);
        return [];
    }
};

export const fetchSocialMediaById = async (sid) => {
    try {
        const url = "social-medias";
        const response = await getDataById(url, sid);
        return response;

    } catch (error) {
        //LOGGER:
        console.error("Error fetching id Social Media/Contact:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchCreateSocialMediaContact = async (data) => {
    try {
        const url = "social-medias/";
        const response = await createData(url, data);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching creating Social Media/Contact:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchUpdateSocialMediaContact = async (sid, data) => {
    try {
        const url = `social-medias/${sid}`;
        const response = await updateData(url, data);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching Social Media/Contact:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchDeleteSocialMedia = async (sid) => {
    try {
        const url = "social-medias";
        const response = await deleteData(url, sid);
        return response;
    } catch (error) {
        //LOGGER
        console.error("Error deleting Social Media:", error.message);
        return { error: { message: error.message } };
    }
};