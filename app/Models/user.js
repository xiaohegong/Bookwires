const log = console.log;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const ObjectId = mongoose.Schema.Types.ObjectId;
const TypeId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
const {MongoClient, ObjectID} = require('mongodb');


/****** The reading history schema *******/
const readingHistory = mongoose.Schema({
    book_id: {
        type: ObjectId,
        required: true
    },
    chapter_num: {
        type: Number,
        required: true
    }
});



/****** The notificaiton message schema *******/
const message = mongoose.Schema({
    messageString: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        required: true
    }
});






/****** The user schema *******/
const UserSchema = mongoose.Schema({
    //13 parameters totally

    //Those 4 parameters are required when a user created
    name: {
        type: String,
        required: true,
        minlength: 3,
        unique: true
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    password: {
        type: String,
        required: true,
        minlength: 4
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
    followers: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: "/img/avatar.jpg"
    },

    //list parameters
    bookshelf: [readingHistory],
    bookshelfIds: [ObjectId],
    writtenBook: [{type: Schema.Types.ObjectId, ref: 'Book'}],
    following: [ObjectId],
    newMessage: [message],
    oldMessage: [message]
});

// Enforce unique user names
UserSchema.plugin(uniqueValidator);

//When a new user is created, 4 parameters must be provided: name, password, mail, isAdmin.
//All the other parameter can be accomplished later
UserSchema.statics.addNewUser = (req) => {
    return new Promise((resolve, reject) => {
        const user = new User({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            isAdmin: req.body.isAdmin
        });
        user.save().then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 400, error});
        });

    });
};

// A search function implemented for user with given name
UserSchema.statics.fuzzySearch = (name) => {
    return new Promise((resolve, reject) => {
        User.find({name: {$regex: name}}).then((user) => {
            resolve(user);
        }, (error) => {
            reject({code: 404, error});
        });
    });

};


// A function used to delete user form the database
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


// Encrypt and hash the password before saving into the database fo teh given user
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

// Find the user by the given id and return the user object
UserSchema.statics.findUserByID = (id) => {
    return new Promise((resolve, reject) => {
        User.findById(id).then((user) => {
            resolve(user);
        }, (error) => {
            reject({code: 404, error});
        });
    });

};

// Update the given user's reading history with the given chapter number
UserSchema.statics.updateReadingChapter = (user, chapter, book) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(user, {
            $set: {
                "bookshelf.$[elem].chapter_num": chapter
            }
        }, {
            arrayFilters: [{"elem.book_id": book}]
        }).then((user) => {
            resolve(user);
        }).catch(error => {
            reject({code: 404, error});
        });
    });

};

// get the reading history of the given book for the user
UserSchema.statics.getReadingChapter = (user, book) => {
    return new Promise((resolve, reject) => {
        User.findOne({_id: user, "bookshelf.book_id": book}, {
            'bookshelf.$': 1
        }).then((user) => {
            resolve(user.bookshelf[0]);
        }).catch(error => {
            reject({code: 404, error});
        });
    });
};

// Follow the given idTofollow
UserSchema.statics.addFollowing = (id, idToFollow) => {
    //after this the user id will follow user idToFollow
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(id, {
            $push: {
                following: idToFollow
            }
        }).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// This function we be called iff addFollowing is called ↕
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

// Static function that stops the given id  a user
UserSchema.statics.removeFollowing = (id, idToNotFollow,) => {
    //after this the user id will not follow user idToNotFollow anymore
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(id, {
            $pull: {
                following: idToNotFollow

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

// A static function that add the given book with bid from the user's bookshelf with uid
UserSchema.statics.addNewBookToRead = (uid, bid) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(uid, {
            $push: {
                bookshelf: {
                    book_id: bid,
                    chapter_num: 0
                },
                bookshelfIds: bid
            }
        }).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// A static function that remove the given book with bid from the user's bookshelf with uid
UserSchema.statics.removeBookToRead = (uid, bid) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(uid, {
            $pull: {
                bookshelfIds: bid
            }
        }).then((result) => {
            User.findByIdAndUpdate(uid, {
                $pull: {
                    "bookshelf": {book_id: bid}
                }
            }).then((result) => {
                resolve(result);
            });
        }).catch((error) => {
            reject({code: 404, error});
        });
    });
};

// A static function that add a new book bid thats written by given uid
UserSchema.statics.addNewBooksWritten = (uid, bid) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(uid, {
            $push: {
                writtenBook: bid
            }
        }).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// A static method that removes the book with bid written by the given author with uid
UserSchema.statics.removeBooksWritten = (uid, bid) => {

    return new Promise((resolve, reject) => {
        // User.findById(uid).then(res=>{
        //     res.writtenBook.remove(bid);
        //     res.save();
        //     resolve(res);
        // }).catch(error=>
        //     reject(error)
        // );
        User.findByIdAndUpdate(uid, {
            $pull: {
                writtenBook: bid

            }
        }, {'new': true}).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

// This function should be called when a book is removed from bookshelf
UserSchema.statics.removeReadingHistory = (sid, bid) => {
    return new Promise((resolve, reject) => {
        User.findById(uid).then(user => {
            let history = user.bookshelf.filter((history) => {
                history.book_id == bid;
            });
            history.remove();
            user.save().then((result) => {
                resolve(result);
            }, (error) => {
                reject({code: 404, error});
            });
        });

    });
};

// This function should be called when a book is added to the shelf of a user
UserSchema.statics.addNewReadingHistory = (sid, bid, chapNum) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(uid, {
            $push: {
                bookshelf: {
                    book_id: bid,
                    chapter_num: chapNum
                },
                bookshelfIds: bid
            }
        }).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};


// This function should be called every time user going to next chapter
UserSchema.statics.updateReadingHistory = (uid, bid, chapNum) => {
    return new Promise((resolve, reject) => {
        User.findById(uid).then((user) => {
            let historyWeWant = user.bookshelf.filter((history) => {
                history.book_id == bid;
            });
            if (!historyWeWant) {
                reject("not in bookshelf");
            }
            historyWeWant.chapter_num = chapNum;
            user.save().then((result) => {
                resolve(result);
            }, (error) => {
                reject({code: 404, error});
            });
        });
    });
};

// A static function that updates the given user's profile information
UserSchema.statics.updateProfileInfo = (id, name, email, password, description) => {
    return new Promise((resolve, reject) => {
        if (!validator.isEmail(email) || (password !== '' && password.length < 6)) {
            reject({code: 404, error});
            return;
        }

        var salt = bcrypt.genSaltSync(10);
        const hashpass = bcrypt.hashSync(password, salt);
        if (password === '') {
            User.findByIdAndUpdate(id, {
                $set: {
                    name: name,
                    email: email,
                    description: description
                }
            }).then((result) => {
                resolve(result);
            }, (error) => {
                reject({code: 404, error});
            });
        } else {
            User.findByIdAndUpdate(id, {
                $set: {
                    name: name,
                    email: email,
                    password: hashpass,
                    description: description
                }
            }).then((result) => {
                resolve(result);
            }, (error) => {
                reject({code: 404, error});
            });
        }
    });
};

// A static function to update the user with given id with the given image
UserSchema.statics.updateProfileImg = (id, img) => {

    return new Promise((resolve, reject) => {

        User.findByIdAndUpdate(id, {

            image: img

        }).then((result) => {
            resolve(result);
        }, (error) => {
            reject({code: 404, error});
        });
    });
};

const User = mongoose.model('User', UserSchema);


module.exports = {User};