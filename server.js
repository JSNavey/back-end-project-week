const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');

const server = express();
const corsOptions = {
    origin: 'http://localhost:3000', //might need to change to netify later
    credential: true
};

const port = process.env.PORT || 5000;

server.use(express.json());
server.use(helmet());
server.use(cors({corsOptions}));


const notesRoute = require('./notes/noteRoute');
const usersRoute = require('./users/userRoute')

server.use('/api/notes', notesRoute);
server.use('/api/users', usersRoute);

server.get('/', (req,res) => {
    res.status(200).json({ api: 'running'})
})


//database connection
mongoose.Promise = global.Promise;

mongoose.connect(`${process.env.mongo}`, {}, error => {
    if(error) console.log(error);
    console.log(`\n===== Connected lambdanotes_db to database =====\n`)
})
    

//setting server port
server.listen(port, () => console.log(`\n===== API up on port: ${port} =====\n`));