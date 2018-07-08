const router = require('express').Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./userModel');
const envSecret = process.env.secret;

//generate Token function
function generateToKen(user) {
    const options = {
        expiresIn: '1h',
    }
    const payload = { name: username };
    return jwt.sign(payload, envSecret, options)
}

//Log in route
router
    .route('/login')
    .post((req, res) => {
        const { username, password } = req.body;

        User
            .findOne({ username })
            .then(user => {
                if(user) {

                    user
                        .validatePassword(password)
                        .then(pwdMatched => {
                            if(pwdMatched) {
                                const token = generateToKen(user);
                                res.status(200).json({ message: `Hello ${username}!`, token })
                            } else {
                                res.status(401).json({ message: 'Invalid Credential!' })
                            }
                        })
                        .catch(error => {
                            res.status(500).json({ message: 'Cannot compare the password.'})
                        })

                } else {
                    res.status(401).json({ message: 'Invalid Credential!' })
                }
            })
            .catch(error => {
                res.status(500).json(error)
            })
    })


//register route
router
    .route('/register')
    .post((req, res) => {
        const { username, password } = req.body;

        if(!username || !password) {
            res.status(400).json({ message: 'Please provide name and password.'})
        }
        
        User
            .findOne({ username: username })
            .then(duplicatedUsername => {
                if(duplicatedUsername) {
                    res.status(400).json({ message: 'The username has already been taken.'})
                } else {

                    User
                        .create({ username, password })
                        .then(newUser => {
                            res.status(201).json({ newUser })
                        })
                        .catch(error => {
                            res.status(500).json(error)
                        })
                }
            })
            .catch(error => {
                res.status(500).json(error)
            })
    })




module.exports = router;