var Marionette = require('backbone.marionette'),
    ShiftsView = require('./views/shifts'),
    ShiftDetailsView = require('./views/shifts'),
    AddShiftView = require('./views/add');

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
        var view = new ShiftDetailsView({ model: window.App.data.shifts.get(id)});
        this.renderView(view);
        window.App.router.navigate('shifts/' + id);
    },

    add: function() {
        App.core.vent.trigger('app:log', 'Controller: "Add Shift" route hit.');
        var view = new AddShiftView();
        this.renderView(view);
        window.App.router.navigate('add');
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
