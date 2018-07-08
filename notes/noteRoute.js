const router = require('express').Router();

const Notes = require('./noteModel');

const jwt = require('jsonwebtoken');
const envSecret = process.env.secret;

//middleware to block the route before get all notes
function restricted(req, res, next) {
    const token = req.headers.authorization;

    if(token) {
        jwt.verify(token, envSecret, (error, decodedToken) => {
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
    .route('/')
    .get(restricted, (req, res) => {
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
    .route('/:id')
    .get((req, res) => {
        const { id } = req.params;

        Notes
            .findById(id)
            .then(note => {
                if(!note) {
                    res.status(404).json({ message: 'No note with this id.'})
                } else {
                    res.status(200).json(note)
                }
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

router
    .route('/edit/:id')
    .put((req, res) => {
        const { id } = req.params;
        const updateNote = ({ title, content } = req.body);

        if(!title || !content) {
            res.status(400).json({ error: 'Please provide title and content.'})
        }

        Notes
            .findByIdAndUpdate(id, updateNote, {new: true})
            .then(note => {
                if(!note) {
                    res.status(404).json({ message: 'No note with this id.'})
                } else {
                    res.status(200).json(note)
                }
            })
            .catch(error => {
                res.status(500).json(error)
            })
    })

router
    .route('/delete/:id')
    .delete((req, res) => {
        const { id } = req.params;

        Notes
            .findByIdAndRemove(id)
            .then(note => {
                if(!note) {
                    res.status(404).json({ message: 'No note with this id.'})
                } else {
                    res.status(200).json(note)
                }
            })
            .catch(error => {
                res.status(500).json(error)
            })
    })

module.exports = router;
