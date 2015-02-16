var Marionette = require('backbone.marionette');

module.exports = Router = Marionette.AppRouter.extend({
    appRoutes: {
        ''  : 'home',
        'shifts/:id' : 'shiftDetails',
        'add' : 'add',
        'calendar' : 'calendar',
        'login' : 'login',
        'logout' : 'logout'
    },

    before: function(route, params) {
        App.core.vent.trigger('app:route:before', route, params);
    },

    after: function(route, params) {
        App.core.vent.trigger('app:route:after', route, params);
    }
});
