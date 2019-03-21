/* server.js - mar 11 -10am*/
'use strict';
const log = console.log;

const express = require('express');
const path = require('path');

const app = express();
const bodyParser = require('body-parser'); // middleware for parsing HTTP body
const { ObjectID } = require('mongodb');

const { mongoose } = require('./mongoose.js');
const { Book,User,Chapter,Comment } = require('./modules.js');
app.use(bodyParser.json());



// Setting up a static directory for your html files
// using Express middleware
app.use('/',express.static(path.join(__dirname, '../CSS')));
app.get('/', (req, res) => {

    res.sendFile('index.html', {root: path.join(__dirname, '../HTML') });

    // res.sendFile('../HTML/index.html', {root: __dirname })
});

// Set up a POST route to *create* a student
app.post('/book', (req, res) => {
    log(req.body);
    // Create a new student
    const book = new Book({
        bookTitle: req.body.bookTitle,
        image: req.body.image
    });
    Book.addBook();

    // Save student to the database
    book.save().then((result) => {
        res.send(result)
    }, (error) => {
        res.status(400).send(error) // 400 for bad request
    })

});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    log('Listening on port 3000...')
});  // common local host development port 3000
// we've bound that port to localhost to go to our express server
// Must restart web server whenyou make changes to route handlers

