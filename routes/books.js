const express = require('express')
const router = express.Router()
const Book = require('../modals/book');
const Author = require('../modals/author');
const multer = require('multer');
const path = require('path');
const uploadPath = path.join('public', Book.coverImageBasePath); // ? This returns the file path from Books Schema
const imageMimeType = ['images/jpeg', 'images/png', 'images/gif']
const fs = require('fs');


let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadPath)
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)

    }


})

let upload = multer({
    storage
}).single('cover')



//* All Books Route
router.get('/', async(req, res) => {
    console.log(req.query);
    try {
        const books = await Book.find({});
        res.render('books/index', {
            books,
            searchOptions: req.query
        })

    } catch (err) {
        req.flash('error', err.message);
        return res.redirect('/');

    }

})

//*  New Book Route
router.get('/new', async(req, res) => {
    try {
        const authors = await Author.find();
        const book = new Book();
        res.render('books/new', {
            authors: authors,
            book: book,
        })


    } catch (err) {
        res.redirect('/books');

    }
})


//* Create A New Book Route
router.post('/', async(req, res) => {

    //! Checking File Request
    upload(req, res, (err) => {

        const fileName = req.file != null ? req.file.filename : null;
        req.body.cover = fileName;
        if (err) {
            req.flash('error', "Something Went Wrong  ");
            return res.redirect('/books/new');
        }
        console.log(req.body);
        console.log(req.body.cover);

        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            publishDate: new Date(req.body.publishDate),
            pageCount: req.body.pageCount,
            coverImageName: req.body.cover,
            description: req.body.description
        })
        console.log(book);
        book.save()
            .then(result => {
                req.flash('success', 'Book Added To The Database' + result);
                return res.redirect('/books');

            })
            .catch(err => {
                if (book.coverImageName != null) {
                    removeBookCover(book.coverImageName);
                }
                req.flash('error', err.message);
                return res.redirect('/books/new')
            })

    })


})


function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.log(err);
    });

}



module.exports = router;