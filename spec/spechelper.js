// TODO: Get rid of these global variables, global variables are bad

global.silent = true;
// sqlite3
if (true) {
    global.db_dialect = 'sqlite3';
    global.db_file = './data/data.db';
} else {
    // sql servers

    global.db_dialect = 'pg';
    //global.db_dialect = 'mysql';
    global.db_host = 'localhost';
    global.db_user = 'postgres';
    global.db_password = 'test';
    global.db_database = 'postgres';
}

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
    Promise = require('bluebird'),
    _ = require('underscore'),
    app = express();

var fixtureshelper = require('./fixtureshelper');

global.fixtures = fixtureshelper.fixtures;
global.setFixtures = fixtureshelper.setFixtures;
global.databaseReady = fixtureshelper.databaseReady;
global.parse = fixtureshelper.parse;
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

global.debug = function(str) {
    //console.log(str);
};

var resetDatabasePromise = null;

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

