const baseHeaders = { "Content-Type": "application/json" };
const credentials = "include";
const GET = "GET";
/* const POST = "POST";
const UPDATE = "PUT"; */
const DELETE = "DELETE";

export const getData = async (baseUrl) => {
    try {
        if (!baseUrl) {
            //LOGGER:
            console.error("Error getting the url to process data!");
            //SWEET ALERT:
            alert("URL is needed!");
            return;
        }

        const opts = {
            method: GET,
            headers: baseHeaders,
            credentials: credentials
        };

        const url = `http://localhost:8080/api/${baseUrl}`;
        const response = await fetch(url, opts);

        return await response.json();

    } catch (error) {
        //LOGGER:
        console.error(error.message);
        //SWEET ALERT:
        alert("Error getting data!");
    }
};

export const getDataPopulate = async (baseUrl, populateFields) => {
    try {
        if (!baseUrl || !populateFields) {
            //LOGGER:
            console.error("All fields are needed!");
            //SWEET ALERT:
            alert("All fields are needed!");
            return;
        };

        const opts = {
            method: GET,
            headers: baseHeaders,
            credentials: credentials
        };

        let populateQuery = Array.isArray(populateFields) ? populateFields.join(",") : populateFields;
        const url = `http://localhost:8080/api/${baseUrl}/populated?populate=${populateQuery}`;
        let response = await fetch(url, opts);
        return await response.json();
    } catch (error) {
        //LOGGER:
        console.error(error.message);
        //SWEET ALERT:
        alert("Error getting populated data!");
    }
};

export const deleteData = async (baseUrl, id) => {
    try {
        if (!baseUrl || !id) {
            //LOGGER:
            console.error("Error getting the url or id to process data!");
            //SWEET ALERT:
            alert("URL or Id is needed!");;
            return;
        };

        const opts = {
            method: DELETE,
            headers: baseHeaders,
            credentials: credentials
        };

        const url = `http://localhost:8080/api/${baseUrl}/${id}`;
        let response = await fetch(url, opts);
        response = await response.json();
        return response;

    } catch (error) {
        //LOGGER:
        console.error(error.message);
        //SWEET ALERT:
        alert("Error deleting data!");
    }
};


