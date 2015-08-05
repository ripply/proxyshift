// TODO: Get rid of these global variables, global variables are bad

global.silent = true;
// sqlite3
global.db_dialect = 'sqlite3';
global.db_file = './data/test.db';
// sql servers
/*
global.db_dialect = 'pg';
//global.db_dialect = 'mysql';
global.db_host = 'localhost';
global.db_user = 'username';
global.db_password = 'password';
global.db_database = 'the_database_to_use';
*/
global.okToDropTables = true;

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
    fixtures = require('./fixtures/fixtures'),
    models = require('../app/models'),
    knex = models.knex,
    app = express();

global.fixtures = fixtures;
global.app = app;

global.Session = require('supertest-session')({
    app: global.app
    //, envs: { KEY: value }
});

global.request = function(app) {
    if (global.hasOwnProperty('sess')) {
        return global.sess
    } else {
        return request(app);
    }
};
global.expect = chai.expect;
global.sinon = require('sinon');
global.ROOT_DIR = ROOT_DIR;
chai.should();

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

    var fixturesList = [];
    var i = 0;
    while (arguments.hasOwnProperty(i)) {
        fixturesList.push(arguments[i++]);
    }
    var promise = new Promise(function(resolve, reject) {
        // makes sqlite3 use async
        // sqlFixtures does a series of insert/select/insert/select/...
        // this makes sqlite3 run very slowly
        // this is because sqlite3 by default will persist data to disk
        // before performing a select query
        // setting this to false means that it does not do that
        knex.schema.raw("PRAGMA synchronous=OFF");
        return models.initDb(true)
            .then(function() {
                // database has been reset
                // add fixtures inside a transaction
                // then resolve promise
                var client = {
                    client: global.db_dialect,
                    connection: {
                        filename: global.db_file
                    }
                };

                function recurse(fixturesLeft) {
                    if (fixturesLeft.length == 0) {
                        // no fixtures left
                        // end recursion
                        resolve();
                    } else {
                        var fixture = fixturesLeft.shift();
                        return sqlFixtures.create(knex, fixture, function (err, result) {
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

function waitForFixturesToComplete(req, res, next) {
    return databaseReady(next);
}

chai.use(sinonChai);

// all environments
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser('secret'));
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
app.use(waitForFixturesToComplete);

