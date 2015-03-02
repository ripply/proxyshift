var Backbone = require('backbone'),
    _ = require('underscore');

module.exports = ErrorMessages = Ractive.extend({
    template: require('../../../templates/headers/error_msg.html'),

    el: "#error_msg",

    init: function(options) {
        _.bindAll.apply(_, [this].concat(_.functions(this)));
        var self = this;
        _.each([
            'success',
            'info',
            'warning',
            'danger'
        ], function(text, index, list) {
            App.core.vent.bind('app:' + text, _.bind(self.showAlert, self, text));
        });

        self.on({
            show: function (event, which) {
                console.log('alksdjflkasjdf');
                ractive.set('visible', null).then(function () {
                    ractive.set('visible', which);
                });
            }
        });
    },

    showAlert: function(severity, message, options) {
        console.log("showAlert() " + message);
        var now = Date.now();
        var self = this;

        if (message === undefined ||
            message === null ||
            message === '') {
            message = 'No message specified';
        }

        if (message !== null &&
            message !== undefined &&
            typeof message === 'object') {
            // server can respond with {error: ''} optionss
            // so we can extract those here
            if ('error' in message) {
                message = message.error;
            }
        }

        this.push('messages', {
            text: message,
            severity: severity,
            added: now
        }).then(function() {
            // wait 5 seconds, then delete the oldest message and update ractive
            window.setTimeout(function() {
                    self.shift('messages');
                },
                5000);
        });
    },

    data: {
        messages: []
    }
});