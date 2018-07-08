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

//move from local middleware to global in order to restrict the route to get all notes.
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

server.use('/api/notes', restricted, notesRoute);
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