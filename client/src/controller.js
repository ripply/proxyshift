var Marionette = require('backbone.marionette'),
    Backbone = require('backbone'),
    TestHeaderView = require('./views/headers/test'),
    ShiftsView = require('./views/shifts/shifts'),
    ShiftDetailsView = require('./views/shifts/shift_detail'),
    FullCalendarView = require('./views/shifts/full_calendar'),
    LoginView = require('./views/users/login'),
    SignupView = require('./views/users/signup'),
    GroupsView = require('./views/groups/add_group'),
    AddShiftView = require('./views/shifts/add_shift'),
    NavBar = require('./views/headers/navbar'),
    CategoriesEdit = require('./views/categories/categories_edit'),
    ErrorMessages = require('./views/headers/error_msg'),
    LoadingView = require('./views/loading_view');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        _.bindAll.apply(_, [this].concat(_.functions(this)));
        App.core.vent.trigger('app:log', 'Controller: Initializing');
        var self = this;
        App.core.vent.bind('app:logout', function(options) {
            App.core.vent.trigger('app:log', 'User was logged out');
            App.core.vent.trigger('app:info', 'You have been logged out');
            App.wasLoggedOut = true;
            App.session.loggedOut();
            App.router.navigate('login', {trigger: true});
            App.core.vent.trigger('app:start:logout');
        });
        App.core.vent.bind('app:login', function(options) {
            App.core.vent.trigger('app:log', 'User was logged in');
            App.core.vent.trigger('app:info', 'Successfully logged in');
            /*if (App.wasLoggedOut) {
                // TODO: This is very flaky and doesn't work very well
                Backbone.history.history.back();
                App.wasLoggedOut = false;
            }*/
            App.router.navigate('calendar', {trigger: true});
            //App.core.vent.trigger('app:start:login');
        });
        // this was very flaky as well
        /*App.core.vent.bind('app:start:logout', function(options) {
            App.router.navigate('login', {trigger: true});
        });
        App.core.vent.bind('app:start:login', function(options) {
            App.router.navigate('calendar', {trigger: true});
        });*/
        App.views.loadingView = new LoadingView();
        App.session.loggedIn({
            success: function() {
                // do nothing
            },
            error: function() {
                // do nothing
            }
        });
        App.views.navBar = new NavBar({
            data: {
                session: App.session
            }
        });
        App.views.errorMessages = new ErrorMessages();
    },

    home: function() {
        App.core.vent.trigger('app:log', 'Controller: "Home" route hit.');
        //App.core.headerRegion.show(new TestHeaderView());
        //var view = window.App.views.shiftsView;
        //App.core.contentRegion.show(view);
        //this.renderView(view);
        window.App.router.navigate('#');
    },

    shiftDetails: function(id) {
        App.core.vent.trigger('app:log', 'Controller: "Shift Details" route hit.');
        var view = new ShiftDetailsView({model: window.App.data.shifts.get(id)});
        App.core.contentRegion.show(view);
        //this.renderView(view);
        window.App.router.navigate('shifts/' + id);
    },

    calendar: function() {
        App.core.vent.trigger('app:log', 'Controller: "Calendar" route hit.');
        console.log('Model: ' + window.App.data.shifts);
        var view = new FullCalendarView({collection: window.App.data.shifts, element: $("#full-calendar")});
        App.core.contentRegion.show(view);
        //this.renderView(view);
        window.App.router.navigate('calendar');
    },

    categories: function() {
        App.core.vent.trigger('app:log', 'Controller: "Categories" route hit.');
        console.log("new categoriesedit()");
        var view = new CategoriesEdit({
            data: {
                categories: App.data.categories
            }
        });
        App.data.categories.fetch({
            success: function() {
                App.core.vent.trigger('app:log', "Successfully fetched categories from server");
            },
            error: function() {
                App.core.vent.trigger('app:log', "FAILED to fetch categories from server");
            }
        });
        window.App.router.navigate('categories');
    },

    add: function() {
        App.core.vent.trigger('app:log', 'Controller: "Add Shift" route hit.');
        var view = new AddShiftView();
        App.core.contentRegion.show(view);
        //this.renderView(view);
        window.App.router.navigate('add');
    },

    login: function() {
        App.core.vent.trigger('app:log', 'Controller: "Login" route hit.');
        var view = new LoginView();
        console.log('LoginView!!!');
        App.core.contentRegion.show(view);
        //this.renderView(view);
        window.App.router.navigate('login');
    },

    signup: function() {
        App.core.vent.trigger('app:log', 'Controller: "Signup" route hit.');
        var view = new SignupView();
        console.log('SignupView!!!');
        App.core.contentRegion.show(view);
        //this.renderView(view);
        window.App.router.navigate('signup');
    },

    groups: function() {
        App.core.vent.trigger('app:log', 'Controller: "Groups" route hit.');
        var view = new GroupsView();
        console.log('GroupsView!!!');
        App.core.contentRegion.show(view);
        //this.renderView(view);
        window.App.router.navigate('groups');
    },

    logout: function() {
        App.core.vent.trigger('app:log', 'Controller: "Logout" route hit.');
        var self = this;
        App.session.logout({}, {
            success: function() {
                self.login();
            },
            error: function(err) {
                //TODO: Try logging out again
                console.log("Problem logging out: " + err);
            }
        });

    },
});
