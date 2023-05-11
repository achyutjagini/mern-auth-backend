//signup and sign-in methods

//User schema
const User = require('../models/User');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

/*This code imports the createJWT function from the ../utils/auth
module using Node.js require function.

The createJWT function is likely used for creating JSON Web Tokens (JWTs) which
are a type of token used for authentication and authorization purposes.

It is important to note that the code alone doesn't provide enough context 
to understand how the createJWT function is being used and what parameters
it requires to function properly. However, it can be inferred that this
code is likely part of a larger program that handles 
authentication and authorization using JWTs.
*/

const {
    createJWT,
} = require("../utils/auth");


/*
Check if the user exists or not, if the user already exists, throw errors with the 
message username already exists.
If the user is a new user, use bcrypt to hash the password before storing it in your database
Save data(name and password) in MongoDB.
*/

exports.signup = (req, res, next) => {
    let { name, password } = req.body;
    let errors = [];
    if (!name) {
        errors.push({ name: "required" });
    }

    if (!password) {
        errors.push({ password: "required" });
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }

    User.findOne({ name: name })
        .then(user => {
            if (user) {
                return res.status(422).json({ errors: [{ user: "username already exists" }] });
            } else {
                const user = new User({
                    name: name,
                    password: password,
                });
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) throw err;
                        user.password = hash;
                        user.save()
                            .then(response => {
                                res.status(200).json({
                                    success: true,
                                    result: response
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    errors: [{ error: err }]
                                });
                            });
                    });
                });
            }
        }).catch(err => {
            res.status(500).json({
                errors: [{ error: 'Something went wrong' }]
            });
        })
}

/*
Check if the user exists or not, if user not exists, throw errors with
the message user not found.
If the user exists, we are checking whether the assigned and retrieved
passwords are the same or not using the bcrypt.compare() method.
Sign our jwt and set the JWT token expiration time. Token will be 
expired within the defined duration which is 1hr in our current code.

If succeed send the token in our response with success status(200) 
and user information.
*/

exports.signin = (req, res) => {
    let { name, password } = req.body;

    let errors = [];
    if (!name) {
        errors.push({ name: "required" });
    }

    if (!password) {
        errors.push({ password: "required" });
    }
    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }

    User.findOne({ name: name }).then(user => {
        if (!user) {
            return res.status(404).json({
                errors: [{ user: "not found" }],
            });
        } else {
            bcrypt.compare(password, user.password).then(isMatch => {
                if (!isMatch) {
                    return res.status(400).json({
                        errors: [{
                            password:
                                "incorrect"
                        }]
                    });
                }
                let access_token = createJWT(
                    user.name,
                    user._id,
                    3600
                );
                //console.log(access_token)
                jwt.verify(access_token, process.env.TOKEN_SECRET, (err, decoded) => {
                    if (err) {
                        res.status(500).json({ error: err });
                    }
                    if (decoded) {
                        return res.status(200).json({
                            success: true,
                            token: access_token,
                            message: user
                        });
                    }
                });
            }).catch(err => {
                res.status(500).json({ error: err });
            });
        }
    }).catch(err => {
        res.status(500).json({ error: err });
    });
}