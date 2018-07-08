const router = require('express').Router();

const Notes = require('./noteModel');

const jwt = require('jsonwebtoken');
const envSecret = process.env.secret;


router
    .route('/')
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
