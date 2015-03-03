var Backbone = require('backbone');

module.exports = NavBar = Ractive.extend({
    template: require('../../../templates/headers/nav_bar.html'),

    adaptors: [ 'Backbone' ],

    el: "#header",

    init: function(options) {
        _.bindAll.apply(_, [this].concat(_.functions(this)));
        App.core.vent.bind('app:route:after', _.bind(this.routeChanged, this, this));
    },

    data: {
        project: 'Scheduling App',
        // left side of nav bar
        left: [
            {
                name: 'Groups',
                url: '#groups',
                route: 'groups'
            },
            {
                name: 'New shift',
                url: '#add',
                route: 'add'
            },
            {
                name: 'Calendar',
                url: '#calendar',
                route: 'calendar'
            },
            {
                name: 'Categories',
                url: '#categories',
                route: 'categories'
            },
            {
                name: 'Dropdown',
                menu: [
                    {
                        name: 'dropdown test1',
                        url: 'http://www.google.com'
                    },
                    {
                        name: 'dropdown 2',
                        url: 'http://www.google.com'
                    },
                    {
                        divider: true
                    },
                    {
                        name: 'nav header',
                        header: true
                    },
                    {
                        name: 'dropdown 3',
                        url: '#calendar'
                    }
                ]
            }
        ],
        // Right uses identical format as left
        right: [
            {
                name: 'About',
                url: '#about',
                route: 'about'
            },
            {
                name: 'Signup',
                url: '#signup',
                route: 'signup'
            },
            {
                login: {
                    name: 'Login',
                    url: '#login'
                },
                logout: {
                    name: 'Logout',
                    url: '#logout'
                }
            }
        ],
        linkUrl: function(route, url, active) {
            return url;
        }
    },

    setSession: function(session) {
        this.set({
            session: session
        });
    },

    routeChanged: function(self, routeName, routeArgs) {
        // set active property for each item in left/right
        // then trigger update
        _.each(['left', 'right'], function(element, index, list) {
            _.each(self.get(element), function(element2, index2, list2) {
                element2.active = (element2.route === routeName);
                if (element2.menu) {
                    _.each(element2.menu, function(menuItem, menuIndex, menu) {
                        menuItem.active = (menuItem.route === routeName);
                    });
                }
                self.update(element);
            });
        });
    }

});