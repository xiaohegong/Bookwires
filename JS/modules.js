
const mongoose = require('mongoose');

const Book = mongoose.model('Book', {
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
        type: Number
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
    chapters:['Chapter'],

    comments:['Comment']

});
const User = mongoose.model("User",{
    name:{
        type:String,
        required:true,
        minlength: 3
    },
    bookshelf:[Number],
    writtenBook:[Number],
    followers:{
        type: Number,
        default: 0
    },
    image:{
        type: String,
        required:true
    },
    following:[String]

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