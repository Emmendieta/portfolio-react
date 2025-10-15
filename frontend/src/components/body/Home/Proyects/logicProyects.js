
import { createData, deleteData, getAllPopulated, getData, getDataById, updateData } from "../../../../helpers/crud";

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