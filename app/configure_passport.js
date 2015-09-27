var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    RememberMeStrategy = require('passport-remember-me').Strategy,
    AuthencationHeaderStrategy = require('./PassportAuthenticationHeader'),
    Utils = require('./utils'),
    bcrypt = require('bcrypt-nodejs');
    models = require('./models');

// from https://github.com/jaredhanson/passport-local/blob/master/examples/express3-mongoose/app.js

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    new models.User({id: id})
        .fetch({require: true})
        .then(function (user) {
            return done(null, user);
        })
        .catch(function (err) {
            return done(null, false, {error: true, data: {message: err.message}});
        });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(function(username, password, done) {
    return models.User.query(function(q) {
        q.select()
            .from('users')
            .whereRaw('LOWER(username) LIKE ?', username.toLowerCase());
    })
        .fetch({require: true})
        .then(function (user) {
            if(bcrypt.compareSync(password, user.get('password'))) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid Password' });
            }
        })
        .catch(function (err) {
            return done(null, false, {error: true, data: {message: err.message}});
        });
    })
);

passport.use(new AuthencationHeaderStrategy(
    function(token, done) {
        models.consumeRememberMeToken(token, function(err, uid) {
            if (err) { return done(err); }
            if (!uid) { return done(null, false); }

            return models.User.forge({id: uid})
                .fetch({require: true})
                .then(function(user) {
                    return done(null, user);
                })
                .catch(function(err) {
                    return done(err);
                });
        });
    }
));

// https://github.com/jaredhanson/passport-remember-me/blob/master/examples/login/server.js
// Remember Me cookie strategy
//   This strategy consumes a remember me token, supplying the user the
//   token was originally issued to.  The token is single-use, so a new
//   token is then issued to replace it.

passport.use(new RememberMeStrategy(
    function(token, done) {
        console.log("Remember me consume!????");
        models.consumeRememberMeToken(token, function(err, uid) {
            if (err) { return done(err); }
            if (!uid) { return done(null, false); }

            return models.User.forge({id: uid})
                .fetch({require: true})
                .then(function(user) {
                    return done(null, user);
                })
                .catch(function(err) {
                    return done(err);
                });
        });
    },
    models.issueToken
));
