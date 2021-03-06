/* server.js - mar 11 -10am*/
'use strict';
const log = console.log;

/* Import statements for the server */
const express = require('express');
const session = require('express-session');
const path = require('path');
const fileUpload = require('express-fileupload');

const app = express();
const bodyParser = require('body-parser'); // middleware for parsing HTTP body
const {ObjectID} = require('mongodb');
const randomProfile = require('random-profile-generator');
const {mongoose} = require('./app/mongoose.js');

const {Book, Chapter, Comment} = require('./app/Models/book.js');
const {User} = require('./app/Models/user.js');

/* Use statements for the server */
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

// Set up a session for recording logged in status
app.use(session({
    secret: 'oursecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000,
        httpOnly: true
    }
}));

// use to redirect to home if already logged in
const sessionChecker = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/index');
    } else {
        res.clearCookie("name");
        res.clearCookie("id");
        res.clearCookie("admin");
        res.clearCookie("newnotifications");
        next();
    }
};

// use to clear the cookie whenever the user is not actually logged in
const cookieClearer = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.clearCookie("name");
        res.clearCookie("id");
        res.clearCookie("admin");
        res.clearCookie("newnotifications");
        next();
    }
};

// use to redirect if a session has not been created
const sessionCheckLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
        res.clearCookie("name");
        res.clearCookie("id");
        res.clearCookie("admin");
        res.clearCookie("newnotifications");
        res.redirect('/login');
    } else {
        next();
    }
};

const sessionHandleRequest = (req, res, next) => {
    if (!req.session.userId) {
        res.clearCookie("name");
        res.clearCookie("id");
        res.clearCookie("admin");
        res.clearCookie("newnotifications");
        res.status(404).send();
    } else {
        next();
    }
};


/* ------------ Begin Routes Helpers ------------ */
app.get('/', (req, res) => {
    res.redirect('/index');
});

// route for login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/HTML/login.html');
    });

app.route('/admin')
    .get(sessionCheckLoggedIn, (req, res) => {
        res.sendFile(__dirname + '/public/HTML/admin.html');
    });

app.get('/index', cookieClearer, (req, res) => {
    // check if we have active session cookie
    res.sendFile(__dirname + '/public/HTML/index.html');
});

app.post('/user/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findByUsernamePassword(username, password).then((user) => {
        if (!user) {
            res.status(404).send();
        } else {
            // Add the user to the session cookie that we will
            // send to the client

            req.session.userId = user._id;
            req.session.isAdmin = user.isAdmin;
            req.session.name = user.name;
            res.cookie("name", user.name);
            res.cookie("id", user._id.toString());
            res.cookie("admin", user.isAdmin);
            res.cookie("newnotifications", user.newMessage.length.toString());
            res.redirect('/index');
        }
    }, (result) => {
        res.status(404).send();
    }).catch((error) => {
        res.status(400).send();
    });
});

app.get('/users/logout', sessionCheckLoggedIn, (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.clearCookie("name");
            res.clearCookie("id");
            res.clearCookie("admin");
            res.clearCookie("newnotifications");
            res.redirect('/index');
        }
    });
});

// route for signup
app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/HTML/signUp.html');
    });


app.post('/user/signup', (req, res) => {
    // Create a new user
    const user = new User({
        name: req.body.username,
        password: req.body.password,
        email: req.body.email,
        isAdmin: false,
        followers: 0,
        image: "/img/avatar.jpg",
        bookshelf: [],
        bookshelfIds: [],
        writtenBook: [],
        following: [],
        newMessage: [],
        oldMessage: []
    });

    // save user to database
    user.save().then((result) => {
        req.session.userId = user._id;
        req.session.email = user.email;
        res.cookie("name", user.name);
        res.cookie("id", user._id.toString());
        res.cookie("admin", user.isAdmin);
        res.redirect('/index');
    }, (error) => {
        res.status(400).send(); // 400 for bad request
    });

});


/************** Routes for books ***********/
app.get('/db/books/:id', (req, res) => {
    const id = req.params.id;
    // Validate the id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // Otherwise, find book by id and send back
    Book.findBookByID(id)
        .then((book) => {
            if (!book) {
                return res.status(404).send();
            } else {
                res.send(book);
            }
        })
        .catch((error) => {
            return res.status(500).send(error);
        });
});


app.get('/books/:id', cookieClearer, (req, res) => {
    const id = req.params.id;
    Book.findBookByID(id)
        .then((book) => {
            if (!book) {
                return res.status(404).send();
            } else {
                const dir = path.join(__dirname + "/public/HTML/");
                res.sendFile(dir + 'book.html');
            }
        })
        .catch((error) => {
            return res.status(500).send(error);
        });
});


app.get('/db/books', (req, res) => {
    Book.find()
        .then((books) => {
            res.send(books);
        })
        .catch(error => {
                return res.status(500).send(error);
            }
        );
});

app.put('/db/fuzzySearch', (req, res) => {
    Book.fuzzySearch(req.body.word)
        .then((books) => {
            res.send(books);
        })
        .catch(error => {
                return res.status(500).send(error);
            }
        );
});

app.put('/db/fuzzySearchwithGenre', (req, res) => {
    Book.fuzzySearchWithGenre(req.body.word, req.body.genre)
        .then((books) => {
            res.send(books);
        })
        .catch(error => {
                return res.status(500).send(error);
            }
        );
});

app.put('/db/bookByGenre', (req, res) => {
    Book.findByGenre(req.body.genre)
        .then((books) => {
            res.send(books);
        })
        .catch(error => {
                return res.status(500).send(error);
            }
        );
});

app.put('/db/bookByRate', (req, res) => {
    Book.findByRate(req.body.rate)
        .then((books) => {
            res.send(books);
        })
        .catch(error => {
                return res.status(500).send(error);
            }
        );
});

app.put('/db/searchUser', (req, res) => {
    User.fuzzySearch(req.body.word)
        .then((books) => {
            res.send(books);
        })
        .catch(error => {
                return res.status(500).send(error);
            }
        );
});

app.put('/db/bookByRateWithGenre', (req, res) => {
    Book.findByRateWithGenre(req.body.rate, req.body.genre)
        .then((books) => {
            res.send(books);
        })
        .catch(error => {
                return res.status(500).send(error);
            }
        );
});

app.get('/search', (req, res) => {
    const dir = path.join(__dirname + "/public/HTML/");
    res.sendFile(dir + 'search.html');
});

app.get('/search/:query', (req, res) => {
    const dir = path.join(__dirname + "/public/HTML/");
    res.sendFile(dir + 'search.html');
});

app.get('/books/:bid/:chapter', (req, res) => {
    const dir = path.join(__dirname + "/public/HTML/");
    res.sendFile(dir + 'readingPage.html');
});

app.post('/db/books', (req, res) => {
    const newBook = new Book({
        "bookTitle": req.body.bookTitle,
        "user": req.body.user,
        "image": req.body.image,
        "description": req.body.description,
        "genre": req.body.genre
    });

    // Check if the inputs are valid
    if (!newBook.bookTitle || !newBook.description) {
        return res.status(400).send();
    }

    newBook.save()
        .then((book) => {
            return User.addNewBooksWritten(req.body.user, book._id);
        }).then((result) => res.send(result))
        .catch(error => {
            return res.status(400).send(error);
        });

});


app.delete('/db/deleteComment', (req, res) => {
    const bid = req.body.book;
    const cid = req.body.comment;
    Book.deleteComment(bid, cid).then((result) => res.send(result))
        .catch(error => {
            return res.status(400).send(error);
        });

});


app.post('/db/booksChapter/:id', (req, res) => {
    // Validate the id
    log("ASDSADSAd");
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Book.addChapter(req.body.chapterTitle, req.body.content, id).then(result => res.send(result));


});
app.post('/db/booksComment/:id', (req, res) => {
    // Validate the id
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Book.addComments(req.body.user, req.body.content, id).then(result => res.send(result));
});

app.patch('/db/updateReadingChapter', (req, res) => {
    // Validate the id
    const user = req.body.user;
    const chapter = req.body.chapter_num;
    const book = req.body.book;

    if (!(user && chapter && book && req.session.userId)) {
        return;
    }

    if (!ObjectID.isValid(user)) {
        return res.status(404).send();
    }

    if (!ObjectID.isValid(book)) {
        return res.status(404).send();
    }
    User.updateReadingChapter(user, chapter, book).then(result => res.send(result)).catch(error => {
        res.status(error.code).send(error.error);
    });
});

app.post('/db/userReadingChapter', (req, res) => {
    // Validate the id
    const user = req.body.user;
    const book = req.body.book;

    if (!ObjectID.isValid(user)) {
        return res.status(404).send();
    }

    if (!ObjectID.isValid(book)) {
        return res.status(404).send();
    }
    User.getReadingChapter(user, book).then(result => {
        res.send(result);
    }).catch(error => {
        res.send([]);
    });
});

app.post('/db/rateBook', (req, res) => {
    Book.newRate(req.body.rate, req.body.book)
        .then((books) => {
            res.send(books);
        })
        .catch(error => {
                return res.status(500).send(error);
            }
        );
});

app.post('/db/BookToRead', (req, res) => {
    // Validate the id
    const id = req.body.user;
    const bid = req.body.book;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    if (!ObjectID.isValid(bid)) {
        return res.status(404).send();
    }
    User.addNewBookToRead(id, bid).then(result => res.send(result)).catch(error => {
        res.status(error.code).send(error.error);
    });
});

app.delete('/db/books/:id', (req, res) => {
    // Validate the id
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Book.deleteBook(id).then(result => {
        User.removeBooksWritten(result.user, result.id);
    }).then(res => {
        log(res);
    }).catch(error => {
        res.status(error.code).send(error.error);
    });
});


app.delete('/db/books/:id/:chapter_id', (req, res) => {
    // Validate the id and reservation id
    const id = req.params.id;
    const chapter_id = req.params.chapter_id;
    if (!ObjectID.isValid(id) || !ObjectID.isValid(chapter_id)) {
        return res.status(404).send();
    }

    // If valid, find the book
    Book.findBookByID(id)
        .then((book) => {
            if (!book) {
                return res.status(404).send();
            } else {
                // Find the queried chapter
                const chap = book.chapters.id(chapter_id);
                if (chap) {
                    book.deleteChapter(book.id, chap.id);
                } else {
                    return res.status(404).send();
                }
            }
        })
        .catch((error) => {
            return res.status(500).send(error);
        });
});

app.patch('/db/books/:id/:chapter_id', (req, res) => {
    // Validate the id and reservation id
    const id = req.params.id;
    const chapter_id = req.params.chapter_id;
    if (!ObjectID.isValid(id) || !ObjectID.isValid(chapter_id)) {
        return res.status(404).send();
    }

    // If valid, find the book
    Book.findBookByID(id)
        .then((book) => {
            if (!book) {
                return res.status(404).send();
            } else {
                // Find the queried chapter
                const chap = book.chapters.id(chapter_id);
                if (chap) {
                    book.updateDescription(req);
                } else {
                    return res.status(404).send();
                }
            }

        })
        .catch((error) => {
            return res.status(500).send(error);
        });

});


/* ------------ Begin Routes for users ------------ */
app.get('/profile/:id', sessionCheckLoggedIn, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    User.findUserByID(id).then((user) => {

        if (!user) {
            res.status(404).send();
        } else {
            const dir = path.join(__dirname + "/public/HTML/");
            res.sendFile(dir + 'profile.html');
        }
    }).catch((error) => {
        res.status(500).send();
    });

});

class userOwner {
    constructor(name, description, id, email, isAdmin, followers, image, bookshelf, writtenBook, following, newMessage, oldMessage) {
        this.name = name;
        this.description = description;
        this.id = id;
        this.email = email;
        this.isAdmin = isAdmin;
        this.followers = followers;
        this.image = image;
        this.bookshelf = bookshelf;
        this.writtenBook = writtenBook;
        this.following = following;
        this.newMessage = newMessage;
        this.oldMessage = oldMessage;
    }
}

class userNonOwner {
    constructor(name, description, id, isAdmin, followers, image, bookshelf, writtenBook, following, isBeingFollowed) {
        this.name = name;
        this.description = description;
        this.id = id;
        this.isAdmin = isAdmin;
        this.followers = followers;
        this.image = image;
        this.bookshelf = bookshelf;
        this.writtenBook = writtenBook;
        this.following = following;
        this.isBeingFollowed = isBeingFollowed;
    }
}

function getFollowersForProfile(user) {
    return new Promise((resolve, reject) => {
        User.find({'_id': {$in: user.following}})
            .then(user => {
                resolve(user);
            }).catch(error => {
            reject({code: 404, error});
        });
    });
}

function getBooksForProfile(bookIdArray) {
    return new Promise((resolve, reject) => {
        Book.find({'_id': {$in: bookIdArray}})
            .then(books => {
                resolve(books);
            }).catch(error => {
            reject({code: 404, error});
        });
    });
}

app.get('/db/profile/:id', sessionHandleRequest, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    User.findById(id).then((user) => {

        if (!user) {
            res.status(404).send();
        } else {
            Promise.all([getBooksForProfile(user.bookshelfIds), getBooksForProfile(user.writtenBook), getFollowersForProfile(user)])
                .then(valueArray => {
                    const bookShelfInfo = [];
                    for (let i = 0; i < valueArray[0].length; i++) {
                        const bookshelfBookObj = {
                            id: valueArray[0][i]._id,
                            image: valueArray[0][i].image,
                            bookTitle: valueArray[0][i].bookTitle
                        };
                        bookShelfInfo.push(bookshelfBookObj);
                    }

                    const writtenBookInfo = [];
                    for (let i = 0; i < valueArray[1].length; i++) {
                        const writtenBookObj = {
                            id: valueArray[1][i]._id,
                            image: valueArray[1][i].image,
                            genre: valueArray[1][i].genre,
                            description: valueArray[1][i].description,
                            bookTitle: valueArray[1][i].bookTitle,
                            chapters: valueArray[1][i].chapters
                        };
                        writtenBookInfo.push(writtenBookObj);
                    }

                    const followingInfo = [];
                    for (let i = 0; i < valueArray[2].length; i++) {
                        const followUserObj = {
                            id: valueArray[2][i]._id,
                            name: valueArray[2][i].name,
                            image: valueArray[2][i].image,
                            writtenCount: valueArray[2][i].writtenBook.length
                        };
                        followingInfo.push(followUserObj);
                    }
                    if (id === req.session.userId.toString() || req.session.isAdmin) {
                        const userToSend = new userOwner(user.name, user.description, user._id, user.email, user.isAdmin,
                            user.followers, user.image, bookShelfInfo, writtenBookInfo,
                            followingInfo, user.newMessage, user.oldMessage);
                        res.send(userToSend);
                    } else {
                        let isBeingFollowed;

                        User.findById(req.session.userId).then((followingUser) => {
                            if (includesCheck(id, followingUser.following)) {
                                isBeingFollowed = true;
                            } else {
                                isBeingFollowed = false;
                            }
                            const userToSend = new userNonOwner(user.name, user.description, user._id, user.isAdmin, user.followers,
                                user.image, bookShelfInfo, writtenBookInfo, followingInfo, isBeingFollowed);
                            res.send(userToSend);
                        }).catch((error) => {
                            log(error);
                            res.status(500).send();
                        });
                    }

                }).catch((error) => {
                res.status(500).send();
            });
            // res.send(user);
        }
    }).catch((error) => {
        res.status(500).send();
    });

});


app.get('/db/users', (req, res) => {
    User.find()
        .then((users) => {
            res.send(users);
        })
        .catch(error => {
                return res.status(500).send(error);
            }
        );
});

app.get('/db/users/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    User.findById(id).then((user) => {
        if (!user) {
            res.status(404).send();
        } else {
            res.send(user);
        }
    }).catch((error) => {
        res.status(500).send();
    });

});

app.delete('/db/users/:id', sessionHandleRequest, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    User.deleteUser(id).then(result => Book.deleteByAuthor(result._id));
});

app.patch('/db/profile/:uid/:fid', sessionHandleRequest, (req, res) => {
    const id = req.params.uid;
    const fid = req.params.fid;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Promise.all([User.removeFollowing(id, fid), User.beNotFollowed(fid)]).then((results) => {
        if (results[0] && results[1]) {
            res.send({resolved: true});
        }
    }).catch((error) => {
        return res.status(500).send(error);
    });
});

app.patch('/db/profile/:id/', sessionHandleRequest, (req, res) => {
    const id = req.params.id;

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const description = req.body.description;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    User.updateProfileInfo(id, name, email, password, description).then((result) => {
        if (result) {
            res.send({resolved: true});
        }
    }).catch((error) => {
        log(error);
        return res.status(500).send(error);
    });

});

app.patch('/db/profile/:id/update/img', sessionHandleRequest, (req, res) => {
    const id = req.params.id;
    const img = req.body.image;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    User.updateProfileImg(id, img).then((result) => {
        if (result) {
            res.send({resolved: true});
        }
    }).catch((error) => {
        log(error);
        return res.status(500).send(error);
    });

});


app.patch('/db/books/:id/update/img', sessionHandleRequest, (req, res) => {
    const id = req.params.id;
    const img = req.body.image;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Book.updateImage(id, img).then((result) => {
        if (result) {
            return res.send({resolved: true});
        }
        req.flash('success', {msg: 'Saved'});
        return res.redirect("/index");
    }).catch((error) => {
        return res.status(500).send(error);
    });

});

app.patch('/db/profile/:id/bookshelf/:bookid', sessionHandleRequest, (req, res) => {
    const id = req.params.id;
    const bookid = req.params.bookid;

    if (!ObjectID.isValid(id) || !ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    User.removeBookToRead(id, bookid).then((result) => {
        if (result) {
            res.send({resolved: true});
        }
    }).catch((error) => {
        log(error);
        return res.status(500).send(error);
    });

});

app.post('/db/profile/:id/createbook', sessionHandleRequest, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    const bookTitle = req.body.bookTitle;
    const genre = req.body.genre;
    const description = req.body.description;
    const user = req.session.userId;

    const newBook = new Book({
        "bookTitle": bookTitle,
        "genre": genre,
        "description": description,
        "user": user
    });

    newBook.save().then((book) => {
        const bid = book._id;
        log(bid);
        User.findByIdAndUpdate(id, {
            $push: {
                writtenBook: bid
            }
        }).then((result) => {
            const writtenBookObj = {
                id: book._id,
                image: book.image,
                genre: book.genre,
                description: book.description,
                bookTitle: book.bookTitle,
                chapters: book.chapters
            };
            res.send(writtenBookObj);
        });
    }).catch((error) => {
        log(error);
        res.status(404).send();
    });
});


app.patch('/db/profile/:id/chapter/:bid/:cid', sessionHandleRequest, (req, res) => {
    // Validate the id and reservation id
    const bid = req.params.bid;
    const cid = req.params.cid;
    if (!ObjectID.isValid(bid) || !ObjectID.isValid(cid)) {
        return res.status(404).send();
    }

    // If valid, find the book
    Book.updateOne({_id: bid, "chapters._id": cid}, {
        $set: {
            "chapters.$.chapterTitle": req.body.chapterTitle,
            "chapters.$.content": req.body.content
        }

    }, {
        returnOriginal: false
    }).then((result) => {
        res.send({resolved: true});
    }).catch((error) => {
        return res.status(500).send(error);
    });

});

app.patch('/db/profile/:id/book/:bid', sessionHandleRequest, (req, res) => {
    // Validate the id and reservation id
    const bid = req.params.bid;
    if (!ObjectID.isValid(bid)) {
        return res.status(404).send();
    }

    // If valid, find the book
    Book.updateOne({_id: bid}, {
        $set: {
            "bookTitle": req.body.bookTitle,
            "genre": req.body.genre,
            "description": req.body.description
        }

    }, {
        returnOriginal: false
    }).then((result) => {
        res.send({resolved: true});
    }).catch((error) => {
        return res.status(500).send(error);
    });

});

app.delete('/db/profile/:id/chapter/:bid/:cid', sessionHandleRequest, (req, res) => {
    // Validate the id and reservation id

    const bid = req.params.bid;
    const cid = req.params.cid;
    if (!ObjectID.isValid(bid) || !ObjectID.isValid(cid)) {
        return res.status(404).send();
    }

    // If valid, find the book
    Book.findBookByID(bid)
        .then((book) => {
            if (!book) {
                res.status(404).send();
            } else {
                // Find the queried chapter
                const chap = book.chapters.id(cid);

                Book.findByIdAndUpdate(bid, {
                    $pull: {
                        chapters: {
                            _id: cid
                        }
                    }
                }).then((result) => {
                    log(result);
                    res.send({resolved: true});
                });
            }
        })
        .catch((error) => {
            log(error);
            res.status(500).send(error);
        });
});

app.post('/db/follow', sessionHandleRequest, (req, res) => {
    const following = req.body.following;
    const beingFollowed = req.body.beingFollowed;

    User.findByIdAndUpdate(following, {
        $push: {
            following: beingFollowed
        }
    }).then((result) => {
        User.findByIdAndUpdate(beingFollowed, {
            $inc: {followers: 1}
        }).then((result) => {
            log(result);
            res.send({resolved: true});
        });
    }).catch(error => {
        log(error);
        res.status(500).send(error);
    });
});

function includesCheck(id, list) {
    for (let i = 0; i < list.length; i++) {
        if (id === list[i].toString()) {
            return true;
        }
    }
    return false;
}


async function addToNotificationList(userId, messageString, type, reference) {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(userId, {
            $push: {
                newMessage: {
                    "messageString": messageString,
                    "type": type,
                    "reference": reference
                }
            }
        }).then((user) => {
            log("resolve(user)");
            resolve(user);
        }).catch(error => {
            log("reject({code: 404, error});");
            reject({code: 404, error});
        });
    });
}

async function promiseLoop(users, bookId, bookTitle) {
    const promises = [];
    for (let i = 0; i < users.length; i++) {
        if (users[i].bookshelfIds) {
            if (includesCheck(bookId, users[i].bookshelfIds)) {
                const messageString = "New Chapter for " + bookTitle;
                const type = "book";
                const reference = "/books/" + bookId.toString();
                const promise = await addToNotificationList(users[i]._id, messageString, type, reference);
                promises.push(promise);
            }
        }

    }
    return new Promise((resolve, reject) => {
        if (promises.length > 0) {
            resolve(promises);
        } else {
            reject();
        }
    });
}

app.post('/db/profile/:id/booksChapter/:bid', sessionHandleRequest, (req, res) => {
    // Validate the id
    const bid = req.params.bid;
    if (!ObjectID.isValid(bid)) {
        return res.status(404).send();
    }
    Book.addChapter(req.body.chapterTitle, req.body.content, bid)
        .then((result) => {
            // const bookId = req.body.bookId;
            // const bookTitle = req.body.bookTitle;

            User.find({}).then((users) => {
                promiseLoop(users, bid, req.body.bookTitle).then((promises) => {
                    Promise.all(promises).then((results) => {
                        log("updated notifications");
                        res.send(result);
                    }, (rej) => {
                        log("no notification updates");
                        res.send(result);
                    });
                }, (rejerr) => {
                    res.send(result);
                });
            }).catch((error) => {
                log(error);
                res.send(result);
            });

        }).catch((error) => {
        log(error);
        res.status(500).send();
    });


});

app.get("/testing", (req, res) => {
    const bookId = req.body.bookId;
    const bookTitle = req.body.bookTitle;
    const authName = req.body.authName;
    const autherId = req.body.bookId;


    User.find({}).then((users) => {

        promiseLoop(users, bookId, bookTitle, authName).then((promises) => {
            Promise.all(promises).then((results) => {
                res.send("added some");
            }, (rej) => {
                res.send("added none");
            });
        });
    });
});


app.post('/db/unfollow', sessionHandleRequest, (req, res) => {
    const following = req.body.following;
    const beingFollowed = req.body.beingFollowed;

    User.findByIdAndUpdate(following, {
        $pull: {
            following: beingFollowed
        }
    }).then((result) => {
        User.findByIdAndUpdate(beingFollowed, {
            $inc: {followers: -1}
        }).then((result) => {
            res.send({resolved: true});
        });
    }).catch(error => {
        res.status(500).send(error);
    });
});

app.delete('/db/profile/:uid/written/:bid/', sessionHandleRequest, (req, res) => {
    // Validate the id and reservation id
    const uid = req.params.uid;
    const bid = req.params.bid;

    if (!ObjectID.isValid(uid) || !ObjectID.isValid(bid)) {
        return res.status(404).send();
    }
    User.findByIdAndUpdate(uid, {
        $pull: {
            writtenBook: bid
        }
    }).then((result) => {
        Book.findByIdAndRemove(bid).then((result) => {
            res.send({resolved: true});
        });
    }).catch((error) => {
        log(error);
        return res.status(500).send(error);
    });
});

app.delete('/db/profile/:id/newMessages', sessionHandleRequest, (req, res) => {
    // Validate the id and reservation id
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    User.findByIdAndUpdate(id, {
        $set: {
            newMessage: []
        }
    }).then((result) => {
        res.cookie("newnotifications", "0");
        res.send({resolved: true});
    }).catch((error) => {
        log(error);
        return res.status(500).send(error);
    });
});



//get all the chapter from the book
app.get('/db/reading/:bid/', (req, res) => {
    const bid = req.params.bid;
    if (!ObjectID.isValid(bid)) {
        return res.status(404).send();
    }
    Book.findById(bid).then((book) => {
            if (!book) {
                res.status(404).send();
            } else {
                res.send(book.chapters);
            }
        }
    );
});

app.post('/upload/:id', function (req, res) {
    const id = req.params.id;
    const image = req.files.img;
    // Use the mv() method to place the file on the server
    image.mv('public/img/' + id + ".jpg", function (err) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("back");
        }
    });
});

app.get('/db/randomavatar/', (req, res) => {
    const avatar = randomProfile.avatar();

    if (!avatar) {
        res.status(404).send();
    } else {
        res.send({avatar: String(avatar)});
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    log('Listening on port 3000...');
});  // common local host development port 3000
// we've bound that port to localhost to go to our express server
// Must restart web server whenyou make changes to route handlers

