var Marionette = require('backbone.marionette');

module.exports = ShiftDetailsView = Marionette.ItemView.extend({
    template: require('../../../templates/shifts/shift_detail.hbs'),
    events: {
        'click a.back': 'goBack',
        'click a.delete': 'deleteShift'
    },

    goBack: function(e) {
        e.preventDefault();
        window.App.controller.home();
    },
    deleteShift: function(e) {
        e.preventDefault();
        console.log('Deleting shift');
        window.App.data.contacts.remove(this.model);

        // this will actually send a DELETE to the server:
        this.model.destroy();

        window.App.controller.home();
    }
});
