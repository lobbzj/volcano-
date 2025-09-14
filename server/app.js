require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const options = require('./knexfile.js');
const knex = require('knex')(options);
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

var usersRouter = require('./routes/users');
var countriesRouter = require('./routes/countries');
var volcanoRouter = require('./routes/volcano');
var volcanoesRouter = require('./routes/volcanoes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    req.db = knex
    next()
});

app.use('/user', usersRouter);
app.use('/countries', countriesRouter);
app.use('/volcano', volcanoRouter);
app.use('/volcanoes', volcanoesRouter);
app.get('/me', function (req, res, next) {
    console.log(req.body);
    res.json({ "name": "Jason Zhang", "student_number": "n11255838" });
});

app.use('/', swaggerUI.serve);
app.get('/', swaggerUI.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).json({ error: true, message: "Not found" });
    next()
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const fs = require('fs');
const credentials = {
    key: fs.readFileSync("selfsigned.key", "utf8"),
    cert: fs.readFileSync("selfsigned.crt", "utf8")
};

const https = require('https');
//const http = require('http');

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(3000);

// const httpServer = http.createServer(credentials, app);
// httpServer.listen(3000);

module.exports = app;
