'use strict';

const express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    passport = require('passport');

require('./passport-init');

let port = process.env.PORT || 3000;

app.set("views", "./views"); // Tells express where to find the view files
app.set('view engine', 'jade'); //Tells express that we will be using JADE template engine.

app.use(require('./logging')); // using the custom logging middleware that we created

// Loads all static files. Ex: CSS, Bootstrap files
app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"));
app.use(express.static("node_modules/jquery/dist"));

require('express-debug')(app, {}); // Express debugging tool

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require('express-session')({ // importing export-session module and invoke to create the middle-ware
    //passing some options to the sessions middle ware. 1 option is secret, option 2 and 3 are default
    secret: 'harry potter', resave: false, saveUninitialized: false
}));
app.use(passport.initialize());//Passport files
app.use(passport.session()); // this ensures that people dont have login at every request.

//Creating a Auth Router
let authRouter = require('./auth');
app.use(authRouter);

// Use a middleware to check if the user is authenticated
app.use(function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        next();
        return;
    }
    // If someone is not authenticated, redirect them to login page
    res.redirect('/login');
});

app.get('/', function (req, res) {
    res.render("home", {title: "Home"})
});

let adminRouter = require('./admin');
app.use('/admin', adminRouter);

let apiRouter = require('./api');
app.use('/api', apiRouter);

app.listen(port, function () {
    console.log('App is running on port ' + port);
});
