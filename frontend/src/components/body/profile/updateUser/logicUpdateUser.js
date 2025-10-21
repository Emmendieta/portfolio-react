import { updateData } from "../../../../helpers/crud";

export const handleUpdateUser = async ({ uid, data, setUser, navigate, successSweet, errorSweet }) => {
    try {
        const url = `users/${uid}`;
        const response = await updateData(url, data);

        if(response.error) {
            //LOGGER:
            console.error(response.error);
            await errorSweet("Error updating user data!");
        } else {
            setUser((prevUser) => ({
                ...prevUser,
                ...data, // cuidado si password no debe quedarse en contexto
            }));
            await successSweet("User data updated successfully!");
            navigate("/profile");
        }
    } catch (error) {
        //LOGGER:
        console.error("Update failed:", error);
        await errorSweet("An error occurred while updating user data!");
    }
};