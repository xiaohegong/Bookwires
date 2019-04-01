const mongoose = require('mongoose');

// connect to our database
// mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true});
mongoose.connect('mongodb+srv://heddy:bookwirepass@cluster0-yzvrb.mongodb.net/test?retryWrites=true', { useNewUrlParser: true});

mongoose.set('useFindAndModify', false);
// Used for silent warning -
// (node:39380) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set('useCreateIndex', true);

module.exports = { mongoose };