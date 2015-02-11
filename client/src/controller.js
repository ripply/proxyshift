var Marionette = require('backbone.marionette'),
    TestHeaderView = require('./views/headers/test'),
    ShiftsView = require('./views/shifts/shifts'),
    ShiftDetailsView = require('./views/shifts/shift_detail'),
    FullCalendarView = require('./views/shifts/full_calendar'),
    LoginView = require('./views/users/login'),
    AddShiftView = require('./views/shifts/add_shift'),
    LoadingView = require('./views/loading_view');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        _.bindAll.apply(_, [this].concat(_.functions(this)));
        App.core.vent.trigger('app:log', 'Controller: Initializing');
        window.App.views.loadingView = new LoadingView();
        //window.App.views.shiftsView = new ShiftsView({ collection: window.App.data.shifts });
    },

    loadingPrecondition: function(callback) {
        if (App.session.authCacheInvalid()) {
            //TODO: Loading screen
            console.log('TODO: Trigger loading screen here while querying server if logged in');
        }
        if (App.session.loggedIn()) {
            callback.success();
        } else {
            callback.error();
        }
    },

    loginFailedCallback: function() {
        console.log('Login failed, triggering login view.');
        this.login();
    },

    home: function() {
        App.core.vent.trigger('app:log', 'Controller: "Home" route hit.');
        this.renderView({
            success: function() {
                App.core.headerRegion.show(new TestHeaderView());
                var view = window.App.views.shiftsView;
                App.core.contentRegion.show(view);
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
                var view = new FullCalendarView({collection: window.App.data.shifts, element: $("#calendar")});
                App.core.contentRegion.show(view);
                //this.renderView(view);
                window.App.router.navigate('calendar');
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
