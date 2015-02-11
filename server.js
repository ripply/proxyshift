var express = require('express'),
    http = require('http'),
    path = require('path'),
    routes = require('./app/routes'),
    exphbs = require('express3-handlebars'),
    mongoose = require('mongoose'),
    seeder = require('./app/seeder'),
    passport = require('passport'),
    passportLocal = require('passport-local').Strategy,
    compression = require('compression'),
    csrf = require('csurf'),
    app = express();

app.set('port', process.env.PORT || 3300);
app.set('views', __dirname + '/views');
app.set('view cache', process.env.NODE_ENV !== 'development');

var hbs = exphbs.create();

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: app.get('views') + '/layouts',
}));
app.set('view engine', 'handlebars');

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
// TODO: Autogenerate this secret and save it in the database
app.use(express.cookieParser('some-secret-value-here'));
app.use(express.session({ cookie: { maxAge: 60000 }}));

app.use(compression());

app.use(csrf({ cookie: true }));

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
app.use(passport.session({secret: 'supersecretstuff'}));

app.use(app.router);
// serves clients our files in public
app.use('/', express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//connect to the db server:
mongoose.connect('mongodb://localhost/MyApp');
mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");

    // check if the db is empty, if so seed it with some contacts:
    seeder.check();
});

//routes list:
routes.initialize(app);

//finally boot up the server:
http.createServer(app).listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});
