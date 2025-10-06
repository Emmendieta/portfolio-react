import { getData } from "../../../../helpers/crud";

export const fetchPerson = async () => {
    try {
        const url = "people/";
        const data = await getData(url);

        if(!data) {
            //LOGGER:
            console.error("Error in fetchPerson or no data recibed");
            //SwEET ALERT:
            alert("Error in fetchPerson or no data recibed");
        }

        return data;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching person:", error.message);
        return { error: { message: error.message } };
    }
};