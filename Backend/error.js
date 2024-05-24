const createError = (res,status, message) => {
    // const err = new Error();
    // err.status = status;
    // err.message = message;
    // return err;

    return res.status(status).json({
        success: false,
        message: message
    });

};
const errorHandlerMiddleware = (err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message })
}
module.exports = { createError, errorHandlerMiddleware };