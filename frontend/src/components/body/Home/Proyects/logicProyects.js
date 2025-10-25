
import { bulkUpdateData, createData, deleteData, getAllPopulated, getData, getDataById, updateData } from "../../../../helpers/crud";

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

export const fetchProyectsPopulated = async () => {
    try {
        const url = "proyects";
        const response = await getAllPopulated(url, ["languages","categories"]);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching Proyects Populated:", error.message);
        return null;
    }
};

export const fetchProyectById = async (pyid) => {
    try {
        const url = "proyects";
        const response = await getDataById(url, pyid);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching id Proyect:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchCreateProyect = async (data) => {
    try {
        const url = "proyects/";
        const response = await createData(url, data);
        return response;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching creating Proyect:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchUpdateProyect = async (pyid, data) => {
    try {
        const url = `proyects/${pyid}`;
        const response = await updateData(url, data);
        return response;        
    } catch (error) {
        //LOGGER:
        console.error("Error fetching update Proyect:", error.message);
        return { error: { message: error.message } };
    }
};

export const fetchUpdateProyectsOrder = async (orderedProyects) => {
    try {
        if (!Array.isArray(orderedProyects)) {
            console.error("No ordered Proyect provided!");
            alert("No ordered Proyect provided!");
            return;
        };
        const dataArray = orderedProyects.map((pro, index) => {
            if(!pro._id || pro._id.length !== 24) throw new Error ("Each Proyect must have a valid id!");
            return { _id: pro._id, order: index};;
        });
        const url = "proyects/reorder";
        const response = await bulkUpdateData(url, dataArray);
        if (!response) {
            console.error("No response from backend when updating Proyect order");
            alert("No response from backend when updating Proyect order");
            return;
        };
        return response;
    } catch (error) {
        console.error("Error updating Proyect order:", error.message);
        alert("Error updating Proyect order!");
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