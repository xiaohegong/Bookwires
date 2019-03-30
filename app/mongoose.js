const mongoose = require('mongoose');

// connect to our database
mongoose.connect('mongodb+srv://heddy:bookwirepass@cluster0-yzvrb.mongodb.net/test?retryWrites=true', { useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

module.exports = { mongoose };