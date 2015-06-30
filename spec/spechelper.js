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
    app = express();

global.app = app;
global.request = request;
global.expect = chai.expect;
global.sinon = require('sinon');
global.ROOT_DIR = ROOT_DIR;
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
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));
app.use('/', express.static(path.join(__dirname, 'public')));


//This allows you to require files relative to the root in any file
requireFromRoot = (function(root) {
    return function(resource) {
        return require(root+"/"+resource);
    }
})(ROOT_DIR);
