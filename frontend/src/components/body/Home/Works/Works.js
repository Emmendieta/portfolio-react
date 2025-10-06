import { deleteData, getData } from "../../../../helpers/crud";

export const fetchWorks = async() => {
    try {
        const url = "works/";
        const data = await getData(url);

        if(!data) {
            //LOGGER:
            console.error("Error in fetch Works or no data recibed!");
            //SWEET ALERT:
            alert("Error in fetch Works or no data recibed!");
        };

        return data;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching works:", error.message);
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
}