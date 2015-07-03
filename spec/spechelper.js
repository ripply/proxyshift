global.silent = true;

var request = require('supertest'),
    chai = require('chai'),
    sinonChai = require("sinon-chai"),
    express = require('express'),
    ROOT_DIR = __dirname + '/..',
    path = require('path'),
    //config = require(ROOT_DIR + '/config'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    sqlFixtures = require('sql-fixtures'),
    Promise = require('bluebird'),
    _ = require('underscore'),
    models = require('../app/models'),
    app = express();

global.app = app;
global.request = request;
global.expect = chai.expect;
global.sinon = require('sinon');
global.ROOT_DIR = ROOT_DIR;

var resetDatabasePromise = null;

function setFixtures() {
    // accepts multiple arguments that are objects of the format
    /*
    {
        users: {
            username: 'Bob',
            email: 'bob@example.com'
        }
    };
    */

    var fixturesList = arguments;
    var promise = new Promise(function(resolve, reject) {
        return models.initDb(true)
            .then(function() {
                // database has been reset
                // add fixtures inside a transaction
                // then resolve promise
                var client;

                function recurse(fixturesLeft) {
                    if (fixturesLeft.length == 0) {
                        // no fixtures left
                        // end recursion
                        resolve();
                    } else {
                        var fixture = fixturesLeft.shift();
                        return sqlFixtures.create(client, fixture, function (err, result) {
                            if (err) {
                                reject(err);
                            }

                            return recurse(fixturesLeft);
                        });
                    }
                }

                return recurse(fixturesList);
            });
    });

    resetDatabasePromise = promise;

    return promise;
}

global.setFixtures = setFixtures;

function databaseReady(next) {
    if (resetDatabasePromise === null || !resetDatabasePromise.isPending()) {
        return next();
    } else {
        return resetDatabasePromise
            .then(next);
    }
}

global.databaseReady = databaseReady;

function afterFixturesAreComplete(req, res, next) {
    return databaseReady(next);
}

chai.use(sinonChai);

// all environments
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    //secret: config.SESSION_SECRET ,
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
//app.use(passport.authenticate('remember-me'));
app.use('/', express.static(path.join(__dirname, 'public')));


//This allows you to require files relative to the root in any file
requireFromRoot = (function(root) {
    return function(resource) {
        return require(root+"/"+resource);
    }
})(ROOT_DIR);


// ensure that fixtures have been initialized before test requests are handled
app.use(function(req, res, next) {
    return databaseReady(next);
});

