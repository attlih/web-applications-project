var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const mongoose = require('mongoose');
// dotenv for environment variables
const dotenv = require('dotenv');
dotenv.config();
// routers
var snippetsRouter = require('./api/snippets');
var usersRouter = require('./api/users');

var app = express();

// Set up database
const mongoDB = process.env.MONGO_URL || "mongodb://localhost:27017/web-project";
mongoose.set('strictQuery', false);
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind("MongoDB connection error"));

// set up cors
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve("..", 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve("..", 'client', 'build', 'index.html'));
    });

} else if(process.env.NODE_ENV === 'development') {
    var corsOptions = {
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions));
}
console.log("NODE_ENV:", process.env.NODE_ENV);

// middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/snippet', snippetsRouter);
app.use('/user', usersRouter);

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
