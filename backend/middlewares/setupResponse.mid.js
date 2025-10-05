const setupResponses = (req, res, next) => {
    try {
        const { method, originalUrl: url } = req;
        const data = { method, url };
        const messages = {
            200: "Success!!!",
            201: "Crated!!!",
            400: "Client Error!!!",
            401: "Bad Auth!!!",
            403: "Forbidden!!!",
            404: "Not Found!!!",
            500: "Internal Server Error!!!"
        };
        const successResponses = (code, response, message = messages[code]) => res.status(code).json({ method, url, response, message });
        const errorResponses = (code, errorMessage = messages[code]) => {
            const error = new Error(errorMessage);
            error.statusCode = code;
            throw error;
        };
        res.json200 = (response, message) => successResponses(200, response, message);
        res.json201 = (response, message) => successResponses(201, response, message);
        res.json400 = (message) => errorResponses(400, message);
        res.json401 = (message) => errorResponses(401, message);
        res.json403 = (message) => errorResponses(403, message);
        res.json404 = (message) => errorResponses(404, message);
        res.json500 = (message) => errorResponses(500, message);
        next();
    } catch (error) {
        next(error);
    }
};

export default setupResponses;