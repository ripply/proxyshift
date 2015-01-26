var Marionette = require('backbone.marionette');

module.exports = Router = Marionette.AppRouter.extend({
    appRoutes: {
        ''  : 'home',
        'shifts/:id' : 'shiftDetails',
        'add' : 'add',
        'calendar' : 'calendar'
    }
});
