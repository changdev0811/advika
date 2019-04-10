//Import Modules
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();

//Import Keys
const keys = require('./../../config/keys');

//Validator
const validateRegisterInput = require('./../../validation/register');
const validateLoginInput = require('./../../validation/login');

//Load User Model
const User = require('./../../models/User');

// @route   GET /api/users/test
// @desc    Testing 'test' route
// @access  Public
router.get('/test', (req, res) => {
    res.json({
        message: "Users route works"
    });
});

// @route   POST /api/users/register
// @desc    Registering new users
// @access  Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check Errors
    if (!isValid) {
        return res.status(400).json(errors);
    }

    //Register
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                errors.email = "Email already exists!";
                return res.status(400).json(errors);
            } else {
                const newUser = new User({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    // avatar: req.body.avatar,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            console.log(err);
                        }
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(`Error: ${err}`));
                    })
                })
            }
        })
});

// @route   POST /api/users/login
// @desc    Login for existing functionality
// @access  Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check Errors
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find Email
    User.findOne({ email })
        .then(user => {
            if (!user) {
                errors.email = "User not found!";
                return res.status(404).json(errors);
            }

            //Check Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // res.json({
                        //     message: "Success! User Logged in"
                        // });

                        //Create Payload
                        const payload = {
                            id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name
                        }

                        //Sign Token
                        jwt.sign(
                            payload,
                            keys.secretOrKey, { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                })
                            });
                    } else {
                        errors.password = "Username/ Password does not match!";
                        return res.status(400).json(errors);
                    }
                })

        })
});

// @route   Get /api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        first_name: req.user.id,
        last_name: req.user.last_name,
        email: req.user.email
    });
})

//Export for other files to access
module.exports = router;