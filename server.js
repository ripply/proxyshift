var express = require('express'),
    http = require('http'),
    path = require('path'),
    routes = require('./app/routes'),
    exphbs = require('express3-handlebars'),
    mongoose = require('mongoose'),
    seeder = require('./app/seeder'),
    passport = require('passport'),
    passportLocal = require('passport-local').Strategy,
    app = express();

app.set('port', process.env.PORT || 3300);
app.set('views', __dirname + '/views');
app.set('view cache', process.env.NODE_ENV !== 'development');
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: app.get('views') + '/layouts'
}));
app.set('view engine', 'handlebars');

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('some-secret-value-here'));
app.use(express.session({ cookie: { maxAge: 60000 }}));

app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use('/', express.static(path.join(__dirname, 'public')));

app.post('/login', passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/login' }));

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
