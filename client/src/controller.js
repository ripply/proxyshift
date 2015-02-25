var Marionette = require('backbone.marionette'),
    Backbone = require('backbone'),
    TestHeaderView = require('./views/headers/test'),
    ShiftsView = require('./views/shifts/shifts'),
    ShiftDetailsView = require('./views/shifts/shift_detail'),
    FullCalendarView = require('./views/shifts/full_calendar'),
    LoginView = require('./views/users/login'),
    SignupView = require('./views/users/signup'),
    AddShiftView = require('./views/shifts/add_shift'),
    NavBar = require('./views/headers/navbar'),
    CategoriesEdit = require('./views/categories/categories_edit'),
    LoadingView = require('./views/loading_view');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        _.bindAll.apply(_, [this].concat(_.functions(this)));
        App.core.vent.trigger('app:log', 'Controller: Initializing');
        var self = this;
        App.core.vent.bind('app:logout', function(options) {
            App.core.vent.trigger('app:log', 'User was logged out');
            App.showAlert('You have been logged out');
            App.wasLoggedOut = true;
            App.session.loggedOut();
            self.login();
            App.core.vent.trigger('app:start:logout');
        });
        App.core.vent.bind('app:login', function(options) {
            App.core.vent.trigger('app:log', 'User was logged in');
            if (App.wasLoggedOut) {
                Backbone.history.history.back();
                App.wasLoggedOut = false;
            }
            App.core.vent.trigger('app:start:login');
        });
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
            // method to listen for route changes
            routeChangeSource: App.core.vent,
            data: {
                session: App.session
            }
        });
    },

    loadingPrecondition: function(callback) {
        if (App.session.authCacheInvalid()) {
            //TODO: Loading screen
            console.log('TODO: Trigger loading screen here while querying server if logged in');
        }
        App.session.loggedIn(callback);
    },

    loginFailedCallback: function() {
        console.log('Login failed, triggering login view.');
        this.login();
    },

    home: function() {
        App.core.vent.trigger('app:log', 'Controller: "Home" route hit.');
        this.renderView({
            success: function() {
                //App.core.headerRegion.show(new TestHeaderView());
                //var view = window.App.views.shiftsView;
                //App.core.contentRegion.show(view);
                //this.renderView(view);
                window.App.router.navigate('#');
            }
        });
    },

    shiftDetails: function(id) {
        App.core.vent.trigger('app:log', 'Controller: "Shift Details" route hit.');
        this.renderView({
            success: function () {
                var view = new ShiftDetailsView({model: window.App.data.shifts.get(id)});
                App.core.contentRegion.show(view);
                //this.renderView(view);
                window.App.router.navigate('shifts/' + id);
            }
        });
    },

    calendar: function() {
        App.core.vent.trigger('app:log', 'Controller: "Calendar" route hit.');
        this.renderView({
            success: function () {
                console.log('Model: ' + window.App.data.shifts);
                var view = new FullCalendarView({collection: window.App.data.shifts, element: $("#full-calendar")});
                App.core.contentRegion.show(view);
                //this.renderView(view);
                window.App.router.navigate('calendar');
            }
        });
    },

    categories: function() {
        App.core.vent.trigger('app:log', 'Controller: "Categories" route hit.');
        this.renderView({
            success: function () {
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
            }
        });
    },

    add: function() {
        App.core.vent.trigger('app:log', 'Controller: "Add Shift" route hit.');
        this.renderView({
            success: function () {
                var view = new AddShiftView();
                App.core.contentRegion.show(view);
                //this.renderView(view);
                window.App.router.navigate('add');
            }
        });
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

    renderView: function(next) {
        if (!('error' in next)) {
            next.error = this.loginFailedCallback;
        }
        this.renderViewWithPrecondition(this.loadingPrecondition, next);
    },

    renderViewWithPrecondition: function(precondition, next) {
        precondition({
            success: function() {
                next.success();
            },
            error: function() {
                next.error();
            }
        });
        /*
        this.destroyCurrentView(view);
        App.core.vent.trigger('app:log', 'Controller: Rendering new view.');
        var rendered = view.render();
        console.log('Rendered content:');
        console.log(rendered);
        if (!rendered.$el) {
            console.error('Failed to render view, rendered.el is undefined: nothing will render');
        }
        //$('#js-boilerplate-app').html(rendered.$el);//view.render().el);
        */
    },

    destroyCurrentView: function(view) {
        if (!_.isUndefined(window.App.views.currentView)) {
            App.core.vent.trigger('app:log', 'Controller: Destroying existing view.');
            window.App.views.currentView.close();
        }
        window.App.views.currentView = view;
    }
});
