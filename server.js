/* server.js - mar 11 -10am*/
'use strict';
const log = console.log;

const express = require('express');
const path = require('path');

const app = express();
const bodyParser = require('body-parser'); // middleware for parsing HTTP body
const {ObjectID} = require('mongodb');

const {mongoose} = require('./app/mongoose.js');
const {Book, User, Chapter, Comment} = require('./app/Models/modules.js');
app.use(express.static("public"));
app.use(bodyParser.json());


// Setting up a static directory for your html files
// using Express middleware
// app.use('/',express.static(path.join(__dirname, '../CSS')));
app.use(express.static('/team26'));
app.get('/', (req, res) => {
    const dir = path.join(__dirname + "/public/HTML/");
    res.sendFile(dir + 'index.html');

    // res.sendFile('../HTML/index.html', {root: __dirname })
});

// Set up a POST route to *create* a student
app.post('/book', (req, res) => {
    Book.addBook(req).then((result) => {
        log(result);
        res.send(result);
    })
        .catch((rej) => {
            res.status(rej.code).send(rej.error);
        });
});

app.post('/find', (req, res) => {
    Book.findBook(req).then((result) => {
        res.send(result);
        return result;
    }).then(
        (result) => {
            log(result[0].image);
            result[0].addChapter(req, result[0]);
        }
    )
        .catch((rej) => {
            res.status(rej.code).send(rej.error);
        });
});

app.patch('/updateDesription', (req, res) => {
    Book.updateDesription(req).then((result) => {
        log(result);
        res.send(result);
    })
        .catch((rej) => {
            res.status(rej.code).send(rej.error);
        });
});


// app.post('/newChapter',(req,res)=>{
//    Chapter.
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    log('Listening on port 3000...');
});  // common local host development port 3000
// we've bound that port to localhost to go to our express server
// Must restart web server whenyou make changes to route handlers

