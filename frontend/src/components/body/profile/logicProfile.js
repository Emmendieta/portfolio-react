import { getDataPopulate } from "../../../helpers/crud";

export const fetchUserPopulated = async (uid) => {
    try {
        const url = `users/${uid}`;
        const response = await getDataPopulate(url, ["person"]);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching Social Medias:", error.message);
        return null;
    }
};