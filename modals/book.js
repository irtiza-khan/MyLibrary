const mongoose = require('mongoose')
const coverImageBasePath = 'uploads/bookCovers';
const path = require('path');

const newBook = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,

    },
    publishDate: {
        type: Date,
        require: true,
    },
    pageCount: {
        type: Number,
        require: true,
    },
    createdAt: {
        type: Date,
        require: true,
        default: Date.now()
    },
    coverImageName: {
        type: String,
        require: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, //this will reference from the author table 
        require: true,
        ref: 'Author'
    },
});


newBook.virtual('coverImagePath').get(function() {

    if (this.coverImageName != null) {
        //return path.join('/', this.coverImageBasePath);
    }

})

const Book = mongoose.model('Book', newBook)

module.exports = Book;
module.exports.coverImageBasePath = coverImageBasePath;