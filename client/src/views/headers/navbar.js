var Backbone = require('backbone');

module.exports = NavBar = Ractive.extend({
    template: require('../../../templates/headers/nav_bar.html'),

    adaptors: [ 'Backbone' ],

    el: "#header",

    data: {
        project: 'Scheduling App',
        // left side of nav bar
        left: [
            {
                name: 'New shift',
                url: '#add',
                route: 'add',
            },
            {
                name: 'Calendar',
                url: '#calendar',
                route: 'calendar'
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
        active: function(route) {
            if (route) {
                return Backbone.history.fragment == route;
            } else {
                return false;
            }
        },
        linkUrl: function(route, url) {
            if (route) {
                if (Backbone.history.fragment == route) {
                    // link is active
                    return '';
                } else {
                    return url;
                }
            } else {
                return url;
            }
        }
    },

    setSession: function(session) {
        this.set({
            session: session
        });
    }

});