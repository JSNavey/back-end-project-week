const router = require('express').Router();
const Notes = require('./noteModel');

const jwt = require('jsonwebtoken');
const secret = 'Secret makes a woman woman...';

function restricted(req, res, next) {
    const token = req.headers.authorization;

    if(token) {
        jwt.verify(token, secret, (error, decodedToken) => {
            req.jwtPayload = decodedToken;
            console.log('decodedToken', decodedToken);

            if(error) {
                return res.status(401).json({ message: 'Please log in.' })
            }

            next();
        })
    } else {
        res.status(401).json({ message: 'Please log in.' })
    }
}

router
    .route('/', restricted)
    .get((req, res) => {
        Notes
            .find()
            .then(notes => {
                res.status(200).json(notes)
            })
            .catch(error => {
                res.status(500).json(error)
            })
    })

router
    .route('/create')
    .post((req, res) => {
        const { title, content } = req.body;
        const newNote = new Notes ({ title, content })

        if(!title || !content) {
            res.status(400).json({ error: 'Please provide title and content.'})
        }

        newNote
            .save()
            .then(newNote => {
                res.status(201).json({ newNote })
            })
            .catch(error => {
                res.status(500).json(error)
            })
    })

module.exports = router;
