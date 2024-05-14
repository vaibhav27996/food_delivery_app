const jwt= require('jsonwebtoken');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    var token=req.headers.authorization;
    token =token.split(' ')[1];
    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
            
            // Check if the error is due to token expiration
            if (err.name === 'TokenExpiredError') {
                return res.json({
                    status: "Failure",
                    message: "Access token has expired",
                    data: null
                });
            } else {
                return res.json({
                    status: "Failure",
                    message: "Invalid access token",
                    data: null
                });
            }
        }
        req.user = user;
        next();
    });
 
};
module.exports=verifyToken;