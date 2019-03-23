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
    genre:{
      type:String,
      required:false
    },
    //Chapter module
    chapters:[ObjectId],

    //comments module
    comments:[ObjectId]

});

BookSchema.statics.addBook = (req)=> {
    // Create a new student
    return new Promise((resolve, reject) => {
        const book = new Book({
            bookTitle: req.body.bookTitle,
            image: req.body.image
        });
        // Save student to the database
        book.save().then((result) => {
            resolve(result)
        }, (error) => {
            reject({code:400,error});
        })
    })


};

BookSchema.statics.findBook = (req)=> {
    // Create a new student
    return new Promise((resolve, reject) => {
        Book.find({bookTitle: req.body.bookTitle}).then((book)=> {
            resolve(book)
        },(error)=>{
            reject({code:404,error});
        })
    })

};
BookSchema.statics.updateDesription = (req)=>{
    return new Promise((resolve, reject) => {

        Book.findOneAndUpdate({
            bookTitle:req.query.bookTitle
        }, {
            $set:{
                description: req.body.description
            }

        }, {
            returnOriginal: false // gives us back updated arguemnt
        }).then((result) => {
            resolve(result)
        }, (error) => {
            reject({code:404,error});
        });

    });

};

BookSchema.statics.updateimage = ((req,res)=>{

    Book.findOneAndUpdate({
        bookTitle:req.query.bookTitle
    }, {
        $set:{
            image: req.body.image
        }

    }, {
        returnOriginal: false // gives us back updated arguemnt
    }).then((result) => {
        res.send(result)
    }, (error) => {
        res.status(404).send(error) // 400 for bad request
    });

});

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