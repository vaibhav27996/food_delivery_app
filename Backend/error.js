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

module.exports=createError;