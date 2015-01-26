var Marionette = require('backbone.marionette');

module.exports = AddView = Marionette.ItemView.extend({
    template: require('../../../templates/shifts/add_shift.hbs'),
    events: {
        'click a.save-button': 'save'
    },

    save: function(e) {
        e.preventDefault();
        var newShift = {
            title: this.$el.find('#title').val,
            description: this.$el.find('#description').val,
            start: this.$el.find('#start').val(),
            end: this.$el.find('#end').val(),
        };

        window.App.data.contacts.create(newShift);
        window.App.core.vent.trigger('app:log', 'Add View: Saved new shift!');
        window.App.controller.home();
    }
});
