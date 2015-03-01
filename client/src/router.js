var Marionette = require('backbone.marionette');

module.exports = Router = Marionette.AppRouter.extend({
    appRoutes: {
        ''  : 'home',
        'shifts/:id' : 'shiftDetails',
        'add' : 'add',
        'calendar' : 'calendar',
        'login' : 'login',
        'signup' : 'signup',
        'logout' : 'logout',
        'categories': 'categories'
    },

    /**
     * This method uses routefilter to prevent navigating to routes
     * that require credentials
     * I would like for authlessRoutes to be a member of this object
     * but that requires a _.bind so is a TODO
     * @param route
     * @param params
     * @returns {boolean}
     */
    before: function(route, params) {
        // this checks an array to see if a route needs authentication
        var authlessRoutes = [
            '',
            'login',
            'signup',
            'about'
        ];
        if (authlessRoutes.indexOf(route) < 0) {
            // route requires authorization
            var loggedIn = false;
            App.core.loggedIn({
                success: function() {
                    loggedIn = true;
                },
                error: function() {
                    loggedIn = false;
                }
            });
            if (!loggedIn) {
                // not logged in
                // and go back in the history so that
                // the page is not showing as being currently as route in the url
                // Backbone.history.history.back();
                App.router.navigate('login');
                // return false to stop routing to this
                return false;
            }
        }

        // bind a simple event for other interested parties
        App.core.vent.trigger('app:route:before', route, params);
    },

    after: function(route, params) {
        // bind a simple event for other interested parties
        App.core.vent.trigger('app:route:after', route, params);
    }
});
