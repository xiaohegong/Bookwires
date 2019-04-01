'use strict';
const log = console.log;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const validator = require('validator');
const ObjectId = mongoose.Schema.Types.ObjectId;
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

    // user: {
    //     // User module
    //     type: ObjectId
    // },
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
        Book.find({bookTitle: {$regex: name}}).then((book) => {
            resolve(book);
        }, (error) => {
            reject({code: 404, error});
        });
    });


};

BookSchema.statics.fuzzySearchWithGenre = (name,genre) => {
    // Create a new student
    return new Promise((resolve, reject) => {
        Book.find({bookTitle: {$regex:name},genre:genre}).then((book) => {
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

BookSchema.statics.findByRate = (rate,genre) => {
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

BookSchema.methods.newRate = (rate, book) => {

    return new Promise((resolve, reject) => {
        // book.chapters.push(chapter);
        // log(book);
        const newRate = (book.rate * book.numOfRate + rate) / (book.numOfRate + 1);
        book.update({
                $inc: {numOfRate: 1},

                $set: {rate: newRate}
            }
        ).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

BookSchema.methods.deleteChapter = (id, chap_id) => {

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


const Book = mongoose.model('Book', BookSchema);


const UserSchema = mongoose.Schema({
    //13 parameters totally

    //Those 4 parameters are required when a user created
    name: {
        type: String,
        required: true,
        minlength: 3
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
        required: true
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
    bookshelf: [ObjectId],
    writtenBook: [ObjectId],
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
				bookshelf:{
					id:bid
				}
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
				bookshelf:{
					id:bid
				}
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
				writtenBook:{
					id:bid
				}
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
		User.findByIdAndUpdate(uid,{
			$pull: {
				writtenBook:{
					id:bid
				}
			}
		}).then((result) => {
			resolve(result);
		},(error) => {
			reject({code:404,error});
		});
	});
};


UserSchema.statics.addNewUser = (req) => {
    return new Promise((resolve, reject) => {
        const newUser = new User({
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


const User = mongoose.model('User', UserSchema);


module.exports = {Book, User, Chapter, Comment};