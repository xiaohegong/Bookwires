const mongoose = require('mongoose');

// connect to our database
mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

module.exports = { mongoose };