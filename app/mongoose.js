const mongoose = require('mongoose');

// connect to our database
mongoose.connect('mongodb+srv://jerry:bookwirepass@cluster0-yzvrb.mongodb.net/test?retryWrites=true', { useNewUrlParser: true});
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/books', { useNewUrlParser: true, useCreateIndex: true});

mongoose.set('useFindAndModify', false);

module.exports = { mongoose };