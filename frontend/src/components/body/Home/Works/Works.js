import { bulkUpdateData, createData, deleteData, getData, getDataById, updateData } from "../../../../helpers/crud";

export const fetchWorks = async () => {
    try {
        const url = "works/";
        const data = await getData(url);

        if (!data) {
            //LOGGER:
            console.error("Error in fetch Works or no data recibed!");
            //SWEET ALERT:
            alert("Error in fetch Works or no data recibed!");
            return;
        };

        return data;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching works:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchWorkById = async (wid) => {
    try {

        const url = "works";
        const response = await getDataById(url, wid);
        return response;

    } catch (error) {
        //LOGGER:
        console.error("Error fetching id work:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchCreateWork = async (data) => {
    try {
        const url = "works/";
        const response = await createData(url, data);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching creating work:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchUpdateWork = async (wid, data) => {
    try {
        const url = `works/${wid}`;
        const response = await updateData(url, data);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching update work:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchUpdateWorksOrder = async (orderedWorks) => {
    try {
        if (!Array.isArray(orderedWorks) || orderedWorks.length === 0) {
            console.error("No ordered Works provided!");
            alert("No ordered Works provided!");
            return;
        };
        const dataArray = orderedWorks.map((work, index) => {
            if (!work._id || work._id.length !== 24) throw new Error("Each work must have a valid _id!");
            return { _id: work._id, order: index };
        });
        const url = "works/reorder";
        const response = await bulkUpdateData(url, dataArray);
        if (!response) {
            console.error("No response from backend when updating Works order");
            alert("No response from backend when updating Works order");
            return;
        };
        return response; 
    } catch (error) {
        console.error("Error updating Works order:", error.message);
        alert("Error updating Works order!");
        return { error: { message: error.message } };
    }
};

export const fetchDeleteWork = async (wid) => {
    try {
        const url = "works";
        const response = await deleteData(url, wid);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error deleting work:", error.message);
        return { error: { message: error.message } };
    }
};