import { updateData } from "../../../../helpers/crud";

export const handleUpdatePerson = async ({ pid, data, successSweet, errorSweet }) => {
    try {
        const url = `people/${pid}`;
        const response = await updateData(url, data);

        if(response.error) {
            //LOGGER:
            console.error(response.error);
            await errorSweet("Error updating person data!");
            return null;
        } else {
            await successSweet("Personal data updated successfully!");
            return response;
        }
    } catch (error) {
        //LOGGER:
        console.error("Update failed:", error);
        await errorSweet("An error occurred while updating person data!");
        return null;
    }
};