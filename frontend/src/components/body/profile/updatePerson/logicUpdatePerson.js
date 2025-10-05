import { updateData } from "../../../../helpers/crud";

export const handleUpdatePerson = async ({ pid, data }) => {
    try {
        const url = `people/${pid}`;
        const response = await updateData(url, data);

        if(response.error) {
            //LOGGER:
            console.error(response.error);
            //SWEET ALERT:
            alert("Error updating person data!");
            return null;
        } else {
            // SWEET ALERT:
            alert("Personal data updated successfully!");
            return response;
        }
    } catch (error) {
        //LOGGER:
        console.error("Update failed:", error);
        //SWEET ALERT:
        alert("An error occurred while updating person data!");
        return null;
    }
};