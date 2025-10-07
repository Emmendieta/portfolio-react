import { createData, deleteData, getData, getDataById } from "../../../../helpers/crud";

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

export const fetchLanguageById = async (eid) => {
    try {
        const url = "languages";
        const response = await getDataById(url, eid);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching id Language:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchCreateLanguage = async (data) => {
    try {
        const url = "languages/";
        const response = await createData(url, data);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching creating Language:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchUpdateLangauge = async (lid, data) => {
    try {
        const url = `languages/${lid}`;
        const response = await createData(url, data);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching update Language:", error.message);
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