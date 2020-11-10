const mongoose = require('mongoose')
const newAuthor = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    }
});


const Author = mongoose.model('Author', newAuthor)

module.exports = Author;