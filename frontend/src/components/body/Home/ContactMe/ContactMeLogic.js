import { createData } from "../../../../helpers/crud";

export const fetchCreateSendMessage = async (data) => {
    try {
        const url = "email/contact";
        const response = await createData(url, data);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching sending Email: ", error.message);
        return { error: { message: error.message }};
    }
};