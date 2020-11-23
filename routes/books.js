const express = require('express')
const router = express.Router()
const Book = require('../modals/book');
const Author = require('../modals/author');
const path = require('path');
const imageMimeType = ['images/jpeg', 'images/png', 'images/gif']



//* All Books Route
router.get('/', async(req, res) => {

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


//Get All Books

router.get('/:id', async(req, res) => {


    try {
        const book = await Book.findById(req.params.id).populate('author'); //populate reference to author collections
        res.render('books/show', { book })
    } catch (err) {
        res.redirect('/');

    }
})

// Edit Book 
router.get('/:id/edit', async(req, res) => {

    try {
        const book = await Book.findById(req.params.id);
        const authors = await Author.find();
        res.render('books/edit', { book, authors });


    } catch (err) {
        req.flash('error', 'Book Did not find');
        return res.redirect('/');

    }
})


//Update a Book
router.put('/:id', async(req, res) => {
    let book;
    let authors;
    try {
        authors = await Author.find();
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author;
        book.publishDate = new Date(req.body.publishDate);
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if (req.body.cover != null && req.body.cover !== '') {
            savCover(book, req.body.cover);
        }
        await book.save();
        req.flash('sucess', 'Book Updated Successfully');
        return res.redirect(`/books/${book.id}`)

    } catch (err) {
        if (book != null) {
            res.render('books/edit', {
                book,
                authors
            })
        } else {

            return res.redirect('/');
        }

    }

})

//Delete a book
router.delete('/:id', async(req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id);
        await book.remove();
        return res.redirect('/books');
    } catch (err) {
        if (book != null) {
            req.flash('error', 'Could Not Remove Book ');
            return res.render('books/show', {
                book
            })
        } else {
            res.redirect('/books');

        }


    }
})


//* Create A New Book Route
router.post('/', async(req, res) => {
    //! Checking File Request
    //TODO: Need to add Form validation


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
        req.flash('success', 'Book Added To The Database');
        return res.redirect(`/books/${books.id}`);


    } catch (err) {

        req.flash('error', err.message);
        return res.redirect('/books/new')
    }

})




function savCover(book, cover) {
    let imageCover = JSON.parse(cover);
    if (imageCover != null && imageCover !== '') {
        book.coverImage = new Buffer.from(imageCover.data, 'base64');
        book.coverImageType = imageCover.type;
    }
}


module.exports = router;