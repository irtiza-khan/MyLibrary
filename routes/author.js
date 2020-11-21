const express = require('express')
const router = express.Router()
const Author = require('../modals/author');
const Book = require('../modals/book');

router.get('/', async(req, res) => {
    //* Searching an Author
    const searchOptions = {}
        //! In Get Request We Use query in order to get data from front-end 
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i') //* i stand for k-sensitive

    }
    try {

        const authors = await Author.find(searchOptions);
        res.render('authors/index', { authors, searchOptions: req.query });
    } catch (err) {
        req.flash('error', 'No Authors Available')
        return res.redirect('/');

    }
})

//New Route For Authors
router.get('/new', async(req, res) => {
    try {
        const author = await Author.find();
        res.render('authors/new', { author });


    } catch (err) {
        console.log(err);

    }
})

router.post('/', (req, res) => {

    const author = new Author({
        name: req.body.name
    })

    author.save()
        .then(result => {

            if (result) {
                req.flash('success', 'Author Saved To Database');
                return res.redirect(`/authors/${author.id}`)
            } else {
                req.flash('error', 'Error User Not Saved')
                res.render('authors/new', {
                    author,
                    flashMessage: req.flash('error')
                })
            }
        })


})


//* Get Author 
router.get('/:id', async(req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const book = await Book.find({ author: author.id }).limit(6).exec();
        res.render('authors/show', {
            author,
            booksByAuthor: book
        })
    } catch (err) {

        res.redirect('/');

    }
})

//* Edit Author 
router.get('/:id/edit', async(req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', { author });


    } catch (err) {
        req.flash('error', 'User Did not find');
        return res.redirect('/authors');

    }
})

//*Update Author
router.put('/:id', async(req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        req.flash('success', 'Author Updated Successfully')
        res.redirect(`/authors/${author.id}`);

    } catch (err) {
        if (author == null) {
            req.flash('error', 'Enable to find the author')
            res.redirect('/');
        } else {

            res.render('authors/edit', {
                author
            })

        }

    }
})


//* Delete Author
router.delete('/:id', async(req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        //author.name = req.body.name;
        await author.remove();
        req.flash('success', 'Author DeletedSuccessfully')
        res.redirect('/authors');

    } catch (err) {
        if (author == null) {
            req.flash('error', 'Enable to find the author')
            res.redirect('/');
        } else {
            res.redirect(`/authors/${author.id}`);

        }

    }
})



module.exports = router;