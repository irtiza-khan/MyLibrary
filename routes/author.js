const express = require('express')
const router = express.Router()
const Author = require('../modals/author');

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
                return res.redirect('authors')
            } else {
                req.flash('error', 'Error User Not Saved')
                res.render('authors/new', {
                    author,
                    flashMessage: req.flash('error')
                })
            }
        })


})

module.exports = router;