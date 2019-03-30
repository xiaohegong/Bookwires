// 'use strict'
// const log = console.log
//
// const {MongoClient, ObjectID} = require('mongodb');
//
// // Fetching Student documents
//
// const connectdb = MongoClient.connect('mongodb://localhost:27017/books', (error, client) => {
//     if (error) {
//         log("Can't connect to mongo server");
//     } else {
//         console.log('Connected to mongo server')
//     }
//
//     const db = client.db('books');
//     return db,client;
//     /// A 'select all' query to get all the documents
//     // toArray(): promise based function that gives the documents
//
// });