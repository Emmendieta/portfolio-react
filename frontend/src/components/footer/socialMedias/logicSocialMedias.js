import { deleteData, getData } from "../../../helpers/crud";

export const fetchSocialMedias = async () => {
    try {
        const url = 'social-medias/';
        const data = await getData(url);

        if (data?.response) {
            const onlySocialMedias = data.response.filter(item => item.type === "social");
            return onlySocialMedias;
        }
    } catch (error) {
        //LOGGER:
        console.error("Error fetching Social Medias:", error.message);
        return [];
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
}