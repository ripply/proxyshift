var Marionette = require('backbone.marionette'),
    ShiftsView = require('./views/shifts/shifts'),
    ShiftDetailsView = require('./views/shifts/shift_detail'),
    FullCalendarView = require('./views/shifts/full_calendar'),
    LoginView = require('./views/users/login'),
    AddShiftView = require('./views/shifts/add_shift');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        App.core.vent.trigger('app:log', 'Controller: Initializing');
        window.App.views.shiftsView = new ShiftsView({ collection: window.App.data.shifts });
    },

    home: function() {
        App.core.vent.trigger('app:log', 'Controller: "Home" route hit.');
        var view = window.App.views.shiftsView;
        this.renderView(view);
        window.App.router.navigate('#');
    },

    shiftDetails: function(id) {
        App.core.vent.trigger('app:log', 'Controller: "Shift Details" route hit.');
        var view = new ShiftDetailsView({ model: window.App.data.shifts.get(id) });
        this.renderView(view);
        window.App.router.navigate('shifts/' + id);
    },

    calendar: function() {
        App.core.vent.trigger('app:log', 'Controller: "Calendar" route hit.');
        console.log('Model: ' + window.App.data.shifts);
        var view = new FullCalendarView({ model: window.App.data.shifts, el: $("#calendar") });
        this.renderView(view);
        window.App.router.navigate('calendar/');
    },

    add: function() {
        App.core.vent.trigger('app:log', 'Controller: "Add Shift" route hit.');
        var view = new AddShiftView();
        this.renderView(view);
        window.App.router.navigate('add');
    },

    login: function() {
        App.core.vent.trigger('app:log', 'Controller: "Login" route hit.');
        var view = new LoginView();
        this.renderView(view);
        window.App.router.navigate('login');
    },

    renderView: function(view) {
        this.destroyCurrentView(view);
        App.core.vent.trigger('app:log', 'Controller: Rendering new view.');
        $('#js-boilerplate-app').html(view.render().el);
    },

    destroyCurrentView: function(view) {
        if (!_.isUndefined(window.App.views.currentView)) {
            App.core.vent.trigger('app:log', 'Controller: Destroying existing view.');
            window.App.views.currentView.close();
        }
        window.App.views.currentView = view;
    }
});
