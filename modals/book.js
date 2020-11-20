const mongoose = require('mongoose')

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
    coverImage: {
        type: Buffer,
        require: true,
    },
    coverImageType: {
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

    if (this.coverImage != null && this.coverImageType != null) {
        // return path.join('/', coverImageBasePath, this.coverImageName);
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }

})

const Book = mongoose.model('Book', newBook)

module.exports = Book;