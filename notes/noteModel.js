const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

const noteModel = mongoose.model('Note', NoteSchema);

module.exports = noteModel;

