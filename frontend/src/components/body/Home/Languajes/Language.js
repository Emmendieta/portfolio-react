import { deleteData, getData } from "../../../../helpers/crud";

export const fetchLanguages = async () => {
    try {
        const url = "languages/";
        const data = await getData(url);

        if (!data) {
            //LOGGER:
            console.error("Error in fetch Languages or no data recibed!");
            //SWEET ALERT:
            alert("Error in fetch Languages or no data recibed!");
            return;
        };

        return data;

    } catch (error) {
        //LOGGER:
        console.error("Error fetching Languages:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchDeleteLanguage = async (lid) => {
    try {
        const url = "languages";
        const response = await deleteData(url, lid);
        if (!response) {
            //LOGGER:
            console.error("Error in fetch Deleting Language!");
            //SWEET ALERT:
            alert("Error in fetch Deleting Language!");
            return;
        };

        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error deleting Language:", error.message);
        return { error: { message: error.message } };
    }
};