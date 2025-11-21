const baseHeaders = { "Content-Type": "application/json" };
const credentials = "include";
const GET = "GET";
const POST = "POST";
const UPDATE = "PUT";
const DELETE = "DELETE";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


export const getData = async (baseUrl) => {
    try {
        if (!baseUrl) {
            //LOGGER:
            console.error("Error getting the url to process data!");
            //SWEET ALERT:
            alert("URL is needed!");
            return;
        };

        const opts = {
            method: GET,
            headers: baseHeaders,
            credentials: credentials
        };

        const url = `${BACKEND_URL}/${baseUrl}`;

        const response = await fetch(url, opts);

        return await response.json();

    } catch (error) {
        //LOGGER:
        console.error(error.message);
        //SWEET ALERT:
        alert("Error getting data!");
    }
};

export const getDataById = async (baseUrl, id) => {
    try {
        if (!baseUrl) {
            //LOGGER:
            console.error("Error gettin the url to process the data!");
            //SWEET ALERT:
            alert("URL is neeeded!");
            return;
        };

        const opts = {
            method: GET,
            headers: baseHeaders,
            credentials: credentials
        };

        const url = `${BACKEND_URL}/${baseUrl}/${id}`;

        const response = await fetch(url, opts);

        return await response.json();

    } catch (error) {
        //LOGGER:
        console.error(error.message);
        //SWEET ALERT:
        alert("Error getting data by Id!");
    }
};

export const getDataByLanguage = async (baseUrl,) => {
    try {
        if (!baseUrl) {
            //LOGGER:
            console.error("Error gettin the url to process the data!");
            //SWEET ALERT:
            alert("URL is neeeded!");
            return;
        }; const opts = {
            method: GET,
            headers: baseHeaders,
            credentials: credentials
        };
        const url = `${BACKEND_URL}/${baseUrl}`;
        const response = await fetch(url, opts);
        return await response.json();
    } catch (error) {
        //LOGGER:
        console.error(error.message);
        //SWEET ALERT:
        alert("Error getting data by Language!");
    }
};

export const getDataPopulate = async (baseUrl, populateFields) => {
    try {
        if (!baseUrl || !populateFields || populateFields.length === 0) {
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
        const url = `${BACKEND_URL}/${baseUrl}/populated?populate=${populateQuery}`;
        let response = await fetch(url, opts);
        return await response.json();
    } catch (error) {
        //LOGGER:
        console.error(error.message);
        //SWEET ALERT:
        alert("Error getting populated data!");
    }
};

export const getAllPopulated = async (baseUrl, populateFields) => {
    try {
        if (!baseUrl || !populateFields || populateFields.length === 0) {
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
        const url = `${BACKEND_URL}/${baseUrl}/populated?populate=${populateQuery}`;

        let response = await fetch(url, opts);
        return await response.json();
    } catch (error) {
        //LOGGER:
        console.error(error.message);
        //SWEET ALERT:
        alert("Error getting populated data!");
    }
};

export const createData = async (baseUrl, data = {}) => {
    try {
        if (!baseUrl) {
            //SWEET ALERT:
            alert("Error in creating Data, missing URL o Method!");
            return;
        };

        if (Object.keys(data).length === 0) {
            //SWEET ALERT:
            alert("No Data to create!");
            return;
        };

        const opts = {
            method: POST,
            headers: baseHeaders,
            credentials: credentials,
            body: JSON.stringify(data)
        };

        const url = `${BACKEND_URL}/${baseUrl}`;
        const response = await fetch(url, opts);
        const result = await response.json();
        return result;
    } catch (error) {
        //LOGGER:
        console.error(error.message);
        //SWEET ALERT:
        alert("Error creating data!")
    }
};

export const updateData = async (baseUrl, data = {}) => {
    try {
        if (!baseUrl) {
            //SWEET ALERT:
            alert("Error in update Data, missing Url or Method!");
            return;
        };
        if (Object.keys(data).length === 0) {
            //SWEET ALERT:
            alert("No Data to update!");
            return;
        };
        const opts = {
            method: UPDATE,
            headers: baseHeaders,
            credentials: credentials,
            body: JSON.stringify(data)
        };

        const url = `${BACKEND_URL}/${baseUrl}`;
        const response = await fetch(url, opts);
        const result = await response.json();
        return result;
    } catch (error) {
        //LOGGER:
        console.error(error.message);
        //SWEET ALERT:
        alert("Error updating data!")
    }
};

export const bulkUpdateData = async (baseUrl, dataArray = []) => {
    try {
        if (!baseUrl) {
            console.error("Error in bulk update: missing URL!");
            alert("Missing URL!");
            return;
        };

        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            console.error("Error in bulk update: no data provided!");
            alert("No data provided for bulk update!");
            return;
        };

        const opts = {
            method: UPDATE,
            headers: baseHeaders,
            credentials: credentials,
            body: JSON.stringify({ data: dataArray })
        };

        const url = `${BACKEND_URL}/${baseUrl}`;
        const response = await fetch(url, opts);
        const result = await response.json();

        return result;

    } catch (error) {
        //LOGGER:
        console.error(error.message);
        //SWEET ALERT:
        alert("Error updating data!")
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

        const url = `${BACKEND_URL}/${baseUrl}/${id}`;
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

export const generatePDFData = async (baseUrl) => {
    try {
        if (!baseUrl) {
            //LOGGER:
            console.error("Error getting the url to process data!");
            //SWEET ALERT:
            alert("URL is needed!");;
            return;
        };

        const opts = {
            method: GET,
            credentials: credentials
        };

        const url = `${BACKEND_URL}${baseUrl}`;
        let response = await fetch(url, opts);
        return response;

    } catch (error) {
        //LOGGER:
        console.error(error.message);
        //SWEET ALERT:
        alert("Error generting PDF data!");
    }
};


