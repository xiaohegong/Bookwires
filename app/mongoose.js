const mongoose = require('mongoose');

// connect to our database
// mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true});
mongoose.connect('mongodb+srv://heddy:bookwirepass@cluster0-yzvrb.mongodb.net/test?retryWrites=true', { useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

module.exports = { mongoose };