var express = require('express'),
    http = require('http'),
    path = require('path'),
    routes = require('./app/routes'),
    //exphbs = require('express3-handlebars'),
    mongoose = require('mongoose'),
    seeder = require('./app/seeder'),
    passport = require('passport'),
    passportLocal = require('passport-local').Strategy,
    compression = require('compression'),
    csrf = require('csurf'),
    log4js = require('log4js'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    app = express();

app.set('port', process.env.PORT || 3300);
app.set('views', __dirname + '/views');
app.set('view cache', process.env.NODE_ENV !== 'development');

/*
var hbs = exphbs.create();

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: app.get('views') + '/layouts'
}));
app.set('view engine', 'handlebars');
*/

if (false) {
    var appLog = log4js.getLogger();
    var httpLog = morgan({
        "format": "default",
        "stream": {
            write: function (str) {
                appLog.debug(str);
            }
        }
    });
    app.use(httpLog);
} else {
    app.use(morgan('dev')); // log every request to the console
}
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//app.use(methodOverride);
// TODO: Autogenerate this secret and save it in the database
app.use(cookieParser('some-secret-value-here'));
app.use(session({ cookie: { maxAge: 60000 }}));

app.use(compression());

var csrfProtection = csrf({
    cookie: true,
    value: function(req) {
        console.log(req.session);
        console.log("Given secret: " + req.cookies['_csrf']);
        return req.cookies['XSRF-TOKEN'];
    }
});

/**app.use(function(req, res, next) {
    // https://github.com/expressjs/csurf/issues/21
    // TODO: FIX, because csrf comes before routes, every POST request is checked for CSRF tokens, this means that cordova cannot send a POST request to a special route to get a CSRF token

    console.log("RECEIVED URL: " + req.url);
    if (req.url === '/csrf') {
        res.set('xcsrftoken', req.csrfToken());
        return next(req, res);
    } else {
        return csrfProtection(req, res, next);
    }
});
 */
//app.use(csrfProtection);

// error handler
/*
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)

    // handle CSRF token errors here
    console.log("INVALID CSRF TOKEN!?");
    console.log(req.body);
    res.status(403)
    res.send('session has expired or form tampered with')
});
*/
// http://www.mircozeiss.com/using-csrf-with-express-and-angular/
/*app.use(function(req, res, next) {
    console.log("Creating session cookie...");
    console.log(req.csrfToken());
    res.cookie('XSRF-TOKEN', req.csrfToken());
    console.log("Running next middleware");
    next();
});*/

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

//app.use(app.router);
// serves clients our files in public
app.use('/', express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

//connect to the db server:
/*
mongoose.connect('mongodb://localhost/MyApp');
mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");

    // check if the db is empty, if so seed it with some contacts:
    //seeder.check();
});
*/

//routes list:
routes.initialize(app);

//finally boot up the server:
http.createServer(app).listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});
