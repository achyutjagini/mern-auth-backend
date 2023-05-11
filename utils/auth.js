/*
utils folder and add auth.js file in it where 
we will make a method to sign a jwt token 
including our payload, expiry time, and token secret.
*/

const jwt = require("jsonwebtoken");

exports.createJWT = (name, userId, duration) => {
    const payload = {
        name,
        userId,
        duration
    };
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: duration,
    });
};