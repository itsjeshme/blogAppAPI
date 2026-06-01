const User = require('../models/User');
const bcrypt = require("bcryptjs");
const auth = require("../auth");


//[SECTION] User Registration
module.exports.registerUser = (req, res) => {

    if (!req.body.email.includes("@")){
        return res.status(400).send(false);
    } else {

        let newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then((result) => res.status(201).send(result))
        .catch(error => auth.errorHandler(error, req, res));
        
    }
};


//[SECTION] User Login
module.exports.loginUser = (req, res) => {

    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).send({
            message: "Missing credentials"
        });
    }

    let query = {};

    if (identifier.includes("@")) {
        query = { email: identifier };
    } else {
        query = { username: identifier };
    }

    return User.findOne(query)
        .then(result => {

            if (!result) {
                return res.status(404).send({
                    message: "User not found"
                });
            }

            const isPasswordCorrect = bcrypt.compareSync(password, result.password);

            if (!isPasswordCorrect) {
                return res.status(401).send({
                    message: "Incorrect password"
                });
            }

            return res.status(200).send({
                access: auth.createAccessToken(result)
            });
        })
        .catch(error => auth.errorHandler(error, req, res));
};


module.exports.getProfile = (req, res) => {

    return User.findById(req.user.id)
    .then(user => {
        user.password = "";
        res.status(200).send(user)
    })
    .catch(error => auth.errorHandler(error, req, res));

};