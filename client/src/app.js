var Marionette = require('backbone.marionette'),
    Controller = require('./controller'),
    Router = require('./router'),
    HeaderRegion = require('./regions/header'),
    ContentRegion = require('./regions/content'),
    FooterRegion = require('./regions/footer'),
    ShiftModel = require('./models/shift'),
    SessionModel = require('./models/session'),
    ShiftsCollection = require('./collections/shifts');

module.exports = App = function App() {};

App.prototype.start = function(){
    App.core = new Marionette.Application();

    App.core.addRegions({
        contentRegion : ContentRegion,
        headerRegion : HeaderRegion,
        footerRegion : FooterRegion
    });

    App.modelErrorHandler = function(model, res, options) {
        console.log("received error code");
        switch (res.status) {
            case 0:
                console.log("trouble contacting server");
                App.core.vent.trigger('app:connectionIssue');
                break;
            case 401:
                console.log("Error fetching shifts, navigating to login");
                App.core.vent.trigger('app:logout');
                break;
            default:
                App.core.vent.trigger('app:verifyLoginStatus');
                break;
        }
    };

    App.core.vent.bind('app:connectionIssue', function(options) {
        // TODO: Record timestamps here in a variable and do something it it keep happening
        App.core.vent.trigger('app:log', "Experiencing connection issues...");
    });

    App.core.on("initialize:before", function (options) {
        App.core.vent.trigger('app:log', 'App: Initializing');

        App.views = {};
        App.data = {};
        App.regions = {};

        App.session = new SessionModel();

        App.data.shifts = new ShiftsCollection();
        App.data.shifts.on('error', App.modelErrorHandler);

        App.core.vent.trigger('app:start');
    });

    App.showAlert = function(message, err, type) {
        console.log('FIXME: App.showAlert NYI, message: ' + message);
    };

    App.core.vent.bind('app:alert', function(message) {
        App.showAlert(message);
    });

    App.core.vent.bind('app:start', function(options){
        App.core.vent.trigger('app:log', 'App: Starting');
        if (Backbone.history) {
            App.controller = new Controller();
            App.router = new Router({ controller: App.controller });
            App.core.vent.trigger('app:log', 'App: Backbone.history starting');
            Backbone.history.start();
        }

        //new up and views and render for base app here...
        App.core.vent.trigger('app:log', 'App: Done starting and running!');
    });

    App.core.vent.bind('app:log', function(msg) {
        console.log(msg);
    });

    App.core.start();
};

