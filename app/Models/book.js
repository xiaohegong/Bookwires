'use strict';
const log = console.log;
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;
const {MongoClient, ObjectID} = require('mongodb');

/****** Define the chapter schema ******/
const ChapterSchema = mongoose.Schema({
    chapterTitle: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});
const Chapter = mongoose.model("Chapter", ChapterSchema);

/****** Define the comment schema ******/
const CommentSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});
const Comment = mongoose.model("Comment", CommentSchema);

/****** Define the book schema ******/
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
    numOfRate: {
        type: Number,
        default: 0
    },
    user: {
        // User module
        type: ObjectId
    },
    image: {
        type: String,
        default: "/img/default.jpg"
    },
    description: {
        type: String,
        maxlength: 300,
        required: false
    },
    genre: {
        type: {
            String,
            enum: ['Science Fiction', 'Mysteries', 'Fantasy', 'Horror', 'Romance', 'Historical', 'Suspense']
        },
        default: "Fantasy"
    },
    //Chapter module
    chapters: [ChapterSchema],

    //comments module
    comments: [CommentSchema]

});

// Static function to add books to the database
BookSchema.statics.addBook = (req) => {
    return new Promise((resolve, reject) => {
        const book = new Book({
            bookTitle: req.body.bookTitle,
            image: req.body.image
        });
        // Save student to the database
        book.save().then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 400, error});
        });
    });
};

// Static function find books by genre in the database
BookSchema.statics.findByGenre = (genre) => {
    return new Promise((resolve, reject) => {
        Book.find({genre: genre}).then((book) => {
            resolve(book);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// A search function implemented for searching book that is case-insensitive
BookSchema.statics.fuzzySearch = (name) => {
    return new Promise((resolve, reject) => {
        Book.find({bookTitle: {$regex: name, '$options': 'i'}}).then((book) => {
            resolve(book);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// A search function implemented for searching book but with given genre that is case-insensitive
BookSchema.statics.fuzzySearchWithGenre = (name, genre) => {
    // Create a new student
    return new Promise((resolve, reject) => {
        Book.find({bookTitle: {$regex: name, '$options': 'i'}, genre: genre}).then((book) => {
            resolve(book);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// A static function that finds book having rate thats greater than the rate given
BookSchema.statics.findByRate = (rate) => {
    return new Promise((resolve, reject) => {
        Book.find({rating: {$gte: rate}}).then((book) => {
            resolve(book);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// A static function that finds book having rate thats greater than the rate given with specified genre
BookSchema.statics.findByRateWithGenre = (rate, genre) => {
    // Create a new student
    return new Promise((resolve, reject) => {
        Book.find({rating: {$gte: rate}, genre: genre}).then((book) => {
            resolve(book);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// A static function that finds books by title and return it
BookSchema.statics.findBook = (bookTitle) => {
    return new Promise((resolve, reject) => {
        Book.find({bookTitle}).then((book) => {
            if (book.length === 0) {
                reject({code: 404, error: "can't find book"});
            } else {
                resolve(book);
            }
        }, (error) => {
            reject({code: 500, error});
        });
    });
};

// A static function that finds book by id and return it
BookSchema.statics.findBookByID = (id) => {
    return new Promise((resolve, reject) => {
        Book.findById(id).then((book) => {
            resolve(book);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// A static function that update the description of the book
BookSchema.statics.updateDescription = (req) => {
    return new Promise((resolve, reject) => {
        Book.findOneAndUpdate({
            bookTitle: req.query.bookTitle
        }, {
            $set: {
                description: req.body.description
            }

        }, {
            returnOriginal: false
        }).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// A static function that update the image of the book
BookSchema.statics.updateImage = ((id, img) => {
    return new Promise((resolve, reject) => {
        Book.findByIdAndUpdate(id, {
            image: img
        }).then((result) => {
            resolve(result);
        }).catch((error) => {
            return reject({code: 500, error});
        });
    });
});

// A static function that add a chapter to the book from the given title, content and id
BookSchema.statics.addChapter = (title, content, id) => {

    return new Promise((resolve, reject) => {
        // book.chapters.push(chapter);
        // log(book);
        Book.findOneAndUpdate({_id: id}, {
                $push: {
                    chapters: {
                        chapterTitle: title,
                        content: content
                    }

                }
            }
        ).then((result) => {
            Book.findById(id).then((book) => {
                resolve(book.chapters[book.chapters.length - 1]);
            });
        }, (error) => {
            reject({code: 404, error});
        });
    }).catch((error) => {
        reject({code: 500, error});
    });
};

// A static function to add comments for the given book with the given comment content by user
BookSchema.statics.addComments = (user, content, id) => {

    return new Promise((resolve, reject) => {
        // book.chapters.push(chapter);
        // log(book);
        Book.findOneAndUpdate({_id: id}, {
                $push: {
                    comments: {
                        user: user,
                        content: content
                    }
                }
            }
        ).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// A static function to update the rate of the given book
BookSchema.statics.newRate = (rate, book) => {
    return new Promise((resolve, reject) => {

        Book.findByIdAndUpdate(book, {
            $set: {rating: rate},
            $inc: {numOfRate: 1}
        }).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// A static function to delete the chapter with given chap_id in the given book
BookSchema.statics.deleteChapter = (id, chap_id) => {

    return new Promise((resolve, reject) => {
        // book.chapters.push(chapter);
        // log(book);
        Book.findByIdAndUpdate(id, {
            $pull: {
                chapters: {
                    id: chap_id
                }
            }
        }).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// A static function to delete the given book
BookSchema.statics.deleteBook = (id) => {
    return new Promise((resolve, reject) => {

        Book.findByIdAndRemove(id).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// A static function to delete comment with given cid
BookSchema.statics.deleteComment = (id, cid) => {
    return new Promise((resolve, reject) => {
        // book.chapters.push(chapter);
        // log(book);
        Book.findByIdAndUpdate(id, {
            $pull: {
                comments: {_id: cid}

            }
        }, {'new': true}).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// A static function to delete a book by the given author
BookSchema.statics.deleteByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        // book.chapters.push(chapter);
        // log(book);
        Book.deleteMany({
            "user": author
        }, {'new': true}).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

const Book = mongoose.model('Book', BookSchema);


module.exports = {Book, Chapter, Comment};
