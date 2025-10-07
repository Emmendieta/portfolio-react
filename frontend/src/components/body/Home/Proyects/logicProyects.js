import { deleteData, getData } from "../../../../helpers/crud";

export const fetchProyects = async () => {
    try {
        const url = "proyects/";
        const data = await getData(url);

        if(!data) {
            //LOGGER:
            console.error("Error in fetch Proyects or no data recibed!");
            //SWEET ALERT:
            alert("Error in fetch Proyects or no data recibed!");
            return;
        };

        return data;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching Proyects:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchDeleteProyect = async (pyid) => {
    try {
        const url = "proyects";
        const response = await deleteData(url, pyid);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error deleting work:", error.message);
        return { error: { message: error.message } };
    }
};