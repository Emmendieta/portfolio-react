import { bulkUpdateData, createData, deleteData, getData, getDataById, updateData } from "../../../../helpers/crud";

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
        const response = await updateData(url, data);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching update Language:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchUpdateLanguagesOrder = async (orderedLanguages) => {
    try {
        if (!Array.isArray(orderedLanguages) || orderedLanguages.length === 0) {
            console.error("No ordered Languages provided!");
            alert("No ordered Languages provided!");
            return;
        };
        // Cada elemento debe tener _id
        const dataArray = orderedLanguages.map((lan, index) => {
            if (!lan._id || lan._id.length !== 24) throw new Error("Each Language must have a valid _id");
            return { _id: lan._id, order: index };
        });
        const url = "languages/reorder";
        // Llamamos a bulkUpdateData según tu backend
        const response = await bulkUpdateData(url, dataArray);
        if (!response) {
            console.error("No response from backend when updating Languages order");
            alert("No response from backend when updating Languages order");
            return;
        };
        return response;
    } catch (error) {
        console.error("Error updating Langauges order:", error.message);
        alert("Error updating Langauges order!");
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