//Lets Bring In Mongoose
const mongoose = require('mongoose')

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL, {
            useCreateIndex: true,
            useFindAndModify: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        if (conn) {
            console.log(`Mongo Db Connected to ${conn.connection.host}`)
        } else {
            console.log('Database not connected');
        }

    } catch (error) {
        console.log(error);

    }


}

module.exports = connectDB;