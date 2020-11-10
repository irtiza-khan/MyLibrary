const express = require('express')
const app = express();
const expressLayouts = require('express-ejs-layouts');
const path = require('path')
const morgan = require('morgan');
const indexRouter = require('./routes/index')
const connectDB = require('./config/db')
require('dotenv').config()

const PORT = process.env.PORT || 8080;

app.use(morgan('dev'));

connectDB();


app.use(express.static(path.join(__dirname, 'public')));


//Setting  Up view engine  
app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')



app.use('/', indexRouter);

app.listen(PORT, () => console.log(`Port Listening on https://localhost:${PORT}`));