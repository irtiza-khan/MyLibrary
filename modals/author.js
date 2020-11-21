const mongoose = require('mongoose')
const Book = require('./book')
const newAuthor = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    }
});


//? Mongo Db Contraints
//? Constraint For Removing An author
newAuthor.pre('remove', function(next) {
    Book.find({ author: this.id }, (err, books) => {
        if (err) {
            next(err)

        } else if (books.length > 0) {
            next(new Error('This Author has a book Still'))
        } else {
            next()
        }
    })
})

const Author = mongoose.model('Author', newAuthor)

module.exports = Author;