/* server.js - mar 11 -10am*/
'use strict';
const log = console.log;

const express = require('express');
const path = require('path');

const app = express();
const bodyParser = require('body-parser'); // middleware for parsing HTTP body
const {ObjectID} = require('mongodb');

const {mongoose} = require('./app/mongoose.js');
const {Book, User, Chapter, Comment} = require('./app/Models/modules.js');
app.use(express.static("public"));
app.use(bodyParser.json());

/* ------------ Begin Routes Helpers ------------ */
app.get('/', (req, res) => {
    const dir = path.join(__dirname + "/public/HTML/");
    res.sendFile(dir + 'index.html');

    // res.sendFile('../HTML/index.html', {root: __dirname })
});

/* Routes for books */
app.get('db/books/:id', (req, res) => {
    const id = req.params.id;
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
                // TODO res.render("book", ...)
            }
        })
        .catch((error) => {
            return res.status(500).send(error);
        });
});

app.get('db/books', (req, res) => {
    Book.find()
        .then((books) => {
            res.send(books);
        })
        .catch(error => {
                return res.status(500).send(error);
            }
        );
});

app.post('db/books', (req, res) => {
    const newBook = new Book({
        "bookTitle": req.body.bookTitle,
        "rating": req.body.rating,
        "numOfRate": req.body.numOfRate,
        // "user": req.body.user,
        "image": req.body.image,
        "description": req.body.description,
        "genre": req.body.genre
    });

    // Check if the inputs are valid
    // if (!newBook.bookTitle || !newBook.rating || !newBook.numOfRate || !newBook.user || !newBook.description) {
    //     return res.status(400).send();
    // }
    if (!newBook.bookTitle || !newBook.rating || !newBook.numOfRate || !newBook.description) {
        return res.status(400).send();
    }

    newBook.save()
        .then((book) => {
            res.send(book);
        })
        .catch(error => {
            return res.status(400).send(error);
        });

});

app.get('db/books/:id', (req, res) => {
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

app.post('db/books/:id', (req, res) => {
    // Validate the id
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // Check if the inputs are valid
    const newChapter = new Chapter({
        "chapterNum": req.body.chapterNum,
        "content": req.body.content
    });
    if (!newChapter.chapterNum || !newChapter.content)
        return res.status(400).send();

    // Otherwise, find book by id and send back
    Book.findBookByID(id)
        .then((book) => {
            // Save chapter to queried book
            // TODO: Does this work...???
            book.addChapter(req.body.chapterNum, req.body.content, book);

            // book.chapters.push(newChapter);
            // book.save().then(
            //     (updated) => {
            //         res.send({
            //             "reservation": newChapter,
            //             "restaurant": updated
            //         });
            //     }, (error) => {
            //         return res.status(400).send(error); // 400 for bad request
            //     });
        })
        .catch((error) => {
            return res.status(500).send(error);
        });

});

app.delete('db/books/:id/:chapter_id', (req, res) => {
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

app.patch('db/books/:id/:chapter_id', (req, res) => {
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
app.get('db/users/:id', (req, res) => {
    const id = req.params.id;
    User.findUserById(id)
        .then((user) => {
            if (!user) {
                return res.status(404).send();
            } else {
                res.send(user);
            }
        })
        .catch((error) => {
            return res.status(500).send(error);
        });
});

app.get('db/users', (req, res) => {
    User.find()
        .then((users) => {
            res.send(users);
        })
        .catch(error => {
                return res.status(500).send(error);
            }
        );
});

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


// UNCOMMENT TO TEST A PUSH TO DB

// app.post('/testing123', (req, res) => {
//     const user = new User({
//         name: "bob",
//         bookshelf: [],
//         writtenBook: [],
//         followers: 0,
//         image: "img/default"
//     })
//     console.log("SDSADASd");
//     user.save().then((result) =>{
// 		res.send(result);
// 	}, (error) => {
// 		res.status(400).send(error) // 400 for bad request
// 	})
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    log('Listening on port 3000...');
});  // common local host development port 3000
// we've bound that port to localhost to go to our express server
// Must restart web server whenyou make changes to route handlers

