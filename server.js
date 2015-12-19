var express = require('express'),
    cluster = require('cluster'),
    http = require('http'),
    path = require('path'),
    routes = require('./app/routes'),
    //exphbs = require('express3-handlebars'),
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
    numCPUs = require('os').cpus().length;
    app = express();

if (cluster.isMaster) {
    if (process.env.WORKERS) {
        numCPUs = parseInt(process.env.WORKERS);
    } else {
        numCPUs = 1;
    }

    if (process.env.LOAD_FIXTURES !== undefined && process.env.LOAD_FIXTURES == 'true') {
        if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "PROD") {
            throw new Error("NODE_ENV == 'PROD' AND FIXTURES ARE SET TO BE LOADED, THIS IS A CONFIGURATION ERROR");
        }
        global.okToDropTables = process.env.CAN_DROP_TABLES == 'true';
        console.log("Resetting database and loading fixtures");
        var fixtureshelper = require('./spec/fixtureshelper');
        fixtureshelper.setFixtures(fixtureshelper.fixtures.base);
        fixtureshelper.databaseReady(function() {
            console.log("Fixtures loaded, starting server");
            return launchServer();
        });
    } else {
        launchServer();
    }
}

function launchServer() {
    if (cluster.isMaster && numCPUs > 1) {
        console.log("Forking " + numCPUs + " workers");
        // Fork workers.
        for (var i = 0; i < numCPUs; i++) {
            console.log("Forking worker #" + i);
            cluster.fork();
        }

        cluster.on('exit', function (worker, code, signal) {
            console.log('worker ' + worker.process.pid + ' died');
        });
    } else {

        if (!cluster.isMaster) {
            process._debugPort = 5858 + cluster.worker.id;
            console.log("Set debug port to " + process._debugPort);
        }
        // Workers can share any TCP connection
        // In this case it is an HTTP server
        /*
         http.createServer(function(req, res) {
         res.writeHead(200);
         res.end("hello world\n");
         }).listen(8000);
         */

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
        app.use(session({
            cookie: {maxAge: 60000},
            secret: 'some-secret-value-here',
            resave: true,
            saveUninitialized: true
        }));

        app.use(compression());

        var csrfProtection = csrf({
            cookie: true,
            value: function (req) {
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
        app.use(passport.authenticate('authentication-token'));
        if (cluster.isMaster) {
            // this causes issues when using a cluster of nodes
            // what happens is that when the user loads the site
            // their client will fetch all the html files
            // then the user will login.
            // if the user reloads the page
            // then a different process can end up serving at least one of the requests for static files
            // and those requests will try to invalidate and issue a new token, simultaneously.
            app.use(passport.authenticate('remember-me'));
        }

        //app.use(app.router);
        // serves clients our files in public
        app.use('/', express.static(path.join(__dirname, 'ionic/www')));

        // development only
        if ('development' == app.get('env')) {
            app.use(errorHandler());
        }

        //routes list:
        routes.initialize(app);

        //finally boot up the server:
        http.createServer(app).listen(app.get('port'), function () {
            if (cluster.isMaster) {
                console.log('Server up: http://localhost:' + app.get('port'));
            } else {
                console.log('Worker up');
            }
        });
    }
}
