const express = require('express')
const router = express.Router()
const Book = require('../modals/book');
const Author = require('../modals/author');
const path = require('path');
const imageMimeType = ['images/jpeg', 'images/png', 'images/gif']



//* All Books Route
router.get('/', async(req, res) => {
    //console.log(req.query);
    let query = Book.find();
    //* ---ADDING FILTER TO SEARCHING FOR BOOKS
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishBefore != null && req.query.publishBefore != '') {
        query = query.lte('publishDate', req.query.publishBefore); //? Checking if publishDate is <= publish Before Data

    }
    if (req.query.publishAfter != null && req.query.publishAfter != '') {
        query = query.gte('publishDate', req.query.publishAfter); //? Checking if publishDate is >= publish Before Data

    }
    try {
        const books = await query.exec();
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
    //TODO: Need to add Form validation
    console.log(req.body);

    const book = new Book({
            title: req.body.title,
            author: req.body.author,
            publishDate: new Date(req.body.publishDate),
            pageCount: req.body.pageCount,
            description: req.body.description
        })
        //Adding file pond response to server KEY: filepond return response in JSON Format 
    const cover = JSON.parse(req.body.cover);
    if (cover != null) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }

    try {
        const books = await book.save();
        console.log(books);
        req.flash('success', 'Book Added To The Database');
        return res.redirect('/books');


    } catch (err) {

        req.flash('error', err.message);
        return res.redirect('/books/new')
    }

})




module.exports = router;