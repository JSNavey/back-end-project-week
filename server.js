const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');

const server = express();
const corsOptions = {
    origin: 'http://localhost:3000', //need to change to netify later
    credential: true
};

// const dbuser = 'dbUser1';
// const dbpassword = 'database1';
// const database = 'lambdanotes_db';

const port = process.env.PORT || 5000;

//need notes and users controllers here 

server.use(express.json());
server.use(helmet());
server.use(cors({corsOptions}));

server.get('/', (req,res) => {
    res.status(200).json({ api: 'running'})
})

//server.use('api/notes', notesController);
//also for user controller


//database connection
mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${process.env.dbuser}:${process.env.dbpassword}@ds015325.mlab.com:15325/${process.env.database}`, {}, error => {
    if(error) console.log(error);
    console.log(`\n===== Connect ${database} to mLab =====\n`)
})
    

//setting server port
server.listen(port, () => console.log(`\n===== API up on port: ${port} =====\n`));