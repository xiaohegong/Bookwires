/* server.js - mar 11 -10am*/
'use strict';
const log = console.log;

const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const bodyParser = require('body-parser'); // middleware for parsing HTTP body
const {ObjectID} = require('mongodb');

const {mongoose} = require('./app/mongoose.js');
const {Book, User, Chapter, Comment} = require('./app/Models/modules.js');
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }))





app.use(session({
	secret: 'oursecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000,
		httpOnly: true
	}
}))

// use to redirect to home if already logged in
const sessionChecker = (req, res, next) => {
	if (req.session.userId) {
		res.redirect('/index')
	} else {
        res.clearCookie("name")
        res.clearCookie("id")
        res.clearCookie("admin")
		next();
	}
}

// use to redirect if a session has not been created
const sessionCheckLoggedIn = (req, res, next) => {
	if (!req.session.userId) {
        res.clearCookie("name")
        res.clearCookie("id")
        res.clearCookie("admin")
		res.redirect('/login')
	} else {
		next();
	}
}


/* ------------ Begin Routes Helpers ------------ */
app.get('/', (req, res) => {
    res.redirect('/index')
    // res.sendFile('../HTML/index.html', {root: __dirname })
});

// route for login
app.route('/login')
	.get(sessionChecker, (req, res) => {
		res.sendFile(__dirname + '/public/HTML/login.html')
})

app.route('/admin')
    .get(sessionCheckLoggedIn, (req, res) => {
        res.sendFile(__dirname + '/public/HTML/admin.html')
    });

app.get('/index', (req, res) => {
    // check if we have active session cookie
    res.sendFile(__dirname + '/public/HTML/index.html');
	// if (req.session.userId) {
	// 	res.sendFile(__dirname + '/public/HTML/index.html')
	// } else {
	// 	res.redirect('/login')
	// }
})

app.post('/user/login', (req, res) => {
	const username = req.body.username
	const password = req.body.password

	User.findByUsernamePassword(username, password).then((user) => {
		if(!user) {
            // TODO SEND "invalid username/password error"
			res.status(404).send()
		} else {
			// Add the user to the session cookie that we will
            // send to the client
            
			req.session.userId = user._id;
            req.session.name = user.name
            res.cookie("name", user.name)
            res.cookie("id", user._id)
            res.cookie("admin", user.isAdmin)
			res.redirect('/index')
		}
	},(result) => {
        res.status(404).send()
    }).catch((error) => {
        // TODO SEND "invalid request error"
		res.status(400).send()
	})
})

app.get('/users/logout', sessionCheckLoggedIn, (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
            res.clearCookie("name")
            res.clearCookie("id")
            res.clearCookie("admin")
			res.redirect('/index')
		}
	})
})

// route for signup
app.route('/signup')
	.get(sessionChecker, (req, res) => {
		res.sendFile(__dirname + '/public/HTML/signUp.html')
})


app.post('/user/signup', (req, res) => {
	// Create a new user
	const user = new User({
        name: req.body.username,
        password: req.body.password,
        email: req.body.email,
        isAdmin: false,
        token: 0,
        followers: 0,
        image: "/img/avatar.jpg",
        bookshelf: [],
        bookshelfIds: [],
        writtenBook: [],
        topThreeBooks: [],
        following: [],
        newMessage: [],
        oldMessage: []
    })
    
    req.session.userId = user._id;
	req.session.email = user.email

	// save user to database
	user.save().then((result) => {
        //TODO possible validation
        res.send(user)
        // res.redirect("/index");        
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})

})





















/* Routes for books */
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



app.get('/books/:id', (req, res) => {
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
    Book.fuzzySearchWithGenre(req.body.word,req.body.genre)
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
    Book.findByRateWithGenre(req.body.rate,req.body.genre)
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
        // "rating": req.body.rating,
        // "numOfRate": req.body.numOfRate,
         "user": req.body.user,
        "image": req.body.image,
        "description": req.body.description,
        "genre": req.body.genre
    });

    // Check if the inputs are valid
    // if (!newBook.bookTitle || !newBook.rating || !newBook.numOfRate || !newBook.user || !newBook.description) {
    //     return res.status(400).send();
    // }
    if (!newBook.bookTitle || !newBook.description) {
        return res.status(400).send();
    }

    newBook.save()
        .then((book) => {
            return User.addNewBooksWritten(req.body.user,book._id)
        }).then((result)=>res.send(result))
        .catch(error => {
            return res.status(400).send(error);
        });

});



app.delete('/db/deleteComment', (req, res) => {
    const bid = req.body.book;
    const cid = req.body.comment;
    Book.deleteComment(bid,cid).then((result)=>res.send(result))
        .catch(error => {
            return res.status(400).send(error);
        });

});



app.post('/db/booksChapter/:id', (req, res) => {
    // Validate the id
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Book.addChapter(req.body.chapterTitle, req.body.content, id).then(result=>res.send(result));


});
app.post('/db/booksComment/:id', (req, res) => {
    // Validate the id
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Book.addComments(req.body.user, req.body.content, id).then(result => res.send(result));
});
app.post('/db/rateBook', (req, res) => {
    Book.newRate(req.body.rate,req.body.book)
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
    User.addNewBookToRead(id,bid).then(result => res.send(result));
});

app.delete('/db/books/:id', (req, res) => {
    // Validate the id
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Book.deleteBook(id).then(result => {
        User.removeBooksWritten(result.user,result.id)
    }).then(res=>{
        log(res);
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




/* Routes for users */
// TODO - to be edited after User Schema is posted
app.get('/profile/:id', (req, res) => {
    const id = req.params.id;
    if(!ObjectID.isValid(id)){
		res.status(404).send();
    }
    User.findUserByID(id).then((user) =>{
        
		if(!user){
			res.status(404).send()
		} else{
            const dir = path.join(__dirname + "/public/HTML/");
            res.sendFile(dir + 'profile.html');
		}
	}).catch((error) => {
		res.status(500).send()
	})

});

class userOwner {
    constructor(name, description, id, email, isAdmin, token, followers, image, bookshelf, writtenBook, following, newMessage, oldMessage) {
        this.name = name;
        this.description = description;
        this.id = id;
        this.email = email;
        this.isAdmin = isAdmin;
        this.token = token;
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
    constructor(name, description, id, isAdmin, followers, image, bookshelf, writtenBook, following) {
        this.name = name;
        this.description = description;
        this.id = id;
        this.isAdmin = isAdmin;
        this.followers = followers;
        this.image = image;
        this.bookshelf = bookshelf;
        this.writtenBook = writtenBook;
        this.following = following;
    }
}

function getFollowersForProfile(user){
    return new Promise((resolve, reject) => {
        User.find({'_id': { $in: user.following}})
        .then(user => {
            resolve(user)
        }).catch(error => {
            reject({code: 404, error})
        });
    })
}

function getBooksForProfile(bookIdArray){
    return new Promise((resolve, reject) => {
        Book.find({'_id': { $in: bookIdArray}})
        .then(books => {
            resolve(books)
        }).catch(error => {
            reject({code: 404, error})
        });
    })
}

app.get('/db/profile/:id', (req, res) => {
    const id = req.params.id;
    

    // TODO: check if id is session id. send a modified user

    if(!ObjectID.isValid(id)){
		res.status(404).send();
    }
    User.findById(id).then((user) =>{
        
		if(!user){
			res.status(404).send()
		} else{
            Promise.all([getBooksForProfile(user.bookshelfIds), getBooksForProfile(user.writtenBook), getFollowersForProfile(user)])
            .then(valueArray => {
                const bookShelfInfo = [];
                for(let i=0; i<valueArray[0].length; i++){
                    const bookshelfBookObj = {
                        id: valueArray[0][i]._id,
                        image: valueArray[0][i].image,
                        bookTitle: valueArray[0][i].bookTitle
                    }
                    bookShelfInfo.push(bookshelfBookObj);
                }

                const writtenBookInfo = []
                for(let i=0; i<valueArray[1].length; i++){                   
                    const writtenBookObj = {
                        id: valueArray[1][i]._id,
                        image: valueArray[1][i].image,
                        bookTitle: valueArray[1][i].bookTitle
                    }
                    writtenBookInfo.push(writtenBookObj);
                }

                const followingInfo = [];
                for(let i=0; i<valueArray[2].length; i++){
                    const followUserObj = {
                        id: valueArray[2][i]._id,
                        name: valueArray[2][i].name,
                        image: valueArray[2][i].image,
                        writtenCount: valueArray[2][i].writtenBook.length
                    }
                    followingInfo.push(followUserObj);
                }
                // if(id === req.session.id){
                if(1===1){
                    const userToSend = new userOwner(user.name, user.description, user._id, user.email, user.isAdmin, 
                        user.token, user.followers, user.image, bookShelfInfo, writtenBookInfo, 
                        followingInfo, user.newMessage, user.oldMessage)
                        res.send(userToSend)
                }
                else{
                    const userToSend = new userNonOwner(user.name, user.description, user._id, user.isAdmin, user.followers, 
                        user.image, bookShelfInfo, writtenBookInfo, followingInfo)
                        res.send(userToSend)
                }

                // getBooksForProfile(user.bookshelf).then((result) => {
                //     log(result)
                
                //     res.send()
    
    
                // })
            }).catch((error) => {
                res.status(500).send()
            })
			// res.send(user);
		}
	}).catch((error) => {
		res.status(500).send()
	})

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
    if(!ObjectID.isValid(id)){
        res.status(404).send();
    }
    User.findById(id).then((user) =>{
        if(!user){
            res.status(404).send()
        } else{
            res.send(user);
        }
    }).catch((error) => {
        res.status(500).send()
    })

});

app.delete('/db/users/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    User.deleteUser(id).then(result => Book.deleteByAuthor(result._id));
});

app.patch('/db/profile/:uid/:fid', (req, res) => {
    const id = req.params.uid;
    const fid = req.params.fid;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Promise.all([User.removeFollowing(id, fid), User.beNotFollowed(fid)]).then( (results) => {
        if(results[0] && results[1]){
            res.send({resolved: true});
        }
    }).catch((error) => {
        return res.status(500).send(error);
    });
})

app.patch('/db/profile/:id/', (req, res) => {
    const id = req.params.id;

    const email = req.body.email;
    const name= req.body.name;
    const password = req.body.password;
    const description = req.body.description;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    User.updateProfileInfo(id, name, email, password, description).then((result) => {
        if(result){
            res.send({resolved: true});
        }
    }).catch((error) => {
        log(error)
        return res.status(500).send(error);
    });

})


// // Set up a POST route to *create* a student
// app.post('/book', (req, res) => {
//     Book.addBook(req).then((result) => {
//         log(result);
//         res.send(result);
//     })
//         .catch((rej) => {
//             res.status(rej.code).send(rej.error);
//         });
// });
//
// app.post('/find', (req, res) => {
//     Book.findBook(req).then((result) => {
//         res.send(result);
//         return result;
//     }).then(
//         (result) => {
//             log(result[0].image);
//             result[0].addChapter(req, result[0]);
//         }
//     )
//         .catch((rej) => {
//             res.status(rej.code).send(rej.error);
//         });
// });
//
// app.patch('/updateDesription', (req, res) => {
//     Book.updateDesription(req).then((result) => {
//         log(result);
//         res.send(result);
//     })
//         .catch((rej) => {
//             res.status(rej.code).send(rej.error);
//         });
// });


// app.post('/newChapter',(req,res)=>{
//    Chapter.
// });

//get all the chapter from the book
app.get('/db/reading/:bid/',(req,res) =>{
    const bid = req.params.bid;
    if (!ObjectID.isValid(bid)) {
        return res.status(404).send();
    }
    Book.findById(bid).then((book)=>{
            if(!book){
                res.status(404).send()
            }else{
                res.send(book.chapters)
            }
        }
    )
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    log('Listening on port 3000...');
});  // common local host development port 3000
// we've bound that port to localhost to go to our express server
// Must restart web server whenyou make changes to route handlers


// const idddd = "5ca2e2259e04deeca4a75ff9";
// User.findById(idddd).then((user) =>{
//     if(!user){
//         res.status(404).send()
//     } else{
//         Book.find({
//             '_id': { $in: user.writtenBook}
//         }).then((ids => {
//             log(ids);
//         }))
//         // res.send(user);
//     }
// }).catch((error) => {
//     res.status(500).send()
// })

// User.addFollowing("5ca43565877585494830691b", "5ca3c2dddbdcc462627e76b8").then(res => log(res)).catch(error => log(error))