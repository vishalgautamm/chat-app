var express = require('express');
var passport = require('passport');
var users = require('./data/users.json');
var _ = require("lodash");

var router = express.Router();
module.exports = router;

router.get('/login', function (req, res) {
    if (req.app.get("env") === "production") {
        var user = users[0];
        if (req.query.user) {
            user = _.find(users, u => u.name === req.query.user)
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
        return;
    }
    res.render('login');
});

// Use login authentication strategy. Second parameter is the set of options that needs to be specified
router.post('/login', passport.authenticate('local', {
    successRedirect: '/', // path to redirect to if the auth is successful
    failureRedirect: '/login'// location to redirect to if the auth is not successful
}));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});
