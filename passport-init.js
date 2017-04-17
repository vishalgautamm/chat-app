var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var users = require('./data/users.json');
var _ = require('lodash');

passport.use(new LocalStrategy(function (username, password, done) {
    var user = _.find(users, u => u.name === username);

    if (!user || user.password !== password) {
        done(null, false);
        return;
    }
    done(null, user);

}));

// Stores username. Session is created and saved
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// Rehydrates the user info stored. This is used to set up user object on the request object
passport.deserializeUser(function (id, done) {
    var user = _.find(users, u => u.id === id);
    done(null, user);
});
