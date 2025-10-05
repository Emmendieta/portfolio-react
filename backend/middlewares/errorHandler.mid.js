const errorHandler = (error, req, res, next) => {
    //Falta Logger
    console.log(error);
    const message = error.message || "Server Error";
    const data = {
        method: req.method,
        url: req.originalUrl,
        error: message
    };
    res.status(error.statusCode || 500).json(data);
};

export default errorHandler;