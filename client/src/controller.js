var Marionette = require('backbone.marionette'),
    TestHeaderView = require('./views/headers/test'),
    ShiftsView = require('./views/shifts/shifts'),
    ShiftDetailsView = require('./views/shifts/shift_detail'),
    FullCalendarView = require('./views/shifts/full_calendar'),
    LoginLayoutView = require('./layouts/login'),
    AddShiftView = require('./views/shifts/add_shift');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        App.core.vent.trigger('app:log', 'Controller: Initializing');
        window.App.views.shiftsView = new ShiftsView({ collection: window.App.data.shifts });
    },

    home: function() {
        App.core.vent.trigger('app:log', 'Controller: "Home" route hit.');
        App.core.headerRegion.show(new TestHeaderView());
        var view = window.App.views.shiftsView;
        App.core.contentRegion.show(view);
        //this.renderView(view);
        window.App.router.navigate('#');
    },

    shiftDetails: function(id) {
        App.core.vent.trigger('app:log', 'Controller: "Shift Details" route hit.');
        var view = new ShiftDetailsView({ model: window.App.data.shifts.get(id) });
        App.core.contentRegion.show(view);
        //this.renderView(view);
        window.App.router.navigate('shifts/' + id);
    },

    calendar: function() {
        App.core.vent.trigger('app:log', 'Controller: "Calendar" route hit.');
        console.log('Model: ' + window.App.data.shifts);
        var view = new FullCalendarView({ collection: window.App.data.shifts, element: $("#calendar") });
        App.core.contentRegion.show(view);
        //this.renderView(view);
        window.App.router.navigate('calendar');
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
        var view = new LoginLayoutView();
        App.core.contentRegion.show(view);
        //this.renderView(view);
        window.App.router.navigate('login');
    },

    renderView: function(view) {
        this.destroyCurrentView(view);
        App.core.vent.trigger('app:log', 'Controller: Rendering new view.');
        var rendered = view.render();
        console.log('Rendered content:');
        console.log(rendered);
        if (!rendered.$el) {
            console.error('Failed to render view, rendered.el is undefined: nothing will render');
        }
        //$('#js-boilerplate-app').html(rendered.$el);//view.render().el);
    },

    destroyCurrentView: function(view) {
        if (!_.isUndefined(window.App.views.currentView)) {
            App.core.vent.trigger('app:log', 'Controller: Destroying existing view.');
            window.App.views.currentView.close();
        }
        window.App.views.currentView = view;
    }
});
