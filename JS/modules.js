'use strict';
const log = console.log;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const ObjectId = mongoose.Schema.Types.ObjectId;
const {MongoClient, ObjectID} = require('mongodb');

const BookSchema = mongoose.Schema({
    bookTitle: {
        type: String,
        required: true,
        minlength: 3
    },
    rating: {
        type: Number,
        default: 0
    },

    user: {
        // User module
        type: ObjectId
    },
    image:{
        type: String,
        required:true
    },
    description:{
        type:String,
        maxlength: 300,
        required:false
    },
    //Chapter module
    chapters:[ObjectId],

    //comments module
    comments:[ObjectId]

});

BookSchema.statics.addBook = ((book)=> {
        MongoClient.connect('mongodb://localhost:27017/StudentAPI', (error, client) => {
            if (error) {
                log("Can't connect to Mongo server")
            } else {
                log('Connected to mongo server')
            }

            const db = client.db('books');

            // Create a collection and insert into it
            db.collection('books').insertOne({
                //_id: 7,
                bookTitle: 'Jimmy',
                image: "3"
            }, (error, result) => {
                if (error) {
                    log("Can't insert book", error)
                } else {
                    log(result.ops)
                    // log(result.ops[0]._id.getTimestamp())
                }
            });

            // close connection
            client.close()


        })
    }
);

const Book = mongoose.model('Book',BookSchema);
const User = mongoose.model("User",{
    name:{
        type:String,
        required:true,
        minlength: 3
    },
    //Book module
    bookshelf:[ObjectId],
    writtenBook:[ObjectId],
    followers:{
        type: Number,
        default: 0
    },
    image:{
        type: String,
        required:true
    },
    //User module
    following:[ObjectId]

    });
const Chapter = mongoose.model("Chapter",{
   chapterNum:{
       type:Number,
       required:true,
   },
   content:{
       content: String
   }
});
const Comment = mongoose.model("Comment",{
   user:{
       type: String,
       required: true
   },
    content: {
       type: String,
        required:true
    }
});
module.exports = { Book,User, Chapter, Comment};