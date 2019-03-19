/* server.js - mar 11 -10am*/
'use strict';
const log = console.log;

const express = require('express');
const path = require('path');

const app = express();

// Setting up a static directory for your html files
// using Express middleware
app.use('/',express.static(path.join(__dirname, '../CSS')));
app.get('/', (req, res) => {
    // res.sendFile(path.resolve(__dirname+'../HTML/index.html'));
    // log(path.resolve(_'/index.html'));
    res.sendFile('index.html', {root: path.join(__dirname, '../HTML') });

    // res.sendFile('../HTML/index.html', {root: __dirname })
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
    log('Listening on port 3000...')
});  // common local host development port 3000
// we've bound that port to localhost to go to our express server
// Must restart web server whenyou make changes to route handlers

