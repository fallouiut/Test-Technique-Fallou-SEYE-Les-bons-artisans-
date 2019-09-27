var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');

var app = express();

// use express-session
var sess = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}
var session = require("express-session");
app.use(session(sess));

// view engine setup. I commonly use EJS for my projects
app.engine('ejs', require('express-ejs-extend'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Require Products.json and join room to socket io
var jsonProducts = require("./classes/Products");
app.use(function (req, res, next) {
    // joindre la room pour être à l'écoute des messages
    // (../bin/www l.95), initialisation socket
    // TODO: bien revoir si ca marche
    req.app.get("io").sockets.on("connection", function (socket) {
        socket.join("room-products");
        socket.emit("connected", {roomName: "products-room"});
        console.log("One socket joined 'room-products'");
    });

    // on mets les produits en session
    if (!req.session.products) {
        req.session.products = jsonProducts;
    }
    next();
});

app.use('/products', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // TODO: remove
    console.log("-----------------APP ERROR----------------------");
    // render the error page
    console.log(err.message);
    console.log(err.stack);
    console.log("------------------------------------------------");


    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
