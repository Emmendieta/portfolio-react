import { deleteData, getData } from "../../../../helpers/crud";

export const fetchEducations = async () => {
    try {
        const url = "educations/";
        const data = await getData(url);

        if(!data) {
            //LOGGER:
            console.error("Error in fetchEducations or no data recibed!");
            //SWEET ALERT:
            alert("Error in fechEducations or no data recibed!");
        };

        return data;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching educations:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchDeleteEducation = async (eid) => {
    try {
        const url = 'educations';
        const response = await deleteData(url, eid);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error deleting education:", error.message);
        return { error: { message: error.message } };
    }
}