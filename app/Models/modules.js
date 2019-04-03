'use strict';
const log = console.log;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const validator = require('validator');
const ObjectId = mongoose.Schema.Types.ObjectId;
const TypeId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
const {MongoClient, ObjectID} = require('mongodb');

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
        default: "./img/default.jpg"
    },
    description: {
        type: String,
        maxlength: 300,
        required: false
    },
    genre: {
        type: String,
        default: 'None'
    },
    //Chapter module
    chapters: [ChapterSchema],

    //comments module
    comments: [CommentSchema]

});

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

BookSchema.statics.findByGenre = (genre) => {
    return new Promise((resolve, reject) => {
        Book.find({genre: genre}).then((book) => {
            resolve(book);
        }, (error) => {
            reject({code: 404, error});
        });
    });


};

BookSchema.statics.fuzzySearch = (name) => {
    return new Promise((resolve, reject) => {
        Book.find({bookTitle: {$regex: name, '$options' : 'i'}}).then((book) => {
            resolve(book);
        }, (error) => {
            reject({code: 404, error});
        });
    });


};

BookSchema.statics.fuzzySearchWithGenre = (name,genre) => {
    // Create a new student
    return new Promise((resolve, reject) => {
        Book.find({bookTitle: {$regex:name, '$options' : 'i'}, genre: genre}).then((book) => {
            resolve(book);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

BookSchema.statics.findByRate = (rate) => {
    return new Promise((resolve, reject) => {
        Book.find({rate: {$gte: rate}}).then((book) => {
            resolve(book);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

BookSchema.statics.findByRateWithGenre = (rate,genre) => {
    // Create a new student
    return new Promise((resolve, reject) => {
        Book.find({rate: {$gte: rate},genre:genre}).then((book) => {
            resolve(book);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

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

BookSchema.statics.findBookByID = (id) => {
    return new Promise((resolve, reject) => {
        Book.findById(id).then((book) => {
            resolve(book);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

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

BookSchema.statics.updateImage = ((req) => {

    return new Promise((resolve, reject) => {

        Book.findOneAndUpdate({
            bookTitle: req.query.bookTitle
        }, {
            $set: {
                image: req.body.image
            }

        }, {
            returnOriginal: false
        }).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });

    });


});

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
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

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

BookSchema.statics.newRate = (rate, book) => {
    return new Promise((resolve, reject) => {
        // book.chapters.push(chapter);
        Book.findByIdAndUpdate(book,{
            $set: {rating: rate},
             $inc: {numOfRate: 1}
        }).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

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

BookSchema.statics.deleteBook = (id) => {
    return new Promise((resolve, reject) => {
        // book.chapters.push(chapter);
        // log(book);
        Book.findByIdAndRemove(id).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

BookSchema.statics.deleteComment = (id,cid) => {
    return new Promise((resolve, reject) => {
        // book.chapters.push(chapter);
        // log(book);
        Book.findByIdAndUpdate(id,{
            $pull: {
                comments:{_id:cid}

            }
        }, { 'new': true }).then((result) => {
            resolve(result);
        },(error) => {
            reject({code:404,error});
        });
    });
};

BookSchema.statics.deleteByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        // book.chapters.push(chapter);
        // log(book);
        Book.deleteMany({
            "user":author
        }, { 'new': true }).then((result) => {
            resolve(result);
        },(error) => {
            reject({code:404,error});
        });
    });
};


const Book = mongoose.model('Book', BookSchema);


const readingHistory = mongoose.Schema({
    book_id:{
        type:ObjectId,
        required:true
    },
    chapter_num:{
        type:Number,
        required:true
    }
});



const UserSchema = mongoose.Schema({
    //13 parameters totally

    //Those 4 parameters are required when a user created
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    password: {
        type: String,
        required: true,
        //minlength: 7
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true, // trim whitespace
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Not valid email'
        }
    },

    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },

    //Other 3 non-list parameters
    token: {
        type: Number,
        default: 0
    },
    followers: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: "../img/avatar.jpg"
    },

    //list parameters
    bookshelf: [readingHistory],
    bookshelfIds: [ObjectId],
    writtenBook: [{type:Schema.Types.ObjectId,ref:'Book'}],
    topThreeBooks: [ObjectId],
    following: [ObjectId],
    newMessage: [ObjectId],
    oldMessage: [ObjectId]
});


//When a new user is created, 4 parameters must be provided: name, password, mail, isAdmin.
//All the other parameter can be accomplished later
UserSchema.statics.addNewUser = (req) => {
	return new Promise((resolve,reject) => {
		const user = new User({
			name: req.body.name,
			password: req.body.password,
			email: req.body.email,
			isAdmin:req.body.isAdmin
		});
        user.save().then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 400, error});
        });

	})
}

UserSchema.statics.fuzzySearch = (name) => {
    return new Promise((resolve, reject) => {
        User.find({name: {$regex: name}}).then((user) => {
            resolve(user);
        }, (error) => {
            reject({code: 404, error});
        });
    });


};


UserSchema.statics.deleteUser = (id) => {

    return new Promise((resolve, reject) => {
        // book.chapters.push(chapter);
        // log(book);
        User.findByIdAndDelete(id).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};


//idk what's this 
UserSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(user.password, salt, null, (error, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }

});

// Our own student finding function 
UserSchema.statics.findByUsernamePassword = function (username, password) {
    const User = this;

    return User.findOne({name: username}).then((user) => {
        if (!user) {
            return Promise.reject();

        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (error, result) => {
                if (result) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

UserSchema.statics.findByName = function (username) {
    const User = this;
    return User.findOne({name: username}).then((user) => {
        if (!user) {
            return Promise.reject();
        }
    });
};

UserSchema.statics.findUserByID = (id) => {
    return new Promise((resolve, reject) => {
        User.findById(id).then((user) => {
            resolve(user);
        }, (error) => {
            reject({code: 404, error});
        });
    });

};

UserSchema.statics.addFollowing = (id, idToFollow) => {
    //after this the user id will follow user idToFollow
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(id, {
            $push: {
                following: {
                    id: idToFollow
                }
            }
        }).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

//This function we be called iff addFollowing is called ↕
UserSchema.statics.beFollowed = (id) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(id, {
            $inc: {followers: 1}

        });
    }).then((result) => {
        resolve(result);
    }, (error) => {
        reject({code: 404, error});
    });
};


UserSchema.statics.removeFollowing = (id, idToNotFollow) => {
    //after this the user id will not follow user idToNotFollow anymore
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(id, {
            $pull: {
                following: {
                    id: idToNotFollow
                }
            }
        }).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};
// This two functions must be used together ↕
UserSchema.statics.beNotFollowed = (id) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(id, {
            $inc: {
                followers: -1
            }
        }).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};


UserSchema.statics.addNewBookToRead = (uid,bid) => {
	return new Promise((resolve,reject) => {
		User.findByIdAndUpdate(uid,{
			$push: {
				bookshelf: {
				    book_id: bid,
                    chapter_num:0
                },
                bookshelfIds: bid
			}
		}).then((result) => {
			resolve(result);
		},(error) => {
			reject({code:404,error});
		});
	});
};


UserSchema.statics.removeBookToRead = (uid,bid) => {
	return new Promise((resolve,reject) => {
		User.findByIdAndUpdate(uid,{
			$pull: {
                bookshelf: bid,
                bookshelfIds: bid
			}
		}).then((result) => {
			resolve(result);
		},(error) => {
			reject({code:404,error});
		});
	});
};


UserSchema.statics.addNewBooksWritten = (uid,bid) => {
	return new Promise((resolve,reject) => {
		User.findByIdAndUpdate(uid,{
			$push: {
				writtenBook:bid
			}
		}).then((result) => {
			resolve(result);
		},(error) => {
			reject({code:404,error});
		});
	});
};


UserSchema.statics.removeBooksWritten = (uid,bid) => {

    return new Promise((resolve,reject) => {
	    // User.findById(uid).then(res=>{
	    //     res.writtenBook.remove(bid);
        //     res.save();
        //     resolve(res);
        // }).catch(error=>
        //     reject(error)
        // );
		User.findByIdAndUpdate(uid,{
			$pull: {
				writtenBook:bid

			}
		}, { 'new': true }).then((result) => {
			resolve(result);
		},(error) => {
			reject({code:404,error});
		});
	});
};

//This function should be called when a book is removed from bookshelf
UserSchema.statics.removeReadingHistory = (sid,bid) =>{
    return new Promise((resolve,reject) => {
        User.findById(uid).then(user=>{
            let history = user.bookshelf.filter((history)=>{history.book_id == bid});
            history.remove();
            user.save().then((result)=> {
                resolve(result);
            },(error) => {
                reject({code:404,error});
            });
        })

    });
};

//This function should be called when a book is added to the shelf of a user
UserSchema.statics.addNewReadingHistory = (sid,bid,chapNum) =>{
    return new Promise((resolve,reject) => {
        User.findByIdAndUpdate(uid, {
            $push: {
                bookshelf:{
                    book_id: bid,
                    chapter_num: chapNum
                },
                bookshelfIds: bid
            }
        }).then((result)=> {
            resolve(result);
        },(error) => {
            reject({code:404,error});
        });
    });
};



//This function should be called every time user going to next chapter
UserSchema.statics.updateReadingHistory = (uid,bid,chapNum) =>{
    return new Promise((resolve,reject) => {
        User.findById(uid).then((user)=>{
            let historyWeWant = user.bookshelf.filter((history)=>{history.book_id == bid});
            if(!historyWeWant){
                reject("not in bookshelf");
            }
            historyWeWant.chapter_num = chapNum;
            user.save().then((result)=> {
                resolve(result);
            },(error) => {
                reject({code:404,error});
            });
        })
    });
};


const User = mongoose.model('User', UserSchema);


module.exports = {Book, User, Chapter, Comment};