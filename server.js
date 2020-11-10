const express = require('express')
const app = express();
const expressLayouts = require('express-ejs-layouts');
const path = require('path')
const morgan = require('morgan');
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/author')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
const session = require('express-session')
require('dotenv').config()

const PORT = process.env.PORT || 8080;

app.use(morgan('dev'));

connectDB();


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))


app.use(cookieParser(process.env.SECRET_KEY));
app.use(session({
    secret: process.env.SECRET_KEY,
    cookie: {
        maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
}))
app.use(flash());

app.use((req, res, next) => {
    res.locals.flashMessage = req.flash();
    next();
})

//Setting  Up view engine  
app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')



app.use('/', indexRouter);
app.use('/authors', authorRouter);

app.listen(PORT, () => console.log(`Port Listening on https://localhost:${PORT}`));