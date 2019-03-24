'use strict';
const log = console.log;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const ObjectId = mongoose.Schema.Types.ObjectId;
const {MongoClient, ObjectID} = require('mongodb');

const ChapterSchema = mongoose.Schema({
    chapterNum:{
        type:Number,
        required:true
    },
    content:{
        type: String,
        required:true
    }
});
const Chapter = mongoose.model("Chapter",ChapterSchema);
const CommentSchema = mongoose.Schema({
    user:{
        type: String,
        required: true
    },
    content: {
        type: String,
        required:true
    }
});
const Comment = mongoose.model("Comment",CommentSchema);


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
    numOfRate:{
        type:Number,
        default:0
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
    chapters:[ChapterSchema],

    //comments module
    comments:[CommentSchema]

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
        Book.find({bookTitle: req.query.bookTitle}).then((book)=> {
            resolve(book)
        },(error)=>{
            reject({code:404,error});
        })
    })

};

BookSchema.statics.findBookByID = (req)=> {
    // Create a new student
    return new Promise((resolve, reject) => {
        Book.findById({bookTitle: req.query.bookTitle}).then((book)=> {
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

BookSchema.statics.updateimage = ((req)=>{

    return new Promise((resolve, reject) => {

        Book.findOneAndUpdate({
            bookTitle:req.query.bookTitle
        }, {
            $set:{
                image: req.body.image
            }

        }, {
            returnOriginal: false // gives us back updated arguemnt
        }).then((result) => {
            resolve(result)
        }, (error) => {
            reject({code:404,error});
        });

    });


});

BookSchema.methods.addChapter = (num,content,book)=>{

    return new Promise((resolve, reject) => {
        // book.chapters.push(chapter);
        // log(book);
        book.update({
                $push:{chapters:{chapterNum:num,
                        content:req.body.content}

                    }
            }
        ).then((result) => {
            resolve(result)
        }, (error) => {
            reject({code:404,error});
        });
    })
};

BookSchema.methods.addComments = (user,content,book)=>{

    return new Promise((resolve, reject) => {
        // book.chapters.push(chapter);
        // log(book);
        book.update({
                $push:{comments:{user:user,
                        content:content}

                }
            }
        ).then((result) => {
            resolve(result)
        }, (error) => {
            reject({code:404,error});
        });
    })
};

BookSchema.methods.newRate = (rate,book)=>{

    return new Promise((resolve, reject) => {
        // book.chapters.push(chapter);
        // log(book);
        const newRate = (book.rate*book.numOfRate+rate)/(book.numOfRate+1);
        book.update({
                $inc:{numOfRate: 1},

                $set:{rate:newRate}
            }
        ).then((result) => {
            resolve(result)
        }, (error) => {
            reject({code:404,error});
        });
    })
};

BookSchema.methods.deleteChapter = (id,chap_id)=>{

    return new Promise((resolve, reject) => {
        // book.chapters.push(chapter);
        // log(book);
        Book.findByIdAndUpdate(id,{
            $pull:{chapters:{
                    id:chap_id}
                }
            }).then((result) => {
            resolve(result)
        }, (error) => {
            reject({code:404,error});
        });
    });
};


const Book = mongoose.model('Book',BookSchema);




const UserSchema = mongoose.Schema({
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
const User = mongoose.model('User',UserSchema);


module.exports = { Book,User, Chapter, Comment};