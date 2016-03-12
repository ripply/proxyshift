process.env.WEB = true;

var express = require('express'),
    cluster = require('cluster'),
    http = require('http'),
    path = require('path'),
    timers = require('timers'),
    routes = require('./app/routes'),
    exphbs = require('express-handlebars'),
    seeder = require('./app/seeder'),
    passport = require('passport'),
    passportLocal = require('passport-local').Strategy,
    compression = require('compression'),
    csrf = require('csurf'),
    log4js = require('log4js'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    error = require('./controllers/controllerCommon').error,
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    numCPUs = require('os').cpus().length,
    I18n = require('i18n-js'),
    moment = require('moment'),
    PeriodicEvents = require('./app/periodic').PeriodicEvents,
    app = express();
require('./app/handlebarTranslations');
var slack;

var timeStarted;
var periodicEvents;
var serverIsUp = false;

if (cluster.isMaster) {
    timeStarted = moment();
    slack = require('./app/slack');
    if (process.env.WORKERS) {
        numCPUs = parseInt(process.env.WORKERS);
    } else {
        numCPUs = 1;
    }

    periodicEvents = new PeriodicEvents();
    periodicEvents.start();

    process.on('SIGINT', function() {
        gracefulExit('Received SIGINT');
    });
    process.on('SIGTERM', function() {
        gracefulExit('Received SIGTERM');
    });

    if (process.env.LOAD_FIXTURES !== undefined && process.env.LOAD_FIXTURES == 'true') {
        if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "PROD") {
            var misconfigured = "NODE_ENV == 'PROD' AND FIXTURES ARE SET TO BE LOADED, THIS IS A CONFIGURATION ERROR";
            slack.alert(misconfigured);
            throw new Error(misconfigured);
        }
        global.okToDropTables = process.env.CAN_DROP_TABLES == 'true';
        var resettingDatabase = "Resetting database and loading fixtures";
        console.log(resettingDatabase);
        slack.info(resettingDatabase);
        var fixtureshelper = require('./spec/fixtureshelper');
        fixtureshelper.setFixtures(fixtureshelper.fixtures.base);
        var utcBeforeWaiting = Date.now();
        var notifyInterval = 5;
        var ready = {
            ready: false,
            notified: false,
            notifyAfter: notifyInterval,
            interval: notifyInterval
        };
        var databaseReadyPrinterInterval = timers.setInterval(function() {
            if (ready.finishTime) {
                timers.clearInterval(databaseReadyPrinterInterval);
                if (ready.notified) {
                    if (serverIsUp) {
                        slack.alert("False alarm, database is just slow, it fixed it's self after " + ready.finishTime + " seconds, server is up now");
                    } else {
                        slack.serious('WARNING: DATABASE SEEMS FINE NOW AFTER ' + ready.finishTime + ' SECONDS BUT SERVER DID *NOT* TOGGLE FLAG INDICATING THAT IT IS UP, PLEASE VERIFY THAT SERVER IS UP');
                    }
                }
            } else {
                var seconds = Math.floor((Date.now() - utcBeforeWaiting) / 1000);
                console.log('Waiting for database to be ready to listen for traffic, have waited: ' + seconds + ' seconds');
                if (seconds >= ready.notifyAfter) {
                    ready.notifyAfter += ready.interval;
                    ready.notified = true;
                    notifyLongWait(seconds);
                }
            }
        }, 5000);

        function notifyLongWait(seconds) {
            ready.notified = true;
            slack.alert('Still waiting for database to become ready (' + seconds + ' seconds)');
        }

        fixtureshelper.databaseReady(function() {
            ready.finishTime = Math.floor((Date.now() - utcBeforeWaiting) / 1000);
            var fixturesLoaded = "Fixtures loaded after " + ready.finishTime + " seconds, starting server";
            console.log(fixturesLoaded);
            slack.info(fixturesLoaded);
            return launchServer();
        });
    } else {
        launchServer();
    }
}

function gracefulExit(reason) {
    var promise;
    if (cluster.isMaster) {
        periodicEvents.stop();
        // send slack message notifying that server is shutting down
        if (!reason) {
            reason = 'UNKNOWN';
        }
        var shuttingDown = 'Shutting down: ' + reason;
        if (timeStarted) {
            shuttingDown += '\nUptime: ' + uptime();
        }
        promise = slack.info(shuttingDown);
        console.log(shuttingDown);
    } else {
        // do nothing for now
        console.log("worker exiting...");
    }
    if (promise) {
        promise.then(function() {
            console.log("Successfully notified slack of shutdown, waiting for IO events to finish");
            exit(0);
        }, function(reason) {
            console.log("Failed to notify slack of shutdown: " + reason);
            exit(1);
        });
    } else {
        console.log("Slack not configured so cannot notify of shutdown");
        exit(0);
    }

    function exit(code) {
        timers.setImmediate(function exit() {
            console.log("Bye!");
            process.exit(code);
        });
    }
}

function uptime() {
    return moment.duration(moment() - timeStarted).humanize();
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

        app.set('port', process.env.PORT || 3300);
        app.set('views', __dirname + '/views');
        app.set('view cache', process.env.NODE_ENV !== 'development');

        app.engine('handlebars',
            exphbs({
                defaultLayout: 'main',
                layoutsDir: app.get('views') + '/layouts',
                helpers: {
                    _: function handlebarsI18n(){
                        var key = arguments[0];
                        var args = {};
                        if (arguments.length > 1) {
                            for (var i = 1; i < arguments.length; i++) {
                                args[i] = arguments[i];
                            }
                        }
                        return (I18n != undefined ? I18n.t(key, args) : key);
                    }
                }
            })
        );
        app.set('view engine', 'handlebars');

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

        app.use(function errorHandler(err, req,res,next) {
            error(req, res, error, next);
            console.error(err.stack);
        });

        //finally boot up the server:
        console.log('Trying to listen on port: ' + app.get('port'));
        http.createServer(app).listen(app.get('port'), '0.0.0.0', function () {
            serverIsUp = true;
            if (cluster.isMaster) {
                console.log('Server up: http://localhost:' + app.get('port'));
                if (slack) {
                    slack.info("Server initialized");
                }
            } else {
                console.log('Worker up');
            }
        });
    }
}
