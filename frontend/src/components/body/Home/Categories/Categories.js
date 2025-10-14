import { createData, deleteData, getData, getDataById, updateData } from "../../../../helpers/crud";

export const fetchCategories = async () => {
    try {
        const url = "categories/";
        const data = await getData(url);

        if(!data) {
            //LOGGER:
            console.error("Error in fetch Categories or no data recibed!");
            //SWEET ALERT:
            alert("Error in fetch Categories or no data recibed!");
            return;
        };

        return data; 

    } catch (error) {
        //LOGGER:
        console.error("Error fetching Categories:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchCategoryById = async (cid) => {
    try {
        const url = "categories";
        const response = await getDataById(url, cid);
        return response;

    } catch (error) {
        //LOGGER:
        console.error("Error fetching id Category:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchCreateCategory = async (data) => {
    try {
        const url = "categories";
        const response = await createData(data);
        return response;

    } catch (error) {
        //LOGGER:
        console.error("Error fetching creating Category:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchUpdateCategory = async (cid, data) => {
    try {
        const url = `categories/${cid}`;
        const response = await updateData(cid, data);
        return response;

    } catch (error) {
        //LOGGER:
        console.error("Error fetching update Category:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchDeleteCategory = async (cid) => {
    try {
        const url = "categories";
        const response = await deleteData(url, cid);
        return response;
        
    } catch (error) {
        //LOGGER:
        console.error("Error deleting Category:", error.message);
        return { error: { message: error.message } };
    }
};