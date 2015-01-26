var Marionette = require('backbone.marionette');

module.exports = ShiftDetailsView = Marionette.ItemView.extend({
    template: require('../../../templates/shifts/shift_detail.hbs'),
    events: {
        'click a.back': 'goBack',
        'click a.submit': 'submit'
    },

    goBack: function(e) {
        e.preventDefault();
        window.App.controller.home();
    },
    submit: function(e) {
        e.preventDefault();

    }
});
