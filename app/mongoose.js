const mongoose = require('mongoose');

// connect to our database
mongoose.connect('mongodb+srv://bookwire:bookwirepass@cluster0-yzvrb.mongodb.net/test?retryWrites=true', {useNewUrlParser: true});
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/books', { useNewUrlParser: true, useCreateIndex: true});

mongoose.set('useFindAndModify', false);
// Used for silent warning -
// (node:39380) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set('useCreateIndex', true);

module.exports = {mongoose};